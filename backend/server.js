const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process"); // Corrected typo: spawn should be lowercase
const path = require("path");
// const fs = require('fs'); // Not needed if using memoryStorage

// Load env vars
dotenv.config();

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors());
app.use(express.json()); // Allows us to accept JSON data in the body

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- FIXED ROUTE ---
app.post("/api/transcribe", upload.single("audioFile"), (req, res) => {
  // Added leading '/' and '=>'
  console.log("recieved the fking request on /api/tran");

  if (!req.file) {
    console.error("nothing");
    return res.status(400).json({ error: "nothing" });
  }

  console.log("Audio file received, buffer size:", req.file.buffer.length); // Added logging

  const pythonExecutable = "python"; // Or 'python3' or the full path if needed
  const scriptPath = path.join(__dirname, "elevenlabs", "agentTest.py");
  console.log(`Spawning Python script: ${pythonExecutable} ${scriptPath}`);

  // spawn the Python process
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

    // Removed commented-out fs.unlinkSync as it's not needed with memory storage

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
      res
        .status(500)
        .json({
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
