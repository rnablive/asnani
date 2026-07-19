/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Orbit } from "lucide-react";
import { useApp } from "../context/AppContext";
import { soundSynth } from "./AudioController";

export default function ExperienceToggle() {
  const { isExperienceMode, setIsExperienceMode, locale } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  
  // Hover particle state
  const [particles, setParticles] = useState<{ id: number; angle: number; speed: number; radius: number; size: number }[]>([]);

  useEffect(() => {
    // Generate orbiting particles for the toggle
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      angle: (i * 360) / 6,
      speed: 0.5 + Math.random() * 0.8,
      radius: 28 + Math.random() * 12,
      size: 2 + Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  const handleToggle = () => {
    const newState = !isExperienceMode;
    setIsExperienceMode(newState);
    soundSynth.playExperienceToggle(newState);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundSynth.playExperienceHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isRtl = locale === "ar";

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Visual Tooltip Indicator */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isRtl ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block rounded-xl border border-white/10 bg-slate-950/90 px-3 py-1.5 text-[10px] font-sans font-bold text-slate-200 shadow-2xl backdrop-blur-md"
          >
            {isExperienceMode
              ? isRtl
                ? "إيقاف نمط التجربة الغامرة"
                : "Disable Premium Cinematic Mode"
              : isRtl
                ? "تفعيل نمط التجربة الغامرة ✨"
                : "Enable Premium Cinematic Mode ✨"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Floating Interactive Button Container */}
      <div className="relative flex items-center justify-center">
        {/* Orbiting particles in Experience Mode */}
        {isExperienceMode && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-cyan-400"
                style={{
                  width: p.size,
                  height: p.size,
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: particles.map((_, idx) => {
                    const angleRad = ((p.angle + idx * 30) * Math.PI) / 180;
                    return Math.cos(angleRad) * p.radius;
                  }),
                  y: particles.map((_, idx) => {
                    const angleRad = ((p.angle + idx * 30) * Math.PI) / 180;
                    return Math.sin(angleRad) * p.radius;
                  }),
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 6 / p.speed,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}

        {/* Hover Sparkles */}
        <AnimatePresence>
          {isHovered && !isExperienceMode && (
            <div className="absolute inset-0 pointer-events-none z-0">
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i * Math.PI) / 2;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos(angle) * 32,
                      y: Math.sin(angle) * 32,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00cfff]"
                    style={{ top: "40%", left: "40%" }}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* The Core Button */}
        <motion.button
          id="experience-mode-toggle"
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileTap={{ scale: 0.92 }}
          className={`relative z-10 flex h-13 w-13 items-center justify-center rounded-full border cursor-pointer transition-all duration-1000 ${
            isExperienceMode
              ? "border-transparent bg-slate-950/80 shadow-[0_0_30px_rgba(0,207,255,0.7)]"
              : isHovered
                ? "border-cyan-400/80 bg-slate-950 shadow-[0_0_20px_rgba(0,207,255,0.4)]"
                : "border-white/10 bg-slate-950/50 shadow-[0_0_15px_rgba(0,180,255,0.15)]"
          }`}
        >
          {/* Pulsing/rotating light borders */}
          <AnimatePresence>
            {isExperienceMode ? (
              /* Conic rotating neon gradient border */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 animate-spin-slow"
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                <div className="h-full w-full rounded-full bg-slate-950" />
              </motion.div>
            ) : (
              /* Soft blue pulsing outer halo */
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-500/20"
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
                  opacity: isHovered ? [0.4, 0.8, 0.4] : [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </AnimatePresence>

          {/* Rainbow reflections layer in Experience Mode */}
          {isExperienceMode && (
            <div className="absolute inset-[2px] rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-fuchsia-500/10 to-transparent animate-pulse" />
              {/* Slanted glass glare sheen */}
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-[-100%] animate-shimmer" style={{ animationDuration: "3s" }} />
            </div>
          )}

          {/* Normal glass glare sheen */}
          {!isExperienceMode && isHovered && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-[-100%] animate-shimmer" style={{ animationDuration: "2s" }} />
            </div>
          )}

          {/* The main changing icon */}
          <motion.div
            animate={{
              rotate: isHovered ? (isExperienceMode ? 360 : 45) : 0,
              scale: isHovered ? 1.12 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            className="relative z-20 flex items-center justify-center"
          >
            {isExperienceMode ? (
              <Sparkles className="h-5 w-5 text-cyan-300 filter drop-shadow-[0_0_6px_#00cfff] animate-pulse" />
            ) : (
              <Orbit className="h-5 w-5 text-cyan-400/80" />
            )}
          </motion.div>

          {/* Miniature sub-indicator status dot */}
          <span className={`absolute bottom-1 right-1 h-2 w-2 rounded-full border border-slate-950 z-20 transition-all duration-500 ${
            isExperienceMode ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-slate-600"
          }`} />

        </motion.button>
      </div>
    </div>
  );
}
