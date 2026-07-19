/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check, ShieldCheck, X } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

interface GlassToothCardProps {
  onClose: () => void;
}

export default function GlassToothCard({ onClose }: GlassToothCardProps) {
  const { t } = useApp();

  const listItems = [
    { textKey: "tip1Title", descKey: "tip1Desc" },
    { textKey: "tip2Title", descKey: "tip2Desc" },
    { textKey: "tip3Title", descKey: "tip3Desc" },
    { textKey: "tip4Title", descKey: "tip4Desc" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => soundSynth.playHover()}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group relative max-w-[280px] rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,207,255,0.25)] select-none"
    >
      {/* Decorative Top Accent line */}
      <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          soundSynth.playClick();
          onClose();
        }}
        className="absolute top-4 left-4 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer z-30"
        title={t("close")}
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Floating Sparkle Icon */}
      <div className="absolute -top-3.5 -right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 p-1.5 text-slate-950 shadow-[0_0_15px_rgba(0,207,255,0.6)]">
        <ShieldCheck className="h-4 w-4" />
      </div>

      <h3 className="font-sans text-lg font-extrabold text-white">{t("yourDentalHealth")}</h3>
      <p className="mt-1 font-sans text-xs text-slate-400">{t("dailyTipsSubtitle")}</p>

      {/* Divider */}
      <div className="my-4 h-[1px] w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />

      <ul className="flex flex-col gap-3.5">
        {listItems.map((item, idx) => (
          <li key={item.textKey} className="flex items-start gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-950/50 text-cyan-400 shadow-[0_0_5px_rgba(0,207,255,0.2)]">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-sans text-sm font-bold text-slate-200 transition-colors duration-300 group-hover:text-white">
                {t(item.textKey as any)}
              </span>
              <span className="font-sans text-[10px] text-slate-400 mt-0.5">
                {t(item.descKey as any)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
