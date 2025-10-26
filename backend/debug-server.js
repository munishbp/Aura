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

// --- Middleware ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors()); // Enable CORS for all routes (handles preflight)
app.use(express.json()); // Allows us to accept JSON data in the body

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error handler caught:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --- Static Image Server ---
const localImageDir = path.join(__dirname, "local_output");
if (!fs.existsSync(localImageDir)) {
  fs.mkdirSync(localImageDir);
}
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
  // Wrap everything in try-catch to prevent crashes
  try {
    console.log("=== Received request on /api/generate-images ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // 1. Get data from React
    const { patientName, procedureType, prompt } = req.body;
    const jobName = patientName;

    console.log(`Patient Name: ${patientName}`);
    console.log(`Procedure Type: ${procedureType}`);
    console.log(`Prompt: ${prompt}`);

    if (!procedureType || !prompt || !jobName) {
      console.log("Missing required fields");
      return res.status(400).json({
        error: "Missing patientName, procedureType, or prompt",
        received: { patientName, procedureType, hasPrompt: !!prompt },
      });
    }

    // 2. Map React procedureType to your Python script's operation name
    const operationMap = {
      Blepharoplasty: "eyelid",
      Rhinoplasty: "nose job",
      Rhytidectomy: "facelift",
    };
    const operation = operationMap[procedureType];
    
    if (!operation) {
      console.log(`Invalid procedure type: ${procedureType}`);
      return res.status(400).json({
        error: `Invalid procedureType: ${procedureType}`,
        validTypes: Object.keys(operationMap),
      });
    }

    console.log(`Mapped operation: ${operation}`);

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

    console.log("Environment variables check:");
    console.log(`SSH_HOST: ${SSH_HOST ? "SET" : "MISSING"}`);
    console.log(`SSH_USERNAME: ${SSH_USERNAME ? "SET" : "MISSING"}`);
    console.log(`REMOTE_SCRIPT_PATH: ${REMOTE_SCRIPT_PATH || "MISSING"}`);
    console.log(`REMOTE_INPUT_DIR: ${REMOTE_INPUT_DIR || "MISSING"}`);
    console.log(`REMOTE_OUTPUT_DIR: ${REMOTE_OUTPUT_DIR || "MISSING"}`);

    if (!REMOTE_SCRIPT_PATH || !REMOTE_INPUT_DIR || !REMOTE_OUTPUT_DIR) {
      console.log("Missing required environment variables");
      return res.status(500).json({
        error: "Server configuration error: Missing required paths in .env",
        missing: {
          REMOTE_SCRIPT_PATH: !REMOTE_SCRIPT_PATH,
          REMOTE_INPUT_DIR: !REMOTE_INPUT_DIR,
          REMOTE_OUTPUT_DIR: !REMOTE_OUTPUT_DIR,
        },
      });
    }

    const sshConfig = {
      host: SSH_HOST,
      port: parseInt(SSH_PORT || "22", 10),
      username: SSH_USERNAME,
      password: SSH_PASSWORD,
    };

    // Create a new SSH instance for each request
    const sshConnection = new NodeSSH();

    try {
      console.log(`Connecting to SSH host: ${sshConfig.host}:${sshConfig.port}...`);
      await sshConnection.connect(sshConfig);
      console.log("✓ SSH connection successful");

      // 4. Create the JSON data for the Python script
      const jobData = {
        name: jobName,
        operation: operation,
        prompt: prompt,
        steps: 30,
      };
      const jobJsonString = JSON.stringify(jobData, null, 2);
      const remoteJsonPath = `${REMOTE_INPUT_DIR}/${jobName}.json`;

      console.log("Job data:", jobJsonString);

      // 5. Upload the JSON file to the remote server
      console.log(`Uploading job file to: ${remoteJsonPath}`);
      const localJsonPath = path.join(__dirname, `${jobName}.json`);
      
      fs.writeFileSync(localJsonPath, jobJsonString);
      console.log(`✓ Created local temp file: ${localJsonPath}`);
      
      await sshConnection.putFile(localJsonPath, remoteJsonPath);
      console.log("✓ File uploaded successfully");
      
      fs.unlinkSync(localJsonPath);
      console.log("✓ Deleted local temp file");

      // 6. Build the command with all paths
      const command = `python3 ${REMOTE_SCRIPT_PATH} --input_json ${remoteJsonPath} --input_dir ${REMOTE_INPUT_DIR} --output_dir ${REMOTE_OUTPUT_DIR}`;

      console.log(`Executing remote command:\n${command}`);
      const result = await sshConnection.execCommand(command, {
        cwd: path.dirname(REMOTE_SCRIPT_PATH),
      });

      console.log("=== Remote script output ===");
      console.log("STDOUT:", result.stdout);
      console.log("STDERR:", result.stderr);
      console.log("Exit code:", result.code);

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
      console.log("Clearing old images from local directory...");
      fs.readdirSync(localImageDir).forEach((f) => {
        const filePath = path.join(localImageDir, f);
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      });

      for (const imgName of imageNames) {
        const remoteImgPath = `${REMOTE_OUTPUT_DIR}/${jobName}/${imgName}`;
        const localImgPath = path.join(localImageDir, imgName);

        console.log(`Downloading: ${remoteImgPath} -> ${localImgPath}`);
        
        try {
          await sshConnection.getFile(localImgPath, remoteImgPath);
          console.log(`✓ Downloaded: ${imgName}`);
          
          // Verify file exists locally
          if (fs.existsSync(localImgPath)) {
            const stats = fs.statSync(localImgPath);
            console.log(`  File size: ${stats.size} bytes`);
            localImageUrls.push(`http://localhost:5000/images/${imgName}`);
          } else {
            console.log(`  WARNING: File not found after download: ${localImgPath}`);
          }
        } catch (downloadError) {
          console.error(`Error downloading ${imgName}:`, downloadError.message);
          // Continue with other images
        }
      }

      if (localImageUrls.length === 0) {
        throw new Error("No images were successfully downloaded");
      }

      // 9. Send the list of local URLs back to React
      console.log("=== Success! Sending response ===");
      console.log("Image URLs:", localImageUrls);
      res.json({ imageUrls: localImageUrls });
      
    } catch (sshError) {
      console.error("SSH operation failed:", sshError);
      throw sshError;
    } finally {
      if (sshConnection.isConnected()) {
        console.log("Disconnecting SSH...");
        sshConnection.dispose();
        console.log("✓ SSH disconnected");
      }
    }
  } catch (error) {
    console.error("=== ERROR in /api/generate-images ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Make sure we send a response
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to generate images",
        details: error.message,
        type: error.constructor.name,
      });
    }
  }
});

// Global error handlers
process.on("uncaughtException", (error) => {
  console.error("=== UNCAUGHT EXCEPTION ===");
  console.error(error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("=== UNHANDLED REJECTION ===");
  console.error("Reason:", reason);
  console.error("Promise:", promise);
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
