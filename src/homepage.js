import React from "react";
import './homepage.css';  // Importing the CSS file

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">Welcome to RadLearn360</h1>
        <p className="hero-desc">Interactive learning platform for radiologic technology</p>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Key Features</h2>
        <div className="features-grid">
          {[
            { title: "Study Anatomy", desc: "Explore detailed anatomy lessons designed to boost your radiology knowledge." },
            { title: "Simulation Activities", desc: "Test your skills with real-world simulation exercises in radiologic technology." },
            { title: "Interactive Learning", desc: "Engage with interactive content that makes learning fun and effective." },
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-list">
          {[
            "RadLearn360 helped me understand complex concepts in radiology in a fun and interactive way!",
            "The simulation section was incredibly helpful in preparing me for real-world scenarios!",
          ].map((testimonial, index) => (
            <blockquote key={index} className="testimonial-item">
              {testimonial}
            </blockquote>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 RadLearn360. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
