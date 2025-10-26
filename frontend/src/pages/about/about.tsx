import React from "react";
import { Link } from "react-router-dom";
import oceanVideo from "/src/assets/ocean.webm";
import logo from "/src/assets/logo.png";

const AboutPage: React.FC = () => {
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

      <>
        <div className="page-container">
          <header className="homepage-header">
            <a href="/">
              <img src={logo} alt="Aura Brand Logo" className="nav-logo-img" />
            </a>
            <nav className="header-nav">
              <a href="https://devpost.com/software/aura-shaping-the-future-you" target="_blank">DevPost</a>
              <a href="https://github.com/munishbp/Aura" target="_blank">Github</a>
              <Link to="/about">About Us</Link>
            </nav>
          </header>

          <main className="main-content">
            <h1 className="main-headline">
              About Us.
            </h1>

            <div className="sub-headline" style={{ textIndent: "1.5em", lineHeight: "1.65em" }}>
              <p style={{ marginBottom: "1.4em" }}>
                Aura was created with a clear mission: to give plastic surgeons and their patients a smarter, more confident way to visualize the future. Today’s industry tools often fall short; they can look artificial, feel clunky, and fail to capture the subtle details that make each face unique. We set out to build something better. Aura intelligently analyzes facial structure from multiple angles and generates realistic outcome predictions that preserve a person’s identity while showing what potential procedures could help achieve.
              </p>

              <p style={{ marginBottom: "1.4em" }}>
                Behind the scenes, Aura combines advanced generative AI, computer vision, and a design approach grounded in real clinical needs. We fine-tuned a state-of-the-art model, DreamOmni2, using LoRA to deliver high-quality results efficiently, all trained on top-tier AMD Instinct hardware to push performance beyond the usual CUDA-based ecosystem. And because surgeons shouldn’t have to wrestle with software, Aura is designed to feel natural and intuitive. With integrated voice interaction powered by ElevenLabs, medical professionals can navigate and operate the system hands-free, making it a seamless part of their workflow.
              </p>

              <p style={{ marginBottom: "1.4em" }}>
                Aura currently supports three core procedures: blepharoplasty, rhinoplasty, and rhytidectomy. Our iOS intake app streamlines the process of capturing facial imagery, while our web application presents outcomes clearly and securely. Every detail of the platform strives for the right balance between cutting-edge AI and real-world usability.
              </p>

              <p style={{ marginBottom: "1.4em" }}>
                This is just the beginning. We are considering expanding Aura to support additional cosmetic enhancements such as hair restoration, injectables, and facial symmetry refinement. We are also exploring live AR previews and intelligent assistant features that will help surgeons communicate more effectively with their patients. The goal is simple: empower better decisions and create a more personalized, reassuring experience from the very first consultation.
              </p>

              <p>
                Aura is redefining what is possible when medical expertise meets intelligent technology, helping bring future outcomes into clear and realistic focus.
              </p>
            </div>
          </main>
        </div>
      </>
    </div>
  );
};

export default AboutPage;
