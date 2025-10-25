import React, { useState, useEffect } from "react";
import "./prompt.css";
import {Link} from "react-router-dom";

// All CSS is embedded here. You can copy this and move it to a `prompt.css` file.
const PromptPage: React.FC = () => {
  // State for form inputs
  const [patientFile, setPatientFile] = useState("");
  const [procedureType, setProcedureType] = useState("Rhinoplasty");
  const [guidelinesText, setGuidelinesText] = useState("");

  // State for TTS simulation
  const [isRecording, setIsRecording] = useState(false);

  // --- Mock Speech-to-Text ---
  // This simulates text appearing as someone speaks.
  // In a real app, you would replace this with your Eleven Labs API integration.
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setGuidelinesText((prevText) => prevText + "... ");
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleRecordClick = () => {
    if (isRecording) {
      // Logic to stop recording with Eleven Labs API
      setIsRecording(false);
    } else {
      // Logic to start recording with Eleven Labs API
      // This would also handle microphone permissions
      setGuidelinesText(""); // Clear text on new recording
      setIsRecording(true);

      // In a real app, you would get a stream from the API
      // and append it to setGuidelinesText.
    }
  };

  return (
    <>
      <div className="page-container">
        <header className="page-header">
          <a href="/" className="header-brand">
            Aura
          </a>
          <nav className="header-nav">
            <a href="https://knighthacksviii.devpost.com/" target="_blank">DevPost</a>
            <a href="https://github.com/munishbp/Aura" target="_blank">Github</a>
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
                placeholder="Start recording or type guidelines here..."
                value={guidelinesText}
                onChange={(e) => setGuidelinesText(e.target.value)}
              />
              <div className="tts-controls">
                <button
                  className={`btn btn-record ${isRecording ? "recording" : ""}`}
                  onClick={handleRecordClick}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
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
