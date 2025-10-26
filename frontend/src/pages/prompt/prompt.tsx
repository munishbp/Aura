import React, { useState, useRef, useEffect } from "react";
import "./prompt.css";
import logo from "/src/assets/logo.png";
import { Link } from "react-router-dom";
import axios from "axios";

// All CSS is embedded here. You can copy this and move it to a `prompt.css` file.
const PromptPage: React.FC = () => {
  // State for form inputs
  const [patientFile, setPatientFile] = useState("");
  const [procedureType, setProcedureType] = useState("Rhinoplasty");
  const [guidelinesText, setGuidelinesText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrls, setImageUrls] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);
  // --- Mock Speech-to-Text ---
  // This simulates text appearing as someone speaks.
  // In a real app, you would replace this with your Eleven Labs API integration.
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const sendAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    setGuidelinesText("Listening");

    const formData = new FormData();
    formData.append("audioFile", audioBlob, "recording.wav");

    try {
      // Send POST request to your backend endpoint
      const response = await axios.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important header for file uploads
        },
      });

      if (response.data && response.data.transcript) {
        setGuidelinesText(response.data.transcript);
      } else {
        setGuidelinesText("Error: Could not get transcript.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      setGuidelinesText("Error: Failed to transcribe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop(); // This triggers the 'onstop' event
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = []; // Clear previous recording chunks

        // Event handler: When data becomes available (chunk)
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // Event handler: When recording stops
        mediaRecorderRef.current.onstop = () => {
          // Combine all chunks into a single Blob
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          }); // Specify MIME type
          sendAudio(audioBlob); // Send the blob to the backend

          // Stop the microphone stream tracks
          stream.getTracks().forEach((track) => track.stop());
        };

        // Start recording
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setGuidelinesText(""); // Clear previous text
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setGuidelinesText("Error: Could not access microphone.");
      }
    }
  };

  const handleGenerateClick = async () => {
    // 1. Reset previous results and start loading
    setImageUrls([]);
    setGenerationError(null);
    setIsGenerating(true);

    // 2. Scroll to results area (smoothly)
    // We use a slight delay to ensure the DOM updates before scrolling
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    // 3. Prepare JSON data
    const generationData = {
      patientFile: patientFile, // Send the selected filename/ID
      procedureType: procedureType,
      prompt: guidelinesText,
      // Add any other relevant data needed by the backend/model
    };

    // Note: If the actual patient file needs to be sent,
    // this would need to be a multipart/form-data request like sendAudio,
    // sending both the file input's actual file and the JSON data.
    // For now, we'll assume sending just the filename/ID is enough.

    try {
      // 4. Send POST request to backend
      const response = await axios.post(
        "/api/generate-images",
        generationData,
        {
          headers: {
            "Content-Type": "application/json", // Sending JSON data
          },
        }
      );

      // 5. Handle success - expecting { imageUrls: ["url1", "url2", "url3"] }
      if (response.data && Array.isArray(response.data.imageUrls)) {
        setImageUrls(response.data.imageUrls);
      } else {
        console.error("Unexpected response format:", response.data);
        setGenerationError("Received invalid data from server.");
      }
    } catch (error) {
      // 6. Handle errors
      console.error("Error generating images:", error);
      setGenerationError(
        `Failed to generate images. ${
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error // Show backend error message if available
            : ""
        }`
      );
    } finally {
      // 7. Stop loading
      setIsGenerating(false);
    }
  };

  // --- NEW: Function to handle Download click (placeholder) ---
  const handleDownloadClick = () => {
    // TODO: Implement backend call to download images as zip
    console.log("Download button clicked. Image URLs:", imageUrls);
    alert("Download functionality not yet implemented.");
    // Example: window.location.href = `/api/download-images?jobId=...`; // If using jobId
  };

  return (
    <>
      <div className="page-container">
        <header className="page-header">
          <a href="/" className="header-brand">
            Aura
          </a>
          <nav className="header-nav">
            <a href="https://knighthacksviii.devpost.com/" target="_blank">
              DevPost
            </a>
            <a href="https://github.com/munishbp/Aura" target="_blank">
              Github
            </a>
            <Link to="/about">About us</Link>
          </nav>
        </header>

        <main className="main-content">
          <div className="prompt-form-container">
            {/* Patient File Dropdown */}
            <div className="form-group">
              <label htmlFor="patient-file" className="form-label">
                Patient File:
              </label>
              <select
                id="patient-file"
                className="form-select"
                value={patientFile}
                onChange={(e) => setPatientFile(e.target.value)}
              >
                <option value="" disabled>
                  Select a file...
                </option>
                <option value="patient-001">Patient_001_Scan.dicom</option>
                <option value="patient-002">Patient_002_Notes.pdf</option>
                <option value="patient-003">Patient_003_History.txt</option>
              </select>
            </div>

            {/* Procedure Type Dropdown */}
            <div className="form-group">
              <label htmlFor="procedure-type" className="form-label">
                Procedure Type:
              </label>
              <select
                id="procedure-type"
                className="form-select"
                value={procedureType}
                onChange={(e) => setProcedureType(e.target.value)}
              >
                <option value="Rhinoplasty">Rhinoplasty</option>
                <option value="Rhytidectomy">Rhytidectomy</option>
              </select>
            </div>

            {/* Procedure Guidelines Text-to-Speech Box */}
            <div className="form-group">
              <label htmlFor="procedure-guidelines" className="form-label">
                Procedure Guidelines
              </label>
              <textarea
                id="procedure-guidelines"
                className="form-textarea"
                placeholder={
                  isLoading
                    ? "Transcribing"
                    : isRecording
                    ? "Processing"
                    : "Start recording or type guidelines here..."
                }
                value={guidelinesText}
                onChange={(e) => setGuidelinesText(e.target.value)}
                readOnly={isRecording || isLoading}
              />
              <div className="tts-controls">
                <button
                  className={`btn btn-record ${isRecording ? "recording" : ""}`}
                  onClick={handleRecordClick}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : isRecording
                    ? "Stop Recording"
                    : "Start Recording"}
                </button>
                {/* You could add a 'Submit' button here as well */}
                <a href="#" className="btn btn-primary">
                  Generate Plan
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PromptPage;
