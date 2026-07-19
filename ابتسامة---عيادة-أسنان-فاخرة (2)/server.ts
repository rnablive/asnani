import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json());

  // Safe lazy initializer for GoogleGenAI
  let ai: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // Intelligent local fallback matching engine (Moroccan Darija & Standard Arabic)
  function getLocalFallbackResponse(message: string): string {
    const msg = message.toLowerCase().trim();
    
    // 1. Greetings
    if (/\b(سلام|اهلين|مرحبا|مرحباً|أهلاً|صباح الخير|مساء الخير|hello|hi|salam|hola)\b/.test(msg)) {
      return "مرحباً بك! أنا المساعد الذكي لعيادة الدكتور أحمد هندية لطب الأسنان بمكناس. كيف يمكنني مساعدتك اليوم؟ يمكنك الاستفسار عن العلاجات، الأسعار، أو كيفية حجز موعد.";
    }
    
    // 2. Location
    if (/\b(فين|بلاصة|العنوان|مكناس|مكان|فين كاين|عنوان|adresse|location|address|meknes)\b/.test(msg)) {
      return "العيادة متواجدة في قلب مدينة مكناس، المغرب. نرحب بزيارتك! لحجز موعد ومعرفة التفاصيل الدقيقة للوصول، يرجى الضغط على زر الواتساب أو الاتصال بالعيادة مباشرة للترتيب.";
    }
    
    // 3. Implants / Price
    if (/\b(زراعة|زرع|بشحال|ثمن|شحال|سعر|prix|price|cost|implant|implants)\b/.test(msg)) {
      return "في عيادة الدكتور أحمد هندية، نستخدم أحدث التقنيات لزراعة الأسنان بأسعار مناسبة تبدأ من 5000 درهم مغربي. للحصول على تشخيص دقيق وخطة علاج مخصصة، كنصحوك تزور الطبيب في أقرب وقت. تقدر تضغط على زر الواتساب للتواصل المباشر وحجز موعد.";
    }
    
    // 4. Booking / Appointment
    if (/\b(حجز|موعد|تقيد|نحجز|ندوز|booking|appointment|rendez|rdv|كيفاش)\b/.test(msg)) {
      return "تقدر تحجز موعدك بكل سهولة بالضغط على زر الواتساب الأخضر أسفل الشاشة أو الاتصال الهاتفي بالعيادة مباشرة. فريقنا مستعد لتأكيد موعدك ف أسرع وقت لتجنب أي مضاعفات لأسنانك!";
    }
    
    // 5. Digital Twin / Veneers / Hollywood Smile
    if (/\b(التوأم|الرقمي|عدسات|زيركون|هوليود|ابتسامة|veneers|hollywood|smile|zircon)\b/.test(msg)) {
      return "تتميز عيادتنا بتقنية 'التوأم الرقمي' (Digital Twin) المدعومة بالذكاء الاصطناعي، حيث يمكنك رؤية ابتسامتك المستقبلية بدقة تصل لـ 99% قبل بدء العلاج! نستخدم أيضاً عدسات الزيركون واللومينير فائقة الرقة. لحجز جلسة تصميم الابتسامة، يرجى الاتصال بنا أو مراسلتنا عبر الواتساب.";
    }
    
    // 6. Toothache / Pain / Emergency
    if (/\b(ألم|وجع|حريق|ضرني|ضرسي|سني|منفوخ|الدم|emergency|pain|toothache)\b/.test(msg)) {
      return "إذا كنت كتعاني من حريق أو ألم حاد في الأسنان، هادي حالة مستعجلة! ننصحك بشدة بالاتصال بنا هاتفياً فوراً أو الضغط على زر الواتساب للقدوم للعيادة في أقرب وقت ممكن وتجنب تفاقم الألم أو حدوث التهابات خطيرة.";
    }

    // 7. General Dental Questions (scaling, root canal, etc.)
    if (/\b(تنظيف|عصب|الميكروسكوب|تقويم|تبييض|ضرس|سنة|أسنان|طبيب|microscope|canal|bleaching|whitening|ortho)\b/.test(msg)) {
      return "الدكتور أحمد هندية يقدم علاجات متطورة تشمل علاج العصب بالميكروسكوب الألماني الحديث، وتقويم الأسنان وتبييضها بأحدث الأجهزة. لحماية أسنانك وصحتك، نوصي بزيارة العيادة للفحص. اضغط على زر الواتساب أو اتصل بنا لتأكيد موعدك.";
    }

    // Fallback default
    return "شكراً على تواصلك معنا! لمساعدتك بشكل دقيق وصحيح بخصوص حالتك، نوصي بشدة بالتواصل مباشرة مع عيادة الدكتور أحمد هندية بمكناس عبر الضغط على زر الواتساب أو الاتصال الهاتفي، باش نجاوبو على كاع التساؤلات ديالك ونحددوا ليك موعد قريب للفحص الطبي.";
  }

  // API route for custom dental chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      let reply = "";
      try {
        const client = getGenAI();
        const response = await client.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: message,
          config: {
            systemInstruction: `You are the highly intelligent and premium virtual holographic AI assistant for Dr. Ahmed Hendia's modern luxury dental clinic ("ابتسامة أسناني" - Ibtisamat Asnani) located in Meknes, Morocco.
Your goal is to answer ANY question asked by the user in Moroccan Darija (الدارجة المغربية) or standard Arabic, with a friendly, professional, highly welcoming, and clinical tone.

CORE MISSIONS & BUSINESS FUNCTIONS:
1. Support Dr. Ahmed Hendia's clinic by warmly encouraging patients to visit the clinic as soon as possible for a professional checkup and diagnosis.
2. Emphasize that dental issues (like decay, toothache, gum bleeding, missing teeth) can worsen rapidly if left unchecked, and that early visits save teeth, prevent pain, and are more cost-effective.
3. Highlight our high-tech services (e.g., Digital Smile Design with AI 'Digital Twin' simulation so they see their smile beforehand, German microscope treatment for root canals, high-quality digital Zirconia veneers, dental implants starting from 5000 DH).
4. Direct the user to take action: click the WhatsApp button or call the clinic to book an appointment immediately.

CRITICAL CONVERSATIONAL INSTRUCTIONS:
- Answer the user's question directly, intelligently, and naturally in fluent Moroccan Darija or Standard Arabic. Match the user's language.
- DO NOT keep repeating a generic welcoming introduction ("مرحباً بك في عيادة الدكتور...") unless they just said a basic greeting like "hello" or "salam".
- If you do not understand the user's question, or if it is completely off-topic (unrelated to dental, teeth, mouth, treatments, or the clinic like coding, history, general math, etc.), you MUST politely explain that this is outside your dental scope and warmly invite them to contact Dr. Ahmed Hendia or visit the clinic directly for proper support or customized dental guidance.
`,
          },
        });

        reply = response.text || "";
      } catch (geminiError) {
        console.error("Gemini API call failed, using intelligent local fallback:", geminiError);
        reply = getLocalFallbackResponse(message);
      }

      if (!reply) {
        reply = getLocalFallbackResponse(message);
      }

      res.json({ reply });
    } catch (error: any) {
      console.error("Express API Error:", error);
      res.json({
        reply: "شكراً على تواصلك معنا! لمساعدتك بشكل دقيق وصحيح، نوصي بشدة بالتواصل مباشرة مع عيادة الدكتور أحمد هندية بمكناس عبر الضغط على زر الواتساب أو الاتصال الهاتفي، لتحديد موعد قريب للفحص الطبي."
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
