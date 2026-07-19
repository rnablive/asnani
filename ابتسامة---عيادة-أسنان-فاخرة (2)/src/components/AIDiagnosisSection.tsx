/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Camera,
  Cpu,
  Sparkles,
  Activity,
  CheckCircle,
  AlertCircle,
  Share2,
  RefreshCw,
  Clock,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  Clipboard,
  Award,
  PhoneCall
} from "lucide-react";
import { soundSynth } from "./AudioController";
import HolographicTooth from "./HolographicTooth";
import { useApp } from "../context/AppContext";

interface DiagnosticFinding {
  id: string;
  nameKey: string;
  englishName: string;
  confidence: number;
  severity: "healthy" | "needs_attention" | "moderate" | "serious";
  severityTextKey: string;
  explanationKey: string;
  recommendationKeys: string[];
  pulseColor: string;
}

const mockFindings: DiagnosticFinding[] = [
  {
    id: "decay",
    nameKey: "aiFindingDecayName",
    englishName: "Enamel Caries Detected",
    confidence: 94,
    severity: "serious",
    severityTextKey: "aiSeverityCritical",
    explanationKey: "aiFindingDecayExpl",
    recommendationKeys: ["recDec1", "recDec2", "recDec3"],
    pulseColor: "#ef4444"
  },
  {
    id: "inflammation",
    nameKey: "aiFindingGingName",
    englishName: "Gingival Inflammation",
    confidence: 88,
    severity: "moderate",
    severityTextKey: "aiSeverityModerate",
    explanationKey: "aiFindingGingExpl",
    recommendationKeys: ["recGing1", "recGing2", "recGing3"],
    pulseColor: "#f59e0b"
  },
  {
    id: "plaque",
    nameKey: "aiFindingPlaqueName",
    englishName: "Dental Plaque Accumulation",
    confidence: 79,
    severity: "needs_attention",
    severityTextKey: "aiSeverityAttention",
    explanationKey: "aiFindingPlaqueExpl",
    recommendationKeys: ["recPlaq1", "recPlaq2", "recPlaq3"],
    pulseColor: "#eab308"
  },
  {
    id: "sensitivity",
    nameKey: "aiFindingSensName",
    englishName: "Dentinal Sensitivity Potential",
    confidence: 70,
    severity: "needs_attention",
    severityTextKey: "aiSeverityPreventative",
    explanationKey: "aiFindingSensExpl",
    recommendationKeys: ["recSens1", "recSens2", "recSens3"],
    pulseColor: "#eab308"
  },
  {
    id: "healthy",
    nameKey: "aiFindingHealthyName",
    englishName: "Excellent Jaw Alignment & Integrity",
    confidence: 99,
    severity: "healthy",
    severityTextKey: "aiSeverityExcellent",
    explanationKey: "aiFindingHealthyExpl",
    recommendationKeys: ["recHeal1", "recHeal2", "recHeal3"],
    pulseColor: "#06b6d4"
  }
];

