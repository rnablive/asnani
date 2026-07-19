/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X, Activity, Scan, Heart, Sparkles } from "lucide-react";
import { soundSynth } from "./AudioController";

export default function VideoCard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    soundSynth.playClick();
    setIsOpen(true);
  };

  const handleClose = () => {
    soundSynth.playClick();
    setIsOpen(false);
  };

  return (
    <>
      {/* Small floating video card container */}
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        onMouseEnter={() => soundSynth.playHover()}
        onClick={handleOpen}
        className="relative h-28 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl cursor-pointer group shrink-0"
      >
        {/* Mock dental clinic blurred visual cover */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-950/20 mix-blend-overlay" />
          
          {/* Aesthetic grid lines mimicking surgical displays */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]" />
          
          {/* Simulated operating light glowing in background */}
          <div className="absolute top-2 left-6 h-12 w-12 rounded-full bg-cyan-400/10 blur-md animate-pulse" />
          <div className="absolute bottom-1 right-2 h-14 w-14 rounded-full bg-blue-500/10 blur-lg" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-3.5 z-10">
          {/* Live Scanner Tag */}
          <div className="flex items-center gap-1.5 self-start rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
            <span className="h-1 w-1 rounded-full bg-red-500 animate-ping" />
            <span>فيديو تعريفي</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col items-start leading-none text-right">
              <span className="font-sans text-xs font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                جولة في العيادة
              </span>
              <span className="font-sans text-[10px] text-slate-400 mt-1">
                مشاهدة التجهيزات والتقنيات
              </span>
            </div>

            {/* Glowing play circular button */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-[0_0_15px_rgba(0,207,255,0.4)] group-hover:shadow-[0_0_20px_rgba(0,207,255,0.7)] group-hover:scale-110 active:scale-90 transition-all duration-300">
              <Play className="h-4 w-4 fill-white ml-0.5 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Moving gloss light reflect effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      </motion.div>

      {/* Cinematic Modal Player Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
                <button
                  onClick={handleClose}
                  className="rounded-full border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
                <h3 className="font-sans text-base font-extrabold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                  <span>ابتسامة - جولة سينمائية تفاعلية بأحدث تقنيات طب الأسنان</span>
                </h3>
              </div>

              {/* Video Player Display (Simulating 3D medical diagnosis dashboard) */}
              <div className="relative aspect-video bg-[#020712] p-8 flex flex-col justify-between overflow-hidden">
                {/* Scan Overlay Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,207,255,0.05)_50%,rgba(0,0,0,0)_50%)] bg-[size:100%_4px] pointer-events-none" />
                
                {/* Abstract Interactive Holographic Medical Displays */}
                <div className="absolute top-12 left-12 flex flex-col gap-2 font-mono text-[10px] text-cyan-400 bg-slate-950/70 p-4 rounded-xl border border-cyan-500/30 backdrop-blur-md z-10">
                  <span className="text-white font-sans font-bold flex items-center gap-1">
                    <Scan className="h-3 w-3 text-cyan-400" /> تشخيص ثلاثي الأبعاد
                  </span>
                  <span>الجهد الكهربائي: 220V - مستقر</span>
                  <span>سرعة دوران الليزر: 15,000 RPM</span>
                  <span>معايرة بؤرة العدسة: نشط تلقائيًا</span>
                  <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <motion.div
                      animate={{ width: ["10%", "95%", "40%", "85%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      className="h-full bg-cyan-400"
                    />
                  </div>
                </div>

                <div className="absolute bottom-12 right-12 flex flex-col gap-2 font-mono text-[10px] text-pink-400 bg-slate-950/70 p-4 rounded-xl border border-pink-500/30 backdrop-blur-md z-10 text-right">
                  <span className="text-white font-sans font-bold flex items-center gap-1 justify-end">
                    <Heart className="h-3 w-3 text-pink-500 fill-pink-500/20" /> نبض المريض والمؤشرات
                  </span>
                  <span>معدل ضربات القلب: 72 BPM</span>
                  <span>مستوى الأكسجين: 99%</span>
                  <span>الضغط: 120/80 - طبيعي</span>
                </div>

                {/* Simulated 3D holographic animation in the video center */}
                <div className="relative z-10 m-auto flex flex-col items-center justify-center text-center max-w-md">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="relative flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-cyan-500/40 p-4"
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 rounded-full border border-pink-500/20"
                    />
                    <Sparkles className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,207,255,0.6)] animate-pulse" />
                  </motion.div>
                  <h4 className="font-sans text-lg font-bold text-white mt-6">
                    الابتسامة الرقمية الذكية
                  </h4>
                  <p className="font-sans text-xs text-slate-400 mt-2 leading-relaxed">
                    هنا نقوم بمحاكاة ابتسامتك المستقبلية بدقة متناهية قبل البدء بأي إجراء علاجي، لضمان رضاك المطلق وتناسق الملامح.
                  </p>
                </div>

                {/* Status Bar */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono mt-auto pt-4 border-t border-slate-900">
                  <span>تحديث البيانات: حي ومباشر</span>
                  <span>ابتسامة لطب الأسنان الحديث</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
