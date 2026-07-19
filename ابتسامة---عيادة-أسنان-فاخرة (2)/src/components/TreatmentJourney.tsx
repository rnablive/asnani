/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, FileText, Cpu, Activity, Heart, Smile, Clock } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

interface JourneyStep {
  id: number;
  titleKey: string;
  subKey: string;
  descKey: string;
  durKey: string;
  metaKey: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

const steps: JourneyStep[] = [
  {
    id: 1,
    titleKey: "j1Title",
    subKey: "j1Sub",
    descKey: "j1Desc",
    durKey: "j1Dur",
    metaKey: "j1Meta",
    icon: <FileText className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(6,182,212,0.15)"
  },
  {
    id: 2,
    titleKey: "j2Title",
    subKey: "j2Sub",
    descKey: "j2Desc",
    durKey: "j2Dur",
    metaKey: "j2Meta",
    icon: <Cpu className="h-6 w-6" />,
    color: "from-cyan-500 to-indigo-500",
    glowColor: "rgba(0,207,255,0.2)"
  },
  {
    id: 3,
    titleKey: "j3Title",
    subKey: "j3Sub",
    descKey: "j3Desc",
    durKey: "j3Dur",
    metaKey: "j3Meta",
    icon: <Activity className="h-6 w-6" />,
    color: "from-indigo-500 to-purple-500",
    glowColor: "rgba(99,102,241,0.15)"
  },
  {
    id: 4,
    titleKey: "j4Title",
    subKey: "j4Sub",
    descKey: "j4Desc",
    durKey: "j4Dur",
    metaKey: "j4Meta",
    icon: <Heart className="h-6 w-6" />,
    color: "from-purple-500 to-emerald-500",
    glowColor: "rgba(168,85,247,0.15)"
  },
  {
    id: 5,
    titleKey: "j5Title",
    subKey: "j5Sub",
    descKey: "j5Desc",
    durKey: "j5Dur",
    metaKey: "j5Meta",
    icon: <Smile className="h-6 w-6" />,
    color: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16,185,129,0.2)"
  }
];

export default function TreatmentJourney() {
  const { t, locale } = useApp();
  const isRtl = locale === "ar";
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handleHoverStep = (id: number | null) => {
    if (id !== null) {
      soundSynth.playClick();
    }
    setHoveredStep(id);
  };

  return (
    <section id="journey-section" className="relative w-full bg-[#030a1c] py-24 px-6 lg:px-16 overflow-hidden border-t border-white/5 select-none">
      {/* Background neon orbs */}
      <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        
        {/* Title block */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-950/20 px-4 py-1.5 text-xs text-indigo-400 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{t("journeyBadge")}</span>
          </motion.div>
          
          <h2 className="mt-4 font-sans text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {t("journeyHeading")}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-sans text-sm text-slate-400 leading-relaxed">
            {t("journeyDesc")}
          </p>
        </div>

        {/* Steps Journey layout with horizontal scroll/grid representation */}
        <div className="relative mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Neon Connector Line (Visual only for desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 via-indigo-500 via-purple-500 to-emerald-500 opacity-25 z-0" />

          {steps.map((step, index) => {
            const isHovered = hoveredStep === step.id;
            
            return (
              <motion.div
                key={step.id}
                onMouseEnter={() => handleHoverStep(step.id)}
                onMouseLeave={() => handleHoverStep(null)}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                
                {/* Visual Step bubble with custom neon gradients */}
                <div
                  className={`relative flex items-center justify-center h-24 w-24 rounded-full border-2 transition-all duration-300 bg-slate-950 shadow-2xl ${
                    isHovered 
                      ? "border-cyan-400 scale-110 shadow-[0_0_30px_rgba(0,207,255,0.4)]" 
                      : "border-slate-800 border-dashed"
                  }`}
                  style={{
                    boxShadow: isHovered ? `0 0 35px ${step.glowColor}` : undefined
                  }}
                >
                  <div className={`absolute inset-1.5 rounded-full bg-gradient-to-br ${step.color} opacity-10`} />
                  
                  {/* Inside Step icon */}
                  <div className={`transition-colors duration-300 ${isHovered ? "text-cyan-400" : "text-slate-400"}`}>
                    {step.icon}
                  </div>

                  {/* Bubble number badge */}
                  <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 border border-white/10 font-sans text-xs font-black text-white">
                    0{step.id}
                  </div>
                </div>

                {/* Animated Glowing Connection Arrow for Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="block lg:hidden h-8 w-[2px] bg-gradient-to-b from-cyan-500 to-indigo-500 opacity-30 my-4" />
                )}

                {/* Step Metadata Card Details */}
                <div className="mt-6 flex flex-col items-center">
                  <span className="font-sans text-[10px] text-cyan-400 font-bold tracking-widest block mb-2">Step 0{step.id}</span>
                  
                  <h3 className={`font-sans text-base font-extrabold text-white transition-all duration-300 ${
                    isHovered ? "text-cyan-400" : ""
                  }`}>
                    {t(step.titleKey as any)}
                  </h3>
                  
                  <span className="mt-2.5 font-sans text-xs text-slate-400 font-medium">
                    {t(step.subKey as any)}
                  </span>

                  {/* Expandable/Interactive Hover Disclosure */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: isHovered ? "auto" : 0,
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden w-full max-w-sm mt-3"
                  >
                    <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-4 text-start mt-2 flex flex-col gap-2.5">
                      <p className="font-sans text-xs text-slate-300 leading-relaxed">
                        {t(step.descKey as any)}
                      </p>
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                        <span className="font-sans text-[10px] text-cyan-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {t(step.durKey as any)}
                        </span>
                        <span className="font-sans text-[9px] text-slate-500">
                          {t(step.metaKey as any)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
