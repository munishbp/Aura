import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";

// The main React component
const HomePage: React.FC = () => {
  return (
    <>
      <div className="homepage-container">
        <header className="homepage-header">
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
          {/* Removed GraphicPlaceholder and graphic-caption */}

          <h1 className="main-headline">
            Aura is the next generation model for surgical and medical
            intervention.
          </h1>

          <p className="sub-headline">
            Control every aspect of medical model training and fine-tuning with
            our flexible API infrastructure.
          </p>

          <div className="cta-buttons">
            {/* Replaced the three links with a single "Get Started" button */}
            <a href="/start" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </main>
      </div>
    </>
  );
};
export default HomePage;
