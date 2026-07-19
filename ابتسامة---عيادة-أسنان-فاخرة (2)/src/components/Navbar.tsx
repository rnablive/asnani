/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Heart, Menu, X, Globe, ChevronDown, Check } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

interface NavbarProps {
  onBookClick: () => void;
  onNavigate: (section: string) => void;
}

const LANGUAGES = [
  { code: "ar", name: "العربية" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文（简体）" },
];

export default function Navbar({ onBookClick, onNavigate }: NavbarProps) {
  const { locale, setLocale, isEmergency, t } = useApp();
  const [activeLinkId, setActiveLinkId] = useState("hero");
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { name: t("navHome"), id: "hero" },
    { name: t("navAbout"), id: "about" },
    { name: t("navServices"), id: "services" },
    { name: t("navBeforeAfter"), id: "before-after" },
    { name: t("navDoctors"), id: "doctors" },
    { name: t("navContact"), id: "contact" },
  ];

  // Close language selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (id: string) => {
    soundSynth.playClick();
    setActiveLinkId(id);
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

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
    }, 150);
  };

  const handleLangChange = (code: string) => {
    soundSynth.playClick();
    setLocale(code);
    setIsLangOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];
  const isRtl = locale === "ar";

  // Dynamic theme colors
  const gradientClass = isEmergency
    ? "from-red-600 to-rose-500 shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_25px_rgba(244,63,94,0.6)]"
    : "from-blue-600 to-cyan-500 shadow-[0_4px_20px_rgba(30,136,255,0.4)] hover:shadow-[0_4px_25px_rgba(0,207,255,0.6)]";

  const glowBorderClass = isEmergency
    ? "from-red-600 to-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
    : "from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(0,207,255,0.4)]";

  const textActiveColor = isEmergency ? "text-red-400" : "text-cyan-400";

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-6 left-1/2 z-40 w-full max-w-6xl -translate-x-1/2 px-4 pointer-events-none"
      >
        <div
          id="navbar"
          className="relative flex h-18 w-full items-center justify-between rounded-full border border-white/10 bg-slate-950/40 px-6 py-2 shadow-2xl backdrop-blur-[40px] pointer-events-auto"
        >
          {/* Logo Section */}
          <div
            className={`flex items-center gap-3 cursor-pointer select-none ${isRtl ? "flex-row" : "flex-row"}`}
            onClick={() => handleLinkClick("hero")}
            onMouseEnter={() => soundSynth.playHover()}
          >
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr p-[1.5px] transition-all duration-1000 ${glowBorderClass}`}>
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                <Heart className={`h-5 w-5 transition-colors duration-1000 ${isEmergency ? "text-red-400 fill-red-400/20" : "text-cyan-400 fill-cyan-400/20"}`} />
              </div>
            </div>
            <div className={`flex flex-col ${isRtl ? "items-start" : "items-start"} leading-none`}>
              <span className="font-sans text-xl font-extrabold tracking-tight text-white transition-all duration-300">
                {t("navTitle")}
              </span>
              <span className="font-sans text-[10px] font-semibold text-slate-400">
                {t("navSubtitle")}
              </span>
            </div>
          </div>

          {/* Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                onMouseEnter={() => soundSynth.playHover()}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeLinkId === link.id ? textActiveColor : "text-slate-300 hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {activeLinkId === link.id && (
                  <motion.div
                    layoutId="navbar-underline"
                    className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-gradient-to-r transition-colors duration-1000 ${
                      isEmergency ? "from-red-500 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(0,207,255,0.5)]"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Side Control Panel (Booking CTA) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Book Appointment CTA Button */}
            <button
              onClick={handleButtonClick}
              onMouseEnter={() => soundSynth.playHover()}
              className={`group relative overflow-hidden flex h-11 items-center gap-2 rounded-full bg-gradient-to-r px-5 text-sm font-bold text-white hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer ${gradientClass}`}
            >
              <Calendar className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span>{t("navBookBtn")}</span>

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

              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                soundSynth.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-4 top-28 z-40 rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-3xl backdrop-blur-3xl lg:hidden flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  onMouseEnter={() => soundSynth.playHover()}
                  className={`w-full rounded-xl px-4 py-2.5 text-right text-base font-medium transition-all cursor-pointer ${
                    activeLinkId === link.id
                      ? isEmergency
                        ? "bg-gradient-to-l from-red-950/50 to-rose-950/20 text-red-400 border-r-2 border-red-400"
                        : "bg-gradient-to-l from-blue-950/50 to-cyan-950/20 text-cyan-400 border-r-2 border-cyan-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleButtonClick}
              className={`flex w-full h-12 items-center justify-center gap-2 rounded-2xl text-base font-bold text-white shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r ${
                isEmergency ? "from-red-600 to-rose-500" : "from-blue-600 to-cyan-500"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>{t("navBookBtn")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
