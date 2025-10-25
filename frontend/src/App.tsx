// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import './App.css';

// 1. Import all your pages
import HomePage from './pages/homepage/homepage';
import PromptPage from './pages/prompt/prompt';
import AboutPage from './pages/about/about'; // Assuming you have a component in about.tsx

function App() {
  return (
    // 2. Define your routes
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/start" element={<PromptPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* You can add a 404 "Not Found" page later */}
      {/* <Route path="*" element={<h1>404: Page Not Found</h1>} /> */}
    </Routes>
  );
}

export default App;