/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Heart, Globe, MessageSquare, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClinicBackground from "./components/ClinicBackground";
import Stats from "./components/Stats";
import VideoCard from "./components/VideoCard";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import BeforeAfter from "./components/BeforeAfter";
import DoctorsSection from "./components/DoctorsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AudioController from "./components/AudioController";
import CustomCursor from "./components/CustomCursor";
import { soundSynth } from "./components/AudioController";
import AIDiagnosisSection from "./components/AIDiagnosisSection";

// Import futuristic immersive sections
import HolographicEarthSection from "./components/HolographicEarthSection";
import TreatmentJourney from "./components/TreatmentJourney";
import DarijaReviews from "./components/DarijaReviews";
import AIAssistant from "./components/AIAssistant";
import ExperienceToggle from "./components/ExperienceToggle";

import { AppContextProvider, useApp } from "./context/AppContext";

function AppContent() {
  const { locale, isEmergency, t, isExperienceMode } = useApp();
  const [shouldShake, setShouldShake] = useState(false);

  // Trigger slight screen shake when emergency mode starts
  useEffect(() => {
    if (isEmergency) {
      setShouldShake(true);
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isEmergency]);

  // 1. Initialize Lenis Smooth Scroll (Standard modern web standard for silky scrolls)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle immediate scrolling navigation
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookClick = () => {
    handleNavigate("contact");
  };

  const isRtl = locale === "ar";
  const [showFloatingBook, setShowFloatingBook] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowFloatingBook(true);
      } else {
        setShowFloatingBook(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={shouldShake ? { x: [-4, 4, -4, 4, -3, 3, -1, 1, 0], y: [-2, 2, -2, 2, -1, 1, 0] } : {}}
      transition={{ duration: 0.6 }}
      className={`relative min-h-screen w-full bg-[#020813] font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-white transition-colors duration-1000 ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      {/* Awwwards Precision Custom Cursor */}
      <CustomCursor />

      {/* Premium Experience Mode Toggle */}
      <ExperienceToggle />

      {/* Experience Mode Cinematic Overlays */}
      <AnimatePresence>
        {isExperienceMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          >
            {/* Aurora background lights */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.55, 0.4],
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px] mix-blend-color-dodge"
            />
            <motion.div
              animate={{
                scale: [1.1, 0.95, 1.1],
                opacity: [0.35, 0.5, 0.35],
                x: [0, -25, 0],
                y: [0, 15, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[20%] right-[25%] h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[180px] mix-blend-color-dodge"
            />

            {/* Floating light rays */}
            <motion.div
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 0.12, 0],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-y-0 w-96 bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent skew-x-12 blur-[80px]"
            />

            {/* Soft Lens Flare (aesthetic light leak) */}
            <div className="absolute top-0 right-0 h-96 w-96 bg-gradient-to-b from-cyan-400/10 to-transparent rounded-full filter blur-[100px] opacity-75" />
            <div className="absolute -top-12 right-1/4 h-24 w-24 bg-white/5 rounded-full filter blur-[20px]" />
            
            {/* Floating cinematic ambient light particles */}
            {Array.from({ length: 25 }).map((_, i) => {
              const size = Math.random() * 3.5 + 1.5;
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const duration = Math.random() * 20 + 15;
              const delay = Math.random() * -18;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-cyan-300"
                  style={{
                    width: size,
                    height: size,
                    left: `${left}%`,
                    top: `${top}%`,
                    boxShadow: "0 0 10px rgba(0,207,255,0.8)",
                  }}
                  animate={{
                    y: ["10vh", "-110vh"],
                    x: [0, Math.sin(i) * 60, 0],
                    opacity: [0, 0.8, 0.8, 0],
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Dental Clinic Backdrop (Glows, lasers, grids, sterile dust, transitions to red in emergency) */}
      <ClinicBackground />

      {/* Floating Glassmorphic Top Navbar */}
      <Navbar onBookClick={handleBookClick} onNavigate={handleNavigate} />

      {/* Main Structural Layout */}
      <main className="relative z-10">
        
        {/* 1. Hero Screen (3D floating tooth, typography, main CTAs, feature badges) */}
        <Hero onBookClick={handleBookClick} />

        {/* 2. Unified Stats & Cinematic Video Card banner (Directly below Hero) */}
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-16 mb-24 select-none">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full rounded-3xl border border-white/10 bg-slate-950/25 p-4 backdrop-blur-3xl shadow-2xl justify-between">
            <div className="flex-grow w-full">
              <Stats />
            </div>
            <div className="flex shrink-0 w-full md:w-auto items-center justify-center">
              <VideoCard />
            </div>
          </div>
        </div>

        {/* 3. About Section (Why Us, diagnostic mesh hologram) */}
        <AboutSection />

        {/* 4. Services Section (CAD/CAM Veneers, Implants, Invisalign, Lasers) */}
        <ServicesSection />

        {/* 4.5. Futuristic Treatment Journey (Consultation -> AI Analysis -> Treatment -> Recovery -> Perfect Smile) */}
        <TreatmentJourney />

        {/* 5. Interactive Before & After Slider (Mouth reconstruction diagnostics) */}
        <BeforeAfter />

        {/* 5.5. AI Dental Diagnosis Center (Futuristic medical holographic laboratory) */}
        <AIDiagnosisSection />

        {/* 6. Doctors Roster Section (Expert international surgeons) */}
        <DoctorsSection />

        {/* 6.5. Premium Moroccan Darija Reviews section (Floating cards with TTS voice reader) */}
        <DarijaReviews />

        {/* 6.8. Cinematic Holographic Earth location finder */}
        <HolographicEarthSection />

        {/* 7. Blog Section (Latest research, articles) */}
        <BlogSection />

        {/* 8. Contact & Scheduler section (Booking form, interactive date grids, tickets) */}
        <ContactSection />

      </main>

      {/* Floating AI Holographic assistant chat agent */}
      <AIAssistant />

      {/* Futuristic Ambient Sound & Sound Effects Manager */}
      <AudioController />

      {/* Luxury Brand Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#01040a]/90 py-12 px-6 lg:px-16 select-none">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo & Slogan */}
          <div className={`md:col-span-4 flex flex-col ${isRtl ? "items-start text-right" : "items-start text-left"}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-[0_0_10px_rgba(0,207,255,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                  <Heart className="h-4.5 w-4.5 text-cyan-400 fill-cyan-400/10" />
                </div>
              </div>
              <span className="font-sans text-lg font-black text-white">{t("navTitle")}</span>
            </div>
            <p className="mt-4 font-sans text-xs text-slate-400 leading-relaxed max-w-xs">
              {t("footerSlogan")}
            </p>
          </div>

          {/* Quick links */}
          <div className={`md:col-span-5 flex flex-wrap gap-x-8 gap-y-4 ${isRtl ? "justify-start" : "justify-start"}`}>
            <div className={`flex flex-col gap-2.5 ${isRtl ? "items-start" : "items-start"}`}>
              <span className="font-sans text-xs font-bold text-white">{t("footerMap")}</span>
              <button onClick={() => handleNavigate("hero")} className="font-sans text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">{t("navHome")}</button>
              <button onClick={() => handleNavigate("about")} className="font-sans text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">{t("navAbout")}</button>
              <button onClick={() => handleNavigate("services")} className="font-sans text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">{t("navServices")}</button>
            </div>
            <div className={`flex flex-col gap-2.5 ${isRtl ? "items-start" : "items-start"}`}>
              <span className="font-sans text-xs font-bold text-white">{t("footerSupport")}</span>
              <button onClick={() => handleNavigate("doctors")} className="font-sans text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">{t("navDoctors")}</button>
              <button onClick={() => handleNavigate("before-after")} className="font-sans text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">{t("navBeforeAfter")}</button>
              <button onClick={() => handleNavigate("blog")} className="font-sans text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">{t("blogHeading")}</button>
            </div>
          </div>

          {/* Certification badges */}
          <div className={`md:col-span-3 flex flex-col gap-4 ${isRtl ? "items-start" : "items-start"}`}>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3.5 py-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span className="font-sans text-[10px] font-bold text-slate-300">{t("footerLabel")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3.5 py-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span className="font-sans text-[10px] font-bold text-slate-300">{t("navSubtitle")}</span>
            </div>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans">
          <span>{t("footerRights")}</span>
          <span className="mt-2 sm:mt-0 font-mono">CRAFTED WITH LUXURY HEALTHCARE STANDARDS</span>
        </div>
      </footer>

      {/* Floating Sticky Booking CTA (appears at top-left as a small elegant icon when scrolled down) */}
      <AnimatePresence>
        {showFloatingBook && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 left-6 z-50 group"
          >
            <button
              onClick={handleBookClick}
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/90 border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                isEmergency
                  ? "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:border-red-400 text-red-400"
                  : "border-cyan-500/30 shadow-[0_0_15px_rgba(0,207,255,0.15)] hover:border-cyan-400 text-cyan-400"
              }`}
            >
              <Calendar className="h-5 w-5" />
              
              {/* Micro pulsing badge */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEmergency ? "bg-red-400" : "bg-cyan-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isEmergency ? "bg-red-500" : "bg-cyan-500"}`}></span>
              </span>
            </button>

            {/* Custom Tooltip on Hover */}
            <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-slate-950/95 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 shadow-2xl backdrop-blur-md ${
              isRtl ? "left-14 text-right" : "left-14 text-left"
            }`}>
              {t("navBookBtn")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}
