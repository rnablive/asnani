/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Award, GraduationCap, Sparkles, Star } from "lucide-react";
import { soundSynth } from "./AudioController";

export default function DoctorsSection() {
  const doctors = [
    {
      name: "د. سمير كمال",
      role: "كبير استشاريي زراعة وتجميل الأسنان",
      degree: "دكتوراه جراحة الفم والأسنان - جامعة غوتنبرغ، السويد",
      experience: "أكثر من 18 عاماً من الخبرة السريرية في السويد والشرق الأوسط",
      specialty: "زراعة الأسنان الفورية وتصميم ابتسامة هوليوود الرقمية",
      avatarBg: "from-blue-600 to-cyan-500",
      skills: ["زراعة رقمية", "فينير تجميلي", "جراحة ليزرية"],
    },
    {
      name: "د. ليلى عبد العزيز",
      role: "استشارية تقويم وتعديل رصف الأسنان",
      degree: "زمالة الكلية الملكية البريطانية لتقويم الأسنان (FDSRCS)",
      experience: "خبرة 12 عاماً في التقويم الشفاف الرقمي وهندسة الإطباق",
      specialty: "تقويم الأسنان اللامرئي والتقويم الوقائي للأطفال والمراهقين",
      avatarBg: "from-purple-600 to-indigo-500",
      skills: ["Invisalign", "تقويم وقائي", "علاج العضة"],
    },
    {
      name: "د. يوسف الغامدي",
      role: "استشاري علاج الجذور والتعقيم الميكروسكوبي",
      degree: "ماجستير علاج العصب المجهري - جامعة تافتس، بوسطن، أمريكا",
      experience: "خبرة 10 سنوات في العلاج المجهري الدقيق وعلاجات الليزر",
      specialty: "سحب العصب وعلاج جذور الأسنان المعقدة تحت المجهر الرقمي",
      avatarBg: "from-emerald-600 to-teal-500",
      skills: ["علاج مجهري", "تنظيف جذور", "ليزر معقم"],
    },
  ];

  return (
    <section id="doctors" className="relative py-24 px-6 lg:px-16 border-t border-slate-900 select-none">
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
            <span>نخبة الأطباء والاستشاريين</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-sans text-3xl md:text-4xl font-extrabold text-white"
          >
            استشاريون دوليون بانتظار خدمتك
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl font-sans text-sm text-slate-400 leading-relaxed"
          >
            نضم في عيادتنا نخبة من الكفاءات الطبية والأساتذة الحاصلين على أرقى الشهادات العالمية لتوفير أقصى درجات الطمأنينة والدقة العلاجية.
          </motion.p>
        </div>

        {/* Doctors Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {doctors.map((doc, idx) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * idx, ease: "easeOut" }}
              onMouseEnter={() => soundSynth.playHover()}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative flex flex-col rounded-3xl border border-white/5 bg-slate-950/40 p-6 text-right backdrop-blur-3xl transition-all duration-500 hover:border-cyan-500/20 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            >
              {/* Doctor Abstract Profile Picture Mockup */}
              <div className="relative mb-6 h-48 w-full rounded-2xl overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-800">
                <div className={`absolute inset-0 bg-gradient-to-tr ${doc.avatarBg} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                {/* Clean medical monogram vector graphic representing doctor */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`h-20 w-20 rounded-full bg-gradient-to-tr ${doc.avatarBg} p-0.5 shadow-lg flex items-center justify-center mb-2`}>
                    <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center font-sans text-xl font-extrabold text-white">
                      {doc.name.split(" ")[1].slice(0, 3)}
                    </div>
                  </div>
                  
                  {/* Star review overlay */}
                  <div className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-0.5 border border-amber-500/20">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="font-mono text-[10px] font-bold text-amber-400">4.9/5 (تقييم المرضى)</span>
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="font-sans text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                {doc.name}
              </h3>
              <span className="font-sans text-xs font-bold text-cyan-400 mt-1">
                {doc.role}
              </span>

              {/* Divider */}
              <div className="my-4 h-[1px] w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />

              {/* Qualifications */}
              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex gap-2.5 items-start">
                  <GraduationCap className="h-4.5 w-4.5 shrink-0 text-slate-400 mt-0.5" />
                  <span className="font-sans text-xs text-slate-300 leading-relaxed">
                    {doc.degree}
                  </span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Award className="h-4.5 w-4.5 shrink-0 text-slate-400 mt-0.5" />
                  <span className="font-sans text-xs text-slate-300 leading-relaxed">
                    {doc.specialty}
                  </span>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="mt-6 flex flex-wrap gap-2 justify-start">
                {doc.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-slate-800 bg-slate-900/40 px-2.5 py-1 text-[10px] font-bold text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
