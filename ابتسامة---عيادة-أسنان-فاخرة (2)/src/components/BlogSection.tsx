/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Calendar, Clock, Sparkles, X, ChevronLeft, ArrowRight, Share2, Bookmark, Heart } from "lucide-react";
import { soundSynth } from "./AudioController";
import { useApp } from "../context/AppContext";

interface Article {
  id: string;
  image: string;
  beforeFilter?: string;
  afterFilter?: string;
  // Dynamic keys to lookup translations
  titleKey: "blogArt1Title" | "blogArt2Title" | "blogArt3Title";
  descKey: "blogArt1Desc" | "blogArt2Desc" | "blogArt3Desc";
  tagKey: "blogArt1Cat" | "blogArt2Cat" | "blogArt3Cat";
  paragraphsAr: string[];
  paragraphsEn: string[];
}

const ARTICLES: Article[] = [
  {
    id: "ai-dentistry",
    titleKey: "blogArt1Title",
    descKey: "blogArt1Desc",
    tagKey: "blogArt1Cat",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    paragraphsAr: [
      "في عيادتنا، لم يعد تصميم الابتسامة عملية اختيار عشوائية، بل علم هندسي دقيق يقوده الذكاء الاصطناعي. نستخدم خوارزميات الذكاء الاصطناعي المتقدمة لتحليل أكثر من 40 إحداثية هندسية في الوجه البشري، بدءًا من المسافة بين العينين، زاوية الشفاه، لون البشرة، وحجم عظام الفك.",
      "عندما يزورنا المريض، نقوم بالتقاط صور رقمية ثلاثية الأبعاد ثلاثية الأبعاد لأسنان الفكين. يقوم المحرك الطبي الذكي بمطابقة هذه البيانات مع آلاف الحالات السابقة الناجحة لتوليد نموذج ثلاثي الأبعاد يُعرف بالـ 'التوأم الرقمي'. هذا النموذج يتيح للمريض رؤية صورته المستقبلية بالابتسامة الجديدة بدقة فائقة تصل إلى 99% قبل برد مليمتر واحد من الأسنان.",
      "تساعد هذه التقنية الدكتور أحمد هندية على تفادي الأخطاء البشرية بالكامل وتحديد الارتفاع المثالي لعدسات الفينير والزوايا البصرية لارتصاف الأسنان بشكل طبيعي تماماً ومتناغم مع حركة عضلات الوجه عند الضحك أو التحدث. إنها ثورة حقيقية تجمع بين الرعاية الطبية الفائقة والابتكار التكنولوجي الاستثنائي."
    ],
    paragraphsEn: [
      "In our clinic, smile design is no longer a random choice, but a precise engineering science led by AI. We use advanced machine learning algorithms to analyze more than 40 geometric coordinates of the human face, including the interpupillary distance, lip angles, skin tone, and jawbone structure.",
      "When a patient visits us, we take high-resolution 3D digital scans of both jaws. Our smart medical engine matches this data with thousands of previously successful cases to generate a personalized digital smile model. This allows the patient to preview their future smile with up to 99% accuracy before starting any actual tooth modification.",
      "This technology helps Dr. Ahmed Hendia completely prevent human errors and determine the ideal length and optical properties of veneers. It delivers a perfect, natural look that harmonizes with facial muscle dynamics during laughing or speaking, representing a true digital revolution in aesthetics."
    ]
  },
  {
    id: "microscope-roots",
    titleKey: "blogArt2Title",
    descKey: "blogArt2Desc",
    tagKey: "blogArt2Cat",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    paragraphsAr: [
      "علاج عصب الأسنان كان في الماضي مصدر قلق كبير للمرضى، لكن دخول التكنولوجيا المجهرية الدقيقة غير هذا المفهوم كلياً. في عيادتنا، نعتمد على ميكروسكوبات طبية ألمانية متطورة توفر تكبيراً بؤرياً يصل إلى 25 ضعفاً مع إضاءة ليزرية مدمجة لرؤية أدق التفاصيل داخل القنوات العصبية.",
      "القنوات العصبية للأسنان غالباً ما تكون دقيقة كالشعرة ومتفرعة بشكل معقد. بدون استخدام الميكروسكوب، قد يغفل الطبيب عن تنظيف قناة فرعية، مما يؤدي إلى فشل العلاج لاحقاً وحدوث التهابات مزمنة. بفضل الميكروسكوب المجهري، نستطيع تنظيف وتعقيم كامل الأقنية بدقة فائقة وبشكل آمن تماماً.",
      "يساهم العلاج المجهري في الحفاظ على أكبر قدر ممكن من نسج السن الطبيعية وتجنب الإضعاف غير المبرر لهيكل السن. نستخدم مع هذا النظام تقنية التعقيم الحراري الكيميائي بالليزر لضمان القضاء التام على الجراثيم داخل العصب، لتكون نسبة نجاح العلاج أعلى من 98% وبدون أي ألم يذكر أثناء أو بعد الجلسة."
    ],
    paragraphsEn: [
      "Root canal treatment was once a major source of anxiety for patients, but microscopic technology has completely changed this. In our clinic, we rely on advanced German microscopes that provide up to 25x magnification with integrated laser light to illuminate the microscopic anatomy of canal systems.",
      "Dental root canals are often as thin as a hair and branch out in complex patterns. Without a microscope, a dentist might miss a secondary canal, leading to eventual treatment failure and chronic inflammation. With microscopic magnification, we can clean and debride the entire system with total precision.",
      "Microscopic endodontics preserves as much natural tooth structure as possible. We combine this with laser-activated irrigation to ensure complete disinfection. This elevates our clinical success rate to over 98% with zero discomfort during or after the appointment."
    ]
  },
  {
    id: "zircon-veneers",
    titleKey: "blogArt3Title",
    descKey: "blogArt3Desc",
    tagKey: "blogArt3Cat",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80",
    paragraphsAr: [
      "تعتبر عدسات الزيركون ميكرو-ثين (Micro-Thin Zirconia) الطفرة الأحدث في عالم تجميل الأسنان وتصميم ابتسامات هوليوود الملكية. تتميز هذه العدسات بسمكها البالغ غاية في الرقة (0.2 ملم فقط) وهو ما يعادل سمك عدسات العين اللاصقة، مما يمكننا من تركيبها بدون الحاجة لبرد الأسنان أو إلحاق الضرر بطبقة المينا الثمينة.",
      "على الرغم من رقتها المتناهية، إلا أن الزيركون مادة فائقة القوة والصلابة، حيث تتحمل قوى المضغ الشديدة وتتميز بمقاومة استثنائية للتصبغ والتكسر. تعكس هذه العدسات الضوء تماماً مثل الأسنان الطبيعية، وتمنح الابتسامة لمعاناً طبيعياً خالياً من المظهر الطباشيري المصطنع.",
      "يتم تصنيع عدسات الزيركون بالكامل داخل عيادتنا باستخدام جهاز الخراطة الرقمي CAD/CAM فائق الدقة الموجه بالحاسوب. نضمن للمريض ملاءمة ميكرومترية تمنع تراكم بقايا الطعام أو التهاب اللثة، مع عمر افتراضي يدوم لعقود لتبدو الأسنان غاية في التألق والجاذبية وصحية بالكامل."
    ],
    paragraphsEn: [
      "Micro-Thin Zirconia veneers are the latest milestone in cosmetic dentistry and celebrity smile makeovers. These ultra-thin veneers measure only 0.2mm, matching the thickness of contact lenses. This allows us to bond them directly with minimal to no tooth preparation, conserving valuable enamel.",
      "Despite being razor-thin, Zirconia is exceptionally durable. It resists extreme chewing forces and staining. These veneers capture and reflect light exactly like real teeth, offering a beautiful, glossy translucency instead of a flat, chalky artificial white appearance.",
      "Our Zirconia veneers are designed and milled in-house using computerized CAD/CAM equipment. We achieve micrometric margins that prevent bacterial accumulation and gum irritation, ensuring decades of comfortable, healthy, and gorgeous smiles."
    ]
  }
];

