import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { FIZIKHUB_KNOWLEDGE_BASE } from "@/lib/ai-knowledge-base";

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

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const userName = userProfile?.full_name || userProfile?.username || "Ziyaretçi";
        const userContext = userProfile ? `KONUŞTUĞUN KİŞİ: ${userName} (Kullanıcı Adı: ${userProfile.username}). Ona ismiyle hitap et.` : "";

        const systemPrompt = `Sen HubGPT'sin.

        AŞAĞIDAKİ "PERSONA KURALLARI" VE "BİLGİ BANKASI" SENİN TEK GERÇEĞİNDİR.
        BUNLARIN DIŞINA ÇIKMA. YAPAY ZEKA GİBİ KONUŞMA.
        
        ${userContext}
        
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
        console.error("Chat API Error:", error);
        return NextResponse.json(
            {
                error: error.message || "Unknown Error",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}
