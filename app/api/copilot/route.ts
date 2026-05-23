import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimiter } from "@/lib/upstash";

// System instructions for the elite AI Physics Copilot
const SYSTEM_PROMPT = `Sen FizikHub platformunun kıdemli ve elite bir "Yapay Zeka Fizik Öğretmeni ve Bilim Asistanı" (Fizik Copilotu) karakterisin.
Görevin, kullanıcılara fizik kavramlarını, formüllerini, deneylerini ve uzay bilimlerini en anlaşılır, sürükleyici ve eğlenceli şekilde Türkçe olarak öğretmektir.

Yazılımcı ve akademik bir titizlikle çalışmalı, aşağıdaki kurallara harfiyen uymalısın:
1. Türkçe konuşmalı ve son derece profesyonel, yardımsever, akıcı bir üslup kullanmalısın.
2. Matematiksel ve fiziksel formülleri mutlaka LaTeX biçiminde yazmalısın:
   - Satır içi (inline) formülleri tek dolar işareti içine al: Örn. $E = mc^2$ veya $\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$.
   - Blok (display) formülleri çift dolar işareti içine al:
     Örn.
     $$i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\hat{H}\\Psi(\\mathbf{r}, t)$$
3. Konuları anlatırken kuru teorik ezberlerden kaçınmalı; gerçek dünya örnekleri, analojiler ve interaktif deney tasarımları sunmalısın.
4. Kod tabanlı simülasyon örnekleri (örn. Python, JavaScript/Canvas) sorulduğunda, temiz ve profesyonel kod blokları paylaşmalısın.
5. Kullanıcının sorduğu soruları adım adım, mantıksal bir silsileyle çözmeli ve anlamadıkları yerleri sormalısın.`;

export async function POST(req: NextRequest) {
    // 1. Get Client IP for Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "anonymous";
    
    // Rate limit: 12 requests per minute (1 request per 5 seconds on average)
    const limitResult = await rateLimiter.limit(`copilot:${ip}`, 12, 60);
    if (!limitResult.success) {
        return NextResponse.json(
            { error: "Çok hızlı gidiyorsun fizikçi! Lütfen biraz bekle ve tekrar dene." },
            { 
                status: 429,
                headers: {
                    "X-RateLimit-Limit": String(limitResult.limit),
                    "X-RateLimit-Remaining": String(limitResult.remaining),
                    "X-RateLimit-Reset": String(limitResult.reset),
                }
            }
        );
    }

    try {
        const body = await req.json();
        const { messages } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Geçersiz konuşma geçmişi." },
                { status: 400 }
            );
        }

        // 2. Load API Key and Initialize Google Generative AI
        const apiKey = process.env.GEMINI_API_KEY || 
                       process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                       process.env.GOOGLE_AI_API_KEY || 
                       "";

        if (!apiKey) {
            return NextResponse.json(
                { error: "Fizik Copilotu şu anda devre dışı (API Key yapılandırılmamış)." },
                { status: 503 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        // 3. Format messages for Gemini Chat History
        // Gemini expects role: "user" or "model"
        // Let's grab last 15 messages to prevent token bloat
        const recentMessages = messages.slice(-15);
        const lastMessage = recentMessages[recentMessages.length - 1];
        
        if (lastMessage.role !== "user") {
            return NextResponse.json(
                { error: "Son mesaj kullanıcıya ait olmalıdır." },
                { status: 400 }
            );
        }

        const history = recentMessages.slice(0, -1)
            .filter((m: any) => m.role === "user" || m.role === "model")
            .map((m: any) => ({
                role: m.role,
                parts: [{ text: m.content || m.text }],
            }));

        // 4. Start Gemini Chat Session
        const chat = model.startChat({
            history,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        });

        const result = await chat.sendMessage(lastMessage.content || lastMessage.text);
        const responseText = result.response.text();

        return NextResponse.json({
            content: responseText,
            remaining: limitResult.remaining,
            reset: limitResult.reset,
        });

    } catch (error: any) {
        console.error("Fizik Copilot API error:", error);
        return NextResponse.json(
            { error: "Yapay zeka yanıt oluştururken kuantum tünelleme hatası yaşadı: " + (error?.message || "Bilinmeyen Hata") },
            { status: 500 }
        );
    }
}
