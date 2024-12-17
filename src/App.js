import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import "./App.css";
import Study from "./study";
import Upper from "./upper-ex";
import Hand from "./hand";

const App = () => {
  const navigate = useNavigate();

  // Handle redirection to the Upper page
  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">RadLearn360</div>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} data-title="Home">
            Home
          </NavLink>
          <NavLink to="/study" className={({ isActive }) => (isActive ? "active" : "")} data-title="Study">
            Study
          </NavLink>
          <NavLink to="/simulation" className={({ isActive }) => (isActive ? "active" : "")} data-title="Simulation">
            Simulation
          </NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<p>Welcome to the homepage! Test content goes here.</p>} />
        <Route path="/study" element={<Study />} />
        <Route path="/upper" element={<Upper />} />
        <Route path="/simulation" element={<p>Simulation content coming soon!</p>} />
        <Route path="/hand" element={<Hand />} /> 
      </Routes>
    </div>
  );
};

// Wrap App in Router in the main index.js file
export default App;
