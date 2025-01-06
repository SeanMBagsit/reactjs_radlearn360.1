import React from "react";
import { Routes, Route, NavLink } from "react-router-dom"; // No need for BrowserRouter here
import "./App.css";
import Study from "./study";
import Upper from "./upper-ex";
import Hand from "./hand";
import Wrist from "./wrist";
import Elbow from "./elbow";  
import Lower from "./lower-ex"; 
import Foot from "./foot"; 
import Ankle from "./ankle";  
import Simulation from "./simulation";  


const App = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">RadLearn360</div>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/study" className={({ isActive }) => (isActive ? "active" : "")}>Study</NavLink>
          <NavLink to="/simulation" className={({ isActive }) => (isActive ? "active" : "")}>Simulation</NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<p>Welcome to the homepage! Test content goes here.</p>} />
        <Route path="/study" element={<Study />} />
        <Route path="/upper" element={<Upper />} />
        <Route path="/hand" element={<Hand />} />
        <Route path="/wrist" element={<Wrist />} />
        <Route path="/elbow" element={<Elbow />} /> 
        <Route path="/lower" element={<Lower />} /> 
        <Route path="/foot" element={<Foot />} />  
        <Route path="/ankle" element={<Ankle />} /> 
        <Route path="/simulation" element={<Simulation />} /> 
      </Routes>
    </div>
  );
};

export default App;
