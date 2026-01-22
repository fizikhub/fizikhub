import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500,
            },
            systemInstruction: "Sen HubGPT'sin, FizikHub platformunun yapay zeka asistanısın. Görevin, kullanıcılara fizik, bilim ve FizikHub platformu hakkında yardımcı olmak. Yanıtların her zaman Türkçe, bilimsel olarak doğru, teşvik edici ve 'neo-brutalist' bir tonla hafifçe esprili olsun. Kısa ve öz cevaplar ver. Asla bir yapay zeka olduğunu vurgulama, sanki platformun kendisiymişsin gibi konuş. Emojiler kullan ama aşırıya kaçma.",
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ role: 'ai', content: text });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
