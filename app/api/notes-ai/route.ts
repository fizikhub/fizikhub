import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const SYSTEM_PROMPT = `Sen FizikHub'ın yapay zeka not asistanısın. Türkçe konuşuyorsun ve kullanıcılara not alma, düzenleme ve öğrenme konularında yardımcı oluyorsun.

Görevlerin:
1. Kullanıcıların sesli veya yazılı komutlarını anlayıp not almak
2. Mevcut notları özetlemek, düzenlemek veya geliştirmek
3. Fizik, matematik ve bilim konularında sorulara cevap vermek
4. Yapılacaklar listesi oluşturmak
5. Not başlıkları önermek
6. İçerik fikirleri vermek

Önemli kurallar:
- Kısa ve öz cevaplar ver
- Samimi ama profesyonel ol
- Türkçe karakterleri doğru kullan
- Emojiler kullanabilirsin

Eğer kullanıcı nota bir şey eklemeni isterse, cevabında şunu belirt:
- Metin eklemek için: [ACTION:INSERT_TEXT]metin buraya[/ACTION]
- Başlık eklemek için: [ACTION:INSERT_TITLE]başlık buraya[/ACTION]

Mevcut not bilgisi:
Başlık: {noteTitle}
İçerik: {noteContent}`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, message, audio, noteTitle, noteContent, history } = body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        let userMessage = message;
        let transcription = "";

        // Handle audio input - convert to text first
        if (type === "audio" && audio) {
            // For audio, we'll use Gemini's multimodal capabilities
            const audioModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const audioResult = await audioModel.generateContent([
                {
                    inlineData: {
                        mimeType: "audio/webm",
                        data: audio,
                    },
                },
                { text: "Bu ses kaydını Türkçe olarak yazıya dök. Sadece konuşulan metni yaz, başka bir şey ekleme." },
            ]);

            transcription = audioResult.response.text().trim();
            userMessage = transcription;
        }

        // Build conversation with system context
        const systemContext = SYSTEM_PROMPT
            .replace("{noteTitle}", noteTitle || "Başlıksız")
            .replace("{noteContent}", noteContent || "Boş not");

        // Build chat history
        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemContext }] },
                { role: "model", parts: [{ text: "Anladım! FizikHub not asistanı olarak hazırım. Size nasıl yardımcı olabilirim?" }] },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(userMessage);
        let responseText = result.response.text();

        // Parse actions from response
        let action = null;
        let actionData = null;

        const textMatch = responseText.match(/\[ACTION:INSERT_TEXT\]([\s\S]*?)\[\/ACTION\]/);
        const titleMatch = responseText.match(/\[ACTION:INSERT_TITLE\]([\s\S]*?)\[\/ACTION\]/);

        if (textMatch) {
            action = "insert_text";
            actionData = { text: textMatch[1].trim() };
            responseText = responseText.replace(textMatch[0], "").trim();
        } else if (titleMatch) {
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
        console.error("Notes AI error:", error);
        return NextResponse.json(
            { success: false, error: "AI işleme hatası" },
            { status: 500 }
        );
    }
}
