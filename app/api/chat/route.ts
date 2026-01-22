import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { FIZIKHUB_KNOWLEDGE_BASE } from "@/lib/ai-knowledge-base";
import { getSiteContext } from "@/lib/get-site-context";
import { createClient } from "@/lib/supabase-server"; // Ensure server client usage

export async function POST(req: Request) {
    try {
        const { messages, userProfile } = await req.json();
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // Initialize Supabase to fetch context
        const supabase = await createClient();
        const dynamicSiteContext = await getSiteContext(supabase);

        const genAI = new GoogleGenerativeAI(apiKey);

        // List of models to try in order of preference (Free tier friendly first)
        // BASED ON DEBUG RESULTS: Only 2.5 models are available for this key.
        const modelsToTry = [
            "gemini-2.5-flash-lite", // Priority: Efficiency & Quota
            "gemini-2.5-flash",      // Backup: Powerful
            "gemini-2.0-flash-exp"   // Fallback: Experimental
        ];

        const userName = userProfile?.full_name || userProfile?.username || "Ziyaretçi";
        const userContext = userProfile ? `KONUŞTUĞUN KİŞİ: ${userName} (Kullanıcı Adı: ${userProfile.username}). Ona ismiyle hitap et.` : "";

        const systemPrompt = `Sen HubGPT'sin.

        AŞAĞIDAKİ "PERSONA KURALLARI", "SİTE İÇERİKLERİ" VE "BİLGİ BANKASI" SENİN TEK GERÇEĞİNDİR.
        BUNLARIN DIŞINA ÇIKMA. YAPAY ZEKA GİBİ KONUŞMA.
        
        ${userContext}
        
        ${dynamicSiteContext}
        
        ${FIZIKHUB_KNOWLEDGE_BASE}
        
        Kısa, net ve "bizden biri" gibi cevap ver.`;

        const history = [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            {
                role: "model",
                parts: [{ text: "Anlaşıldı. HubGPT moduna geçiyorum. Sistem hazır. Sorularını bekliyorum." }]
            },
            ...messages.slice(0, -1).map((msg: any) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            }))
        ];

        const lastMessage = messages[messages.length - 1].content;

        let lastError = null;

        // Try models sequentially
        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });

                const result = await chat.sendMessage(lastMessage);
                const response = await result.response;
                const text = response.text();

                return NextResponse.json({ role: 'ai', content: text });
            } catch (error: any) {
                console.error(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // Continue if 404/not found, otherwise try next
                continue;
            }
        }

        // If we get here, all models failed
        throw lastError;

    } catch (error: any) {
        console.error("Chat API Error (All models failed):", error);
        return NextResponse.json(
            {
                error: `Tüm modeller denendi ve başarısız oldu. Son hata: ${error.message || "Unknown Error"}`,
                details: error.toString()
            },
            { status: 500 }
        );
    }
}
