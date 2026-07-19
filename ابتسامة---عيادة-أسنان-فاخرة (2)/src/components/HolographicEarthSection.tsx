/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import { Compass, MapPin, Phone, Compass as CompassIcon, Navigation, ChevronRight, Activity, Globe } from "lucide-react";
import { soundSynth } from "./AudioController";

interface ZoomStep {
  label: string;
  labelAr: string;
  scale: number;
  rotationY: number;
  rotationX: number;
  description: string;
}

const ZOOM_STEPS: ZoomStep[] = [
  {
    label: "Space Orbit View",
    labelAr: "منظور المدار الفضائي",
    scale: 1.0,
    rotationY: 0.0,
    rotationX: 0.1,
    description: "البحث والمسح الهولوغرافي لموقع عيادة الدكتور أحمد هندية على كوكب الأرض."
  },
  {
    label: "Africa Continent Entry",
    labelAr: "دخول القارة الإفريقية",
    scale: 2.2,
    rotationY: -0.3,
    rotationX: 0.25,
    description: "تحليل الإحداثيات ودخول الغلاف الجوي فوق شمال إفريقيا."
  },
  {
    label: "Morocco Kingdom Boundary",
    labelAr: "تحديد حدود المملكة المغربية",
    scale: 4.5,
    rotationY: -0.65,
    rotationX: 0.45,
    description: "توجيه عدسات الفحص الحراري المجهري وتأكيد الاتجاه نحو المغرب."
  },
  {
    label: "Meknes Imperial Coordinates",
    labelAr: "إحداثيات العاصمة الإسماعيلية (مكناس)",
    scale: 8.0,
    rotationY: -0.85,
    rotationX: 0.52,
    description: "الاقتراب من إحداثيات مدينة مكناس وربط البيانات بنظام الـ GPS المحلّي."
  },
  {
    label: "Hamria Modern District",
    labelAr: "حي حمرية (المركز الرقمي)",
    scale: 14.0,
    rotationY: -0.92,
    rotationX: 0.56,
    description: "تصفية الخرائط ثلاثية الأبعاد لشارع الجيش الملكي بحمرية."
  },
  {
    label: "Dr. Ahmed Hindia Dental Clinic",
    labelAr: "عيادة الدكتور أحمد هندية لطب الأسنان",
    scale: 22.0,
    rotationY: -0.96,
    rotationX: 0.58,
    description: "الهبوط الناجح! تفعيل المنارة الهولوغرافية المضيئة للعيادة الفاخرة."
  }
];

