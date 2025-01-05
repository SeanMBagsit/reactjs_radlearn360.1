import React, { useState, useEffect, useRef } from 'react';
import './wrist.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Wrist = () => {
  const [showModel, setShowModel] = useState(false);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    if (showModel) {
      // Initialize the 3D model scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      modelViewerRef.current.appendChild(renderer.domElement);
      

      const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5).normalize();
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const loader = new GLTFLoader();
      loader.load(
        '/models/LATERAL_WRIST.glb', 
        (glb) => {
          const model = glb.scene;
          model.scale.set(5, 5, 5);
          model.castShadow = true;
          model.receiveShadow = true;
          scene.add(model);

          camera.position.z = 1;
          camera.position.y = 2;
          camera.position.x = 12;

          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.screenSpacePanning = false;

          const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };
          animate();
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
        }
      );

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      return () => {
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
              className="black-box"
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              <p>Click to view 3D Model</p>
            </div>
          </div>
          <div className="text-section">
            <h2>Patient Position:</h2>
          </div>
        </div>
      </main>

      {showModel && (
        <div
          id="model-viewer-container"
          style={{
            width: '100%',
            height: '100vh',
            backgroundColor: 'black',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
          }}
        >
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

export default Wrist;
