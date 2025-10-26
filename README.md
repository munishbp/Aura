# Aura - Setup Guide

Our stack consists of:

- **Express**: Backend API framework
- **React**: Frontend library (using Vite + TypeScript)
- **Node.js**: Backend runtime environment

---

## 1. Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js (LTS version)](https://nodejs.org/en/) (which includes `npm`)
- [Git](https://git-scm.com/)
- A code editor (e.g., [VS Code](https://code.visualstudio.com/))

---

## 2. Installation & Setup

Follow these steps to get both the backend and frontend servers running.

### A. Clone the Repository

First, clone the project from GitHub to your local machine:

```bash
git clone [https://github.com/Aur](https://github.com/munishbp/Aura.git)
```

## Inspiration
We wanted to empower plastic surgeons with intelligent tools that enhance patient outcomes. By combining advanced computer vision and real-time feedback, we aimed to transform uncertainty into precision — helping surgeons and patients visualize the future with confidence. In addition, the current industry standard tools offer mediocre results, we felt like we could do better. 
## What it does
Aura analyzes facial data from multiple angles to detect distinct structural features. Aura accurately models realistic facial plastic surgery outcomes while preserving the distinct facial features that makes a person unique.  This sample demo showcases three distinct surgery models: blepharoplasty, rhinoplasty, and rhytidectomy.  Our AI tool achieves this through capturing a patient's facial profile with thorough photo analysis of their facial features.  We then used a FLUX generative AI model to produce realistic outcomes.  Lastly, we opted to present the estimated outcomes on our website.  
## How we built it
The journey to our app began on the whiteboard, where we explored in-depth diagrams and considerations, before developing a minimalistic yet impactful prototype UI.  To carry on the spirit of this ideal, we created a dynamic, robust interface that is accessible to medical professionals. In our history of interacting with the industry, we've discovered that these professionals do not like interacting with software. We integrated Eleven Lab's speech-to-text model to create a more natural workflow and to achieve our vision of a software that they will want to use.  To achieve the heavy lifting of producing better estimations of plastic surgery outcomes, we used DreamOmni2 fine-tuned with LoRA.  The inspiration behind us using LoRA was due to Thinking Machine Lab's groundbreaking results. To tie everything together we created a robust iOS app to intake facial profiles of patients.
## Challenges we ran into
The AI industry is centered around CUDA and everything they offer. We were fortunate enough to have access to AMD's top-of-the-line cloud computing resources.  Although there were some initial learning curves using their native library, ROCm, it later enabled us to maximize our training efficiency through reducing time through parallelization. Another challenge we had was applying state-of-the-art algorithms combined with the challenge of adapting a brand new model, DreamOmni2, without community support, we leveraged Gemini 2.5 and our own expertise to overcome this hurdle.  We wanted a professional, industry-level UI, which caused us to be very ambitious.  Due to the standard we set for ourselves, this caused many design challenges when forming the UI.  To overcome this, we created storyboards, clear expectations of our webpages, and allotted our time accordingly.  
## Accomplishments that we're proud of
-A working prototype deployed on AMD Instinct hardware
-Learning to use ROCm on a top-of-the-line GPU was a great opportunity. Being able to perform LoRA efficiently to create not one, but 3 separate LoRA adaptors on a state-of-the-art AI model that combines a vision-language and FLUX to achieve a realistic generation of our goal output. This would not have been possible without AMD, which enabled us to achieve our goals.
-Real-time feedback with voice interaction
-High consistency in recommendations across testing sets
-Delivering a system that blends medical practicality with cutting-edge AI
## What we learned
We learned how to push AI beyond the usual CUDA world by utilizing AMD’s ROCm and Instinct GPUs running smoothly, proving that high performance isn’t limited to one ecosystem. We also became quick at adapting and fine-tuning new models like DreamOmni2 and LoRA, even when we had no community support to lean on. Additionally, we focused on making everything user-friendly, including speech-to-text tools that fit right into the workflow of doctors. We discovered that a professional-looking experience takes real planning, including storyboards, clear standards, and attainable ideals; not just good intentions. Ultimately, we learned many valuable lessons related to integrating and training AI for real use cases, full-stack web app development, and creating accessible mobile app support.
## What's next for Aura: Shaping the Future You 
-Broaden Aura’s recommendation system to support a wider range of cosmetic procedures, including:
--Hair restoration (implants)
--Botox and injectables for wrinkle reduction
--Lip augmentation 
--Enhanced facial symmetry and contour refinement
-Introduce AR-based live previews for outcome visualization
-Begin pilot studies with clinical partners and live testing
-Increase agentic AI functionalities to enable doctors to be more personable with patients

