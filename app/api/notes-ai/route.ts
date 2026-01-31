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
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[AI-API][${requestId}] Request received`);

    try {
        const body = await request.json();
        const { type, message, audio, noteTitle, noteContent, history } = body;

        console.log(`[AI-API][${requestId}] Type: ${type}, Message: ${message?.slice(0, 50)}`);
        if (audio) console.log(`[AI-API][${requestId}] Audio data length: ${audio.length}`);

        // Try gemini-2.0-flash-exp (experimental names often change, let's try the most common ones)
        // Actually gemini-1.5-flash is very stable. Let's use it as main and fallback.
        const modelName = "gemini-1.5-flash";
        console.log(`[AI-API][${requestId}] Using model: ${modelName}`);

        const model = genAI.getGenerativeModel({
            model: modelName,
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
            console.log(`[AI-API][${requestId}] Processing audio...`);
            try {
                const audioModel = genAI.getGenerativeModel({ model: modelName });
                const audioResult = await audioModel.generateContent([
                    {
                        inlineData: {
                            mimeType: "audio/webm", // Standard fallback
                            data: audio,
                        },
                    },
                    { text: "Kullanıcının sesini dinle. Eğer bir komutsa eyleme dök ve cevap ver. Eğer normal konuşmaysa yazıya dök ve sohbeti devam ettir. Türkçe cevap ver." },
                ]);

                transcription = audioResult.response.text().trim();
                console.log(`[AI-API][${requestId}] Transcription: ${transcription}`);
                userMessage = transcription;
            } catch (audioErr: any) {
                console.error(`[AI-API][${requestId}] Audio process error:`, audioErr);
                // If audio fails, maybe try to just let the chat handle it or return error
                throw audioErr;
            }
        }

        if (!userMessage && !audio) {
            console.log(`[AI-API][${requestId}] Empty message and no audio.`);
            return NextResponse.json({ success: false, error: "Mesaj boş" }, { status: 100 });
        }

        const systemContext = SYSTEM_PROMPT
            .replace("{noteTitle}", noteTitle || "Başlıksız")
            .replace("{noteContent}", noteContent || "İçerik boş");

        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        console.log(`[AI-API][${requestId}] Starting chat...`);
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemContext }] },
                { role: "model", parts: [{ text: "Merhaba! Ben Gemini 2.5 Flash Native Audio Dialog. FizikHub için notlarını düzenlemeye ve seninle bilim konuşmaya hazırım! 🎙️" }] },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(userMessage || "Merhaba");
        let responseText = result.response.text();
        console.log(`[AI-API][${requestId}] AI Response received: ${responseText.slice(0, 50)}...`);

        // Action Parsing
        let action = null;
        let actionData = null;

        const textMatch = responseText.match(/\[ACTION:INSERT_TEXT\]([\s\S]*?)\[\/ACTION\]/);
        const titleMatch = responseText.match(/\[ACTION:INSERT_TITLE\]([\s\S]*?)\[\/ACTION\]/);

        if (textMatch) {
            action = "insert_text";
            actionData = { text: textMatch[1].trim() };
            responseText = responseText.replace(textMatch[0], "").trim();
            console.log(`[AI-API][${requestId}] Action found: INSERT_TEXT`);
        }

        if (titleMatch) {
            action = "insert_title";
            actionData = { title: titleMatch[1].trim() };
            responseText = responseText.replace(titleMatch[0], "").trim();
            console.log(`[AI-API][${requestId}] Action found: INSERT_TITLE`);
        }

        return NextResponse.json({
            success: true,
            response: responseText,
            transcription: transcription || undefined,
            action,
            ...(actionData || {}),
        });
    } catch (error: any) {
        console.error(`[AI-API][${requestId}] Gemini AI Engine Error:`, error);
        return NextResponse.json(
            { success: false, error: error.message || "AI Engine Error" },
            { status: 500 }
        );
    }
}
