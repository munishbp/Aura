// src/App.tsx

import './App.css';
import { HomePage } from './pages/homepage/homepage'; // 1. Import your page

function App() {
  return (
    <main>
      <HomePage /> {/* 2. Render your page here */}
    </main>
  );
}

export default App;