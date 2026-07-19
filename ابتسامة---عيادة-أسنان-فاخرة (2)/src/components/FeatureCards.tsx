/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, Shield, Users, Heart } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

export default function FeatureCards() {
  const { t } = useApp();

  const features = [
    {
      titleKey: "feat1Title",
      descKey: "feat1Desc",
      icon: Heart,
      glowColor: "group-hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]",
      borderColor: "hover:border-pink-500/30",
      iconColor: "text-pink-400",
      iconBg: "bg-pink-950/20",
    },
    {
      titleKey: "feat2Title",
      descKey: "feat2Desc",
      icon: Shield,
      glowColor: "group-hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]",
      borderColor: "hover:border-emerald-500/30",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/20",
    },
    {
      titleKey: "feat3Title",
      descKey: "feat3Desc",
      icon: Users,
      glowColor: "group-hover:shadow-[0_0_25px_rgba(30,136,255,0.3)]",
      borderColor: "hover:border-blue-500/30",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-950/20",
    },
    {
      titleKey: "feat4Title",
      descKey: "feat4Desc",
      icon: Sparkles,
      glowColor: "group-hover:shadow-[0_0_25px_rgba(0,207,255,0.3)]",
      borderColor: "hover:border-cyan-500/30",
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 select-none">
      {features.map((feature, idx) => {
        const IconComponent = feature.icon;
        return (
          <motion.div
            key={feature.titleKey}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 * idx, ease: "easeOut" }}
            onMouseEnter={() => {
              soundSynth.playHover();
            }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-950/30 p-5 text-center backdrop-blur-md transition-all duration-500 cursor-pointer ${feature.borderColor} ${feature.glowColor}`}
          >
            {/* Ambient Background Glow Spot */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-transparent to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Rotating & Glowing Icon container */}
            <div
              className={`mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 ${feature.iconBg}`}
            >
              <IconComponent
                className={`h-7 w-7 transition-transform duration-700 group-hover:rotate-[360deg] ${feature.iconColor}`}
              />
            </div>

            {/* Title & Description */}
            <h3 className="font-sans text-base font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
              {t(feature.titleKey as any)}
            </h3>
            <p className="mt-1 font-sans text-xs leading-relaxed text-slate-400">
              {t(feature.descKey as any)}
            </p>

            {/* Border Inner Beam Effect */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:w-full transition-all duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
}
