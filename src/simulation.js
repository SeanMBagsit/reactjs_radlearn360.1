import React, { useState, useEffect, useRef } from 'react';
import './ankle.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Simulation = () => {
    const [showModel, setShowModel] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('red');
    const [handPosition, setHandPosition] = useState({ x: 0, y: 0, z: 0 });
    const [handRotation, setHandRotation] = useState({ x: 0, y: 0 });
    const modelViewerRef = useRef(null);
    const [handModel, setHandModel] = useState(null);
    const dragControlsRef = useRef(null);

    // Define boundary limits for hand position
    const boundaries = {
        minX: -10,
        maxX: 10,
        minY: -10,
        maxY: 10,
        minZ: -10,
        maxZ: 10,
    };

    // Define target angles for rotation (in radians)
    const targetRotation = {
        x: Math.PI / 4,  // 45 degrees for X-axis
        y: Math.PI / 6,  // 30 degrees for Y-axis
    };

    useEffect(() => {
        if (showModel) {
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

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(1.5, 80, 0.5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const loader = new GLTFLoader();

            loader.load(
                '/models/hand.glb',
                (glb) => {
                    const loadedHandModel = glb.scene;
                    loadedHandModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    loadedHandModel.position.set(0, 0, 0);
                    scene.add(loadedHandModel);
                    setHandModel(loadedHandModel);

                    const dragControls = new DragControls([loadedHandModel], camera, renderer.domElement);
                    dragControlsRef.current = dragControls;

                    // Disable orbit controls while dragging the hand model
                    dragControls.addEventListener('drag', (event) => {
                        let { x, y, z } = event.object.position;

                        x = Math.max(boundaries.minX, Math.min(x, boundaries.maxX));
                        y = Math.max(boundaries.minY, Math.min(y, boundaries.maxY));
                        z = Math.max(boundaries.minZ, Math.min(z, boundaries.maxZ));

                        event.object.position.set(x, y, z);

                        setHandPosition({ x, y, z });
                    });

                    // Disable orbit controls when dragging starts
                    dragControls.addEventListener('dragstart', () => {
                        cameraControls.enabled = false; // Disable camera movement during drag
                    });

                    // Re-enable orbit controls when dragging ends
                    dragControls.addEventListener('dragend', () => {
                        cameraControls.enabled = true; // Re-enable camera movement after drag
                    });
                },
                undefined,
                (error) => {
                    console.error('Error loading hand model:', error);
                }
            );

            loader.load(
                '/models/xray.glb',
                (glb) => {
                    const loadedXrayModel = glb.scene;
                    loadedXrayModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    loadedXrayModel.position.set(0, -10, 0);
                    scene.add(loadedXrayModel);
                },
                undefined,
                (error) => {
                    console.error('Error loading xray model:', error);
                }
            );

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI / 2;

            // Store the controls reference to disable them during dragging
            const cameraControls = controls;

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            return () => {
                renderer.dispose();
                controls.dispose();
            };
        }
    }, [showModel]);

    const handleClick = () => {
        setShowModel(true);
        setFeedbackMessage('');
    };

    const closeModel = () => {
        setShowModel(false);
        setFeedbackMessage('');
    };

//SETTINGS IN ORDER SIMULATION TO PASS----------------
    const handleVerifyPlacement = () => {
        // Define target position and rotation values
        const targetPosition = { x: 0.87, y: -8.81, z: -6.13 };
        const targetRotation = { x: 0, y: 0 };
    
        const distance = Math.sqrt(
            Math.pow(handPosition.x - targetPosition.x, 2) +
            Math.pow(handPosition.y - targetPosition.y, 2) +
            Math.pow(handPosition.z - targetPosition.z, 2)
        );
    
        const threshold = .7; // Allow a small margin of error for position
    
        // Check if the position and rotation are within acceptable range
        const rotationXDifference = Math.abs(handModel.rotation.x - targetRotation.x);
        const rotationYDifference = Math.abs(handModel.rotation.y - targetRotation.y);
    
        if (distance <= threshold &&
            rotationXDifference < 0.01 && // Allow a very small margin of error for rotation
            rotationYDifference < 0.01) {
            setFeedbackMessage('You passed!');
            setFeedbackColor('green');
        } else {
            setFeedbackMessage('Wrong position or rotation!');
            setFeedbackColor('red');
        }
    };
    

    // Control the rotation of the model using sliders
    const handleRotationChange = (axis, value) => {
        if (!handModel) return;

        const rotationValue = parseFloat(value) * Math.PI / 180; // Convert to radians
        if (axis === 'x') {
            handModel.rotation.x = rotationValue;
            setHandRotation(prevState => ({ ...prevState, x: rotationValue }));
        } else if (axis === 'y') {
            handModel.rotation.y = rotationValue;
            setHandRotation(prevState => ({ ...prevState, y: rotationValue }));
        }
    };

    // Right-click interaction
    const handleRightClick = (event) => {
        event.preventDefault();
        console.log("Right-click on the hand model.");
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
                            <p>Start Simulation</p>
                        </div>
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
                        onContextMenu={handleRightClick}
                        style={{ width: '100%', height: '100%' }}
                    ></div>

                    <button
                        onClick={handleVerifyPlacement}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            backgroundColor: 'transparent',
                            border: '2px solid white',
                            color: 'white',
                            padding: '10px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            zIndex: 20,
                        }}
                    >
                        Verify Placement
                    </button>

                    {feedbackMessage && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '60px',
                                width: '100%',
                                textAlign: 'center',
                                color: feedbackColor,
                                fontSize: '24px',
                                fontWeight: 'bold',
                            }}
                        >
                            {feedbackMessage}
                        </div>
                    )}

                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            color: 'white',
                            fontSize: '18px',
                            zIndex: 20,
                        }}
                    >
                        {`Position: X: ${handPosition.x.toFixed(2)} Y: ${handPosition.y.toFixed(2)} Z: ${handPosition.z.toFixed(2)}`}
                        <br />
                        {`Rotation: X: ${(handRotation.x * 180 / Math.PI).toFixed(2)}° Y: ${(handRotation.y * 180 / Math.PI).toFixed(2)}°`}
                    </div>

                    {/* Rotation Sliders */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 20,
                        }}
                    >
                        <div style={{ marginBottom: '10px', color: 'white' }}>Rotate X Axis</div>
                        <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            defaultValue="0"
                            onChange={(e) => handleRotationChange('x', e.target.value)}
                            style={{
                                width: '150px',
                                background: '#ddd',
                                borderRadius: '5px',
                            }}
                        />
                        <div style={{ marginTop: '10px', color: 'white' }}>Rotate Y Axis</div>
                        <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            defaultValue="0"
                            onChange={(e) => handleRotationChange('y', e.target.value)}
                            style={{
                                width: '150px',
                                background: '#ddd',
                                borderRadius: '5px',
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Simulation;
