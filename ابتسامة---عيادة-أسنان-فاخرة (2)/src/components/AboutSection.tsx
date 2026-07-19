/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Award, Eye, Heart, Shield, Sparkles } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

export default function AboutSection() {
  const { t, locale } = useApp();
  const isRtl = locale === "ar";

  const points = [
    {
      titleKey: "aboutPoint1Title",
      descKey: "aboutPoint1Desc",
      icon: Heart,
    },
    {
      titleKey: "aboutPoint2Title",
      descKey: "aboutPoint2Desc",
      icon: Award,
    },
    {
      titleKey: "aboutPoint3Title",
      descKey: "aboutPoint3Desc",
      icon: Shield,
    },
  ];

  return (
    <section id="about" className="relative py-24 px-6 lg:px-16 border-t border-slate-900 select-none">
      <div className="mx-auto max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Column for Aesthetic surgical laboratory diagram mockup */}
          <div className="relative flex items-center justify-center h-[380px] rounded-3xl border border-white/5 bg-slate-950/20 backdrop-blur-md overflow-hidden group">
            {/* Ambient inner neon glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-blue-500/10 blur-[80px]" />
            <div className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-cyan-400/10 blur-[50px] animate-pulse" />

            {/* Surgical monitor interface simulation */}
            <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className={`flex items-center gap-1.5 font-mono text-[9px] text-cyan-400 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{t("aboutAiCalib")}</span>
                </div>
                <Eye className="h-4 w-4 text-slate-500" />
              </div>

              {/* Graphical tooth mesh simulation */}
              <div className="h-28 w-full border border-dashed border-slate-800 rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
                <svg
                  className="h-full w-auto text-cyan-400/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  viewBox="0 0 100 100"
                >
                  <path d="M30,20 C40,15 50,22 50,30 C50,22 60,15 70,20 C80,30 75,55 65,70 C55,80 50,85 50,85 C50,85 45,80 35,70 C25,55 20,30 30,20 Z" />
                  <line x1="50" y1="30" x2="50" y2="85" strokeDasharray="2 2" />
                  <path d="M35,45 C45,40 55,40 65,45" strokeDasharray="1 1" />
                  {/* Grid overlay scanner line */}
                  <motion.line
                    animate={{ y: [0, 100, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    x1="10" y1="0" x2="90" y2="0" stroke="#00cfff" strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Diagnosis details */}
              <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] text-slate-400 text-start">
                <div className="flex justify-between">
                  <span className="text-cyan-400">99.85%</span>
                  <span>{t("aboutGumIndex")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">{t("aboutPerfect")}</span>
                  <span>{t("aboutBiteRatio")}</span>
                </div>
              </div>
            </div>

            {/* Glowing border outline */}
            <div className="absolute inset-0 border border-white/5 group-hover:border-cyan-500/20 transition-all duration-700 rounded-3xl" />
          </div>

          {/* Column for Content and list */}
          <div className="flex flex-col items-start text-start">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-950/10 px-3.5 py-1 text-xs text-blue-400 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>{t("aboutBadgeText")}</span>
            </motion.div>
            
            <h2 className="mt-4 font-sans text-3xl md:text-4xl font-extrabold text-white">
              {t("aboutHeadingText")}
            </h2>
            
            <p className="mt-6 font-sans text-sm text-slate-400 leading-relaxed">
              {t("aboutDescText")}
            </p>

            {/* Detail items */}
            <div className="mt-10 flex flex-col gap-6 w-full">
              {points.map((point) => {
                const IconComponent = point.icon;
                return (
                  <div key={point.titleKey} className="flex gap-4 items-start group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950/20 border border-white/5 text-blue-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all duration-300">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none text-start">
                      <h4 className="font-sans text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {t(point.titleKey as any)}
                      </h4>
                      <p className="mt-1.5 font-sans text-xs text-slate-400 leading-relaxed">
                        {t(point.descKey as any)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
