/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, Compass, ShieldAlert, ShieldCheck } from "lucide-react";
import { soundSynth } from "./AudioController";
import ThreeTooth from "./ThreeTooth";
import GlassToothCard from "./GlassToothCard";
import FeatureCards from "./FeatureCards";
import { useApp } from "../context/AppContext";

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  const { t, locale } = useApp();
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isTipsOpen, setIsTipsOpen] = useState(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);

    soundSynth.playClick();
    setTimeout(() => {
      onBookClick();
    }, 200);
  };

  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen w-full flex-col justify-between pt-24 pb-12 px-6 lg:px-16"
    >
      <div className="mx-auto w-full max-w-6xl flex-grow grid grid-cols-1 lg:grid-cols-12 items-center gap-12 mt-4">
        
        {/* Right Column: 3D Tooth Model and Floating Glass Card */}
        <div className="lg:col-span-5 order-1 lg:order-2 relative flex flex-col items-center justify-center h-[520px] lg:h-full">
          {/* Three.js Canvas */}
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <ThreeTooth />
          </div>

          {/* Special place and custom icon button to toggle preventive health tips */}
          <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 z-30 flex items-center gap-2">
            <motion.button
              onClick={() => {
                soundSynth.playClick();
                setIsTipsOpen(!isTipsOpen);
              }}
              onMouseEnter={() => soundSynth.playHover()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-cyan-500/30 bg-slate-950/80 text-cyan-400 hover:text-white hover:border-cyan-400/60 shadow-[0_0_15px_rgba(0,207,255,0.2)] hover:shadow-[0_0_25px_rgba(0,207,255,0.4)] backdrop-blur-md transition-all cursor-pointer relative group"
              type="button"
            >
              {/* Pulsing ring indicator */}
              <span className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-60 scale-105 pointer-events-none group-hover:scale-110" />
              <ShieldCheck className="h-4.5 w-4.5 text-cyan-400 group-hover:animate-pulse" />
              <span className="font-sans text-xs font-bold">{t("heroHealthTips")}</span>
            </motion.button>
          </div>

          {/* Glass Tooth Card Overlay Container with slide-out transition */}
          <AnimatePresence>
            {isTipsOpen && (
              <div className="absolute right-0 bottom-20 lg:-right-4 lg:bottom-24 z-20">
                <GlassToothCard onClose={() => setIsTipsOpen(false)} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Left Column: Premium Typography and Content */}
        <div className={`lg:col-span-7 order-2 lg:order-1 flex flex-col items-start ${locale === "ar" ? "text-right pr-0 lg:pr-6" : "text-left pl-0 lg:pl-6"}`}>
          
          {/* High-tech glow mini pill badge */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-1.5 text-xs font-semibold text-cyan-400 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
            <span className="font-sans">{t("heroBadge")}</span>
          </motion.div>

          {/* Main Huge Headline */}
          <h1 className="font-sans text-5xl md:text-6xl font-black leading-[1.15] text-white tracking-tight select-none">
            <motion.span
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="block"
            >
              {t("heroHeading")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,207,255,0.2)]"
            >
              {t("heroHeadingAccent")}
            </motion.span>
          </h1>

          {/* Elegant descriptive paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 font-sans text-base md:text-lg leading-relaxed text-slate-300 max-w-xl select-none"
          >
            {t("heroDesc")}
          </motion.p>

          {/* Call To Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4 w-full justify-start select-none"
          >
            {/* Primary Gradient Ripple Button */}
            <button
              onClick={handleButtonClick}
              onMouseEnter={() => soundSynth.playHover()}
              className="group relative overflow-hidden flex h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 text-base font-extrabold text-white shadow-[0_8px_30px_rgba(30,136,255,0.35)] hover:shadow-[0_8px_35px_rgba(0,207,255,0.5)] hover:scale-[1.04] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>{t("heroCtaBook")}</span>
              <ArrowLeft className={`h-5 w-5 transition-transform ${locale === "ar" ? "group-hover:-translate-x-1.5" : "rotate-180 group-hover:translate-x-1.5"}`} />

              {/* Ripple Effect elements */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
                  style={{
                    left: ripple.x - 24,
                    top: ripple.y - 24,
                    width: 48,
                    height: 48,
                  }}
                />
              ))}
            </button>

            {/* Secondary Glass Border Glow Button */}
            <button
              onClick={() => {
                soundSynth.playClick();
                // Scroll down to before-after section
                document.getElementById("before-after")?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={() => soundSynth.playHover()}
              className="group relative flex h-14 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-base font-bold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:text-white hover:bg-white/[0.06] active:scale-95 cursor-pointer"
            >
              <Compass className="h-5 w-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
              <span>{t("heroVirtualTour")}</span>
            </button>
          </motion.div>

          {/* Under-the-fold Feature Cards */}
          <div className="mt-14 w-full">
            <FeatureCards />
          </div>

        </div>
      </div>
    </section>
  );
}
