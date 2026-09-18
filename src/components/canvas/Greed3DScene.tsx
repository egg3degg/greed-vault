"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GameStatus } from "@/hooks/useGreedGame";

interface Greed3DSceneProps {
  gameStatus: GameStatus;
  lastOutcome: "DOUBLE" | "BUST" | null;
  currentMultiplier: number;
}

export function Greed3DScene({ gameStatus, lastOutcome, currentMultiplier }: Greed3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // References to 3D objects for updates
  const coinMeshRef = useRef<THREE.Group | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Animation state tracking
  const flipStateRef = useRef<{
    isFlipping: boolean;
    startTime: number;
    duration: number;
    targetFace: "DOUBLE" | "BUST";
    baseY: number;
    maxHeight: number;
  }>({
    isFlipping: false,
    startTime: 0,
    duration: 1.5,
    targetFace: "DOUBLE",
    baseY: 0.6,
    maxHeight: 3.2,
  });

  // Mouse tracking for subtle 3D parallax
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Trigger flip animation when status changes to FLIPPING
  useEffect(() => {
    if (gameStatus === "FLIPPING") {
      flipStateRef.current = {
        isFlipping: true,
        startTime: performance.now(),
        duration: 1.5,
        targetFace: lastOutcome || "DOUBLE",
        baseY: 0.6,
        maxHeight: 3.2,
      };
    } else if (gameStatus === "ROUND_WON") {
      flipStateRef.current.isFlipping = false;
      if (coinMeshRef.current) {
        coinMeshRef.current.position.y = 0.6;
        coinMeshRef.current.rotation.x = 0; // Crown / Double face up
      }
    } else if (gameStatus === "BUSTED") {
      flipStateRef.current.isFlipping = false;
      if (coinMeshRef.current) {
        coinMeshRef.current.position.y = 0.6;
        coinMeshRef.current.rotation.x = Math.PI; // Skull face up
      }
    }
  }, [gameStatus, lastOutcome]);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth > 0 ? container.clientWidth : window.innerWidth;
    const height = container.clientHeight > 0 ? container.clientHeight : Math.max(window.innerHeight - 140, 450);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    // Allow transparent background so rich CSS ambient gradients show through
    scene.background = null;
    scene.fog = new THREE.FogExp2("#0B0F19", 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.5);
    camera.lookAt(0, 0.6, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Bright, Vibrant Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight("#4A5B78", 2.4);
    scene.add(ambientLight);

    // Top Dramatic Spotlight on Coin
    const spotLight = new THREE.SpotLight("#FFF0B3", 6.5);
    spotLight.position.set(0, 8, 2);
    spotLight.angle = Math.PI / 4.2;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Dynamic Rim / Tension Light (Green on win, Red on bust)
    const rimLight = new THREE.PointLight("#00F092", 2.5, 12);
    rimLight.position.set(0, 1.0, -1.8);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Golden Stage Bounce Light
    const bounceLight = new THREE.PointLight("#FFD700", 2.2, 8);
    bounceLight.position.set(0, 0.2, 1.8);
    scene.add(bounceLight);

    // Secondary cool blue fill
    const fillLight = new THREE.DirectionalLight("#60A5FA", 0.8);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // 4. Create Luxury Brushed Cobalt/Obsidian Pedestal
    const pedestalGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(2.0, 2.3, 0.8, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: "#1A2234",
      roughness: 0.2,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.4;
    pedestal.receiveShadow = true;
    pedestalGroup.add(pedestal);

    // Glowing Gold Trim Ring on Pedestal
    const trimGeo = new THREE.TorusGeometry(2.02, 0.04, 16, 64);
    const trimMat = new THREE.MeshStandardMaterial({
      color: "#FFD700",
      emissive: "#554400",
      metalness: 0.95,
      roughness: 0.15,
    });
    const trimRing = new THREE.Mesh(trimGeo, trimMat);
    trimRing.rotation.x = Math.PI / 2;
    trimRing.position.y = 0.0;
    pedestalGroup.add(trimRing);
    scene.add(pedestalGroup);

    // 5. Create Procedural Canvas Textures for Coin Faces
    const createCoinTexture = (isDouble: boolean) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Background gradient
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
      if (isDouble) {
        grad.addColorStop(0, "#FFE066");
        grad.addColorStop(0.7, "#D4AF37");
        grad.addColorStop(1, "#8A6D1C");
      } else {
        grad.addColorStop(0, "#2D1517");
        grad.addColorStop(0.7, "#1F0D0E");
        grad.addColorStop(1, "#0A0506");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Outer rings
      ctx.strokeStyle = isDouble ? "#FFF0A3" : "#FF3344";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(256, 256, 230, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(256, 256, 210, 0, Math.PI * 2);
      ctx.stroke();

      // Icon & Text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (isDouble) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 96px sans-serif";
        ctx.fillText("👑", 256, 185);

        ctx.fillStyle = "#1E1805";
        ctx.font = "900 64px sans-serif";
        ctx.fillText("DOUBLE", 256, 310);

        ctx.fillStyle = "#332600";
        ctx.font = "bold 32px monospace";
        ctx.fillText("2X MULTIPLIER", 256, 375);
      } else {
        ctx.fillStyle = "#FF3344";
        ctx.font = "bold 110px sans-serif";
        ctx.fillText("💀", 256, 185);

        ctx.fillStyle = "#FF4D5E";
        ctx.font = "900 64px sans-serif";
        ctx.fillText("BUSTED", 256, 310);

        ctx.fillStyle = "#FF808C";
        ctx.font = "bold 32px monospace";
        ctx.fillText("GREED ZERO", 256, 375);
      }

      return new THREE.CanvasTexture(canvas);
    };

    const crownTexture = createCoinTexture(true);
    const skullTexture = createCoinTexture(false);

    // 6. Build the 3D Challenge Coin
    const coinGroup = new THREE.Group();
    const coinRadius = 1.0;
    const coinThickness = 0.14;

    // Edge cylinder
    const edgeGeo = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 64, 1, true);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: "#FFD700",
      metalness: 0.95,
      roughness: 0.18,
    });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    coinGroup.add(edgeMesh);

    // Top Face (Crown / Double)
    const topFaceGeo = new THREE.CircleGeometry(coinRadius, 64);
    const topFaceMat = new THREE.MeshStandardMaterial({
      map: crownTexture,
      metalness: 0.85,
      roughness: 0.25,
    });
    const topFace = new THREE.Mesh(topFaceGeo, topFaceMat);
    topFace.position.y = coinThickness / 2;
    topFace.rotation.x = -Math.PI / 2;
    coinGroup.add(topFace);

    // Bottom Face (Skull / Bust)
    const bottomFaceGeo = new THREE.CircleGeometry(coinRadius, 64);
    const bottomFaceMat = new THREE.MeshStandardMaterial({
      map: skullTexture,
      metalness: 0.85,
      roughness: 0.25,
    });
    const bottomFace = new THREE.Mesh(bottomFaceGeo, bottomFaceMat);
    bottomFace.position.y = -coinThickness / 2;
    bottomFace.rotation.x = Math.PI / 2;
    coinGroup.add(bottomFace);

    coinGroup.position.set(0, 0.6, 0);
    scene.add(coinGroup);
    coinMeshRef.current = coinGroup;

    // 7. Floating Dust / Gold Ember Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = Math.random() * 5;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: "#FFD700",
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 8. Event Listeners for Parallax and Resize
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.25;
    };

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth > 0 ? container.clientWidth : window.innerWidth;
      const newH = container.clientHeight > 0 ? container.clientHeight : Math.max(window.innerHeight - 140, 450);
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // 9. Main 60 FPS Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      camera.position.x = mouseRef.current.x * 2.0;
      camera.position.y = 3.2 + mouseRef.current.y * 1.0;
      camera.lookAt(0, 0.6, 0);

      // Particle floating drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.03;
      }

      // Coin Flip Physics Engine
      const flipState = flipStateRef.current;
      if (flipState.isFlipping && coinMeshRef.current) {
        const timeElapsed = (performance.now() - flipState.startTime) / 1000;
        const progress = Math.min(timeElapsed / flipState.duration, 1.0);

        // Parabolic vertical jump
        const heightProgress = 4 * progress * (1 - progress); // peaks at 1.0 when progress = 0.5
        coinMeshRef.current.position.y = flipState.baseY + heightProgress * flipState.maxHeight;

        // Rapid spins: 6 full revolutions + target face offset
        const totalRotations = Math.PI * 2 * 6;
        const targetFaceRotation = flipState.targetFace === "DOUBLE" ? 0 : Math.PI;

        // Ease-out cubic rotation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        coinMeshRef.current.rotation.x = totalRotations * (1 - easeOut) + targetFaceRotation;
        coinMeshRef.current.rotation.z = Math.sin(progress * Math.PI * 4) * 0.4 * (1 - progress);

        if (progress >= 1.0) {
          flipState.isFlipping = false;
          coinMeshRef.current.position.y = flipState.baseY;
          coinMeshRef.current.rotation.x = targetFaceRotation;
          coinMeshRef.current.rotation.z = 0;
        }
      } else if (coinMeshRef.current && gameStatus === "IDLE") {
        // Idle gentle levitation and slow rotation
        coinMeshRef.current.position.y = 0.6 + Math.sin(elapsed * 2.0) * 0.08;
        coinMeshRef.current.rotation.y = elapsed * 0.6;
      }

      // Dynamic rim light response based on game state
      if (rimLightRef.current) {
        if (gameStatus === "ROUND_WON") {
          rimLightRef.current.color.set("#00F092");
          rimLightRef.current.intensity = 3.0 + Math.sin(elapsed * 6) * 1.0;
        } else if (gameStatus === "BUSTED") {
          rimLightRef.current.color.set("#FF3344");
          rimLightRef.current.intensity = 4.0 + Math.sin(elapsed * 8) * 2.0;
        } else {
          rimLightRef.current.color.set("#FFE6A3");
          rimLightRef.current.intensity = 1.0;
        }
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      crownTexture.dispose();
      skullTexture.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      topFaceGeo.dispose();
      topFaceMat.dispose();
      bottomFaceGeo.dispose();
      bottomFaceMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />
      {/* Dynamic atmospheric vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(6,7,10,0.85)_100%)] z-10" />
    </div>
  );
}
