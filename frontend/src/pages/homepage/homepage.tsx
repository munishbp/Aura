import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import oceanVideo from "/src/assets/ocean.webm"; // use relative path with forward slashes

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="bg-video"
      >
        <source src={oceanVideo} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div className="video-overlay"></div>

      {/* Header */}
      <header className="homepage-header">
        <a href="/" className="header-brand">
          Aura
        </a>
        <nav className="header-nav">
          <a
            href="https://knighthacksviii.devpost.com/"
            target="_blank"
            rel="noreferrer"
          >
            DevPost
          </a>
          <a
            href="https://github.com/munishbp/Aura"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          <Link to="/about">About us</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="header-logo">
          <p className="strike"> Aura </p>
        </h1>

        <h2 className="main-headline">
          Aura is the next generation tool used to model plastic surgery augmentations.
        </h2>

        <p className="sub-headline">
          Provide patients with better estimates of plastic surgery outcomes by
          using generative artificial intelligence.
        </p>

        <div className="cta-buttons">
          <a href="/start" className="btn btn-primary">
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