function ArticleInlineMedia({ articleId, isRtl }: { articleId: string; isRtl: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);

  const mediaData: Record<string, {
    img: string;
    captionAr: string;
    captionEn: string;
    badgeAr: string;
    badgeEn: string;
  }> = {
    "ai-dentistry": {
      img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      captionAr: "شاشة التخطيط ثلاثي الأبعاد وجهاز الخراطة الرقمي CAD/CAM لتصميم الابتسامة الماسية في العيادة.",
      captionEn: "3D smile planning screen and digital CAD/CAM milling interface for designing diamond veneers.",
      badgeAr: "مختبرنا الرقمي",
      badgeEn: "Our Digital Lab"
    },
    "microscope-roots": {
      img: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80",
      captionAr: "استخدام الميكروسكوب الألماني المتطور لتكبير قنوات عصب الأسنان بدقة تبلغ 25 ضعفاً.",
      captionEn: "Utilizing advanced German microscope to magnify root canals up to 25x with laser illumination.",
      badgeAr: "علاج مجهري",
      badgeEn: "Microscopic Treatment"
    },
    "zircon-veneers": {
      img: "https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&w=800&q=80",
      captionAr: "عدسات الزيركون فائقة الرقة ومقاومة التصبغات مصممة بالكامل عبر الحاسوب.",
      captionEn: "Ultra-thin, stain-resistant Zirconia veneers fully engineered and milled via computer.",
      badgeAr: "عدسات زيركون",
      badgeEn: "Zirconia Veneers"
    }
  };

  const current = mediaData[articleId];
  if (!current) return null;

  return (
    <div className="my-6 rounded-2xl border border-white/10 overflow-hidden bg-slate-950/60 shadow-xl">
      <div className="relative h-60 w-full flex items-center justify-center bg-slate-900 overflow-hidden group">
        {!imgFailed ? (
          <img
            src={current.img}
            alt={isRtl ? current.captionAr : current.captionEn}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="relative h-28 w-28 rounded-full border border-cyan-500/30 flex items-center justify-center animate-pulse">
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20 animate-spin-slow" />
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00cfff]" />
              <div className="absolute w-full h-[1px] bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.8)] top-1/2 left-0 -translate-y-1/2 animate-bounce" />
            </div>
            <div className="absolute bottom-4 flex gap-4 font-mono text-[9px] text-cyan-400/80">
              <span>[ CAD/CAM SIMULATION_ACTIVE ]</span>
              <span>[ RESOLUTION: 0.01MM ]</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <span className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} rounded-full px-3 py-1 text-[10px] font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-300`}>
          {isRtl ? current.badgeAr : current.badgeEn}
        </span>
      </div>
      <div className={`p-4 bg-slate-950 border-t border-white/5 text-xs text-slate-400 leading-relaxed font-sans ${isRtl ? "text-right" : "text-left"}`}>
        {isRtl ? current.captionAr : current.captionEn}
      </div>
    </div>
  );
}

export default function BlogSection() {
  const { t, locale, isEmergency } = useApp();
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleOpenArticle = (art: Article) => {
    soundSynth.playHealing();
    setActiveArticle(art);
  };

  const handleCloseModal = () => {
    soundSynth.playClick();
    setActiveArticle(null);
  };

  const showToast = (msg: string) => {
    soundSynth.playClick();
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const isRtl = locale === "ar";

  return (
    <section id="blog" className="relative py-24 px-6 lg:px-16 border-t border-slate-900 select-none">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs backdrop-blur-md transition-colors duration-1000 ${
              isEmergency ? "border-red-500/20 bg-red-950/20 text-red-400" : "border-cyan-500/10 bg-cyan-950/10 text-cyan-400"
            }`}
          >
            <Sparkles className={`h-3 w-3 transition-colors duration-1000 ${isEmergency ? "text-red-400 animate-spin" : "text-cyan-400"}`} />
            <span>{t("blogBadge")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-sans text-3xl md:text-4xl font-extrabold text-white"
          >
            {t("blogHeading")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl font-sans text-sm text-slate-400 leading-relaxed"
          >
            {t("blogDesc")}
          </motion.p>
        </div>

        {/* Blog row grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ARTICLES.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * idx, ease: "easeOut" }}
              onMouseEnter={() => soundSynth.playHover()}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => handleOpenArticle(art)}
              className={`group relative flex flex-col rounded-3xl border bg-slate-950/40 p-6 backdrop-blur-3xl transition-all duration-500 cursor-pointer ${
                isRtl ? "text-right" : "text-left"
              } ${isEmergency ? "border-red-500/10 hover:border-red-500/30" : "border-white/5 hover:border-cyan-500/20"}`}
            >
              {/* Cover image block */}
              <div className="relative mb-5 h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {!failedImages[art.id] ? (
                  <img
                    src={art.image}
                    alt={t(art.titleKey)}
                    onError={() => setFailedImages(prev => ({ ...prev, [art.id]: true }))}
                    className="absolute inset-0 h-full w-full object-cover opacity-65 group-hover:scale-105 transition-all duration-700 brightness-75"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-4 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    <div className="relative h-16 w-16 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
                      <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20 animate-spin-slow" />
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00cfff]" />
                      <div className="absolute w-full h-[1px] bg-cyan-500/40 top-1/2 left-0 -translate-y-1/2" />
                    </div>
                    <div className="absolute bottom-2 font-mono text-[8px] text-cyan-400/60">
                      [ {art.id === "ai-dentistry" ? "CAD_CAM_SIM" : art.id === "microscope-roots" ? "MICROSCOPE_SIM" : "VENEERS_SIM"} ]
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
                
                {/* Float tag */}
                <div className={`absolute top-4 rounded-xl bg-slate-950/95 px-3 py-1.5 text-[10px] font-bold border border-white/5 shadow-lg transition-colors duration-1000 ${
                  isRtl ? "right-4" : "left-4"
                } ${isEmergency ? "text-red-400" : "text-cyan-400"}`}>
                  {t(art.tagKey)}
                </div>
              </div>

              {/* Date & read-time metadatas */}
              <div className={`flex items-center gap-4 text-[10px] text-slate-500 font-mono mb-3 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-600" />
                  {isRtl ? "14 يوليو 2026" : "July 14, 2026"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-600" />
                  {isRtl ? "قراءة 4 دقائق" : "4 min read"}
                </span>
              </div>

              {/* Title */}
              <h3 className={`font-sans text-base font-extrabold text-white transition-colors duration-300 leading-snug ${
                isEmergency ? "group-hover:text-red-400" : "group-hover:text-cyan-300"
              }`}>
                {t(art.titleKey)}
              </h3>

              {/* Excerpt description */}
              <p className="mt-3 font-sans text-xs leading-relaxed text-slate-400 flex-grow">
                {t(art.descKey)}
              </p>

              {/* Divider link */}
              <div className={`mt-5 pt-4 border-t border-white/5 flex items-center gap-1 text-xs font-bold transition-all duration-1000 ${
                isRtl ? "justify-end flex-row" : "justify-start flex-row-reverse"
              } ${isEmergency ? "text-slate-400 group-hover:text-red-400" : "text-slate-400 group-hover:text-cyan-400"}`}>
                <span>{t("blogReadMore")}</span>
                <span className={`font-mono transition-transform duration-300 ${
                  isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                }`}>{isRtl ? "←" : "→"}</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Premium Article Glassmorphism Modal */}
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
              
              {/* Glass Backdrop Overlayer with blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              />

              {/* Modal Container Body */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className={`relative w-full max-w-3xl max-h-[85vh] bg-slate-950/95 border rounded-3xl overflow-hidden flex flex-col z-10 ${
                  isEmergency ? "border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]" : "border-white/15 shadow-[0_0_50px_rgba(0,207,255,0.2)]"
                }`}
              >
                
                {/* Tech scanned lines backdrop */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,207,255,0.015)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />

                {/* Close Button & Header controls */}
                <div className={`absolute top-4 z-30 flex items-center gap-2 ${isRtl ? "left-4" : "right-4"}`}>
                  <button
                    onClick={handleCloseModal}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all shadow-md cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Cover Image Header */}
                <div className="relative h-64 md:h-72 w-full flex-shrink-0">
                  {!failedImages[activeArticle.id] ? (
                    <img
                      src={activeArticle.image}
                      alt={t(activeArticle.titleKey)}
                      onError={() => setFailedImages(prev => ({ ...prev, [activeArticle.id]: true }))}
                      className="absolute inset-0 h-full w-full object-cover brightness-75 animate-pulse"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                      <div className="relative h-24 w-24 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
                        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-spin-slow" />
                        <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00cfff]" />
                        <div className="absolute w-full h-[1.5px] bg-cyan-500/40 top-1/2 left-0 -translate-y-1/2 animate-bounce" />
                      </div>
                      <div className="absolute bottom-3 font-mono text-[9px] text-cyan-400/80">
                        [ {activeArticle.id === "ai-dentistry" ? "CAD_CAM SYSTEM ACTIVE" : activeArticle.id === "microscope-roots" ? "MICROSCOPE SYSTEM ACTIVE" : "VENEERS ANALYSIS ACTIVE"} ]
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />
                  
                  {/* Category Tag overlay */}
                  <div className={`absolute bottom-6 flex flex-col gap-2 ${isRtl ? "right-6 text-right" : "left-6 text-left"}`}>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold font-sans self-start bg-cyan-400/10 border border-cyan-400/40 text-cyan-400`}>
                      {t(activeArticle.tagKey)}
                    </span>
                    <h2 className="text-xl md:text-3xl font-black text-white mt-1 leading-tight drop-shadow-md">
                      {t(activeArticle.titleKey)}
                    </h2>
                  </div>
                </div>

                {/* Scrollable Contents Grid */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 z-10 scrollbar-thin">
                  
                  {/* Article Metadata line */}
                  <div className={`flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-white/5 pb-4 ${
                    isRtl ? "justify-start flex-row-reverse" : "justify-start flex-row"
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className={`h-4 w-4 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                      {isRtl ? "14 يوليو 2026" : "July 14, 2026"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className={`h-4 w-4 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                      {isRtl ? "قراءة 4 دقائق" : "4 min read"}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                    <span className="text-slate-500 font-sans">{isRtl ? "بإشراف د. أحمد هندية" : "Supervised by Dr. Hendia"}</span>
                  </div>

                  {/* Body Paragraphs */}
                  <div className={`space-y-4 font-sans text-sm md:text-base leading-relaxed text-slate-200 ${
                    isRtl ? "text-right" : "text-left"
                  }`}>
                    {(isRtl ? activeArticle.paragraphsAr : activeArticle.paragraphsEn).map((p, pIdx) => (
                      <React.Fragment key={pIdx}>
                        <p className="font-medium">
                          {p}
                        </p>
                        {pIdx === 1 && (
                          <ArticleInlineMedia articleId={activeArticle.id} isRtl={isRtl} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Related Articles section */}
                  <div className={`border-t border-white/5 pt-6 mt-12 ${isRtl ? "text-right" : "text-left"}`}>
                    <h4 className={`font-sans text-sm font-black text-white mb-4 flex items-center gap-2 ${
                      isRtl ? "justify-end" : "justify-start"
                    }`}>
                      <BookOpen className={`h-4 w-4 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                      {isRtl ? "مقالات ذات صلة قد تهمك" : "Related Reading Materials"}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ARTICLES.filter((a) => a.id !== activeArticle.id).map((other) => (
                        <div
                          key={other.id}
                          onClick={() => handleOpenArticle(other)}
                          className={`group border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-3 text-right hover:border-cyan-500/20 ${
                            isRtl ? "flex-row" : "flex-row-reverse text-left"
                          }`}
                        >
                          <div className="flex-1 flex flex-col justify-between">
                            <h5 className="font-sans text-xs font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                              {t(other.titleKey)}
                            </h5>
                            <span className={`text-[10px] text-slate-500 mt-2 font-sans flex items-center gap-1 ${
                              isRtl ? "justify-end" : "justify-start"
                            }`}>
                              {isRtl ? "قراءة 4 دقائق" : "4 min read"}
                              <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                            </span>
                          </div>
                          <img
                            src={other.image}
                            alt={t(other.titleKey)}
                            className="h-14 w-20 rounded-xl object-cover border border-white/5 opacity-70 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className={`bg-slate-950 border-t border-white/5 p-4 flex items-center justify-between z-10 ${
                  isRtl ? "flex-row" : "flex-row-reverse"
                }`}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(window.location.href);
                          showToast(isRtl ? "تم نسخ رابط المقال بنجاح!" : "Article link copied to clipboard!");
                        } catch (e) {}
                      }}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        showToast(isRtl ? "تمت إضافة المقال إلى المفضلة الطبية!" : "Added to reading bookmarks!");
                      }}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleCloseModal}
                    className={`px-5 py-2 rounded-xl text-xs font-black font-sans transition-all cursor-pointer flex items-center gap-1.5 bg-gradient-to-r text-slate-950 ${
                      isEmergency ? "from-red-500 to-rose-400" : "from-cyan-400 to-blue-500"
                    }`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    {isRtl ? "العودة للموقع" : "Return to Site"}
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Custom Toast Notification System */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 left-6 z-50 rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-3 text-xs text-white backdrop-blur-md shadow-2xl flex items-center gap-2"
            >
              <div className={`h-2 w-2 rounded-full animate-ping ${isEmergency ? "bg-red-500" : "bg-cyan-400"}`} />
              <span className="font-sans font-bold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
