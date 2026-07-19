/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Volume2, Cpu, Mic, VolumeX, Sparkles, Smile } from "lucide-react";
import { soundSynth } from "./AudioController";

interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const DARIJA_ANSWERS: Record<string, string> = {
  "فين كاينة العيادة؟": "العيادة ديالنا كاينة ف قلب مكناس، بضبط ف حي حمرية، شارع الجيش الملكي. الموقع ديالنا ساهل بزاف ومجهر بأحدث تكنولوجيا!",
  "بشحال زراعة الأسنان؟": "تكلفة زراعة الأسنان كتبدا من 5000 درهم على حسب حالة العظم والنوعية ديال الغرسة المستعملة. كولشي كيدوز بالليزر وبدون ألم.",
  "كيفاش نحجز موعد؟": "تقدر تحجز موعد مباشرة عبر الضغط على زر الواتساب أو الاتصال الهاتفي بالعيادة، الطاقم ديالنا غادي يجاوبك ف البلاصة ويحدد ليك الوقت المناسب.",
  "شنو هو التوأم الرقمي؟": "التوأم الرقمي هو تقنية كتخلينا نصنعو مجسم ثلاثي الأبعاد لأسنانك بالذكاء الاصطناعي، باش الطبيب يفحص كاع المشاكل بدقة قبل ما يبدا العلاج.",
  "default": "مرحباً بك ف عيادة الدكتور أحمد هندية لطب الأسنان! أنا هنا باش نجاوبك على كاع الاستفسارات ديالك بخصوص العلاجات والتكاليف بالدارجة المغربية."
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "ai", text: "أهلاً بك! أنا المساعد الهولوغرافي الذكي لعيادة د. هندية. كيف نقدر نعاونك اليوم؟" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate holographic eye tracking (reacts to mouse movement)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setEyePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleOpenToggle = () => {
    soundSynth.playClick();
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    soundSynth.playClick();

    const newMsgs = [...messages, { id: Date.now(), sender: "user" as const, text }];
    setMessages(newMsgs);
    setInputText("");

    // Look up answer
    setTimeout(() => {
      let responseText = DARIJA_ANSWERS[text];
      if (!responseText) {
        // Simple match
        const found = Object.keys(DARIJA_ANSWERS).find((k) => text.includes(k) || k.includes(text));
        responseText = found ? DARIJA_ANSWERS[found] : DARIJA_ANSWERS["default"];
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai" as const, text: responseText }
      ]);
      soundSynth.playHealing();
    }, 1000);
  };

  const handleVoiceSpeak = (text: string) => {
    soundSynth.playClick();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-MA";
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.includes("ar"));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Laser Assistant Button Node */}
      <div className="fixed bottom-6 left-6 z-50 select-none">
        <motion.button
          onClick={handleOpenToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 border border-cyan-400/40 text-cyan-400 shadow-[0_0_25px_rgba(0,207,255,0.4)] cursor-pointer overflow-hidden group"
        >
          {/* Breathing background halo */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping pointer-events-none" />

          {/* Abstract Facial/Eye Tracking Indicator */}
          <div className="relative flex flex-col items-center justify-center gap-1">
            <div className="flex gap-2">
              <motion.div
                style={{ x: eyePos.x, y: eyePos.y }}
                className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,207,255,1)]"
              />
              <motion.div
                style={{ x: eyePos.x, y: eyePos.y }}
                className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,207,255,1)]"
              />
            </div>
            {/* Mouth breathing line */}
            <motion.div
              animate={{ width: [12, 18, 12] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-[2px] bg-cyan-400/80 rounded-full"
            />
          </div>
        </motion.button>
      </div>

      {/* Holographic Assistant Chat Drawer Portal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-6 z-50 w-[350px] md:w-[380px] h-[500px] rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,207,255,0.15)] flex flex-col justify-between overflow-hidden select-none text-right"
          >
            {/* Visual tech matrix scanned lines backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,207,255,0.015)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />

            {/* Chat Drawer Header */}
            <div className="bg-slate-950 border-b border-white/5 p-4 flex items-center justify-between z-10">
              <button
                onClick={handleOpenToggle}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <h4 className="font-sans text-xs font-black text-white">طبيب الأسنان الافتراضي</h4>
                  <span className="font-sans text-[9px] text-cyan-400 flex items-center gap-1 justify-end mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    المسح والتحليل مفعّل
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <Cpu className="h-4.5 w-4.5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 z-10 scrollbar-thin">
              {messages.map((m) => {
                const isAi = m.sender === "ai";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 max-w-[85%] ${
                      isAi ? "self-start text-right flex-row-reverse" : "self-end text-right"
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed ${
                        isAi
                          ? "bg-white/5 border border-white/5 text-slate-100"
                          : "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white"
                      }`}
                    >
                      <p>{m.text}</p>
                      
                      {/* Hear speech synthesis button */}
                      {isAi && (
                        <button
                          onClick={() => handleVoiceSpeak(m.text)}
                          className={`mt-2 flex items-center gap-1 text-[9px] font-sans transition-all cursor-pointer ${
                            isSpeaking ? "text-cyan-400" : "text-slate-500 hover:text-cyan-400"
                          }`}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          {isSpeaking ? "جاري القراءة..." : "استمع للرد"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Prompt Suggestion Chips for Moroccan Darija */}
            <div className="p-3 bg-black/40 border-t border-white/5 z-10 flex flex-wrap gap-1.5 justify-end">
              {Object.keys(DARIJA_ANSWERS)
                .filter((k) => k !== "default")
                .map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-lg border border-white/5 bg-slate-900/60 hover:bg-slate-900 text-[10px] text-slate-300 font-sans cursor-pointer transition-colors"
                  >
                    {q}
                  </button>
                ))}
            </div>

            {/* Chat Drawer Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 bg-slate-950 border-t border-white/5 z-10 flex gap-2"
            >
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
              
              <input
                type="text"
                placeholder="اكتب استفسارك هنا بالدارجة المغربية..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 text-right outline-none focus:border-cyan-500/40"
              />
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
