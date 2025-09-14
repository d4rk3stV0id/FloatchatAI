import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Globe3DProps {
  className?: string;
}

const Globe3D: React.FC<Globe3DProps> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const globeRef = useRef<THREE.Mesh>();
  const particlesRef = useRef<THREE.Points>();
  const animationRef = useRef<number>();
  const [mouseX, setMouseX] = useState(window.innerWidth / 2);
  const [mouseY, setMouseY] = useState(window.innerHeight / 2);
  const [mouseDistance, setMouseDistance] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create morphing sphere geometry with wave displacement
    const createMorphingSphereGeometry = () => {
      const geometry = new THREE.SphereGeometry(1, 64, 32);
      const positions = geometry.attributes.position.array as Float32Array;
      const originalPositions = new Float32Array(positions.length);
      
      // Store original positions
      for (let i = 0; i < positions.length; i++) {
        originalPositions[i] = positions[i];
      }
      
      // Add custom attributes for wave animation
      geometry.userData = { originalPositions };
      return geometry;
    };

    const geometry = createMorphingSphereGeometry();
    
    // Create candy swirl texture
    const createCandySwirlTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
      gradient.addColorStop(0, '#FF6B9D'); // Pink
      gradient.addColorStop(0.3, '#4ECDC4'); // Teal
      gradient.addColorStop(0.6, '#45B7D1'); // Blue
      gradient.addColorStop(1, '#96CEB4'); // Green

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);

      // Add swirl patterns
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.7;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const centerX = 200 + i * 150;
        const centerY = 100 + i * 80;
        const radius = 80 + i * 20;
        
        for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
          const x = centerX + Math.cos(angle) * (radius + Math.sin(angle * 3) * 20);
          const y = centerY + Math.sin(angle) * (radius + Math.cos(angle * 2) * 15);
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Add candy dots
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 15 + 5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const candyTexture = createCandySwirlTexture();
    
    // Create candy-like material
    const material = new THREE.MeshPhongMaterial({
      map: candyTexture,
      shininess: 100,
      specular: new THREE.Color(0xFFFFFF),
    });

    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add interactive particles around the globe
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const maxRadius = 2.0; // Maximum sphere radius for particles

    for (let i = 0; i < particlesCount; i++) {
      // Position particles in a sphere around the globe (1.2 to 1.8 radius)
      const baseRadius = 1.2 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.sin(phi) * Math.sin(theta);
      const z = baseRadius * Math.cos(phi);
      
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
      
      // Store original positions for expansion calculation
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.012,
      color: 0x20B2AA, // Ocean teal color
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesRef.current = particlesMesh;
    scene.add(particlesMesh);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (globeRef.current) {
        const globe = globeRef.current;
        const time = Date.now() * 0.001;
        
        // Rotate based on mouse position
        const targetRotationY = (mouseX / window.innerWidth) * Math.PI * 2;
        globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.05;
        
        // Continuous slow rotation
        globe.rotation.y += 0.005;
        
        // High-resolution wave morphing effect
        const positions = globe.geometry.attributes.position.array as Float32Array;
        const originalPositions = globe.geometry.userData.originalPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
          const x = originalPositions[i];
          const y = originalPositions[i + 1];
          const z = originalPositions[i + 2];
          
          // Calculate distance from center for wave intensity
          const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
          
          // High-frequency wave patterns for smaller, more dynamic waves
          const wave1 = Math.sin(x * 15 + time * 3.2) * 0.03;
          const wave2 = Math.sin(y * 12 + time * 2.8) * 0.025;
          const wave3 = Math.sin(z * 18 + time * 3.5) * 0.035;
          const wave4 = Math.sin((x + y) * 8 + time * 2.1) * 0.02;
          const wave5 = Math.sin((y + z) * 10 + time * 2.7) * 0.018;
          const wave6 = Math.sin((x + z) * 14 + time * 3.1) * 0.022;
          
          // Diagonal and complex wave patterns
          const wave7 = Math.sin((x + y + z) * 6 + time * 1.9) * 0.015;
          const wave8 = Math.sin((x - y + z) * 9 + time * 2.4) * 0.012;
          const wave9 = Math.sin((x + y - z) * 11 + time * 2.6) * 0.016;
          const wave10 = Math.sin((x - y - z) * 7 + time * 2.2) * 0.014;
          
          // High-frequency ripple patterns
          const ripple1 = Math.sin(Math.sqrt(x * x + y * y) * 20 + time * 4.2) * 0.008;
          const ripple2 = Math.sin(Math.sqrt(y * y + z * z) * 16 + time * 3.8) * 0.006;
          const ripple3 = Math.sin(Math.sqrt(x * x + z * z) * 22 + time * 4.5) * 0.009;
          
          // Turbulent noise-like patterns
          const noise1 = Math.sin(x * 25 + y * 15 + time * 5.1) * 0.005;
          const noise2 = Math.sin(y * 28 + z * 18 + time * 4.8) * 0.004;
          const noise3 = Math.sin(z * 30 + x * 20 + time * 5.3) * 0.006;
          
          // Combine all wave patterns
          const waveDisplacement = (
            wave1 + wave2 + wave3 + wave4 + wave5 + wave6 + 
            wave7 + wave8 + wave9 + wave10 +
            ripple1 + ripple2 + ripple3 +
            noise1 + noise2 + noise3
          ) * (1 - distanceFromCenter * 0.2); // Reduced center damping for more surface activity
          
          // Apply displacement along the normal direction
          const normalX = x / distanceFromCenter;
          const normalY = y / distanceFromCenter;
          const normalZ = z / distanceFromCenter;
          
          positions[i] = x + normalX * waveDisplacement;
          positions[i + 1] = y + normalY * waveDisplacement;
          positions[i + 2] = z + normalZ * waveDisplacement;
        }
        
        globe.geometry.attributes.position.needsUpdate = true;
        globe.geometry.computeVertexNormals(); // Recalculate normals for proper lighting
      }

      // Interactive particle expansion based on mouse distance
      if (particlesRef.current) {
        const particles = particlesRef.current;
        const positions = particles.geometry.attributes.position.array as Float32Array;
        
        // Calculate mouse distance from center (normalized)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distance = Math.sqrt(
          Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // More responsive expansion factor: 1.0 (normal) to 2.2 (expanded)
        const expansionFactor = 1.0 + (normalizedDistance * 1.2);
        
        // Update particle positions based on expansion
        for (let i = 0; i < particlesCount; i++) {
          const originalX = originalPositions[i * 3];
          const originalY = originalPositions[i * 3 + 1];
          const originalZ = originalPositions[i * 3 + 2];
          
          // Calculate new position with expansion
          let newX = originalX * expansionFactor;
          let newY = originalY * expansionFactor;
          let newZ = originalZ * expansionFactor;
          
          // Keep particles within the maximum sphere radius
          const currentRadius = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
          if (currentRadius > maxRadius) {
            const scaleFactor = maxRadius / currentRadius;
            newX *= scaleFactor;
            newY *= scaleFactor;
            newZ *= scaleFactor;
          }
          
          positions[i * 3] = newX;
          positions[i * 3 + 1] = newY;
          positions[i * 3 + 2] = newZ;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Rotate particles slowly
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
        
        // Adjust particle opacity and size based on expansion
        particles.material.opacity = 0.8 - (normalizedDistance * 0.5);
        particles.material.size = 0.012 + (normalizedDistance * 0.008);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      candyTexture.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`globe-container rounded-full ${className}`}
      style={{ width: '400px', height: '400px' }}
    />
  );
};

export default Globe3D;