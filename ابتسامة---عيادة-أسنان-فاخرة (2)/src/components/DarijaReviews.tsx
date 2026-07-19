/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare, Volume2, Sparkles, CheckCircle2 } from "lucide-react";
import { soundSynth } from "./AudioController";

interface Review {
  id: number;
  name: string;
  city: string;
  text: string;
  avatar: string;
  rating: number;
}

const MOROCCAN_REVIEWS: Review[] = [
  {
    id: 1,
    name: "ياسين بنجلون",
    city: "مكناس",
    text: "بصراحة أول مرة نخرج من عند طبيب الأسنان وأنا مرتاح. المعاملة طوب، والتقنيات اللي عندهوم ف العيادة بحال إلى راك ف المستقبل. تبارك الله عليكوم!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5
  },
  {
    id: 2,
    name: "أمينة المرابط",
    city: "الرباط",
    text: "الخدمة زوينة بزاف وطاقم محترف. مشيت ندير تبييض الأسنان بالليزر والنتيجة بانت ف البلاصة وما كاين لا حريق لا والو. كنهنيهوم بزاف على الخدمة.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5
  },
  {
    id: 3,
    name: "عمر التازي",
    city: "فاس",
    text: "الطبيب محترف بزاف وكيشرح ليك كاع الخطوات بالذكاء الاصطناعي قبل ما يبدا. درت عندهوم زراعة الضرسة والحمد لله دازت العملية دغيا ودون ألم.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5
  },
  {
    id: 4,
    name: "سناء العلمي",
    city: "الدار البيضاء",
    text: "النتيجة فاقت كاع التوقعات ديالي! الابتسامة ديالي تبدلات 180 درجة من بعد ما درت الفينير زيركون. العيادة نقية بزاف والأجهزة ديال مكناس ف المستوى العالي.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    rating: 5
  }
];

export default function DarijaReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState<number | null>(null);

  // Auto scroll slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOROCCAN_REVIEWS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSpeakReview = (review: Review) => {
    soundSynth.playClick();
    
    // Stop any existing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (isPlayingVoice === review.id) {
      setIsPlayingVoice(null);
      return;
    }

    setIsPlayingVoice(review.id);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(review.text);
      utterance.lang = "ar-MA"; // Moroccan Arabic dialect setting
      
      // Try to find an Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((voice) => voice.lang.includes("ar"));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      
      utterance.rate = 0.9; // speak slightly slower for clarity

      utterance.onend = () => {
        setIsPlayingVoice(null);
        soundSynth.playHealing();
      };

      utterance.onerror = () => {
        setIsPlayingVoice(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback sound if text-to-speech not supported
      setTimeout(() => {
        setIsPlayingVoice(null);
        soundSynth.playHealing();
      }, 3000);
    }
  };

  return (
    <section id="reviews-section" className="relative w-full bg-[#020813] py-24 px-6 lg:px-16 overflow-hidden border-t border-white/5 select-none">
      {/* Light glow backdrops */}
      <div className="absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-1.5 text-xs text-cyan-400 backdrop-blur-md"
          >
            <Star className="h-4 w-4 animate-pulse text-cyan-400" />
            <span>شهادات حية من مكناس والمغرب</span>
          </motion.div>
          
          <h2 className="mt-4 font-sans text-3xl md:text-5xl font-extrabold text-white">
            آراء مرضانا بـ <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">الدارجة المغربية</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-sans text-sm text-slate-400 leading-relaxed">
            استمع مباشرة لتجارب مرضانا الحقيقية وتعرف على مدى رضاهم عن مستوى الخدمة والتقنيات ثلاثية الأبعاد الفاخرة.
          </p>
        </div>

        {/* Floating cards grid representing Moroccan satisfaction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Static Glass dashboard info */}
          <div className="lg:col-span-5 text-right flex flex-col items-start lg:items-end">
            <span className="font-mono text-xs text-cyan-400 tracking-wider mb-2 block">REVIEWS SATISFACTION INDEX</span>
            <h3 className="font-sans text-3xl font-black text-white leading-snug">رعاية استثنائية يثق بها الجميع</h3>
            <p className="mt-4 font-sans text-sm text-slate-400 leading-relaxed text-right lg:text-right">
              نسعى دائماً لتقديم تجربة علاجية لا مثيل لها فالمغرب. نحن فخورون بتحقيق نسبة رضاء تتعدى 99% بفضل الجودة والأدوات المبتكرة وراحة المريض التامة.
            </p>

            <div className="mt-8 flex gap-8">
              <div className="text-center bg-slate-950/50 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                <span className="font-mono text-2xl font-black text-cyan-400 block">+1500</span>
                <span className="font-sans text-[10px] text-slate-400 mt-1 block">مريض سعيد</span>
              </div>
              <div className="text-center bg-slate-950/50 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                <span className="font-mono text-2xl font-black text-emerald-400 block">4.9/5</span>
                <span className="font-sans text-[10px] text-slate-400 mt-1 block">تقييم جوجل مابز</span>
              </div>
            </div>
          </div>

          {/* Interactive Floating glass cards carousel */}
          <div className="lg:col-span-7 flex justify-center relative min-h-[300px]">
            
            {/* Visual background circle glow */}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full max-w-xl relative">
              {MOROCCAN_REVIEWS.map((review, idx) => {
                const isActive = activeIndex === idx;
                
                return (
                  <AnimatePresence key={review.id}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -15 }}
                        transition={{ duration: 0.45 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="absolute inset-0 w-full rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(0,207,255,0.05)] cursor-pointer select-none text-right"
                      >
                        {/* Upper row: Avatar & Stars */}
                        <div className="flex items-center justify-between">
                          
                          {/* Audio Speak button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakReview(review);
                            }}
                            className={`flex items-center justify-center h-10 w-10 rounded-full border transition-all duration-300 cursor-pointer ${
                              isPlayingVoice === review.id
                                ? "bg-cyan-400 text-slate-950 border-cyan-400 animate-pulse shadow-[0_0_15px_rgba(0,207,255,0.4)]"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            <Volume2 className="h-4.5 w-4.5" />
                          </button>

                          {/* Avatar & Patient Details */}
                          <div className="flex items-center gap-3.5">
                            <div className="text-right">
                              <h4 className="font-sans text-sm font-black text-white">{review.name}</h4>
                              <span className="font-sans text-[10px] text-cyan-400 flex items-center gap-1.5 justify-end mt-0.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                                {review.city}، المغرب
                              </span>
                            </div>
                            <img
                              src={review.avatar}
                              alt={review.name}
                              referrerPolicy="no-referrer"
                              className="h-12 w-12 rounded-full object-cover border-2 border-cyan-500/20"
                            />
                          </div>

                        </div>

                        {/* Mid Row: Written Patient text in Moroccan Darija */}
                        <div className="my-6">
                          <p className="font-sans text-sm md:text-base text-slate-100 leading-relaxed font-medium">
                            "{review.text}"
                          </p>
                        </div>

                        {/* Lower Row: Gold Stars feedback */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <span className="font-mono text-[9px] text-slate-500">تم التحقق من زيارة العيادة</span>
                          <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
