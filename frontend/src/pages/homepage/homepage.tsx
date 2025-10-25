import React from "react";
import "./homepage.css";

// The main React component
const App: React.FC = () => {
  return (
    <>
      <div className="homepage-container">
        <header className="homepage-header">
          <a href="/" className="header-brand">
            Aura
          </a>
          <nav className="header-nav">
            <a href="/join">Join us</a>
          </nav>
        </header>

        <main className="main-content">
          <h1 className="main-headline">
            Aura is the next generation model for surgical and medical
            intervention.
          </h1>

          <p className="sub-headline">
            Control every aspect of medical model training and fine-tuning with
            our flexible API infrastructure.
          </p>

          <div className="cta-buttons">
            <a href="/announcement" className="btn btn-secondary">
              About
            </a>
            <a href="/docs" className="btn btn-secondary">
              Code
            </a>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
