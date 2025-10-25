import React from 'react';

// All CSS is embedded here. You can copy this and move it to a `homepage.css` file.
const HomepageStyles = () => (
    <style>{`
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500&display=swap');

    /* CSS Variables for colors */
    :root {
      --bg-color: #FFFFFF;
      --text-color: #1a1a1a;
      --text-color-secondary: #555555;
      --btn-bg: #F3F4F6;
      --btn-bg-hover: #E5E7EB;
      --btn-border: #E5E7EB;
    }

    /* Global & Body */
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    * {
      box-sizing: border-box;
    }

    /* Main Page Container */
    .homepage-container {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center; /* Center content vertically */
      align-items: center;    /* Center content horizontally */
      position: relative;
      overflow: hidden;
    }

    /* Header Navigation */
    .homepage-header {
      width: 100%;
      padding: 1.5rem 3rem; /* Padding as seen in screenshot */
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }

    .header-brand {
      font-size: 1.125rem; /* 18px */
      font-weight: 600;
      letter-spacing: 0.2em; /* Wide letter spacing for "AURA" */
      text-transform: uppercase;
      text-decoration: none;
      color: var(--text-color);
    }

    .header-nav {
      display: flex;
      gap: 2.5rem; /* Spacing between nav items */
    }

    .header-nav a {
      text-decoration: none;
      color: var(--text-color-secondary);
      font-size: 0.9rem; /* 14.4px */
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .header-nav a:hover {
      color: var(--text-color);
    }

    /* Main Content Area */
    .main-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 4rem 2rem; /* Add padding for spacing */
      margin-top: 4rem; /* Push content down from header */
    }

    .graphic-placeholder {
      width: 100%;
      max-width: 450px; /* Max width for the graphic */
      margin-bottom: 1rem;
      color: #999;
    }
    
    /* SVG styles */
    .graphic-placeholder svg {
      width: 100%;
      height: auto;
    }
    
    .graphic-placeholder .grid-line {
      stroke: #E0E0E0;
      stroke-width: 0.5;
    }
    .graphic-placeholder .diag-red {
      stroke: #E57373; /* Muted red */
      stroke-width: 0.7;
    }
    .graphic-placeholder .diag-blue {
      stroke: #64B5F6; /* Muted blue */
      stroke-width: 0.7;
    }
    .graphic-placeholder .node-group {
      fill: #FFD54F; /* Gold/Yellow */
      stroke: #BFA440;
      stroke-width: 0.5;
    }
    
    .graphic-caption {
      font-size: 0.75rem; /* 12px */
      color: #888888;
      margin-bottom: 3rem;
      font-style: italic;
    }

    .main-headline {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem; /* 40px */
      font-weight: 500;
      max-width: 600px;
      margin: 0 auto 1.5rem auto;
      line-height: 1.3;
      color: var(--text-color);
    }

    .sub-headline {
      font-size: 1rem; /* 16px */
      max-width: 500px;
      margin: 0 auto 2.5rem auto;
      color: var(--text-color-secondary);
      line-height: 1.6;
    }

    /* Call-to-Action Buttons */
    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .btn {
      text-decoration: none;
      padding: 0.65rem 1.25rem;
      border-radius: 9999px; /* Full pill shape */
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .btn-primary {
      background-color: var(--btn-bg);
      color: #333;
      border: 1px solid var(--btn-border);
    }

    .btn-primary:hover {
      background-color: var(--btn-bg-hover);
    }

    .btn-secondary {
      color: var(--text-color-secondary);
    }

    .btn-secondary:hover {
      color: var(--text-color);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .homepage-header {
        padding: 1rem 1.5rem;
      }
      
      .header-nav {
        gap: 1.5rem;
      }
      
      .header-nav a {
        font-size: 0.85rem;
      }

      .main-content {
        padding: 6rem 1rem 2rem 1rem;
        margin-top: 0;
      }

      .main-headline {
        font-size: 2rem; /* Smaller headline for mobile */
      }

      .sub-headline {
        font-size: 0.95rem;
      }
      
      .cta-buttons {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `}</style>
);

