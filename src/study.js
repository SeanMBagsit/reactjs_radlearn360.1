import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './study.css';

const Study = () => {
  const [image1, setImage1] = useState('human.png');
  const [image2, setImage2] = useState('human.png');
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleMouseEnter = (setImage, newSrc) => {
    setImage(newSrc);
  };

  const handleMouseLeave = (setImage, originalSrc) => {
    setImage(originalSrc);
  };

  // Use navigate() for redirection instead of window.location.href
  const handleRedirect = (url) => {
    navigate(url);  // Navigate to the provided URL
  };

  return (
    <div>
      {/* Main Content */}
      <div className="content">
        <h1>Select Your Anatomical Region</h1>
        <div className="body-chart">
          {/* Anatomical Image 1 (Upper Extremities) */}
          <div
            className="human-body"
            id="body-1"
            onMouseEnter={() => handleMouseEnter(setImage1, 'upperex.png')}
            onMouseLeave={() => handleMouseLeave(setImage1, 'human.png')}
            onClick={() => handleRedirect('/upper')}  // Use React Router's navigate here
          >
            <img src={image1} alt="Upper Extremities" className="body-img" id="image-1" />
            <div className="tooltip" id="tooltip-1">
              <span className="tooltip-text">Upper Extremities</span>
            </div>
          </div>

          {/* Anatomical Image 2 (Lower Extremities) */}
          <div
            className="human-body"
            id="body-2"
            onMouseEnter={() => handleMouseEnter(setImage2, 'lowerex.png')}
            onMouseLeave={() => handleMouseLeave(setImage2, 'human.png')}
            onClick={() => handleRedirect('/lower')}  // Use React Router's navigate here
          >
            <img src={image2} alt="Lower Extremities" className="body-img" id="image-2" />
            <div className="tooltip" id="tooltip-2">
              <span className="tooltip-text">Lower Extremities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;
