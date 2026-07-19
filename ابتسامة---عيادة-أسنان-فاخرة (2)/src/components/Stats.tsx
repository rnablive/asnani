/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { Award, HeartHandshake, Smile, Stethoscope } from "lucide-react";
import { soundSynth } from "./AudioController";

interface StatItemProps {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatCounter({ icon: Icon, value, suffix, label, delay }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 2000; // 2 seconds
    const incrementTime = Math.max(Math.floor(totalDuration / end), 20);
    
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        start += Math.ceil(end / 40); // larger steps for speed
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      className="flex flex-1 items-center gap-4 px-6 py-4 justify-center md:justify-start"
    >
      {/* Icon Container */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900/40 text-cyan-400 border border-white/5 shadow-[0_0_10px_rgba(0,207,255,0.1)]">
        <Icon className="h-6 w-6" />
      </div>

      {/* Numerical Data */}
      <div className="flex flex-col items-start leading-none text-right">
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-3xl font-extrabold text-white">
            {count.toLocaleString()}
          </span>
          <span className="font-sans text-xl font-bold text-cyan-400">
            {suffix}
          </span>
        </div>
        <span className="font-sans text-xs font-medium text-slate-400 mt-1">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      onMouseEnter={() => soundSynth.playHover()}
      className="relative w-full rounded-3xl border border-white/10 bg-slate-950/25 shadow-2xl backdrop-blur-3xl overflow-hidden select-none"
    >
      {/* Visual Accent Layer */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800/40 p-1">
        <StatCounter
          icon={HeartHandshake}
          value={98}
          suffix="%"
          label="رضا المرضى التام"
          delay={0.1}
        />
        <StatCounter
          icon={Smile}
          value={15000}
          suffix="+"
          label="ابتسامة سعيدة جديدة"
          delay={0.2}
        />
        <StatCounter
          icon={Award}
          value={10}
          suffix="+"
          label="سنوات الخبرة الدولية"
          delay={0.3}
        />
        <StatCounter
          icon={Stethoscope}
          value={25}
          suffix="+"
          label="طبيب واستشاري متخصص"
          delay={0.4}
        />
      </div>
    </motion.div>
  );
}
