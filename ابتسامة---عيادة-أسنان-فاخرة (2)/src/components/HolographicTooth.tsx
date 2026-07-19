/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

interface HolographicToothProps {
  activeFindingId: string;
}

export default function HolographicTooth({ activeFindingId }: HolographicToothProps) {
  const { isExperienceMode } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeIdRef = useRef(activeFindingId);

  useEffect(() => {
    activeIdRef.current = activeFindingId;
  }, [activeFindingId]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020813, 0.08);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0e1b30, isExperienceMode ? 4.5 : 2.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, isExperienceMode ? 6.0 : 3.5);
    mainLight.position.set(5, 5, 4);
    scene.add(mainLight);

    const cyanRimLight = new THREE.DirectionalLight(isExperienceMode ? 0x00ffff : 0x00cfff, isExperienceMode ? 9.0 : 5.0);
    cyanRimLight.position.set(-5, 3, -4);
    scene.add(cyanRimLight);

    const redRimLight = new THREE.DirectionalLight(0xff3b30, isExperienceMode ? 4.0 : 2.0);
    redRimLight.position.set(5, -3, -3);
    scene.add(redRimLight);

    // 5. Molar Tooth Geometric Sculpting (matching high-quality custom procedural model)
    const toothGeometry = new THREE.SphereGeometry(1.15, 80, 80);
    const positionAttribute = toothGeometry.attributes.position;
    const vertexCount = positionAttribute.count;

    const colors: number[] = [];

    for (let i = 0; i < vertexCount; i++) {
      let x = positionAttribute.getX(i);
      let y = positionAttribute.getY(i);
      let z = positionAttribute.getZ(i);

      // Crown Cusp Sculpting
      if (y > 0) {
        const angle = Math.atan2(z, x);
        const dist2D = Math.sqrt(x * x + z * z);
        const cuspDeform = Math.sin(angle * 2) * Math.cos(angle * 2) * 0.25;
        y += cuspDeform * (y / 1.15);

        if (dist2D < 0.65) {
          y -= (0.65 - dist2D) * 0.3;
        }
      }

      // Neck narrowing waist
      const waistFactor = 1.0 - 0.2 * Math.exp(-Math.pow(y + 0.15, 2) / 0.08);
      x *= waistFactor;
      z *= waistFactor;

      // Double Root Splitting
      if (y < -0.15) {
        const rootT = Math.min(1.0, (-y - 0.15) / 1.0);
        if (x > 0) {
          x = x + 0.4 * rootT;
          z = z * (1.0 - rootT * 0.35);
          x = x * (1.0 - rootT * 0.4);
          y -= rootT * 0.1;
        } else {
          x = x - 0.4 * rootT;
          z = z * (1.0 - rootT * 0.35);
          x = x * (1.0 - rootT * 0.4);
          y -= rootT * 0.1;
        }
      }

      positionAttribute.setXYZ(i, x, y, z);
      colors.push(1, 1, 1);
    }

    toothGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    toothGeometry.computeVertexNormals();

    // 6. Holographic Material Design
    // Semi-translucent glass look with wireframe overlay to feel high-tech
    const toothMaterial = new THREE.MeshPhysicalMaterial({
      color: isExperienceMode ? 0x0d2c5c : 0x0a1c36,
      roughness: isExperienceMode ? 0.05 : 0.1,
      metalness: isExperienceMode ? 0.35 : 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: isExperienceMode ? 0.01 : 0.05,
      transmission: isExperienceMode ? 0.95 : 0.8,
      thickness: isExperienceMode ? 2.5 : 1.5,
      ior: 1.65,
      transparent: true,
      opacity: isExperienceMode ? 0.92 : 0.75,
      side: THREE.DoubleSide,
    });

    const toothMesh = new THREE.Mesh(toothGeometry, toothMaterial);
    scene.add(toothMesh);

    // Glowing wireframe tooth overlay
    const wireframeGeometry = new THREE.WireframeGeometry(toothGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: isExperienceMode ? 0x00ffff : 0x00cfff,
      transparent: true,
      opacity: isExperienceMode ? 0.65 : 0.25,
      blending: THREE.AdditiveBlending,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    toothMesh.add(wireframeLine);

    // 7. Futuristic Medical Scanning HUD Rings & Pedestal
    const standGeometry = new THREE.CylinderGeometry(1.5, 1.7, 0.15, 32);
    const standMaterial = new THREE.MeshStandardMaterial({
      color: 0x09172e,
      roughness: 0.3,
      metalness: 0.8,
    });
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.position.y = -1.9;
    scene.add(standMesh);

    const glowRingGeometry = new THREE.TorusGeometry(1.4, 0.02, 8, 80);
    const glowRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.4,
    });
    const glowRingMesh = new THREE.Mesh(glowRingGeometry, glowRingMaterial);
    glowRingMesh.position.y = -1.82;
    glowRingMesh.rotation.x = Math.PI / 2;
    scene.add(glowRingMesh);

    // Vertical Laser Scanning line
    const scanRingGeometry = new THREE.TorusGeometry(1.55, 0.015, 4, 60);
    const scanRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.6,
    });
    const scanRingMesh = new THREE.Mesh(scanRingGeometry, scanRingMaterial);
    scanRingMesh.rotation.x = Math.PI / 2;
    scene.add(scanRingMesh);

    // 8. Animated Floating Diagnosis Points (Hotspots)
    // We place multiple hotspots that glow and pulse depending on the active ID
    const hotspotGroup = new THREE.Group();
    scene.add(hotspotGroup);

    const createHotspot = (id: string, color: number, x: number, y: number, z: number) => {
      const geo = new THREE.SphereGeometry(0.12, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.name = id;

      // Glow Ring around hotspot
      const glowGeo = new THREE.TorusGeometry(0.25, 0.015, 4, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      mesh.add(glow);

      hotspotGroup.add(mesh);
      return mesh;
    };

    // Hotspot mappings:
    const decayHotspot = createHotspot("decay", 0xff3b30, 0.4, 0.9, 0.4);      // Red
    const plaqueHotspot = createHotspot("plaque", 0xffcc00, -0.6, -0.1, 0.5);   // Yellow
    const tartarHotspot = createHotspot("tartar", 0xff9500, 0.5, -0.4, -0.4);   // Orange
    const gumHotspot = createHotspot("inflammation", 0xff3b30, 0.0, -0.2, 0.85); // Red Gum Line
    const sensHotspot = createHotspot("sensitivity", 0xffcc00, -0.4, -1.2, 0.2); // Yellow Root

    // Hide hotspots initially, we will pulse them when active
    const hotspots = [decayHotspot, plaqueHotspot, tartarHotspot, gumHotspot, sensHotspot];

    // 9. Particles System
    const particleCount = isExperienceMode ? 160 : 80;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 0.8;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = -1.5 + Math.random() * 3.0;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
      particleSpeeds.push(0.3 + Math.random() * 0.6);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: isExperienceMode ? 0.085 : 0.05,
      color: isExperienceMode ? 0xffcc00 : 0x00cfff,
      transparent: true,
      opacity: isExperienceMode ? 0.8 : 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 10. Performance optimization resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(containerRef.current);

    // 11. Animation Loop
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      time += delta;

      const currentActiveId = activeIdRef.current;

      // Slow idle rotation
      let targetRotY = time * 0.3;
      let targetRotX = Math.sin(time * 0.5) * 0.1;

      // If a specific diagnosis is selected, orient tooth to reveal it
      if (currentActiveId === "decay") {
        targetRotY = 0.5;
        targetRotX = 0.25;
      } else if (currentActiveId === "plaque") {
        targetRotY = -0.8;
        targetRotX = -0.1;
      } else if (currentActiveId === "tartar") {
        targetRotY = 2.4;
        targetRotX = -0.15;
      } else if (currentActiveId === "inflammation") {
        targetRotY = 0.0;
        targetRotX = 0.1;
      } else if (currentActiveId === "sensitivity") {
        targetRotY = -0.4;
        targetRotX = -0.3;
      }

      toothMesh.rotation.y = THREE.MathUtils.lerp(toothMesh.rotation.y, targetRotY, 0.08);
      toothMesh.rotation.x = THREE.MathUtils.lerp(toothMesh.rotation.x, targetRotX, 0.08);

      // Mirror hotspots rotation with the parent
      hotspotGroup.rotation.y = toothMesh.rotation.y;
      hotspotGroup.rotation.x = toothMesh.rotation.x;

      // Move vertical scan ring up and down
      scanRingMesh.position.y = Math.sin(time * 2.5) * 1.25;

      // Pulsing effect for hotspots
      const pulse = 1.0 + Math.sin(time * 8.0) * 0.25;
      const ringPulse = 1.0 + (time * 2.5 % 1.0) * 1.5;
      const ringOpacity = 1.0 - (time * 2.5 % 1.0);

      hotspots.forEach((hs) => {
        if (hs.name === currentActiveId) {
          hs.visible = true;
          hs.scale.set(pulse, pulse, pulse);
          // Animate outer ring pulse
          const ring = hs.children[0] as THREE.Mesh;
          if (ring) {
            ring.scale.set(ringPulse, ringPulse, ringPulse);
            (ring.material as THREE.MeshBasicMaterial).opacity = ringOpacity * 0.8;
          }
        } else {
          hs.visible = false;
        }
      });

      // Ambient color shifts based on selected condition
      if (currentActiveId === "healthy") {
        toothMaterial.color.setHex(0x0a2647);
        wireframeMaterial.color.setHex(0x00f5ff);
        scanRingMaterial.color.setHex(0x00f5ff);
      } else if (currentActiveId === "decay" || currentActiveId === "broken" || currentActiveId === "missing") {
        toothMaterial.color.setHex(0x2d0c0f);
        wireframeMaterial.color.setHex(0xff3b30);
        scanRingMaterial.color.setHex(0xff3b30);
      } else if (currentActiveId === "inflammation" || currentActiveId === "tartar") {
        toothMaterial.color.setHex(0x2d170c);
        wireframeMaterial.color.setHex(0xff9500);
        scanRingMaterial.color.setHex(0xff9500);
      } else {
        // Needs attention (Yellow)
        toothMaterial.color.setHex(0x28230c);
        wireframeMaterial.color.setHex(0xffcc00);
        scanRingMaterial.color.setHex(0xffcc00);
      }

      // Floating particles movement
      const posArr = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += delta * particleSpeeds[i];
        if (posArr[i * 3 + 1] > 1.5) {
          posArr[i * 3 + 1] = -1.5;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      toothGeometry.dispose();
      toothMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      standGeometry.dispose();
      standMaterial.dispose();
      glowRingGeometry.dispose();
      glowRingMaterial.dispose();
      scanRingGeometry.dispose();
      scanRingMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      hotspots.forEach((hs) => {
        hs.geometry.dispose();
        (hs.material as THREE.Material).dispose();
        const inner = hs.children[0] as THREE.Mesh;
        if (inner) {
          inner.geometry.dispose();
          (inner.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    };
  }, [isExperienceMode]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center select-none"
      style={{ minHeight: "360px" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-none" />
      
      {/* Dynamic 3D Floating HUD badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/5 bg-slate-950/80 px-4 py-1.5 text-[10px] text-cyan-400 font-mono shadow-xl backdrop-blur-md">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        </span>
        <span className="font-sans font-extrabold tracking-widest text-slate-400">MODEL RECONSTRUCTION ACTIVE</span>
      </div>
    </div>
  );
}
