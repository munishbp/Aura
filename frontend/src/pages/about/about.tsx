import React from "react";
import {Link} from "react-router-dom";
import oceanVideo from "/src/assets/ocean.webm";
import logo from "/src/assets/logo.png";


const AboutPage: React.FC = () => {
    return(
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

        <>
            <div className="page-container">
                <header className="homepage-header">
                    <a href="/">
                        <img src={logo} alt="Aura Brand Logo" className="nav-logo-img" />
                    </a>
                    <nav className="header-nav">
                        <a href="https://knighthacksviii.devpost.com/" target="_blank">DevPost</a>
                        <a href="https://github.com/munishbp/Aura" target="_blank">Github</a>
                        <Link to="/about">About Us</Link>
                    </nav>
                </header>



                <main className="main-content">
                    {/* Removed GraphicPlaceholder and graphic-caption */}

                    <h1 className="main-headline">
                        About Us.
                    </h1>

                    <p className="sub-headline">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </main>

            </div>
        </>
    </div>
    );
};

export default AboutPage;