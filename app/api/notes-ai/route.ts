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

// Define a list of models to try in order of preference
const PREFERRED_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
];

async function tryGenerateContent(requestId: string, modelName: string, parts: any[]) {
    console.log(`[AI-API][${requestId}] Attempting with model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 2048,
                topP: 0.95,
            },
        });

        // For audio, we use simpler approach if the specific model supports it
        const result = await model.generateContent(parts);
        const response = await result.response;
        return response.text();
    } catch (err: any) {
        console.error(`[AI-API][${requestId}] Model ${modelName} failed:`, err.message);
        throw err;
    }
}

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[AI-API][${requestId}] Request received`);

    try {
        const body = await request.json();
        const { type, message, audio, noteTitle, noteContent, history } = body;

        console.log(`[AI-API][${requestId}] Request Type: ${type}`);

        let userMessage = message;
        let transcription = "";
        let audioData: any = null;

        // If audio is provided, prepare it for the prompt
        if (type === "audio" && audio) {
            console.log(`[AI-API][${requestId}] Audio data received (length: ${audio.length})`);
            audioData = {
                inlineData: {
                    mimeType: "audio/webm",
                    data: audio,
                },
            };
        }

        const systemContext = SYSTEM_PROMPT
            .replace("{noteTitle}", noteTitle || "Başlıksız")
            .replace("{noteContent}", noteContent || "İçerik boş");

        // Build the prompt parts
        const promptParts: any[] = [];
        promptParts.push({ text: systemContext });

        // Add history
        (history || []).forEach((msg: { role: string; content: string }) => {
            promptParts.push({ text: `${msg.role === "user" ? "Kullanıcı" : "Asistan"}: ${msg.content}` });
        });

        // Add current input
        if (audioData) {
            promptParts.push(audioData);
            promptParts.push({ text: "Kullanıcının bu ses kaydını dinle ve Türkçe olarak yanıt ver. Eğer bir komutsa (not al vs.) eyleme dök." });
        } else {
            promptParts.push({ text: `Kullanıcı: ${userMessage || "Merhaba"}` });
        }

        // Try models in order
        let responseText = "";
        let successModel = "";
        let lastError = null;

        for (const modelName of PREFERRED_MODELS) {
            try {
                responseText = await tryGenerateContent(requestId, modelName, promptParts);
                successModel = modelName;
                break;
            } catch (err) {
                lastError = err;
                continue;
            }
        }

        if (!successModel) {
            throw lastError || new Error("Hiçbir model yanıt vermedi");
        }

        console.log(`[AI-API][${requestId}] Success with ${successModel}`);

        // Extract transcription if it was an audio request (Gemini returns the text as part of response usually)
        if (type === "audio") {
            // Simplified: we'll treat the response as both the transcription and the dialogue
            // In a more complex setup, we could ask for both in one go.
            transcription = "[Ses Kaydı İşlendi]";
        }

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
            debug: { model: successModel }
        });
    } catch (error: any) {
        console.error(`[AI-API][${requestId}] Fatal Error:`, error);
        return NextResponse.json(
            { success: false, error: error.message || "Bir hata oluştu", details: error.toString() },
            { status: 500 }
        );
    }
}
