import React, { useState, useEffect, useRef } from 'react';
import './hand.css'; // Assuming your CSS file is in the same directory
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Correct path for GLTFLoader
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Correct path for OrbitControls

const Hand = () => {
  const [showModel, setShowModel] = useState(false);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    if (showModel) {
      // Initialize Three.js scene when the model is shown
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true; // Enable shadows
      modelViewerRef.current.appendChild(renderer.domElement);

      // Create an ambient light for basic illumination
      const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
      scene.add(ambientLight);

      // Add a directional light to cast shadows and create highlights
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5).normalize();
      directionalLight.castShadow = true; // Enable shadow for this light
      scene.add(directionalLight);

      // Load the 3D model using GLTFLoader
      const loader = new GLTFLoader();
      loader.load(
        '/models/PA_HAND.glb', // Path to the 3D model in your public directory
        (glb) => {
          const model = glb.scene;
          model.scale.set(5, 5, 5); // Adjust model scale
          model.castShadow = true; // Enable shadows on the model
          model.receiveShadow = true; // Allow model to receive shadows
          scene.add(model);

          // Set up the camera position
          camera.position.z = 5; // Adjust for a better view
          camera.position.y = 3;
          camera.position.x = 0;

          // Create OrbitControls for interactivity
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.screenSpacePanning = false; // Prevent panning out of bounds

          const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Update controls
            renderer.render(scene, camera);
          };
          animate();
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          modelViewerRef.current.innerHTML = 'Failed to load 3D model. Please try again later.';
        }
      );

      // Handle window resize events
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      return () => {
        // Clean up on component unmount
        window.removeEventListener('resize', () => {});
        renderer.dispose();
      };
    }
  }, [showModel]);

  const handleClick = () => {
    setShowModel(true);
  };

  const closeModel = () => {
    setShowModel(false);
  };

  return (
    <div>
      <main className="content">
        <div className="procedure-container">
          <div className="image-section">
            <div
              id="view-3d-model"
              className="black-box"
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              <p>Click to view 3D Model</p>
            </div>
          </div>
          <div className="text-section">
            <h2>Patient Position:</h2>
            <p>- Palmar surface down on the IR; spread the fingers slightly</p>
            <h2>Reference Point:</h2>
            <p>- 3rd MCP joint</p>
            <h2>Central Ray:</h2>
            <p>- Perpendicular</p>
            <h2>Structure Shown:</h2>
            <p>- PA oblique projection of the thumbs</p>
          </div>
        </div>
      </main>

      {/* Display the 3D model viewer when showModel is true */}
      {showModel && (
        <div
          id="model-viewer-container"
          style={{
            width: '100%',
            height: '100vh',
            backgroundColor: 'black', // Set background to black
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
          }}
        >
          {/* Close Button (X) */}
          <button
            onClick={closeModel}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              cursor: 'pointer',
              zIndex: 20,
            }}
          >
            X
          </button>

          <div
            id="model-viewer"
            ref={modelViewerRef}
            style={{ width: '100%', height: '100%' }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Hand;
