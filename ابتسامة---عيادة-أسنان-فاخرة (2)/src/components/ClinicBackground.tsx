/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export default function ClinicBackground() {
  const { isExperienceMode } = useApp();

  return (
    <div className="absolute inset-0 -z-50 overflow-hidden bg-[#020813]">
      {/* 1. Deep Core Medical Vignette Gradient */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isExperienceMode
          ? "bg-radial-at-c from-[#0d2a4a]/90 via-[#030d1c] to-[#010408]"
          : "bg-radial-at-c from-[#051322]/40 via-[#020610] to-[#010306]"
      }`} />

      {/* 2. Soft Volumetric Blue & Cyan Glow Spheres */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.55, 0.4],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -top-[20%] left-[10%] h-[600px] w-[600px] rounded-full transition-all duration-1000 ${
          isExperienceMode ? "bg-cyan-500/35 blur-[160px]" : "bg-cyan-500/6 blur-[140px]"
        }`}
      />

      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.35, 0.5, 0.35],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-[30%] -right-[10%] h-[700px] w-[700px] rounded-full transition-all duration-1000 ${
          isExperienceMode ? "bg-fuchsia-500/25 blur-[180px]" : "bg-blue-600/8 blur-[160px]"
        }`}
      />

      <div className={`absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full transition-all duration-1000 ${
        isExperienceMode ? "bg-indigo-500/20 blur-[150px]" : "bg-indigo-500/5 blur-[120px]"
      }`} />

      {/* 3. High-Tech Medical Clinic Grid and Spatial Blueprint Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 4. Abstract Vector Blueprint of a Premium Dental Chair and Clinic Lamp (Blurred) */}
      <div className="absolute inset-0 opacity-[0.06] select-none pointer-events-none">
        {/* Stylized Operation Light Ring */}
        <svg
          className="absolute right-[5%] top-[15%] h-[350px] w-[350px] text-cyan-500 blur-[2px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="12" className="animate-pulse" />
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </svg>

        {/* Abstract Surgical Dental Chair outline */}
        <svg
          className="absolute left-[8%] bottom-[10%] h-[450px] w-[450px] text-blue-400 blur-[3px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 100 100"
        >
          {/* Base */}
          <path d="M10,90 L90,90" />
          <path d="M35,90 L35,70 L65,70 L65,90" />
          {/* Seat & Backrest support */}
          <path d="M20,60 C30,60 40,65 50,65 C60,65 70,55 80,45" />
          {/* Backrest */}
          <path d="M20,60 L10,35 C8,30 12,25 18,28 L30,42" />
          {/* Headrest */}
          <ellipse cx="8" cy="25" rx="5" ry="3" />
          {/* Armrest */}
          <path d="M35,55 L55,55 C60,55 65,58 70,62" />
        </svg>
      </div>

      {/* 5. Volumetric Laser Light Beam (Pulsing sweep) */}
      <motion.div
        animate={{
          opacity: isExperienceMode ? [0.35, 0.75, 0.35] : [0.03, 0.08, 0.03],
          x: isExperienceMode ? ["-15%", "25%", "-15%"] : ["-5%", "15%", "-5%"],
        }}
        transition={{
          duration: isExperienceMode ? 8 : 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-y-0 left-1/3 w-3 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[35px] -rotate-12 transition-all duration-1000"
      />

      {/* 6. Medical Filter Micro-Particles (Drifting sterile dust) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isExperienceMode ? 65 : 14)].map((_, i) => {
          const size = isExperienceMode ? Math.random() * 5 + 1.5 : Math.random() * 2 + 0.6;
          const left = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = isExperienceMode ? Math.random() * 10 + 6 : Math.random() * 25 + 18;
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full transition-all duration-1000 ${
                isExperienceMode 
                  ? (i % 3 === 0 
                      ? "bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.9)]" 
                      : i % 3 === 1 
                        ? "bg-blue-400 shadow-[0_0_12px_rgba(30,144,255,0.9)]" 
                        : "bg-fuchsia-400 shadow-[0_0_12px_rgba(255,0,255,0.9)]"
                    )
                  : "bg-cyan-500/15"
              }`}
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: "105%",
              }}
              animate={{
                y: ["0vh", "-110vh"],
                x: [0, Math.sin(i) * (isExperienceMode ? 100 : 25), 0],
                opacity: isExperienceMode ? [0, 0.95, 0.95, 0] : [0, 0.45, 0.45, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>

      {/* 7. Bottom Fog Cover */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#020813] to-transparent" />
    </div>
  );
}
