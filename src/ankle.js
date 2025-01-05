import React, { useState, useEffect, useRef } from 'react';
import './ankle.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const Ankle = () => {
  const [showModel, setShowModel] = useState(false);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    if (showModel) {
      // Scene, Camera, and Renderer Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 60);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      modelViewerRef.current.appendChild(renderer.domElement);

    

      // Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Subtle ambient light
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(1.5, 80, 0.500);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 5000;
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffddcc, 1, 100);
      pointLight.position.set(-10, 10, -10);
      pointLight.castShadow = true;
      scene.add(pointLight);

      // Post-Processing
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      composer.addPass(bloomPass);

      // Load the GLTF Model
      const loader = new GLTFLoader();
      loader.load(
        '/models/shadankle.glb',
        (glb) => {
          const model = glb.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          scene.add(model);

          // Adjust Camera
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          camera.position.set(center.x, center.y + size.y * 1.5, size.z * 2);
          camera.lookAt(center);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
        }
      );

      // Orbit Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.maxDistance = 50;

      // Resize Handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        composer.render();
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        composer.dispose();
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

export default Ankle;
