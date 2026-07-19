/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Orbit, X, ChevronRight, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { soundSynth } from "./AudioController";

export default function ExperienceToggle() {
  const { isExperienceMode, setIsExperienceMode, locale } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleToggle = () => {
    const newState = !isExperienceMode;
    setIsExperienceMode(newState);
    soundSynth.playExperienceToggle(newState);
  };

  const handleOpen = () => {
    soundSynth.playExperienceHover();
    setIsExpanded(true);
  };

  const handleClose = () => {
    soundSynth.playClick();
    setIsExpanded(false);
  };

  const isRtl = locale === "ar";

  return (
    <div className="fixed right-0 top-1/3 -translate-y-1/2 z-50 select-none">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Sleek, thin vertical indicator tab on the right edge */
          <motion.button
            key="indicator-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ x: -4 }}
            onClick={handleOpen}
            onMouseEnter={() => {
              setIsHovered(true);
              soundSynth.playExperienceHover();
            }}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex w-8 h-16 items-center justify-center rounded-l-xl border-y border-l bg-slate-950/90 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer transition-all duration-300 ${
              isExperienceMode
                ? "border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,207,255,0.25)]"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {/* Soft pulsing indicator dot */}
            <span className={`absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full animate-pulse ${
              isExperienceMode ? "bg-cyan-400" : "bg-slate-600"
            }`} />

            <Orbit className={`h-4.5 w-4.5 ${isExperienceMode ? "animate-spin-slow text-cyan-400" : ""}`} />

            {/* Hover tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-10 whitespace-nowrap rounded-xl border border-white/10 bg-slate-950/95 px-3 py-1.5 text-[10px] font-bold text-slate-200 shadow-xl"
                >
                  {isRtl ? "التأثيرات الرقمية ✨" : "Digital Effects ✨"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ) : (
          /* Beautiful, expanded visual settings panel */
          <motion.div
            key="expanded-panel"
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: -16, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="w-64 p-4 rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col gap-3"
          >
            {/* Header row */}
            <div className={`flex items-center justify-between border-b border-white/5 pb-2 ${
              isRtl ? "flex-row-reverse" : "flex-row"
            }`}>
              <div className={`flex items-center gap-1.5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="font-sans text-xs font-black text-white">
                  {isRtl ? "التحكم بالتأثيرات" : "Effects Controller"}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="h-6 w-6 rounded-lg border border-white/5 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Main Interactive Toggle */}
            <div className={`flex flex-col gap-2 p-1.5 rounded-xl bg-white/[0.01] border border-white/5`}>
              <button
                onClick={handleToggle}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                  isExperienceMode
                    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                    : "bg-slate-900/40 border border-white/5 text-slate-400 hover:text-slate-300"
                } ${isRtl ? "flex-row-reverse" : "flex-row"}`}
              >
                <span className="font-sans text-xs font-bold">
                  {isRtl ? "النمط السينمائي الغامر" : "Cinematic Mode"}
                </span>
                
                {/* Simulated Custom Toggle Switch */}
                <div className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-300 ${
                  isExperienceMode ? "bg-cyan-500" : "bg-slate-800"
                }`}>
                  <div className={`w-4.5 h-4.5 rounded-full bg-slate-950 shadow-md transition-transform duration-300 ${
                    isExperienceMode ? (isRtl ? "-translate-x-4.5" : "translate-x-4.5") : "translate-x-0"
                  }`} />
                </div>
              </button>
            </div>

            {/* Description note */}
            <p className={`font-sans text-[10px] leading-relaxed text-slate-400 ${
              isRtl ? "text-right" : "text-left"
            }`}>
              {isRtl
                ? "تفعيل التأثيرات السينمائية ثلاثية الأبعاد والتوهجات الماسية الفاخرة أثناء تصفح الموقع."
                : "Enable rich 3D cinematic camera paths and luxurious glowing diamond reflections."}
            </p>

            {/* Footer feedback */}
            <div className={`flex items-center gap-1.5 text-[9px] text-emerald-400 font-sans border-t border-white/5 pt-2 ${
              isRtl ? "justify-end flex-row-reverse" : "justify-start"
            }`}>
              <Check className="h-3 w-3" />
              <span>{isRtl ? "مُحسّن للسرعة الفائقة 100%" : "100% Speed Optimized"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
