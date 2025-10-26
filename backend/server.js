const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { NodeSSH } = require("node-ssh");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const ssh = new NodeSSH();

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---- Local Output Folder ----
const localImageDir = path.join(__dirname, "local_output");
if (!fs.existsSync(localImageDir)) fs.mkdirSync(localImageDir);
app.use("/images", express.static(localImageDir));

// ---- Test Route ----
app.get("/", (req, res) => res.send("API is running..."));

// ---- Generate Images ----
app.post("/api/generate-images", async (req, res) => {
  console.log("➡️ Received /api/generate-images");

  const { patientName, procedureType, prompt } = req.body;
  if (!patientName || !procedureType || !prompt)
    return res.status(400).json({ error: "Missing required fields" });

  // Map procedureType → operation (used in Python)
  const operationMap = {
    Blepharoplasty: "eyelid",
    Rhinoplasty: "nose job",
    Rhytidectomy: "facelift",
  };
  const operation = operationMap[procedureType];
  if (!operation)
    return res
      .status(400)
      .json({ error: `Invalid procedureType: ${procedureType}` });

  // Load .env
  const {
    SSH_HOST,
    SSH_PORT,
    SSH_USERNAME,
    SSH_PASSWORD,
    REMOTE_INPUT_DIR,
    REMOTE_OUTPUT_DIR,
    REMOTE_SCRIPT_PATH,
    REMOTE_PYTHON_EXEC,
  } = process.env;

  const sshConfig = {
    host: SSH_HOST,
    port: parseInt(SSH_PORT || "22", 10),
    username: SSH_USERNAME,
    password: SSH_PASSWORD,
  };

  const jobName = `${patientName}_${Date.now()}`; // unique per job
  const localJsonPath = path.join(__dirname, `${jobName}.json`);
  const remoteJsonPath = `${REMOTE_INPUT_DIR}/${jobName}.json`;

  // Prepare JSON
  const jobData = {
    name: jobName,
    operation,
    prompt,
    steps: 30,
  };
  fs.writeFileSync(localJsonPath, JSON.stringify(jobData, null, 2));

  try {
    console.log(`🔗 Connecting to SSH: ${SSH_HOST}`);
    await ssh.connect(sshConfig);
    console.log("✅ SSH Connected.");

    console.log("📤 Uploading JSON:", remoteJsonPath);
    await ssh.putFile(localJsonPath, remoteJsonPath);
    fs.unlinkSync(localJsonPath);

    // Construct exact Python command
    const command = `bash -c "source /home/amd-knights/myenv/bin/activate && ${REMOTE_PYTHON_EXEC} ${REMOTE_SCRIPT_PATH} --input_json ${REMOTE_JSON_PATH} --input_dir ${REMOTE_INPUT_DIR} --output_dir ${REMOTE_OUTPUT_DIR}"`;
    console.log("🚀 Executing remote inference:");
    console.log(command);

    const result = await ssh.execCommand(command, {
      cwd: path.dirname(REMOTE_SCRIPT_PATH),
    });

    console.log("📜 STDOUT:", result.stdout);
    console.error("⚠️ STDERR:", result.stderr);

    if (result.code !== 0) {
      throw new Error(`Remote execution failed: ${result.stderr}`);
    }

    // ---- Download Results ----
    const imageNames = [
      "front_center.jpg",
      "left_third.jpg",
      "right_third.jpg",
    ];
    const localUrls = [];

    fs.readdirSync(localImageDir).forEach((f) =>
      fs.unlinkSync(path.join(localImageDir, f))
    );

    for (const name of imageNames) {
      const remotePath = `${REMOTE_OUTPUT_DIR}/${jobName}/${name}`;
      const localPath = path.join(localImageDir, name);
      console.log(`⬇️ Downloading: ${remotePath}`);
      await ssh.getFile(localPath, remotePath);
      localUrls.push(`http://localhost:5000/images/${name}`);
    }

    console.log("✅ All images downloaded.");
    res.json({ imageUrls: localUrls });
  } catch (err) {
    console.error("❌ SSH or command failed:", err.message);
    res.status(500).json({
      error: "Inference failed",
      details: err.message,
    });
  } finally {
    if (ssh.isConnected()) ssh.dispose();
  }
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
