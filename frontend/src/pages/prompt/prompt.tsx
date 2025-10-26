import React, { useState, useRef, useEffect } from "react";
import "./prompt.css";
import logo from "/src/assets/logo.png"; // Assuming logo is imported correctly
import { Link } from "react-router-dom";
import axios from "axios";

// All CSS is embedded here. You can copy this and move it to a `prompt.css` file.
const PromptPage: React.FC = () => {
  // State for form inputs
  const [patientName, setPatientName] = useState(""); // Changed from patientFile
  const [procedureType, setProcedureType] = useState(""); // Defaulting to empty
  const [guidelinesText, setGuidelinesText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  // Type correction: imageUrls should be string[] or null, not string | null if expecting multiple
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
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
    setGuidelinesText("Transcribing..."); // Changed feedback text

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
    setImageUrls(null); // Reset to null instead of []
    setGenerationError(null);
    setIsGenerating(true);

    // 2. Scroll to results area (smoothly)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    // 3. Prepare JSON data
    const generationData = {
      patientName: patientName, // Changed from patientFile
      procedureType: procedureType,
      prompt: guidelinesText,
      // Add any other relevant data needed by the backend/model
    };

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
      <div className="homepage-container">
        {" "}
        {/* Corrected class name */}
        <header className="homepage-header">
          {" "}
          {/* Corrected class name */}
          <a href="/">
            <img src={logo} alt="Aura Brand Logo" className="nav-logo-img" />
          </a>
          <nav className="header-nav">
            <a
              href="https://knighthacksviii.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              DevPost
            </a>
            <a
              href="https://github.com/munishbp/Aura"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            <Link to="/about">About us</Link>
          </nav>
        </header>
        <main
          style={{ paddingTop: "8rem", paddingBottom: "4rem", width: "100%" }}
        >
          {" "}
          {/* Adjusted padding */}
          <div className="prompt-form-container">
            {/* --- CHANGED: Patient Name Input --- */}
            <div className="form-group">
              <label htmlFor="patient-name" className="form-label">
                Patient Name:
              </label>
              <input
                type="text"
                id="patient-name"
                className="form-select" // Consider creating a separate form-input class if styles differ
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name..."
              />
            </div>
            {/* ---------------------------------- */}

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
                <option value="" disabled>
                  Select a procedure...
                </option>
                <option value="Blepharoplasty">Blepharoplasty</option>
                <option value="Rhinoplasty">Rhinoplasty</option>
                <option value="Rhytidectomy">Rhytidectomy</option>
              </select>
            </div>

            {/* Procedure Guidelines Textarea */}
            <div className="form-group">
              <label htmlFor="procedure-guidelines" className="form-label">
                Procedure Guidelines
              </label>
              <textarea
                id="procedure-guidelines"
                className="form-textarea"
                placeholder={
                  isLoading
                    ? "Transcribing..." // Changed feedback
                    : isRecording
                    ? "Listening..." // Changed feedback
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
                  disabled={isLoading || isGenerating} // Disable during generation too
                >
                  {isLoading
                    ? "Processing..."
                    : isRecording
                    ? "Stop Recording"
                    : "Start Recording"}
                </button>
                {/* --- Changed: Generate Plan Button --- */}
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateClick} // Changed from href="#"
                  disabled={
                    isLoading ||
                    isGenerating ||
                    !guidelinesText.trim() ||
                    !procedureType ||
                    !patientName.trim()
                  } // Add disable logic
                >
                  {isGenerating ? "Generating..." : "Generate Plan"}
                </button>
                {/* ------------------------------------- */}
              </div>
            </div>
          </div>
          {/* --- Results Section --- */}
          <div
            ref={resultsRef}
            className="results-container"
            style={{
              marginTop: "3rem",
              width: "100%",
              maxWidth: "900px",
              margin: "3rem auto 0 auto",
            }}
          >
            {isGenerating && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-color-secondary)",
                }}
              >
                Generating images... Please wait.
              </div>
            )}
            {generationError && (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "red" }}
              >
                Error: {generationError}
              </div>
            )}
            {imageUrls &&
              imageUrls.length > 0 && ( // Check if imageUrls is not null before checking length
                <div style={{ textAlign: "center" }}>
                  <h2>Generated Images:</h2>
                  <div
                    className="image-gallery"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "2rem",
                    }}
                  >
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Generated Image ${index + 1}`}
                        style={{
                          maxWidth: "30%",
                          height: "auto",
                          border: "1px solid var(--input-border)",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleDownloadClick}
                  >
                    Download All Images (.zip)
                  </button>
                </div>
              )}
          </div>
          {/* End Results Section */}
        </main>
      </div>
    </>
  );
};

export default PromptPage;