export default function AIDiagnosisSection() {
  const { t, locale, isEmergency, setIsEmergency } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessageIndex, setScanMessageIndex] = useState(0);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [activeFinding, setActiveFinding] = useState<string>("decay");
  const [showCameraSim, setShowCameraSim] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const [isEmergencyScan, setIsEmergencyScan] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isRtl = locale === "ar";

  // Dynamic keys translation tool
  const txt = (key: string, fallback: string): string => {
    try {
      const val = t(key as any);
      return val && val !== key ? val : fallback;
    } catch {
      return fallback;
    }
  };

  const scanningMessages = [
    t("scanMsg1" as any),
    t("scanMsg2" as any),
    t("scanMsg3" as any),
    t("scanMsg4" as any),
    t("scanMsg5" as any),
    t("scanMsg6" as any)
  ];

  useEffect(() => {
    if (isScanning) {
      soundSynth.startAmbience();
      setScanProgress(0);
      setScanMessageIndex(0);

      scannerIntervalRef.current = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(scannerIntervalRef.current!);
            setIsScanning(false);
            setIsAnalyzed(true);
            
            if (isEmergencyScan) {
              setActiveFinding("decay");
              setIsEmergency(true);
              soundSynth.playSiren(); // play wailing siren synthesized in real-time
              setShowWarningDialog(true);
            } else {
              setActiveFinding("healthy");
              soundSynth.playHealing(); // play positive healing chime
            }
            return 100;
          }
          
          const increment = Math.floor(Math.random() * 5) + 3;
          const nextProgress = Math.min(prev + increment, 100);

          const msgIdx = Math.min(
            Math.floor((nextProgress / 100) * scanningMessages.length),
            scanningMessages.length - 1
          );
          setScanMessageIndex(msgIdx);

          if (nextProgress % 15 === 0) {
            soundSynth.playHover();
          }

          return nextProgress;
        });
      }, 150);
    } else {
      if (scannerIntervalRef.current) clearInterval(scannerIntervalRef.current);
    }

    return () => {
      if (scannerIntervalRef.current) clearInterval(scannerIntervalRef.current);
    };
  }, [isScanning, isEmergencyScan]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      loadImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    soundSynth.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setIsEmergencyScan(false);
        setIsScanning(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Simulate mobile camera capture
  const triggerCameraCapture = (emergency: boolean = false) => {
    soundSynth.playClick();
    setShowCameraSim(true);
    setCameraCountdown(3);

    const timer = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          // Auto load a sample dental image representation
          const sampleDentalImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23020617'/><text x='50%25' y='50%25' fill='%2300cfff' font-family='sans-serif' font-size='16' text-anchor='middle'>[ HOLOGRAPHIC SCAN CAPTURED ]</text><path d='M150,120 Q200,90 250,120 T350,150 T250,220 T200,240 T150,220 T50,150 Z' fill='none' stroke='%2300cfff' stroke-width='2' stroke-dasharray='5,5'/></svg>";
          setImage(sampleDentalImage);
          setShowCameraSim(false);
          setIsEmergencyScan(emergency);
          setIsScanning(true);
          return null;
        }
        soundSynth.playClick();
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    soundSynth.playClick();
    setImage(null);
    setIsScanning(false);
    setIsAnalyzed(false);
    setScanProgress(0);
    setIsEmergency(false);
    setIsEmergencyScan(false);
    setShowWarningDialog(false);
    setActiveFinding("decay");
  };

  const triggerWhatsAppShare = () => {
    soundSynth.playClick();
    const activeData = mockFindings.find((f) => f.id === activeFinding) || mockFindings[0];
    
    const greeting = t("waShareGreeting" as any);
    const body = t("waShareBody" as any);
    const scoreVal = isEmergency ? (isRtl ? "38% (حالة حرجة)" : "38% (Critical alert)") : t("waShareScore" as any);
    const alertLabel = t("waShareAlert" as any);
    const confLabel = t("waShareConf" as any);
    const recsLabel = t("waShareRecs" as any);
    const footer = t("waShareFooter" as any);

    const pathology = t(activeData.nameKey as any);
    const recommendations = activeData.recommendationKeys.map(k => t(k as any)).join(", ");

    const messageText = `${greeting}
${body}

• ${isRtl ? "النتيجة العامة" : "Overall Score"}: ${scoreVal}
• ${alertLabel}: ${pathology}
• ${confLabel}: ${activeData.confidence}%
• ${recsLabel}: ${recommendations}

${footer}`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/212649661963?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const activeData = mockFindings.find((f) => f.id === activeFinding) || mockFindings[0];

  return (
    <section
      id="ai-diagnosis-section"
      className="relative w-full overflow-hidden bg-[#020813] py-24 px-6 lg:px-16 select-none"
    >
      {/* Dynamic Laser Scanning Grid overlay background - transitions to red in emergency */}
      <div className={`absolute inset-0 bg-[size:4rem_4rem] opacity-20 transition-all duration-1000 ${
        isEmergency
          ? "bg-[linear-gradient(to_right,#450a0a_1px,transparent_1px),linear-gradient(to_bottom,#450a0a_1px,transparent_1px)]"
          : "bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]"
      }`} />
      
      <div className={`absolute -top-40 left-1/4 h-96 w-96 rounded-full blur-[150px] transition-colors duration-1000 ${
        isEmergency ? "bg-red-600/10" : "bg-blue-600/10"
      }`} />
      <div className={`absolute -bottom-40 right-1/4 h-96 w-96 rounded-full blur-[150px] transition-colors duration-1000 ${
        isEmergency ? "bg-rose-600/10" : "bg-cyan-600/10"
      }`} />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Futuristic Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs backdrop-blur-md font-mono transition-all duration-1000 ${
              isEmergency
                ? "border-red-500/30 bg-red-950/20 text-red-400"
                : "border-cyan-500/30 bg-cyan-950/20 text-cyan-400"
            }`}
          >
            <Cpu className={`h-4 w-4 animate-spin transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
            <span className="tracking-widest font-extrabold uppercase text-[10px]">
              {isEmergency ? "CRITICAL EMERGENCY PROTOCOL ENABLED" : "DIAGNOSTIC CORE 2035 v2.2"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            {txt("aiHeading", "مركز الذكاء الاصطناعي لتحليل الأسنان")}{" "}
            <span className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-1000 ${
              isEmergency ? "from-red-400 to-rose-500" : "from-cyan-400 to-blue-500"
            }`}>
              ({isRtl ? "التشخيص الفوري" : "AI Diagnostics"})
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl font-sans text-sm text-slate-400 leading-relaxed"
          >
            {txt("aiDesc", "ادخل إلى مختبر التشخيص الهولوغرافي المستقبلي. ارفع لقطة لابتسامتك أو أسنانك، ليعمل عقلنا الاصطناعي على فحص سلامتها وتوليد نماذج ثلاثية الأبعاد بلمحة بصر.")}
          </motion.p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: 3D Holographic Stage */}
          <div className={`flex flex-col justify-between rounded-3xl border bg-slate-950/40 p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden group min-h-[460px] lg:col-span-5 transition-all duration-1000 ${
            isEmergency ? "border-red-500/20" : "border-white/5"
          }`}>
            {/* Corner Decorative brackets */}
            <div className={`absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 transition-colors duration-1000 ${isEmergency ? "border-red-500/40" : "border-cyan-500/40"}`} />
            <div className={`absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 transition-colors duration-1000 ${isEmergency ? "border-red-500/40" : "border-cyan-500/40"}`} />
            <div className={`absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 transition-colors duration-1000 ${isEmergency ? "border-red-500/40" : "border-cyan-500/40"}`} />
            <div className={`absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 transition-colors duration-1000 ${isEmergency ? "border-red-500/40" : "border-cyan-500/40"}`} />

            {/* Glowing background node */}
            <div className={`absolute inset-0 pointer-events-none bg-radial-gradient transition-all duration-1000 ${
              isEmergency ? "from-red-500/5 to-transparent" : "from-cyan-500/5 to-transparent"
            }`} />

            {/* Stage Title */}
            <div className="flex items-center justify-between z-10">
              <span className="font-sans text-xs font-bold text-slate-400 flex items-center gap-2">
                <Activity className={`h-4 w-4 animate-pulse transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-400"}`} />
                {isRtl ? "المحاكي الهولوغرافي ثلاثي الأبعاد" : "Holographic 3D Simulator"}
              </span>
              <span className="font-mono text-[9px] text-slate-600">3D_CORE_DENTAL_INTEGRATION</span>
            </div>

            {/* 3D Model Rendering Stage */}
            <div className="flex-grow flex items-center justify-center relative my-4">
              <HolographicTooth activeFindingId={activeFinding} />
            </div>

            {/* Model diagnostic feedback HUD */}
            <div className="z-10 bg-slate-950/60 rounded-xl border border-white/5 p-3 flex flex-col gap-1 text-start">
              <span className="font-sans text-[10px] text-slate-400">{isRtl ? "العقدة التشريحية النشطة:" : "Active Anatomical Node:"}</span>
              <span className={`font-sans text-xs font-black transition-colors duration-1000 ${isEmergency ? "text-red-400" : "text-cyan-300"}`}>
                {activeFinding === "decay" && (isRtl ? "عنق التاج العلوي (تسوس المينا الحاد)" : "Upper Crown Neck (Enamel Caries)")}
                {activeFinding === "inflammation" && (isRtl ? "الرباط اللثوي وجيب السن (احتقان)" : "Periodontal Ligament (Inflammation)")}
                {activeFinding === "plaque" && (isRtl ? "عنق المينا والأسطح الطاحنة (رواسب البلاك)" : "Enamel Neck & Occlusal (Plaque)")}
                {activeFinding === "sensitivity" && (isRtl ? "جذور قنوات العاج (تحفيز عصبي)" : "Dentinal Root Canals (Sensitivity)")}
                {activeFinding === "healthy" && (isRtl ? "الاصطفاف السليم ومستوى المينا العام" : "Healthy Alignment & General Enamel")}
              </span>
            </div>
          </div>

          {/* Column 2: Diagnostic Workflow panel */}
          <div className="lg:col-span-7 flex flex-col justify-start rounded-3xl border border-white/5 bg-slate-950/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden p-6 min-h-[460px]">
            
            <AnimatePresence mode="wait">
              
              {/* STATE 1: Upload Dropzone & SIMULATE CONTROL PANELS */}
              {!image && !isScanning && !isAnalyzed && (
                <motion.div
                  key="upload-stage"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-grow flex flex-col justify-center items-center py-6"
                >
                  <div className="max-w-md w-full text-center flex flex-col items-center">
                    
                    {/* Pulsing neon icon container */}
                    <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/20 bg-slate-950/80 shadow-[0_0_30px_rgba(0,207,255,0.15)] transition-all">
                      <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/40 animate-spin-slow" />
                      <Upload className="h-7 w-7 text-cyan-400 animate-bounce" />
                    </div>

                    <h3 className="font-sans text-xl font-bold text-white mb-2">{txt("aiUploadTitle", "قم برفع صورة واضحة لابتسامتك")}</h3>
                    <p className="font-sans text-xs text-slate-400 mb-6 leading-relaxed">
                      {txt("aiUploadDesc", "يرجى التأكد من توفر إضاءة جيدة وتصوير الفكين بشكل مقابل لنتائج دقيقة.")}
                    </p>

                    {/* Drag and Drop Zone Container */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-2xl p-6 mb-6 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                        isDragging
                          ? "border-cyan-400 bg-cyan-950/25 shadow-[0_0_20px_rgba(0,207,255,0.2)]"
                          : "border-white/10 hover:border-cyan-500/30 bg-slate-950/40"
                      }`}
                    >
                      <span className="font-sans text-xs text-slate-400">{txt("aiDragDrop", "اسحب صورتك الطبية وأفلتها هنا أو اضغط للاختيار")}</span>
                      <span className="font-mono text-[9px] text-slate-600">MAX FILE SIZE 10MB</span>
                    </div>

                    {/* Hidden input element */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Two Parallel simulation buttons: Healthy vs Critical Emergency */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      {/* Standard Healthy simulator */}
                      <button
                        type="button"
                        onClick={() => triggerCameraCapture(false)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyan-500/20 bg-cyan-950/10 text-cyan-300 hover:text-white hover:bg-cyan-950/30 hover:border-cyan-400 transition-all text-xs cursor-pointer font-bold"
                      >
                        <Camera className="h-4.5 w-4.5" />
                        <span>{txt("aiCameraSim", "التقاط لقطة فورية (محاكي الكاميرا)")}</span>
                      </button>

                      {/* RED CRITICAL EMERGENCY SIMULATION BUTTON */}
                      <button
                        type="button"
                        onClick={() => triggerCameraCapture(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-950/40 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all text-xs cursor-pointer font-bold"
                      >
                        <ShieldAlert className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                        <span>{txt("aiEmergencySim", "محاكاة حالة طوارئ حرجة ⚠️")}</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* CAMERA COUNTDOWN OVERLAY */}
              {showCameraSim && (
                <div className="absolute inset-0 bg-[#020813]/95 z-50 flex flex-col items-center justify-center text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan-400/30 text-cyan-400 font-sans text-4xl font-extrabold animate-pulse">
                    {cameraCountdown}
                  </div>
                  <span className="mt-4 font-sans text-sm text-slate-400">{isRtl ? "جاري تفعيل مصفوفة العدسات البيومترية... ابتسم!" : "Initializing biometric lens array... smile!"}</span>
                </div>
              )}

              {/* STATE 2: AI SCANNING */}
              {isScanning && !isAnalyzed && (
                <motion.div
                  key="scanning-stage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow flex flex-col justify-center items-center relative py-4"
                >
                  <div className="w-full max-w-lg">
                    
                    {/* Simulated Floating Scanner Frame (red glow if emergency) */}
                    <div className={`relative rounded-2xl overflow-hidden bg-slate-950/80 p-1.5 aspect-video flex items-center justify-center mb-6 border transition-all duration-1000 ${
                      isEmergencyScan
                        ? "border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.25)]"
                        : "border-cyan-500/30 shadow-[0_0_30px_rgba(0,207,255,0.15)]"
                    }`}>
                      {/* Laser beam animation */}
                      <div className={`absolute left-0 right-0 h-0.5 top-0 animate-scan-line z-20 shadow-lg ${
                        isEmergencyScan
                          ? "bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                          : "bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(0,207,255,0.8)]"
                      }`} />
                      
                      {/* Grid effect inside frame */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,207,255,0.02)_1px,transparent_1px)] bg-[size:100%_8px] z-10 pointer-events-none" />

                      {/* Render preview image */}
                      {image && (
                        <img
                          src={image}
                          alt="Scanning View"
                          className="h-full w-full object-cover rounded-xl filter brightness-75 contrast-125 saturate-50"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Cybernetic HUD Target brackets */}
                      <div className={`absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 ${isEmergencyScan ? "border-red-400" : "border-cyan-400"}`} />
                      <div className={`absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 ${isEmergencyScan ? "border-red-400" : "border-cyan-400"}`} />
                      <div className={`absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 ${isEmergencyScan ? "border-red-400" : "border-cyan-400"}`} />
                      <div className={`absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 ${isEmergencyScan ? "border-red-400" : "border-cyan-400"}`} />
                    </div>

                    {/* Loading details */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border bg-slate-950/40 ${isEmergencyScan ? "border-red-500/20" : "border-cyan-500/20"}`}>
                          <div className={`absolute inset-0 rounded-full border-t-2 animate-spin ${isEmergencyScan ? "border-red-500" : "border-cyan-400"}`} />
                          <span className={`font-mono text-xs font-extrabold ${isEmergencyScan ? "text-red-400" : "text-cyan-400"}`}>{scanProgress}%</span>
                        </div>
                        <div className="text-start">
                          <h4 className="font-sans text-sm font-bold text-white">{txt("aiDiagnosticLoading", "معالجة الذكاء الاصطناعي قيد التشغيل...")}</h4>
                          <p className={`font-sans text-xs animate-pulse mt-1 ${isEmergencyScan ? "text-red-400" : "text-cyan-400"}`}>
                            {scanningMessages[scanMessageIndex]}
                          </p>
                        </div>
                      </div>

                      {/* Smooth Progress bar */}
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${isEmergencyScan ? "from-red-500 to-rose-600" : "from-cyan-500 to-blue-500"}`}
                          style={{ width: `${scanProgress}%` }}
                          layoutId="scan-progress-bar"
                        />
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STATE 3: INTERACTIVE RESULTS DASHBOARD */}
              {isAnalyzed && (
                <motion.div
                  key="results-stage"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-grow flex flex-col justify-start text-start"
                >
                  
                  {/* Dashboard HUD metrics header */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                    
                    {/* Overall Score Dial Gauge */}
                    <div className="md:col-span-5 rounded-2xl border border-white/5 bg-slate-950/40 p-4 flex items-center gap-4 backdrop-blur-md">
                      <div className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 border shrink-0 ${
                        isEmergency ? "border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      }`}>
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-900"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={isEmergency ? "text-red-500" : "text-emerald-400"}
                            strokeDasharray={isEmergency ? "38, 100" : "92, 100"}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className={`font-mono text-base font-extrabold ${isEmergency ? "text-red-400" : "text-emerald-400"}`}>
                          {isEmergency ? "38%" : "92%"}
                        </span>
                      </div>
                      <div className="text-start">
                        <span className="font-sans text-[10px] text-slate-400 block">{txt("aiScoreLabel", "درجة صحة الأسنان العامة")}</span>
                        <span className={`font-sans text-xs font-black mt-0.5 block flex items-center gap-1.5 ${
                          isEmergency ? "text-red-400" : "text-emerald-400"
                        }`}>
                          {isEmergency ? (
                            <>
                              <ShieldAlert className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                              {isRtl ? "مخاطر صحية حرجة مكتشفة!" : "Critical health risks!"}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                              {isRtl ? "ممتازة وخاضعة للمراقبة" : "Excellent structural health"}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Reset Button & Summary header */}
                    <div className="md:col-span-7 flex items-center justify-end gap-3">
                      {isEmergency && (
                        <button
                          type="button"
                          onClick={() => {
                            soundSynth.playSiren();
                            setShowWarningDialog(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-900/30 transition-all text-xs font-sans font-bold cursor-pointer"
                        >
                          <ShieldAlert className="h-4 w-4 animate-bounce" />
                          {isRtl ? "عرض التنبيه" : "View Alert"}
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs cursor-pointer font-sans"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        {txt("aiResetBtn", "إعادة فحص جديد")}
                      </button>
                      
                      <div className="rounded-xl border border-white/5 bg-slate-950/20 px-3.5 py-2 text-right">
                        <span className="font-mono text-[9px] text-slate-500 block">REPORT_HASH</span>
                        <span className={`font-mono text-[10px] ${isEmergency ? "text-red-400" : "text-cyan-400"}`}>
                          {isEmergency ? "#AI-DX-EMERGENCY" : "#AI-DX-79840B"}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Findings tab selector */}
                  <span className="font-sans text-xs font-bold text-slate-400 mb-2.5 block text-start">
                    {txt("aiReportLabel", "الملاحظات والمؤشرات الطبية المكتشفة:")}
                  </span>

                  {/* Group of Findings List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-6">
                    {mockFindings.map((finding) => {
                      const isActive = activeFinding === finding.id;
                      const isSerious = finding.severity === "serious";
                      const isModerate = finding.severity === "moderate";
                      const isNeedsAttention = finding.severity === "needs_attention";

                      return (
                        <button
                          key={finding.id}
                          onClick={() => {
                            soundSynth.playClick();
                            setActiveFinding(finding.id);
                          }}
                          className={`p-3 rounded-xl border text-start transition-all duration-300 relative cursor-pointer flex flex-col gap-1 ${
                            isActive
                              ? isEmergency
                                ? "bg-red-950/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                : "bg-slate-900 border-cyan-500/40 shadow-[0_0_15px_rgba(0,207,255,0.15)]"
                              : "bg-slate-950/40 border-white/5 hover:bg-slate-950/70 hover:border-white/10"
                          }`}
                        >
                          <div className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="font-mono text-[9px] text-slate-500">{finding.englishName}</span>
                            <span className="relative flex h-2 w-2">
                              {isActive && (
                                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                                  isEmergency ? "bg-red-400" : "bg-cyan-400"
                                }`} />
                              )}
                              <span
                                className={`relative inline-flex h-2 w-2 rounded-full ${
                                  isSerious ? "bg-red-500" :
                                  isModerate ? "bg-amber-500" :
                                  isNeedsAttention ? "bg-yellow-400" : "bg-cyan-400"
                                }`}
                              />
                            </span>
                          </div>
                          <span className="font-sans text-xs font-bold text-white mt-1">
                            {isRtl ? txt(finding.nameKey, finding.englishName) : finding.englishName}
                          </span>
                          <span className="font-sans text-[10px] text-slate-400 mt-1 block">
                            {isRtl ? `تأكيد: ${finding.confidence}%` : `Conf: ${finding.confidence}%`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Finding Detail Display Card */}
                  <div className={`rounded-2xl border bg-slate-950/60 p-4 backdrop-blur-md mb-6 text-start transition-colors duration-1000 ${
                    isEmergency ? "border-red-500/20" : "border-white/5"
                  }`}>
                    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-3 border-b border-white/5 mb-3 ${
                      isRtl ? "sm:flex-row-reverse" : "sm:flex-row"
                    }`}>
                      <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                        <span
                          className="h-2.5 w-2.5 rounded-full animate-pulse"
                          style={{ backgroundColor: activeData.pulseColor }}
                        />
                        <h4 className="font-sans text-sm font-black text-white">
                          {isRtl ? txt(activeData.nameKey, activeData.englishName) : activeData.englishName}
                        </h4>
                      </div>
                      <span
                        className="text-[10px] font-sans font-bold px-2.5 py-1 rounded-full border"
                        style={{
                          borderColor: `${activeData.pulseColor}40`,
                          color: activeData.pulseColor,
                          backgroundColor: `${activeData.pulseColor}08`
                        }}
                      >
                        {isRtl
                          ? txt(activeData.severityTextKey, "تنبيه تشخيصي")
                          : activeData.severity.toUpperCase()}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                      {isRtl
                        ? txt(activeData.explanationKey, "جاري تحميل تفاصيل الفحص الطبي...")
                        : `A custom diagnostic and microscopic analysis has mapped this anatomical region: ${activeData.englishName}.`}
                    </p>

                    {/* Recommendations inside finding card */}
                    <div>
                      <span className={`font-sans text-[11px] font-bold mb-2 block ${isEmergency ? "text-red-400" : "text-cyan-400"}`}>
                        {txt("aiStoryLabel", "التوصيات الطبية المقترحة:")}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeData.recommendationKeys.map((recKey, index) => (
                          <span
                            key={index}
                            className="text-[10px] font-sans text-slate-300 border border-white/5 bg-white/5 px-2.5 py-1 rounded-lg"
                          >
                            {t(recKey as any)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Share and whatsapp footer */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-start">
                      <h4 className="font-sans text-sm font-black text-white">
                        {t("aiShareTitle" as any)}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 mt-0.5">
                        {t("aiShareDesc" as any)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={triggerWhatsAppShare}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-sans font-bold text-sm transition-all cursor-pointer select-none active:scale-95 text-white bg-gradient-to-r ${
                        isEmergency
                          ? "from-red-600 to-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                          : "from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(30,136,255,0.35)] hover:shadow-[0_0_30px_rgba(0,207,255,0.5)]"
                      }`}
                    >
                      <Share2 className="h-4.5 w-4.5" />
                      <span>{t("aiShareBtn" as any)}</span>
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* RED EMERGENCY WARNING DIALOG/MODAL */}
      <AnimatePresence>
        {showWarningDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                soundSynth.playClick();
                setShowWarningDialog(false);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-lg w-full bg-slate-950 border border-red-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.4)] text-center z-10 overflow-hidden"
            >
              
              {/* Tech lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(239,68,68,0.015)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500 animate-pulse">
                <ShieldAlert className="h-8 w-8 text-red-500" />
              </div>

              <h3 className="font-sans text-2xl font-black text-red-500 mb-4 uppercase tracking-tight">
                {txt("aiClinicAlertTitle", "تنبيه طبي عاجل! ⚠️")}
              </h3>

              <p className="font-sans text-sm text-slate-300 leading-relaxed mb-8">
                {txt("aiClinicAlertDesc", "تم رصد حالة تسوس حرجة متقدمة أو التهاب لثوي حاد في الفحص الهولوغرافي. لتجنب تلف دائم للجذر أو آلام غير محتملة، ننصحك بالاتصال بالدكتور أحمد هندية فوراً للحصول على علاج طارئ.")}
              </p>

              <div className="flex flex-col gap-2.5">
                {/* Emergency call button to Clinic */}
                <a
                  href="tel:+212649661963"
                  onClick={() => soundSynth.playClick()}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-sans text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="h-4 w-4 animate-bounce" />
                  <span>{txt("aiEmergencyCallBtn", "اتصال طوارئ بالعيادة")}</span>
                </a>

                {/* Dismiss button */}
                <button
                  onClick={() => {
                    soundSynth.playClick();
                    setShowWarningDialog(false);
                    // Leave isEmergency as true so the site stays red, but close the modal
                  }}
                  className="w-full py-3.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white font-bold font-sans text-xs transition-all cursor-pointer"
                >
                  {txt("aiCloseAlertBtn", "إغلاق التنبيه ومتابعة التقرير")}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