// This is a placeholder SVG to represent the complex graphic.
// You can replace this with your own <img /> tag or a more complex SVG.
const GraphicPlaceholder = () => (
    <svg viewBox="0 0 200 100" className="graphic-placeholder">
        <title>Abstract geometric grid graphic</title>
        {/* Background Grid */}
        <path className="grid-line" d="M 0 0 H 200 M 0 25 H 200 M 0 50 H 200 M 0 75 H 200 M 0 100 H 200 M 0 0 V 100 M 50 0 V 100 M 100 0 V 100 M 150 0 V 100 M 200 0 V 100" />

        {/* Diagonal Lines */}
        <path className="diag-red" d="M 0 0 L 200 100 M 0 50 L 100 100 M 100 0 L 200 50 M 0 100 L 200 0 M 0 50 L 100 0 M 100 100 L 200 50" />
        <path className="diag-blue" d="M 0 25 L 50 0 M 0 75 L 50 100 M 50 0 L 100 25 M 50 100 L 100 75 M 100 25 L 150 0 M 100 75 L 150 100 M 150 0 L 200 25 M 150 100 L 200 75" />

        {/* Node Clusters */}
        <g className="node-group">
            <circle cx="25" cy="12.5" r="3" /> <circle cx="12.5" cy="25" r="3" /> <circle cx="25" cy="37.5" r="3" /> <circle cx="37.5" cy="25" r="3" />
            <circle cx="75" cy="12.5" r="3" /> <circle cx="62.5" cy="25" r="3" /> <circle cx="75" cy="37.5" r="3" /> <circle cx="87.5" cy="25" r="3" />
            <circle cx="125" cy="12.5" r="3" /> <circle cx="112.5" cy="25" r="3" /> <circle cx="125" cy="37.5" r="3" /> <circle cx="137.5" cy="25" r="3" />
            <circle cx="175" cy="12.5" r="3" /> <circle cx="162.5" cy="25" r="3" /> <circle cx="175" cy="37.5" r="3" /> <circle cx="187.5" cy="25" r="3" />

            <circle cx="25" cy="62.5" r="3" /> <circle cx="12.5" cy="75" r="3" /> <circle cx="25" cy="87.5" r="3" /> <circle cx="37.5" cy="75" r="3" />
            <circle cx="75" cy="62.5" r="3" /> <circle cx="62.5" cy="75" r="3" /> <circle cx="75" cy="87.5" r="3" /> <circle cx="87.5" cy="75" r="3" />
            <circle cx="125" cy="62.5" r="3" /> <circle cx="112.5" cy="75" r="3" /> <circle cx="125" cy="87.5" r="3" /> <circle cx="137.5" cy="75" r="3" />
            <circle cx="175" cy="62.5" r="3" /> <circle cx="162.5" cy="75" r="3" /> <circle cx="175" cy="87.5" r="3" /> <circle cx="187.5" cy="75" r="3" />
        </g>
    </svg>
);


// The main React component
const App: React.FC = () => {
    return (
        <>
            <HomepageStyles />
            <div className="homepage-container">

                <header className="homepage-header">
                    <a href="/" className="header-brand">
                        Aura
                    </a>
                    <nav className="header-nav">
                        <a href="/tinker">Tinker</a>
                        <a href="/blog">Blog</a>
                        <a href="/join">Join us</a>
                    </nav>
                </header>

                <main className="main-content">
                    <GraphicPlaceholder />

                    <p className="graphic-caption">
                        *network graphic attribution or description goes here*
                    </p>

                    <h1 className="main-headline">
                        Aura is the next generation model for surgical and medical intervention.
                    </h1>

                    <p className="sub-headline">
                        Control every aspect of medical model training and
                        fine-tuning with our flexible API infrastructure.
                    </p>

                    <div className="cta-buttons">
                        <a href="/waitlist" className="btn btn-primary">
                            Join waitlist
                        </a>
                        <a href="/announcement" className="btn btn-secondary">
                            Announcement
                        </a>
                        <a href="/docs" className="btn btn-secondary">
                            Docs
                        </a>
                    </div>
                </main>

            </div>
        </>
    );
};

export default App;
