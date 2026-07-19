/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeftRight, Sparkles, Smile, ShieldAlert, Clock, User, Award, ShieldCheck, Heart, Star, Frown, AlertTriangle } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

// Definitions of Before/After Icons for comparison
const getBeforeIcons = (isRtl: boolean) => [
  { icon: Frown, label: isRtl ? "خجل الابتسامة" : "Smile Shyness", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  { icon: ShieldAlert, label: isRtl ? "تصبغات داكنة" : "Dark Stains", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { icon: AlertTriangle, label: isRtl ? "فراغات واعوجاج" : "Gaps & Crowding", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" }
];

const getAfterIcons = (isRtl: boolean) => [
  { icon: Smile, label: isRtl ? "ثقة كاملة" : "Full Confidence", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
  { icon: Sparkles, label: isRtl ? "بياض ناصع" : "Bright White", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" },
  { icon: ShieldCheck, label: isRtl ? "محاذاة مثالية" : "Perfect Symmetry", color: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]" }
];

export default function BeforeAfter() {
  const { t, isEmergency, locale } = useApp();
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cases = [
    {
      id: "veneers",
      title: t("baCase1Title"),
      desc: t("baCase1Desc"),
      story: t("baCase1Story"),
      type: t("baCase1Type"),
      time: t("baCase1Duration"),
      age: 28,
      successRate: 99.8,
      beforeLabel: "PRE-OP",
      afterLabel: "POST-OP",
      beforeImage: "https://images.unsplash.com/photo-1513412539089-a91aefc307f7?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
      beforeFilter: "brightness-85 sepia-[0.35] saturate-[1.2] contrast-95 blur-[0.2px] grayscale-[0.1]",
      afterFilter: "brightness-105 contrast-105 saturate-110 font-medium"
    },
    {
      id: "implants",
      title: t("baCase2Title"),
      desc: t("baCase2Desc"),
      story: t("baCase2Story"),
      type: t("baCase2Type"),
      time: t("baCase2Duration"),
      age: 44,
      successRate: 99.4,
      beforeLabel: "PRE-OP",
      afterLabel: "POST-OP",
      beforeImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800",
      beforeFilter: "brightness-75 grayscale-[0.2] contrast-95 sepia-[0.1]",
      afterFilter: "brightness-105 saturate-105"
    },
    {
      id: "invisalign",
      title: t("baCase3Title"),
      desc: t("baCase3Desc"),
      story: t("baCase3Story"),
      type: t("baCase3Type"),
      time: t("baCase3Duration"),
      age: 22,
      successRate: 100,
      beforeLabel: "PRE-OP",
      afterLabel: "POST-OP",
      beforeImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      beforeFilter: "brightness-80 hue-rotate-15 contrast-95 sepia-[0.1] blur-[0.2px]",
      afterFilter: "brightness-110 saturate-105 font-semibold"
    }
  ];

  const activeCase = cases[activeCaseIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate 3D tilt angles based on cursor offset from card center
    const tiltY = ((x / rect.width) - 0.5) * 18;  // -9 to +9 deg
    const tiltX = -((y / rect.height) - 0.5) * 12; // -6 to +6 deg
    setRotateX(tiltX);
    setRotateY(tiltY);
    setIsHovering(true);

    if (e.buttons === 1 || e.buttons === 0) { // Hover or Drag move
      // When dragging or moving over, let it slide
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0] && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);

      const tiltY = ((x / rect.width) - 0.5) * 14;
      const tiltX = -((y / rect.height) - 0.5) * 10;
      setRotateX(tiltX);
      setRotateY(tiltY);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  const selectCase = (index: number) => {
    soundSynth.playClick();
    setActiveCaseIndex(index);
    setSliderPosition(50);
  };

  const isRtl = locale === "ar";

  return (
    <section id="before-after" className="relative py-24 px-6 lg:px-16 bg-[#020813] select-none border-t border-white/5 overflow-hidden">
      
      {/* Floating Background Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute h-1 w-1 rounded-full pointer-events-none transition-colors duration-1000 ${
            isEmergency ? "bg-red-500/20" : "bg-cyan-400/20"
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["110vh", "-10vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Visual Ambient nodes */}
      <div className={`absolute top-1/2 left-1/3 h-80 w-80 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${
        isEmergency ? "bg-red-500/5" : "bg-blue-500/5"
      }`} />
      
      <div className="mx-auto max-w-7xl animate-fade-in">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs backdrop-blur-md transition-all duration-1000 ${
              isEmergency
                ? "border-red-500/20 bg-red-950/20 text-red-400"
                : "border-cyan-500/20 bg-cyan-950/20 text-cyan-400"
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 animate-spin transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
            <span>{t("baBadge")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-sans text-3xl md:text-5xl font-extrabold text-white"
          >
            {t("baHeading")}{" "}
            <span className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-1000 ${
              isEmergency ? "from-red-400 to-rose-500" : "from-cyan-400 to-indigo-500"
            }`}>
              ({isRtl ? "قبل وبعد" : "Before & After"})
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl font-sans text-sm text-slate-400 leading-relaxed"
          >
            {t("baDesc")}
          </motion.p>
        </div>

        {/* Dynamic Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {cases.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => selectCase(idx)}
              className={`px-5 py-3 rounded-2xl font-sans text-xs font-bold transition-all duration-500 border backdrop-blur-md cursor-pointer ${
                activeCaseIndex === idx
                  ? isEmergency
                    ? "bg-gradient-to-r from-red-500/15 to-rose-500/15 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(0,207,255,0.15)]"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Slider Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column: Simplified clean card */}
          <div className="lg:col-span-5 flex flex-col justify-center rounded-3xl border border-white/5 bg-slate-950/30 p-6 backdrop-blur-xl shadow-2xl relative min-h-[300px]">
            <div>
              <span className={`font-sans text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`}>
                {isRtl ? "تفاصيل حالة الابتسامة" : "SMILE CASE DETAILS"}
              </span>
              <h3 className="font-sans text-2xl font-black text-white leading-snug">{activeCase.title}</h3>
              <p className="mt-3 font-sans text-xs text-slate-400 leading-relaxed">
                {activeCase.desc}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <Award className={`h-4 w-4 transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                  <span className="font-sans text-xs font-bold text-white">{activeCase.type}</span>
                </div>
                <span className="font-sans text-xs text-slate-400">{isRtl ? "الإجراء" : "Procedure"}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <Clock className={`h-4 w-4 transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                  <span className="font-sans text-xs font-bold text-white">{activeCase.time}</span>
                </div>
                <span className="font-sans text-xs text-slate-400">{isRtl ? "المدة المتوقعة" : "Expected Duration"}</span>
              </div>
            </div>
          </div>

          {/* Right Comparison Slider Stage */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            {/* 3D Holo Stage Container */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-[380px] md:h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 cursor-ew-resize select-none shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300"
              style={{
                transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.02 : 1})`,
                transition: isHovering ? "none" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                transformStyle: "preserve-3d"
              }}
            >
              
              {/* BEFORE Layer */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-[#1a0e10] to-slate-950 flex items-center">
                {/* Before Icons Container (Left Side) */}
                <div className="absolute left-[12%] md:left-[18%] flex flex-col gap-6 md:gap-8 items-center w-[130px] md:w-[160px]">
                  <div className="text-rose-500 font-extrabold text-[10px] md:text-xs tracking-wider uppercase bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
                    {isRtl ? "قبل العلاج" : "BEFORE"}
                  </div>
                  {getBeforeIcons(isRtl).map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex flex-col items-center gap-1.5 text-center group">
                        <div className={`h-11 w-11 md:h-13 md:w-13 rounded-full border flex items-center justify-center transition-all duration-300 ${item.color} group-hover:scale-110 shadow-lg shadow-black/40`}>
                          <IconComponent className="h-5.5 w-5.5 md:h-6 md:w-6" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AFTER Layer */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-[#0a1e36] to-slate-950 flex items-center select-none"
                style={{
                  clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                  transition: "none"
                }}
              >
                {/* After Icons Container (Right Side) */}
                <div className="absolute right-[12%] md:right-[18%] flex flex-col gap-6 md:gap-8 items-center w-[130px] md:w-[160px]">
                  <div className="text-cyan-400 font-extrabold text-[10px] md:text-xs tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    {isRtl ? "بعد العلاج" : "AFTER"}
                  </div>
                  {getAfterIcons(isRtl).map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex flex-col items-center gap-1.5 text-center group">
                        <div className={`h-11 w-11 md:h-13 md:w-13 rounded-full border flex items-center justify-center transition-all duration-300 ${item.color} group-hover:scale-110 shadow-lg shadow-black/40`}>
                          <IconComponent className="h-5.5 w-5.5 md:h-6 md:w-6" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-200">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Drag Slider Bar line with Glowing Neon Laser Line and 3D floating handle */}
              <div
                className={`absolute inset-y-0 w-1 transition-all duration-1000 z-30 pointer-events-none bg-gradient-to-b ${
                  isEmergency
                    ? "from-red-600 via-rose-500 to-red-600 shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                    : "from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_20px_rgba(0,207,255,0.9)]"
                }`}
                style={{ 
                  left: `${sliderPosition}%`,
                  transform: "translateZ(25px)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* 3D floating handle */}
                <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border bg-slate-950/95 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.9)] ${
                  isEmergency
                    ? "border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                    : "border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(0,207,255,0.6)]"
                }`}
                style={{ transform: "translateZ(15px)" }}>
                  <ArrowLeftRight className="h-5 w-5 animate-pulse" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

