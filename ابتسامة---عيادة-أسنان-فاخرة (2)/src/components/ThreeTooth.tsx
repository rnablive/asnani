/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundSynth } from "./AudioController";

export default function ThreeTooth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationState, setAnimationState] = useState<"healthy" | "cavity" | "healing" | "super">("healthy");
  const scrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1f3a, 0.08);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0b1f3a, 2.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
    mainLight.position.set(5, 5, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00cfff, 4.0);
    cyanRimLight.position.set(-6, 3, -4);
    scene.add(cyanRimLight);

    const blueRimLight = new THREE.DirectionalLight(0x1e88ff, 3.5);
    blueRimLight.position.set(4, -3, -3);
    scene.add(blueRimLight);

    const softGlowLight = new THREE.PointLight(0x00cfff, 3.0, 8);
    softGlowLight.position.set(0, -1.5, 0);
    scene.add(softGlowLight);

    // 5. Molar Tooth Geometric Sculpting
    const toothGeometry = new THREE.SphereGeometry(1.2, 90, 90);
    
    // Get position attributes to deform vertices
    const positionAttribute = toothGeometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // We will save original coordinates for morphing and deformation
    const originalPositions: THREE.Vector3[] = [];
    const modifiedPositions: THREE.Vector3[] = [];
    const colors: number[] = [];

    // Indices near the crown cusp where the cavity will appear
    const cavityVertexIndices: number[] = [];
    const cavityCenter = new THREE.Vector3(0.5, 1.1, 0.5);

    for (let i = 0; i < vertexCount; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      const originalVec = new THREE.Vector3(x, y, z);
      originalPositions.push(originalVec.clone());

      let nx = x;
      let ny = y;
      let nz = z;

      // 5a. Sculpt the Crown Cusps
      if (ny > 0) {
        const angle = Math.atan2(nz, nx);
        const dist2D = Math.sqrt(nx * nx + nz * nz);
        
        // 4 prominent cusps on the molar top
        const cuspDeform = Math.sin(angle * 2) * Math.cos(angle * 2) * 0.28;
        ny += cuspDeform * (ny / 1.2);

        // Center depression (occlusal surface groove)
        if (dist2D < 0.7) {
          ny -= (0.7 - dist2D) * 0.35;
        }
      }

      // 5b. Sculpt the Neck (narrow waist)
      const waistFactor = 1.0 - 0.22 * Math.exp(-Math.pow(ny + 0.15, 2) / 0.08);
      nx *= waistFactor;
      nz *= waistFactor;

      // 5c. Sculpt the Roots (split into two powerful roots at the bottom)
      if (ny < -0.15) {
        const rootT = Math.min(1.0, (-ny - 0.15) / 1.0); // 0 at neck, 1 at root tip
        
        // Split roots based on x direction
        if (nx > 0) {
          nx = nx + 0.42 * rootT;
          nz = nz * (1.0 - rootT * 0.35);
          nx = nx * (1.0 - rootT * 0.45);
          ny -= rootT * 0.12;
        } else {
          nx = nx - 0.42 * rootT;
          nz = nz * (1.0 - rootT * 0.35);
          nx = nx * (1.0 - rootT * 0.45);
          ny -= rootT * 0.12;
        }
      }

      const modifiedVec = new THREE.Vector3(nx, ny, nz);
      modifiedPositions.push(modifiedVec);

      // Update positions
      positionAttribute.setXYZ(i, nx, ny, nz);

      // Initial clean white colors for PBR tooth
      colors.push(1, 1, 1);

      // Save vertex indices that are close to the cavity center on the cusp
      const distToCavity = modifiedVec.distanceTo(cavityCenter);
      if (distToCavity < 0.42) {
        cavityVertexIndices.push(i);
      }
    }

    // Set colors attribute
    toothGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    toothGeometry.computeVertexNormals();

    // 6. Tooth Material (Porcelain, highly realistic enamel physical properties)
    const toothMaterial = new THREE.MeshPhysicalMaterial({
      roughness: 0.12,
      metalness: 0.01,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.28, // Subsurface scattering / translucent enamel depth
      thickness: 1.2,
      ior: 1.62,
      vertexColors: true,
      flatShading: false,
    });

    const toothMesh = new THREE.Mesh(toothGeometry, toothMaterial);
    toothMesh.castShadow = true;
    toothMesh.receiveShadow = true;
    scene.add(toothMesh);

    // 7. Pediatric Pedestal / Stand (Floating metal platform)
    const standGeometry = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 40);
    const standMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a192f,
      roughness: 0.2,
      metalness: 0.85,
    });
    const standMesh = new THREE.Mesh(standGeometry, standMaterial);
    standMesh.position.y = -2.0;
    scene.add(standMesh);

    const glowRingGeometry = new THREE.TorusGeometry(1.5, 0.03, 16, 100);
    const glowRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.8,
    });
    const glowRingMesh = new THREE.Mesh(glowRingGeometry, glowRingMaterial);
    glowRingMesh.position.y = -1.9;
    glowRingMesh.rotation.x = Math.PI / 2;
    scene.add(glowRingMesh);

    // Floating Ring laser around the tooth
    const scanRingGeometry = new THREE.TorusGeometry(1.6, 0.015, 8, 80);
    const scanRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.5,
    });
    const scanRingMesh = new THREE.Mesh(scanRingGeometry, scanRingMaterial);
    scanRingMesh.rotation.x = Math.PI / 2;
    scene.add(scanRingMesh);

    // 8. Healing Swirling Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);
    const particleYOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = -999; // Out of view initially
      particlePositions[i * 3 + 2] = 0;
      particleSpeeds[i] = 1.5 + Math.random() * 2.5;
      particleRadii[i] = 0.5 + Math.random() * 1.5;
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleYOffsets[i] = -0.5 + Math.random() * 1.5;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    
    // Glowing particle texture
    const canvasParticle = document.createElement("canvas");
    canvasParticle.width = 16;
    canvasParticle.height = 16;
    const ctxParticle = canvasParticle.getContext("2d");
    if (ctxParticle) {
      const grad = ctxParticle.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(0, 207, 255, 1)");
      grad.addColorStop(0.3, "rgba(0, 207, 255, 0.6)");
      grad.addColorStop(1, "rgba(0, 207, 255, 0)");
      ctxParticle.fillStyle = grad;
      ctxParticle.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvasParticle);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 9. Interactive mouse handler
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current = { x, y };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Scroll percentage tracker
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      scrollYRef.current = window.scrollY / maxScroll;
    };
    window.addEventListener("scroll", onScroll);

    // 10. Performance optimization resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(containerRef.current);

    // 11. Animation Loop & 8-Second Cycle Control
    let time = 0;
    let clock = new THREE.Clock();
    let hasPlayedHealingSound = false;

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      time += delta;

      // Float tooth forever
      const floatY = Math.sin(time * 1.5) * 0.15;
      
      // Calculate rotation and scroll interaction
      const currentScroll = scrollYRef.current;
      
      // Target position based on scrolling:
      // When at top (scroll = 0): Right side of screen, centering coordinates
      // When scrolled (scroll = 1): moves down, left/right to not overlap paragraphs
      const targetX = currentScroll * -1.8; // moves to the left slightly or right
      const targetY = floatY + (currentScroll * -1.5);
      const targetZ = currentScroll * -1.2;

      // Tooth rotation (slow default rotation + mouse tilt)
      const baseRotationY = time * 0.25 + (currentScroll * Math.PI * 1.2);
      const targetRotationY = baseRotationY + mouseRef.current.x * 0.5;
      const targetRotationX = mouseRef.current.y * 0.4 + (currentScroll * 0.3);
      const targetRotationZ = mouseRef.current.x * 0.2;

      // Smooth interpolation (lerping) for floaty, premium feels
      toothMesh.position.x = THREE.MathUtils.lerp(toothMesh.position.x, targetX, 0.1);
      toothMesh.position.y = THREE.MathUtils.lerp(toothMesh.position.y, targetY, 0.1);
      toothMesh.position.z = THREE.MathUtils.lerp(toothMesh.position.z, targetZ, 0.1);

      toothMesh.rotation.y = THREE.MathUtils.lerp(toothMesh.rotation.y, targetRotationY, 0.1);
      toothMesh.rotation.x = THREE.MathUtils.lerp(toothMesh.rotation.x, targetRotationX, 0.1);
      toothMesh.rotation.z = THREE.MathUtils.lerp(toothMesh.rotation.z, targetRotationZ, 0.1);

      // Follow stand position under the tooth
      standMesh.position.x = toothMesh.position.x;
      standMesh.position.y = toothMesh.position.y - 1.8;
      standMesh.position.z = toothMesh.position.z;

      glowRingMesh.position.x = toothMesh.position.x;
      glowRingMesh.position.y = toothMesh.position.y - 1.7;
      glowRingMesh.position.z = toothMesh.position.z;

      // Hover scanning ring floating up and down the tooth
      scanRingMesh.position.x = toothMesh.position.x;
      scanRingMesh.position.y = toothMesh.position.y + Math.sin(time * 3.0) * 1.1;
      scanRingMesh.position.z = toothMesh.position.z;
      scanRingMesh.rotation.z = time * 0.5;

      // 8-Second Cycle Logic:
      // 0 - 3s: Healthy
      // 3 - 5s: Cavity forming
      // 5 - 7s: Healing (particles swirl + color glowing restore)
      // 7 - 8s: Brighter than before super glow
      const cycleTime = time % 8;
      const colorAttribute = toothGeometry.attributes.color as THREE.BufferAttribute;

      if (cycleTime < 3) {
        // State 1: Healthy
        if (animationState !== "healthy") {
          setAnimationState("healthy");
          hasPlayedHealingSound = false;
        }

        // Return colors to normal smooth white
        for (let i = 0; i < vertexCount; i++) {
          const r = colorAttribute.getX(i);
          const g = colorAttribute.getY(i);
          const b = colorAttribute.getZ(i);
          colorAttribute.setXYZ(
            i,
            THREE.MathUtils.lerp(r, 1.0, 0.08),
            THREE.MathUtils.lerp(g, 1.0, 0.08),
            THREE.MathUtils.lerp(b, 1.0, 0.08)
          );
        }
        colorAttribute.needsUpdate = true;
        toothMaterial.emissive.setHex(0x000000);
        toothMaterial.roughness = 0.12;

        // Hide particles
        const posArr = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 1] = -999;
        }
        particleGeometry.attributes.position.needsUpdate = true;

      } else if (cycleTime >= 3 && cycleTime < 5) {
        // State 2: Cavity forming
        if (animationState !== "cavity") {
          setAnimationState("cavity");
        }

        // Deform colors near the cavity center to dark black/brown
        // Also slightly darken/desaturate the rest of the tooth
        const progress = (cycleTime - 3) / 2; // 0 to 1
        for (let i = 0; i < vertexCount; i++) {
          const r = colorAttribute.getX(i);
          const g = colorAttribute.getY(i);
          const b = colorAttribute.getZ(i);

          if (cavityVertexIndices.includes(i)) {
            // Decaying cavity spot (dark brown)
            colorAttribute.setXYZ(
              i,
              THREE.MathUtils.lerp(r, 0.12, 0.1),
              THREE.MathUtils.lerp(g, 0.08, 0.1),
              THREE.MathUtils.lerp(b, 0.06, 0.1)
            );
          } else {
            // Rest of the tooth becomes slightly grayish/duller due to sickness
            const targetColor = 1.0 - (progress * 0.2);
            colorAttribute.setXYZ(
              i,
              THREE.MathUtils.lerp(r, targetColor, 0.08),
              THREE.MathUtils.lerp(g, targetColor, 0.08),
              THREE.MathUtils.lerp(b, targetColor, 0.08)
            );
          }
        }
        colorAttribute.needsUpdate = true;
        toothMaterial.roughness = 0.22; // loses shine when decayed

      } else if (cycleTime >= 5 && cycleTime < 7) {
        // State 3: Healing Animation
        if (animationState !== "healing") {
          setAnimationState("healing");
        }

        // Play healing sound once
        if (!hasPlayedHealingSound) {
          soundSynth.playHealing();
          hasPlayedHealingSound = true;
        }

        // Swirling blue medical particles animation
        const posArr = particleGeometry.attributes.position.array as Float32Array;
        const progress = (cycleTime - 5) / 2; // 0 to 1

        for (let i = 0; i < particleCount; i++) {
          // Particles spiral around the tooth from bottom pedestal to the cavity spot
          particleAngles[i] += delta * particleSpeeds[i];
          const heightProgress = ((particleAngles[i] * 0.1) % 1.0); // 0 to 1
          
          const currentRadius = particleRadii[i] * (1.0 - heightProgress * 0.6);
          const px = toothMesh.position.x + Math.cos(particleAngles[i]) * currentRadius;
          const pz = toothMesh.position.z + Math.sin(particleAngles[i]) * currentRadius;
          const py = toothMesh.position.y - 1.5 + heightProgress * 3.0;

          posArr[i * 3] = px;
          posArr[i * 3 + 1] = py;
          posArr[i * 3 + 2] = pz;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Heal the colors: cavity disappears, and glows golden/white
        for (let i = 0; i < vertexCount; i++) {
          const r = colorAttribute.getX(i);
          const g = colorAttribute.getY(i);
          const b = colorAttribute.getZ(i);

          if (cavityVertexIndices.includes(i)) {
            // Glowing cyan/gold repair transition
            colorAttribute.setXYZ(
              i,
              THREE.MathUtils.lerp(r, 0.3, 0.15),
              THREE.MathUtils.lerp(g, 1.4, 0.15), // bright emerald/cyan glow
              THREE.MathUtils.lerp(b, 1.8, 0.15)
            );
          } else {
            // Restore rest of the tooth
            colorAttribute.setXYZ(
              i,
              THREE.MathUtils.lerp(r, 1.0, 0.1),
              THREE.MathUtils.lerp(g, 1.1, 0.1),
              THREE.MathUtils.lerp(b, 1.2, 0.1)
            );
          }
        }
        colorAttribute.needsUpdate = true;

        // Apply emissive neon blue/cyan light to the entire tooth
        toothMaterial.emissive.setRGB(0.0, 0.3 * progress, 0.5 * progress);
        toothMaterial.roughness = 0.1;

      } else if (cycleTime >= 7 && cycleTime < 8) {
        // State 4: Brighter than before
        if (animationState !== "super") {
          setAnimationState("super");
        }

        // Hide particles smoothly
        const posArr = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 1] = THREE.MathUtils.lerp(posArr[i * 3 + 1], -999, 0.1);
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Tooth glows bright white
        const progress = 1.0 - (cycleTime - 7); // fades from 1 to 0
        for (let i = 0; i < vertexCount; i++) {
          const r = colorAttribute.getX(i);
          const g = colorAttribute.getY(i);
          const b = colorAttribute.getZ(i);
          colorAttribute.setXYZ(
            i,
            THREE.MathUtils.lerp(r, 1.2, 0.1),
            THREE.MathUtils.lerp(g, 1.2, 0.1),
            THREE.MathUtils.lerp(b, 1.2, 0.1)
          );
        }
        colorAttribute.needsUpdate = true;
        
        toothMaterial.emissive.setRGB(0.2 * progress, 0.4 * progress, 0.5 * progress);
        toothMaterial.roughness = 0.05; // Maximum glossy glow finish!
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      
      toothGeometry.dispose();
      toothMaterial.dispose();
      standGeometry.dispose();
      standMaterial.dispose();
      glowRingGeometry.dispose();
      glowRingMaterial.dispose();
      scanRingGeometry.dispose();
      scanRingMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="tooth-3d-container"
      className="relative flex h-full w-full items-center justify-center pointer-events-auto"
      style={{ minHeight: "500px" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      
      {/* Absolute overlay indicator displaying cycle status with a very neat aesthetic */}
      <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1.5 text-xs text-cyan-400 backdrop-blur-md font-mono select-none">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
          <span className={`relative inline-flex h-2 w-2 rounded-full ${
            animationState === "healthy" ? "bg-emerald-400" :
            animationState === "cavity" ? "bg-amber-500" :
            animationState === "healing" ? "bg-cyan-400" : "bg-white animate-pulse"
          }`}></span>
        </span>
        <span className="font-sans font-medium">
          {animationState === "healthy" && "تحليل صحة السن: مثالية"}
          {animationState === "cavity" && "تنبيه: رصد تسوس سطحي"}
          {animationState === "healing" && "معالجة ليزرية ذكية..."}
          {animationState === "super" && "اكتمال التعقيم والتقوية واللمعان"}
        </span>
      </div>
    </div>
  );
}
