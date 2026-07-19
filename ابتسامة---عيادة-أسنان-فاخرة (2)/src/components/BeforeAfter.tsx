/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeftRight, Sparkles, Smile, ShieldAlert, Clock, User, Award, ShieldCheck, Heart, Star } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

export default function BeforeAfter() {
  const { t, isEmergency, locale } = useApp();
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
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
      // High-quality dental portrait smile before and after
      beforeImage: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800",
      beforeFilter: "brightness-75 sepia-[0.35] saturate-[0.8] contrast-95 blur-[0.3px]",
      afterFilter: "brightness-110 contrast-105 saturate-110"
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
      // Restorative smile showing dental procedures
      beforeImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800",
      beforeFilter: "brightness-70 grayscale-[0.3] contrast-90 sepia-[0.2]",
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
      // Young adult aligned smile comparison
      beforeImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
      beforeFilter: "brightness-80 hue-rotate-15 contrast-95 sepia-[0.2]",
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
    if (e.buttons === 1 || e.buttons === 0) { // Drag or hover move
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const selectCase = (index: number) => {
    soundSynth.playClick();
    setActiveCaseIndex(index);
    setSliderPosition(50);
  };

  const isRtl = locale === "ar";

  return (
    <section id="before-after" className="relative py-24 px-6 lg:px-16 bg-[#020813] select-none border-t border-white/5 overflow-hidden">
      
      {/* Floating Background Particles (Color matches isEmergency) */}
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
      
      <div className="mx-auto max-w-7xl">
        
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left info column: Glass stats card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-white/5 bg-slate-950/30 p-6 backdrop-blur-xl shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`font-sans text-[10px] font-bold uppercase tracking-widest block transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`}>
                  {isRtl ? "تحليل ودراسة الحالة الطبية" : "CASE MEDICAL STUDY"}
                </span>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-mono text-[10px] text-amber-300 font-bold">5.0</span>
                </div>
              </div>
              <h3 className="font-sans text-2xl font-black text-white leading-snug">{activeCase.title}</h3>
              <p className="mt-4 font-sans text-xs text-slate-400 leading-relaxed">
                {activeCase.desc}
              </p>

              {/* Patient Story Box */}
              <div className="mt-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-start">
                <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t("baStoryLabel")}
                </span>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  {activeCase.story}
                </p>
              </div>
            </div>

            {/* Comprehensive case metrics with custom icons */}
            <div className="mt-8 flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <Award className={`h-4 w-4 transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                  <span className="font-sans text-xs font-black text-white">{activeCase.type}</span>
                </div>
                <span className="font-sans text-xs text-slate-400">{isRtl ? "الإجراء الأساسي" : "Primary Procedure"}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <Clock className={`h-4 w-4 transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                  <span className="font-sans text-xs font-black text-white">{activeCase.time}</span>
                </div>
                <span className="font-sans text-xs text-slate-400">{isRtl ? "مدة العلاج" : "Duration"}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <User className={`h-4 w-4 transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                  <span className="font-sans text-xs font-black text-white">{activeCase.age} {isRtl ? "سنة" : "Years Old"}</span>
                </div>
                <span className="font-sans text-xs text-slate-400">{isRtl ? "عمر المريض" : "Patient Age"}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                  <span className="font-mono text-xs font-extrabold text-emerald-400">{activeCase.successRate}%</span>
                </div>
                <span className="font-sans text-xs text-slate-400">{isRtl ? "نسبة النجاح السريرية" : "Clinical Success Rate"}</span>
              </div>
            </div>
          </div>

          {/* Right Comparison Slider Stage */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full h-[380px] md:h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 cursor-ew-resize select-none shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              
              {/* Floating diagnostic corner label */}
              <div className="absolute top-4 right-4 z-20 bg-slate-950/80 px-3 py-1 rounded-full border border-white/5 text-[10px] font-sans text-slate-400">
                {isRtl ? "معاينة رقمية حية" : "Live Visual Scanner"}
              </div>

              {/* BEFORE Layer (Clinical Patient Smile image) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={activeCase.beforeImage}
                  alt="Before"
                  className={`w-full h-full object-cover select-none ${activeCase.beforeFilter}`}
                  referrerPolicy="no-referrer"
                />
                
                {/* Clinical Pre-Op Badge */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-slate-950/80 px-3 py-1 text-[10px] font-bold text-amber-400">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  <span>{activeCase.beforeLabel}</span>
                </div>
              </div>

              {/* AFTER Layer (Polished, gleaming, white smile image) */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden select-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  transition: "none"
                }}
              >
                <img
                  src={activeCase.afterImage}
                  alt="After"
                  className={`w-full h-full object-cover select-none ${activeCase.afterFilter}`}
                  referrerPolicy="no-referrer"
                />

                {/* Clinical Post-Op Badge */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-slate-950/80 px-3 py-1 text-[10px] font-bold text-emerald-400">
                  <Smile className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{activeCase.afterLabel}</span>
                </div>
              </div>

              {/* Center Drag Slider Bar line */}
              <div
                className={`absolute inset-y-0 w-1 transition-all duration-1000 z-30 pointer-events-none bg-gradient-to-b ${
                  isEmergency
                    ? "from-red-600 via-rose-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.9)]"
                    : "from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_15px_rgba(0,207,255,0.9)]"
                }`}
                style={{ left: `${sliderPosition}%` }}
              >
                <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border bg-slate-950 transition-all duration-1000 cursor-ew-resize ${
                  isEmergency
                    ? "border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                    : "border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(0,207,255,0.6)]"
                }`}>
                  <ArrowLeftRight className="h-4 w-4 animate-pulse" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
