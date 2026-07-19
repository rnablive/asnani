/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Phone, Mail, MapPin, CheckCircle, Sparkles, User, ShieldCheck } from "lucide-react";
import { soundSynth } from "./AudioController";

export default function ContactSection() {
  const [selectedTreatment, setSelectedTreatment] = useState("عدسات الزيركون الفاخرة");
  const [selectedDoctor, setSelectedDoctor] = useState("د. سمير كمال");
  const [selectedDate, setSelectedDate] = useState("الأحد - 19 يوليو");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const treatments = [
    "عدسات الزيركون الفاخرة",
    "زراعة الأسنان الرقمية",
    "التقويم الشفاف الذكي",
    "تبييض الأسنان بالضوء البارد",
    "علاج الجذور بالليزر",
  ];

  const doctors = ["د. سمير كمال", "د. ليلى عبد العزيز", "د. يوسف الغامدي"];

  const dates = [
    { day: "الأحد", date: "19 يوليو" },
    { day: "الاثنين", date: "20 يوليو" },
    { day: "الثلاثاء", date: "21 يوليو" },
    { day: "الأربعاء", date: "22 يوليو" },
    { day: "الخميس", date: "23 يوليو" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playClick();
    if (!fullName || !phoneNumber) {
      alert("الرجاء ملء جميع الحقول المطلوبة لتأكيد حجزك الإلكتروني.");
      return;
    }

    // Generate a secure simulation booking ticket number
    const randId = "EBT-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randId);
    setIsSuccess(true);
    soundSynth.playHealing(); // play sparkle sounds on successful booking
  };

  const handleCloseSuccess = () => {
    soundSynth.playClick();
    setIsSuccess(false);
    setFullName("");
    setPhoneNumber("");
  };

  return (
    <>
      <section id="contact" className="relative py-24 px-6 lg:px-16 border-t border-slate-900 bg-[#020710] select-none">
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
            <span>الحجز الإلكتروني والاتصال السريع</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-sans text-3xl md:text-4xl font-extrabold text-white"
          >
            ابدأ رحلة ابتسامتك المثالية اليوم
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl font-sans text-sm text-slate-400 leading-relaxed"
          >
            احجز موعد استشارتك المجانية الأولى رقمياً وبأقل من دقيقة، وسيتواصل معك منسقو العلاج لتأكيد الحجز وتحديد المتطلبات.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Right Column: Contact Details & Map Info */}
          <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1 text-right">
            <div className="rounded-3xl border border-white/5 bg-slate-950/40 p-8 backdrop-blur-3xl flex flex-col gap-6">
              <h3 className="font-sans text-lg font-extrabold text-white">معلومات العيادة العامة</h3>
              
              <div className="flex gap-4 items-start text-right">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/20 text-cyan-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start leading-none mt-1">
                  <span className="font-sans text-xs text-slate-400">اتصال مباشر (الهاتف والواتساب)</span>
                  <span className="font-mono text-base font-bold text-white mt-1.5" dir="ltr">
                    +212 649 66 19 63
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-right">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/20 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start leading-none mt-1">
                  <span className="font-sans text-xs text-slate-400">البريد الإلكتروني للعيادة</span>
                  <span className="font-mono text-base font-bold text-white mt-1.5">
                    ahmedhendiya@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-right">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/20 text-cyan-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start leading-none mt-1">
                  <span className="font-sans text-xs text-slate-400">عنوان المقر الرئيسي</span>
                  <span className="font-sans text-xs text-white font-semibold mt-1.5 leading-relaxed">
                    شارع الجيش الملكي، حمرية، مكناس، المغرب
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-slate-800/40" />

              {/* Emergency info badge */}
              <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-right flex flex-col gap-1">
                <span className="font-sans text-xs font-bold text-red-400">ملاحظة الحالات العاجلة والطارئة:</span>
                <p className="font-sans text-[11px] leading-relaxed text-slate-300">
                  تستقبل عيادتنا الحالات الحرجة وآلام الأسنان الحادة 24 ساعة طوال أيام الأسبوع من خلال قسم الطوارئ الفوري بدون الحاجة لموعد مسبق.
                </p>
              </div>
            </div>
          </div>

          {/* Left Column: Interactive Schedule Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/5 bg-slate-950/40 p-8 backdrop-blur-3xl text-right flex flex-col gap-6"
            >
              <h3 className="font-sans text-lg font-extrabold text-white">نموذج حجز المواعيد الفوري</h3>

              {/* 1. Select Treatment */}
              <div className="flex flex-col gap-2">
                <span className="font-sans text-xs font-bold text-slate-300">اختر نوع العلاج التجميلي المطلوب:</span>
                <div className="flex flex-wrap gap-2 justify-start mt-1">
                  {treatments.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        soundSynth.playClick();
                        setSelectedTreatment(t);
                      }}
                      onMouseEnter={() => soundSynth.playHover()}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        selectedTreatment === t
                          ? "border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_10px_rgba(0,207,255,0.2)]"
                          : "border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Select Doctor */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-sans text-xs font-bold text-slate-300">اختر الطبيب الاستشاري المفضل:</span>
                <div className="flex flex-wrap gap-2 justify-start mt-1">
                  {doctors.map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => {
                        soundSynth.playClick();
                        setSelectedDoctor(doc);
                      }}
                      onMouseEnter={() => soundSynth.playHover()}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                        selectedDoctor === doc
                          ? "border-blue-500 bg-blue-950/30 text-blue-400 shadow-[0_0_10px_rgba(30,136,255,0.2)]"
                          : "border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {doc}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Select Date */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-sans text-xs font-bold text-slate-300">حدد التاريخ واليوم المناسب لك:</span>
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {dates.map((d) => {
                    const id = `${d.day} - ${d.date}`;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          soundSynth.playClick();
                          setSelectedDate(id);
                        }}
                        onMouseEnter={() => soundSynth.playHover()}
                        className={`rounded-xl border p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          selectedDate === id
                            ? "border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_10px_rgba(0,207,255,0.2)]"
                            : "border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <span className="font-sans text-[11px] font-bold">{d.day}</span>
                        <span className="font-sans text-[9px] text-slate-400 mt-1">{d.date}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-xs font-bold text-slate-300">الاسم الثلاثي بالكامل:</span>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكريم"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all text-right"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-sans text-xs font-bold text-slate-300">رقم الهاتف الجوال:</span>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="06xxxxxxxx"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all text-left font-mono"
                      dir="ltr"
                    />
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                onMouseEnter={() => soundSynth.playHover()}
                className="group relative overflow-hidden flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-base font-extrabold text-white shadow-xl hover:shadow-2xl hover:scale-[1.015] active:scale-95 transition-all duration-300 mt-4 cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
                <span>تأكيد الحجز الفوري وإرسال التفاصيل</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>

      {/* Booking Confirmation Success Dialog Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={handleCloseSuccess}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 text-center shadow-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>

              <h3 className="font-sans text-xl font-black text-white">تم تأكيد حجزك الإلكتروني!</h3>
              <p className="font-sans text-xs text-slate-400 mt-2">
                شكراً لاختيارك عيادتنا الفاخرة. تم تسجيل الموعد بنجاح وإرسال رسالة SMS برابط التأكيد والتذاكر الطبية لجوالك المعتمد.
              </p>

              {/* Booking Pass Ticket Card */}
              <div className="my-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-right flex flex-col gap-2 relative">
                <div className="absolute top-3.5 left-4 flex items-center gap-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 text-[9px] text-cyan-400 font-bold">
                  <ShieldCheck className="h-3 w-3" />
                  <span>مؤكد رقمياً</span>
                </div>

                <div className="font-mono text-[10px] text-slate-500">
                  رقم التذكرة: <span className="text-white font-bold">{ticketId}</span>
                </div>
                <div className="h-[1px] w-full bg-slate-800/40 my-1" />
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">الاسم الكريم:</span>
                    <span className="text-white font-bold block mt-0.5">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الهاتف المعتمد:</span>
                    <span className="text-white font-mono font-bold block mt-0.5" dir="ltr">{phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">نوع الإجراء الطبي:</span>
                    <span className="text-cyan-400 font-bold block mt-0.5">{selectedTreatment}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الطبيب الاستشاري:</span>
                    <span className="text-white font-bold block mt-0.5">{selectedDoctor}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">الموعد المحدد:</span>
                    <span className="text-cyan-300 font-bold block mt-0.5">{selectedDate}</span>
                  </div>
                </div>

                {/* Simulated Ticket cutouts in sides */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#020710] border-r border-white/5" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#020710] border-l border-white/5" />
              </div>

              <button
                onClick={handleCloseSuccess}
                className="w-full h-12 rounded-xl bg-slate-900 text-sm font-bold text-white border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                العودة للتصفح
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