export default function HolographicEarthSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "SYS_INIT: مصفوفة المسح الهولوغرافي جاهزة",
    "GPS_LINK: تم الاتصال بالأقمار الاصطناعية العسكرية"
  ]);

  const stepRef = useRef(currentStep);
  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  // Add system telemetry logs
  const pushLog = (log: string) => {
    setLogs((prev) => [log, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Setup Scene
    const scene = new THREE.Scene();

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.0);

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0a1530, 2.0);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00cfff, 3.5);
    cyanLight.position.set(5, 3, 5);
    scene.add(cyanLight);

    const blueLight = new THREE.DirectionalLight(0x4f46e5, 2.0);
    blueLight.position.set(-5, -3, -5);
    scene.add(blueLight);

    // 5. Build Holographic Earth Sphere
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Core solid glowing glass sphere
    const sphereGeo = new THREE.SphereGeometry(1.8, 48, 48);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x071124,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 1.0,
      side: THREE.DoubleSide,
    });
    const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
    earthGroup.add(coreMesh);

    // Wireframe grid lines overlay (holographic look)
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    earthGroup.add(wireLines);

    // Dotted particle field for outer atmospheric glow
    const dotCount = 1200;
    const dotGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const scaleFactors = new Float32Array(dotCount);

    for (let i = 0; i < dotCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.82 + Math.random() * 0.05;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scaleFactors[i] = Math.random();
    }

    dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dotMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x00cfff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const atmosDots = new THREE.Points(dotGeo, dotMat);
    earthGroup.add(atmosDots);

    // Glowing coordinate rings orbiting the Earth
    const ringGeo = new THREE.RingGeometry(2.1, 2.12, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.5;
    earthGroup.add(orbitRing);

    // Landmark pin on Morocco (approx coordinates on globe)
    // Morocco on globe sits at roughly lat 31 N, lon 8 W
    const moroccoPinGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const moroccoPinMat = new THREE.MeshBasicMaterial({
      color: 0xff3b30,
      transparent: true,
      opacity: 0.8,
    });
    const moroccoPin = new THREE.Mesh(moroccoPinGeo, moroccoPinMat);
    
    // Position on Earth's surface (radius 1.8)
    const lat = 31.0 * (Math.PI / 180);
    const lon = -8.0 * (Math.PI / 180);
    moroccoPin.position.set(
      1.82 * Math.cos(lat) * Math.cos(lon),
      1.82 * Math.sin(lat),
      1.82 * Math.cos(lat) * Math.sin(lon)
    );
    earthGroup.add(moroccoPin);

    // Pulsing target halo around the Morocco pin
    const haloGeo = new THREE.TorusGeometry(0.18, 0.015, 4, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.6,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.copy(moroccoPin.position);
    halo.lookAt(0, 0, 0);
    earthGroup.add(halo);

    // 6. Resize handler
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(containerRef.current);

    // 7. Animation loop
    let clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      // Earth rotation interpolation
      const stepIdx = stepRef.current;
      const stepData = ZOOM_STEPS[stepIdx];

      // Rotation & Zoom interpolation for cinematic Google-Earth glide
      const targetScale = stepData.scale;
      const targetRotY = stepData.rotationY + (stepIdx === 0 ? time * 0.05 : 0); // slow rotation only on space view
      const targetRotX = stepData.rotationX;

      earthGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      earthGroup.rotation.y = THREE.MathUtils.lerp(earthGroup.rotation.y, targetRotY, 0.05);
      earthGroup.rotation.x = THREE.MathUtils.lerp(earthGroup.rotation.x, targetRotX, 0.05);

      // Pulse the target halo
      const pulse = 1.0 + Math.sin(time * 6.0) * 0.3;
      halo.scale.set(pulse, pulse, pulse);
      (halo.material as THREE.MeshBasicMaterial).opacity = 0.8 - (time * 1.5 % 1.0) * 0.8;

      // Rotate atmosphere slightly faster
      atmosDots.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      sphereGeo.dispose();
      sphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      moroccoPinGeo.dispose();
      moroccoPinMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Trigger camera flight sequence
  const startLocationFlight = () => {
    if (isFlying) return;
    soundSynth.playClick();
    setIsFlying(true);
    setCurrentStep(0);
    pushLog("FLY_SEQ_START: بدء مناورة الاقتراب والولوج السريع");

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < ZOOM_STEPS.length) {
        setCurrentStep(current);
        soundSynth.playClick();
        pushLog(`COORDS_LOCK: تم الانتقال إلى: ${ZOOM_STEPS[current].label}`);
      } else {
        clearInterval(interval);
        setIsFlying(false);
        soundSynth.playHealing();
        pushLog("LAND_SUCCESS: تم الهبوط بأمان وتحديد موقع العيادة");
      }
    }, 1800);
  };

  const openGoogleMaps = () => {
    soundSynth.playClick();
    window.open("https://maps.google.com/?q=Dr.+Ahmed+Hindia+Dental+Clinic+Hamria+Meknes+Morocco", "_blank");
  };

  const callClinic = () => {
    soundSynth.playClick();
    window.open("tel:+212535555555", "_self");
  };

  return (
    <section id="location-section" className="relative w-full bg-[#020813] py-24 px-6 lg:px-16 overflow-hidden border-t border-white/5 select-none">
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/10 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-1.5 text-xs text-cyan-400 backdrop-blur-md font-mono"
          >
            <CompassIcon className="h-4 w-4 animate-spin text-cyan-400" />
            <span>نظام الملاحة والموقع الجغرافي</span>
          </motion.div>
          
          <h2 className="mt-4 font-sans text-3xl md:text-5xl font-extrabold text-white">
            المسح الفضائي ثلاثي الأبعاد <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">لموقعنا المميّز</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-sans text-sm text-slate-400 leading-relaxed">
            اضغط على زر تفعيل محاكي الطيران لتجربة اقتراب سينمائي مذهل للأقمار الاصطناعية من الفضاء الخارجي مباشرة لقلب مدينة مكناس.
          </p>
        </div>

        {/* Interactive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Earth 3D Viewport Column */}
          <div
            ref={containerRef}
            className="lg:col-span-7 rounded-3xl border border-white/5 bg-slate-950/40 min-h-[460px] relative overflow-hidden flex flex-col justify-between p-6"
          >
            {/* HUD Scan overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,207,255,0.02)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none z-10" />
            
            {/* WebGL Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

            {/* Corner Decorative brackets */}
            <div className="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-cyan-500/30" />
            <div className="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-cyan-500/30" />
            <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-cyan-500/30" />
            <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-cyan-500/30" />

            {/* Top Stats telemetry bar */}
            <div className="z-10 flex items-center justify-between text-right">
              <div className="flex flex-col">
                <span className="font-sans text-[10px] text-slate-500">الحالة المدارية</span>
                <span className="font-sans text-xs font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  {isFlying ? "توجيه الأقمار النشط..." : "ثابت في المدار"}
                </span>
              </div>
              <div className="text-left font-mono text-[9px] text-slate-600">
                LAT 33.896 N • LON 5.549 W
              </div>
            </div>

            {/* Bottom logs telemetry screen */}
            <div className="z-10 bg-slate-950/70 border border-white/5 rounded-xl p-3 max-w-sm mt-auto select-none text-right font-mono text-[10px] text-cyan-500/80 flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-sans block mb-1">سجل الملاحة اللحظي:</span>
              {logs.map((log, idx) => (
                <div key={idx} className="truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Location Flight Control Panel & Information Dashboard */}
          <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-slate-950/30 backdrop-blur-xl p-6 flex flex-col justify-between text-right relative overflow-hidden">
            
            {/* Step navigation display */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <span className="font-sans text-xs font-black text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-400 animate-pulse" />
                  موقع عيادتنا الفاخرة
                </span>
                <span className="font-sans text-xs text-slate-400">
                  خطوة {currentStep + 1} من 6
                </span>
              </div>

              {/* Progress track */}
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
                />
              </div>

              <h3 className="font-sans text-xl font-bold text-white mb-2">
                {ZOOM_STEPS[currentStep].labelAr}
              </h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
                {ZOOM_STEPS[currentStep].description}
              </p>

              {/* Flight trigger button */}
              {!isFlying && currentStep < 5 && (
                <button
                  type="button"
                  onClick={startLocationFlight}
                  className="w-full py-3.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-sans font-bold text-xs transition-all cursor-pointer select-none mb-6 animate-pulse"
                >
                  تفعيل الطيران الجغرافي للموقع ✈
                </button>
              )}

              {/* Final Clinic Location Reveal Panel */}
              <AnimatePresence>
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 text-right flex flex-col gap-3 mb-6 shadow-[0_0_20px_rgba(0,207,255,0.05)]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4.5 w-4.5 text-red-500 animate-bounce" />
                      <span className="font-sans text-sm font-black text-white">عيادة الدكتور أحمد هندية الرقمية</span>
                    </div>
                    <div className="font-sans text-xs text-slate-300 flex flex-col gap-1">
                      <span>📍 حي حمرية، شارع الجيش الملكي، وسط مكناس</span>
                      <span>🇲🇦 المملكة المغربية</span>
                      <span>📞 الهاتف: 05-35-55-55-55</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Google maps buttons */}
            <div className="flex flex-col gap-2.5 mt-6">
              <button
                type="button"
                onClick={openGoogleMaps}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-sans font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                فتح عبر خرائط جوجل (Google Maps)
              </button>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={callClinic}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  الاتصال الهاتفي بالعيادة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundSynth.playClick();
                    setCurrentStep(0);
                    pushLog("SYS_RESET: إعادة تهيئة المدار الفضائي");
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
                >
                  إعادة ضبط الخارطة
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
