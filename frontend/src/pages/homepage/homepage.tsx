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
      max-width: 800px; /* Max width for the graphic - Increased from 600px */
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
      stroke: #EF4444; /* Updated from #E57373 */
      stroke-width: 0.7;
    }
    .graphic-placeholder .diag-blue {
      stroke: #3B82F6; /* Updated from #64B5F6 */
      stroke-width: 0.7;
    }
    .graphic-placeholder .node-group {
      fill: #EAB308; /* Updated from #FFD54F (yellow) */
      stroke: #1A1A1A; /* Updated from #BFA440 (main text color) */
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
      font-size: 2.75rem; /* 44px - Slightly larger */
      font-weight: 500;
      max-width: 1000px; /* Increased from 800px */
      margin: 0 auto 1.5rem auto;
      line-height: 1.3;
      color: var(--text-color);
    }

    .sub-headline {
      font-size: 1.1rem; /* 17.6px - Slightly larger */
      max-width: 800px; /* Increased from 700px */
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
        font-size: 2.25rem; /* Smaller headline for mobile - adjusted */
      }

      .sub-headline {
        font-size: 1rem; /* adjusted */
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
              <a href="/devpost">DevPost</a>
              <a href="/github">Github</a>
              <a href="/about">About us</a>
            </nav>
          </header>

          <main className="main-content">
            {/* Removed GraphicPlaceholder and graphic-caption */}

            <h1 className="main-headline">
              Aura is the next generation model for surgical and medical intervention.
            </h1>

            <p className="sub-headline">
              Control every aspect of medical model training and
              fine-tuning with our flexible API infrastructure.
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

export default App;





