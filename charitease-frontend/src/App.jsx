import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Organizations from './pages/Organizations';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Donor</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/donate">Donate</a>
            <a href="/organizations">Organizations</a>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/organizations" element={<Organizations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
