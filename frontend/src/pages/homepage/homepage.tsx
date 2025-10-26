import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import oceanVideo from "/src/assets/ocean.webm";
import logo from "/src/assets/logo.png";

const HomePage: React.FC = () => {
    return (
        <div className="homepage-container">

            {/* Background Video */}
            <video className="bg-video" autoPlay muted loop playsInline>
                <source src={oceanVideo} type="video/webm" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for video readability */}
            <div className="video-overlay" />

            {/* Header */}
            <header className="homepage-header">
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

                    <Link to="/about">About Us</Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <a href="/" className="header-logo">
                    <img src={logo} alt="Aura Brand Logo" className="header-logo-img" />
                </a>

                <h2 className="main-headline">
                    Aura is the next generation tool used to model plastic surgery augmentations.
                </h2>

                <p className="sub-headline">
                    Provide patients with better estimates of plastic surgery outcomes by using
                    generative artificial intelligence.
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
