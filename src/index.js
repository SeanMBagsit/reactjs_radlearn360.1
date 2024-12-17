import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18+
import { BrowserRouter as Router } from "react-router-dom"; // Import Router
import App from "./App";
import "./index.css";

// Create a root and render the App component wrapped in Router
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
