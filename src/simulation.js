import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Simulation = () => {
    const [showModel, setShowModel] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('red');
    const [handPosition, setHandPosition] = useState({ x: 0, y: 0, z: 0 });
    const [handRotation, setHandRotation] = useState({ x: 0, y: 0, z: 0 });  // Added z rotation
    const modelViewerRef = useRef(null);
    const [Model, setModel] = useState(null);
    const dragControlsRef = useRef(null);
    const [currentItem, setCurrentItem] = useState(0);
    const [passedCurrentItem, setPassedCurrentItem] = useState(false);


    const boundaries = {
        minX: -10,
        maxX: 10,
        minY: -10,
        maxY: 10,
        minZ: -10,
        maxZ: 10,
    };

    const simulationSettings = [
        {
            ModelFile: '/models/hand.glb',
            targetPosition: { x: 0.87, y: -8.81, z: -6.13 },
            targetRotation: { x: 0, y: 0, z: 0 }, // No conversion needed (0 degrees = 0 radians)
            threshold: 0.5,
            scale: { x: 1, y: 1, z: 1 }, // Scale added here
        },
        {
            ModelFile: '/models/wrist.glb',
            targetPosition: { x: 1.33, y: 0.34, z: -0.37 },
            targetRotation: { 
                x: 0, 
                y: 0, 
                z: -100 * (Math.PI / 180) // Convert -100 degrees to radians (-1.745 radians)
            },
            threshold: 0.1,
            scale: { x: 6, y: 6, z: 6 }, // Scale added here
        },
        {
            ModelFile: '/models/elbow.glb',
            targetPosition: { x: -3.63, y: -3.33, z: 4.66 },
            targetRotation: { 
                x: 0, 
                y: 0, 
                z: -180 * (Math.PI / 180) // Convert -180 degrees to radians (-3.142 radians)
            },
            threshold: 0.2,
            scale: { x: 4, y: 4, z: 4 }, // Scale added here
        },
        {
            ModelFile: '/models/foot.glb',
            targetPosition: { x: 0, y: -7.67, z: 0.38 },
            targetRotation: { 
                x: 0,
                y: 0,
                z: 0,
            },
            threshold: 0.3,
            scale: { x: 1.2, y: 1.2, z: 1.2 }, // Scale added here
        },
        {
            ModelFile: '/models/foot.glb',
            targetPosition: { x: 8.06, y:-0.49, z: 3.61 },
            targetRotation: { 
                x: 0, 
                y: 0, 
                z: -100 * (Math.PI / 180) // Convert -100 degrees to radians (-1.745 radians)
            },
            threshold: 0.7,
            scale: { x: 1, y: 1, z: 1 }, // Scale added here
        }
    ];
    
    


    const enterSimulation = () => {
        setShowIntro(true);
        setShowModel(true);
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
            modelViewerRef.current.innerHTML = '';
            modelViewerRef.current.appendChild(renderer.domElement);
    
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
    
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(1.5, 80, 0.5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
    
            const loader = new GLTFLoader();
    
            // Check if currentItem is within bounds of the simulationSettings array
            const currentSetting = simulationSettings[currentItem] || {};
    
            const { ModelFile, scale } = currentSetting;  // Use the currentSetting to prevent destructure error
    
            if (ModelFile) {
                loader.load(
                    ModelFile,
                    (glb) => {
                        const loadedHandModel = glb.scene;
                        loadedHandModel.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        loadedHandModel.position.set(0, 0, 0);
                        loadedHandModel.scale.set(scale.x, scale.y, scale.z); // Apply the scale here
                        scene.add(loadedHandModel);
                        setModel(loadedHandModel);
    
                        const dragControls = new DragControls([loadedHandModel], camera, renderer.domElement);
                        dragControlsRef.current = dragControls;
    
                        dragControls.addEventListener('drag', (event) => {
                            let { x, y, z } = event.object.position;
                            x = Math.max(boundaries.minX, Math.min(x, boundaries.maxX));
                            y = Math.max(boundaries.minY, Math.min(y, boundaries.maxY));
                            z = Math.max(boundaries.minZ, Math.min(z, boundaries.maxZ));
    
                            event.object.position.set(x, y, z);
                            setHandPosition({ x, y, z });
                        });
    
                        dragControls.addEventListener('dragstart', () => {
                            cameraControls.enabled = false;
                        });
    
                        dragControls.addEventListener('dragend', () => {
                            cameraControls.enabled = true;
                        });
    
                        camera.position.set(currentSetting.targetPosition?.x || 0, currentSetting.targetPosition?.y || 0, 60);
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading model:', error);
                    }
                );
            } else {
                console.error('Model file not found in simulation settings for current item.');
            }
    
            // Load xray model (keeping the existing code)
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
    }, [showModel, currentItem]);
    

    const handleVerifyPlacement = () => {
        const { targetPosition, targetRotation, threshold } = simulationSettings[currentItem];
    
        // Calculate distance between current and target positions
        const distance = Math.sqrt(
            Math.pow(handPosition.x - targetPosition.x, 2) +
            Math.pow(handPosition.y - targetPosition.y, 2) +
            Math.pow(handPosition.z - targetPosition.z, 2)
        );
    
        // Check both position and all rotation axes
        if (distance <= threshold &&
            Math.abs(Model.rotation.x - targetRotation.x) < 0.01 &&
            Math.abs(Model.rotation.y - targetRotation.y) < 0.01 &&
            Math.abs(Model.rotation.z - targetRotation.z) < 0.01) {  // Added z-rotation check
            setFeedbackMessage('You passed!');
            setFeedbackColor('green');
            setPassedCurrentItem(true);
        } else {
            setFeedbackMessage('Wrong position or rotation!');
            setFeedbackColor('red');
        }
    };

    const handleRotationChange = (axis, value) => {
        if (!Model) return;

        const rotationValue = parseFloat(value) * Math.PI / 180;
        if (axis === 'x') {
            Model.rotation.x = rotationValue;
            setHandRotation(prevState => ({ ...prevState, x: rotationValue }));
        } else if (axis === 'y') {
            Model.rotation.y = rotationValue;
            setHandRotation(prevState => ({ ...prevState, y: rotationValue }));
        } else if (axis === 'z') {  // Added z-axis rotation handling
            Model.rotation.z = rotationValue;
            setHandRotation(prevState => ({ ...prevState, z: rotationValue }));
        }
    };


    const handleNextItem = () => {
        if (currentItem < simulationSettings.length - 1) {
            setCurrentItem(currentItem + 1);
            setPassedCurrentItem(false); 
            setFeedbackMessage('');
            setFeedbackColor('red');
            // Reset position and rotation to 0, 0, 0
            setHandPosition({ x: 0, y: 0, z: 0 });
            setHandRotation({ x: 0, y: 0, z: 0 });  // Reset rotation
        }
    };
    

    const handleExitSimulation = () => {
        const confirmation = window.confirm('Are you sure you want to exit? All progress will be lost.');
        if (confirmation) {
            setShowModel(false);
            setShowIntro(true);
            setCurrentItem(0);
            setHandPosition({ x: 0, y: 0, z: 0 });
            setHandRotation({ x: 0, y: 0, z: 0 });  // Reset z rotation
            setFeedbackMessage('');
            setFeedbackColor('red');
            setPassedCurrentItem(false);
    
            if (Model) {
                Model.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                });
            }
    
            if (dragControlsRef.current) {
                dragControlsRef.current.dispose();
                dragControlsRef.current = null;
            }
            
            if (modelViewerRef.current) {
                modelViewerRef.current.innerHTML = '';
            }
        }
    };

    return (
        <div>
            {showIntro && (
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '30px',
                    }}
                >
                    <button
                        onClick={enterSimulation}
                        style={{
                            backgroundColor: 'blue',
                            color: 'white',
                            padding: '15px 30px',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                    >
                        Start Simulation
                    </button>
                </div>
            )}

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
                        onClick={handleExitSimulation}
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

                    {/* Progress Tracker */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80%',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            padding: '5px',
                            borderRadius: '5px',
                        }}
                    >
                        <div
                            style={{
                                width: `${((currentItem + 1) / simulationSettings.length) * 100}%`,
                                height: '10px',
                                backgroundColor: 'green',
                                borderRadius: '5px',
                            }}
                        ></div>
                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                textAlign: 'center',
                                color: 'white',
                                fontSize: '16px',
                                top: '15px',
                            }}
                        >
                            {`${currentItem + 1}/${simulationSettings.length}`}
                        </div>
                    </div>

                    <div
                        id="model-viewer"
                        ref={modelViewerRef}
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

                    {passedCurrentItem && (
                        <button
                            onClick={handleNextItem}
                            style={{
                                position: 'absolute',
                                bottom: '100px',
                                left: '40px',
                                backgroundColor: 'green',
                                color: 'white',
                                padding: '20px 30px',
                                border: 'none',
                                borderRadius: '9px',
                                fontSize: '30px',
                                cursor: 'pointer',
                                zIndex: 20,
                            }}
                        >
                            Next
                        </button>
                    )}

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
                            top: '40px',
                            left: '20px',
                            color: 'white',
                            fontSize: '18px',
                            zIndex: 15,
                        }}
                    >
                        <div>Hand Position: ({handPosition.x.toFixed(2)}, {handPosition.y.toFixed(2)}, {handPosition.z.toFixed(2)})</div>
                        <div>Hand Rotation: ({(handRotation.x * 180 / Math.PI).toFixed(2)}°, {(handRotation.y * 180 / Math.PI).toFixed(2)}°, {(handRotation.z * 180 / Math.PI).toFixed(2)}°)</div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            color: 'white',
                            fontSize: '18px',
                            zIndex: 15,
                        }}
                    >
                        {/* X Rotation */}
                        <div style={{ marginBottom: '10px' }}>
                            <div>X Rotation</div>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={handRotation.x * (180 / Math.PI)}
                                onChange={(e) => handleRotationChange('x', e.target.value)}
                                style={{ width: '200px' }}
                            />
                        </div>

                        {/* Y Rotation */}
                        <div style={{ marginBottom: '10px' }}>
                            <div>Y Rotation</div>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={handRotation.y * (180 / Math.PI)}
                                onChange={(e) => handleRotationChange('y', e.target.value)}
                                style={{ width: '200px' }}
                            />
                        </div>

                        {/* Z Rotation */}
                        <div style={{ marginBottom: '10px' }}>
                            <div>Z Rotation</div>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={handRotation.z * (180 / Math.PI)}
                                onChange={(e) => handleRotationChange('z', e.target.value)}
                                style={{ width: '200px' }}
                            />
                        </div>
                    </div>


                </div>
            )}
        </div>
    );
};

export default Simulation;