/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Layers, Sparkles, Wand2, Shield, Heart, Activity } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

export default function ServicesSection() {
  const { t, locale } = useApp();
  const isRtl = locale === "ar";

  const services = [
    {
      titleKey: "srv1Title",
      descKey: "srv1Desc",
      icon: Layers,
      color: "from-blue-500 to-indigo-600",
      glow: "rgba(30,136,255,0.3)",
    },
    {
      titleKey: "srv2Title",
      descKey: "srv2Desc",
      icon: Sparkles,
      color: "from-cyan-400 to-blue-500",
      glow: "rgba(0,207,255,0.3)",
    },
    {
      titleKey: "srv3Title",
      descKey: "srv3Desc",
      icon: Wand2,
      color: "from-purple-500 to-indigo-500",
      glow: "rgba(168,85,247,0.3)",
    },
    {
      titleKey: "srv4Title",
      descKey: "srv4Desc",
      icon: Shield,
      color: "from-emerald-400 to-teal-500",
      glow: "rgba(34,197,94,0.3)",
    },
    {
      titleKey: "srv5Title",
      descKey: "srv5Desc",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      glow: "rgba(236,72,153,0.3)",
    },
    {
      titleKey: "srv6Title",
      descKey: "srv6Desc",
      icon: Activity,
      color: "from-amber-400 to-orange-500",
      glow: "rgba(245,158,11,0.3)",
    },
  ];

  return (
    <section id="services" className="relative py-24 px-6 lg:px-16 border-t border-slate-900 bg-slate-950/10 select-none">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-950/10 px-3.5 py-1 text-xs text-cyan-400 backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>{t("servicesBadge")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-sans text-3xl md:text-4xl font-extrabold text-white"
          >
            {t("servicesHeading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl font-sans text-sm text-slate-400 leading-relaxed"
          >
            {t("servicesDesc")}
          </motion.p>
        </div>

        {/* Services Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 * idx, ease: "easeOut" }}
                onMouseEnter={() => soundSynth.playHover()}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-slate-950/40 p-6 text-start backdrop-blur-3xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)]"
              >
                {/* Visual Glow Layer */}
                <div
                  className="absolute inset-0 -z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${service.glow}, transparent 60%)`,
                  }}
                />

                <div>
                  {/* Top Header with Icon */}
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${service.color} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg]`}
                  >
                    <IconComponent className="h-5.5 w-5.5" />
                  </div>

                  {/* Title */}
                  <h3 className="font-sans text-base font-extrabold text-white transition-colors duration-300 group-hover:text-cyan-300">
                    {t(service.titleKey as any)}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 font-sans text-xs leading-relaxed text-slate-400">
                    {t(service.descKey as any)}
                  </p>
                </div>

                {/* Learn More link indicator */}
                <div className={`mt-6 flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors cursor-pointer ${isRtl ? "justify-end" : "justify-start"}`}>
                  <span>{t("srvLearnMore")}</span>
                  <span className={`font-mono stroke-[3] transition-transform ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                    {isRtl ? "←" : "→"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
