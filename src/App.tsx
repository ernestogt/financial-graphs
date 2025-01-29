import { Link, Navigate, Route, Routes } from 'react-router';
import Graphs from './pages/Graphs';
import FinancialNews from './pages/FinancialNews';
import './App.css';
import { useState } from 'react';
import ThemeContext from './context/ThemeContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? "min-h-screen bg-gray-900 text-gray-100" : "min-h-screen bg-gray-100 text-gray-900"}>

        <nav className="bg-blue-500 p-4 h-2 flex justify-between items-center">
          <ul className="flex space-x-4">
            <li><Link to="/graphs" className="text-white hover:underline">Graphs</Link></li>
            <li><Link to="/financial-news" className="text-white hover:underline">Financial News</Link></li>
          </ul>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="hidden"
            />
            <span className={`slider ${darkMode ? 'bg-gray-600' : 'bg-blue-500'}`}></span>
          </label>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/graphs" />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/financial-news" element={<FinancialNews />} />
          </Routes>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
