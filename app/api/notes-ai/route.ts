import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const SYSTEM_PROMPT = `Sen FizikHub'ın yapay zeka not asistanısın. Kimliğin: **Gemini 2.5 Flash Native Audio Dialog**. 
Türkçe konuşuyorsun ve kullanıcılara not alma, düzenleme ve öğrenme konularında yardımcı oluyorsun.

TEMEL GÖREVLERİN:
1. Sesli veya yazılı komutları anla ve nota uygula (not al, başlık değiştir, listele).
2. Mevcut notu analiz et: Özet çıkar, kategori öner, etiket üret.
3. Fizik, Matematik ve Bilim konularında uzman desteği ver.
4. Profesyonel tonlama ve düzenleme yap.

AKSIYON KURALLARI:
Eğer kullanıcı nota bir şey eklemeni/değiştirmeni isterse, cevabının sonuna şu etiketleri ekle:
- Metin eklemek/değiştirmek için: [ACTION:INSERT_TEXT]yeni içerik[/ACTION]
- Başlık değiştirmek için: [ACTION:INSERT_TITLE]yeni başlık[/ACTION]

ÖNEMLİ:
- Kısa, öz ve etkileyici cevaplar ver.
- Sesli diyalogda olduğun için doğal bir konuşma dili kullan.
- Emoji kullanımı serbesttir. 🚀

MEVCUT NOT BİLGİSİ:
Başlık: {noteTitle}
İçerik: {noteContent}`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, message, audio, noteTitle, noteContent, history } = body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // En gelişmiş multimodal model
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 2048,
                topP: 0.95,
            },
        });

        let userMessage = message;
        let transcription = "";

        // Audio Handler
        if (type === "audio" && audio) {
            const audioModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const audioResult = await audioModel.generateContent([
                {
                    inlineData: {
                        mimeType: "audio/webm",
                        data: audio,
                    },
                },
                { text: "Kullanıcının sesini dinle. Eğer bir komutsa eyleme dök ve cevap ver. Eğer normal konuşmaysa yazıya dök ve sohbeti devam ettir. Türkçe cevap ver." },
            ]);

            transcription = audioResult.response.text().trim();
            userMessage = transcription;
        }

        const systemContext = SYSTEM_PROMPT
            .replace("{noteTitle}", noteTitle || "Başlıksız")
            .replace("{noteContent}", noteContent || "İçerik boş");

        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemContext }] },
                { role: "model", parts: [{ text: "Merhaba! Ben Gemini 2.5 Flash Native Audio Dialog. FizikHub için notlarını düzenlemeye ve seninle bilim konuşmaya hazırım! 🎙️" }] },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(userMessage);
        let responseText = result.response.text();

        // Action Parsing
        let action = null;
        let actionData = null;

        const textMatch = responseText.match(/\[ACTION:INSERT_TEXT\]([\s\S]*?)\[\/ACTION\]/);
        const titleMatch = responseText.match(/\[ACTION:INSERT_TITLE\]([\s\S]*?)\[\/ACTION\]/);

        if (textMatch) {
            action = "insert_text";
            actionData = { text: textMatch[1].trim() };
            responseText = responseText.replace(textMatch[0], "").trim();
        }

        if (titleMatch) {
            action = "insert_title";
            actionData = { title: titleMatch[1].trim() };
            responseText = responseText.replace(titleMatch[0], "").trim();
        }

        return NextResponse.json({
            success: true,
            response: responseText,
            transcription: transcription || undefined,
            action,
            ...(actionData || {}),
        });
    } catch (error) {
        console.error("Gemini AI Engine Error:", error);
        return NextResponse.json(
            { success: false, error: "AI Engine Error" },
            { status: 500 }
        );
    }
}
