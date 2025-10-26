const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { NodeSSH } = require("node-ssh");

dotenv.config();

const app = express();
const ssh = new NodeSSH();

// --- Middleware ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors()); // Enable CORS for all routes (handles preflight)
app.use(express.json()); // Allows us to accept JSON data in the body

// --- Static Image Server ---
// This serves the downloaded images from a local folder
const localImageDir = path.join(__dirname, "local_output");
if (!fs.existsSync(localImageDir)) {
  fs.mkdirSync(localImageDir);
}
// This creates a public URL: http://localhost:5000/images/image.jpg
app.use("/images", express.static(localImageDir));

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Transcribe Route ---
app.post("/api/transcribe", upload.single("audioFile"), (req, res) => {
  console.log("Received request on /api/transcribe");

  if (!req.file) {
    console.error("No audio file received");
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  console.log("Audio file received, buffer size:", req.file.buffer.length);

  const pythonExecutable = "python"; // Or 'python3'
  const scriptPath = path.join(__dirname, "elevenlabs", "agentTest.py");
  console.log(`Spawning Python script: ${pythonExecutable} ${scriptPath}`);

  const pythonProcess = spawn(pythonExecutable, [scriptPath]);

  let transcriptData = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => {
    transcriptData += data.toString();
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0 && transcriptData) {
      console.log("Transcription successful:", transcriptData.trim());
      res.json({ transcript: transcriptData.trim() });
    } else {
      console.error("Transcription failed. Python stderr:", errorData);
      res
        .status(500)
        .json({ error: "Failed to transcribe audio", details: errorData });
    }
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python process:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to start transcription process",
        details: err.message,
      });
    }
  });

  console.log("Writing audio buffer to Python stdin");
  pythonProcess.stdin.write(req.file.buffer);
  pythonProcess.stdin.end();
  console.log("Finished writing to Python stdin");
});

// --- Generate Images Route ---
app.post("/api/generate-images", async (req, res) => {
  console.log("Received request on /api/generate-images");

  // 1. Get data from React
  const { patientName, procedureType, prompt } = req.body;
  const jobName = patientName; // Use patientName as the jobName

  if (!procedureType || !prompt || !jobName) {
    return res
      .status(400)
      .json({ error: "Missing patientName, procedureType, or prompt" });
  }

  // 2. Map React procedureType to your Python script's operation name
  const operationMap = {
    Blepharoplasty: "eyelid",
    Rhinoplasty: "nose job",
    Rhytidectomy: "facelift",
  };
  const operation = operationMap[procedureType];
  if (!operation) {
    return res
      .status(400)
      .json({ error: `Invalid procedureType: ${procedureType}` });
  }

  // 3. Get paths from .env
  const {
    SSH_HOST,
    SSH_PORT,
    SSH_USERNAME,
    SSH_PASSWORD,
    REMOTE_SCRIPT_PATH,
    REMOTE_INPUT_DIR,
    REMOTE_OUTPUT_DIR,
  } = process.env;

  if (!REMOTE_SCRIPT_PATH || !REMOTE_INPUT_DIR || !REMOTE_OUTPUT_DIR) {
    return res.status(500).json({
      error:
        "Missing REMOTE_SCRIPT_PATH, REMOTE_INPUT_DIR, or REMOTE_OUTPUT_DIR in .env",
    });
  }

  const sshConfig = {
    host: SSH_HOST,
    port: parseInt(SSH_PORT || "22", 10),
    username: SSH_USERNAME,
    password: SSH_PASSWORD,
  };

  try {
    console.log(`Connecting to SSH host: ${sshConfig.host}...`);
    await ssh.connect(sshConfig);
    console.log("SSH connection successful.");

    // 4. Create the JSON data for the Python script
    const jobData = {
      name: jobName,
      operation: operation, // "eyelid", "nose job", etc.
      prompt: prompt,
      steps: 30, // Hardcoded, but you can pass this from React
    };
    const jobJsonString = JSON.stringify(jobData, null, 2);
    const remoteJsonPath = `${REMOTE_INPUT_DIR}/${jobName}.json`;

    // 5. Upload the JSON file to the remote server
    console.log(`Uploading job file to: ${remoteJsonPath}`);
    const localJsonPath = path.join(__dirname, `${jobName}.json`);
    fs.writeFileSync(localJsonPath, jobJsonString);
    await ssh.putFile(localJsonPath, remoteJsonPath);
    fs.unlinkSync(localJsonPath); // Delete temp file
    console.log("Job file uploaded successfully.");

    // 6. Build the CORRECT command with all paths
    const command = `python3 ${REMOTE_SCRIPT_PATH} --input_json ${remoteJsonPath} --input_dir ${REMOTE_INPUT_DIR} --output_dir ${REMOTE_OUTPUT_DIR}`;

    console.log(`Executing remote command: ${command}`);
    const result = await ssh.execCommand(command, {
      cwd: path.dirname(REMOTE_SCRIPT_PATH),
    });

    console.log("Remote script stdout:", result.stdout);
    console.error("Remote script stderr:", result.stderr);

    if (result.code !== 0) {
      throw new Error(
        `Remote script failed with exit code ${result.code}: ${result.stderr}`
      );
    }

    // 7. Download the 3 generated images
    console.log("Remote script finished. Downloading images...");
    const imageNames = [
      "front_center.jpg",
      "left_third.jpg",
      "right_third.jpg",
    ];
    const localImageUrls = [];

    // Clear old images from the local output dir
    fs.readdirSync(localImageDir).forEach((f) =>
      fs.unlinkSync(path.join(localImageDir, f))
    );

    for (const imgName of imageNames) {
      const remoteImgPath = `${REMOTE_OUTPUT_DIR}/${jobName}/${imgName}`;
      const localImgPath = path.join(localImageDir, imgName);

      console.log(`Downloading: ${remoteImgPath} to ${localImgPath}`);
      await ssh.getFile(localImgPath, remoteImgPath);

      // 8. Create the local URL for React
      localImageUrls.push(`http://localhost:5000/images/${imgName}`);
    }

    // 9. Send the list of local URLs back to React
    console.log("All images downloaded. Sending URLs to client.");
    res.json({ imageUrls: localImageUrls });
  } catch (error) {
    console.error("SSH connection or command execution failed:", error);
    res.status(500).json({
      error: "Failed to connect or execute remote command",
      details: error.message,
    });
  } finally {
    if (ssh.isConnected()) {
      console.log("Disconnecting SSH.");
      ssh.dispose();
    }
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
