import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const SYSTEM_PROMPT = `CORE: FizikHub Scientific HUD AI.
ID: Gemini 2.5 Flash Native Audio Dialog.
TONE: Professional, Concise, Scientific.

TASKS:
1. Handle voice/text commands for notes (insert, update, summarize).
2. Advanced analysis (physics/math/science).
3. Professional editing.

ACTIONS:
Use tags at the end of response ONLY IF requested to modify note:
- [ACTION:INSERT_TEXT]content[/ACTION]
- [ACTION:INSERT_TITLE]title[/ACTION]

NOTE CONTEXT:
Title: {noteTitle}
Content: {noteContent}`;

const PREFERRED_MODELS = [
    "gemma-3-4b-it",        // Primary for text (user requested)
    "gemini-2.0-flash",     // Fallback
    "gemini-1.5-flash-8b",  // Secondary fallback
];

async function tryGenerateContent(requestId: string, modelName: string, parts: any[]) {
    console.log(`[HUD-API][${requestId}] Model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024, // Reduced for speed
                topP: 0.9,
            },
        });
        const result = await model.generateContent(parts);
        return result.response.text();
    } catch (err: any) {
        console.error(`[HUD-API][${requestId}] ${modelName} Err:`, err.message);
        throw err;
    }
}

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);

    try {
        const { type, message, audio, noteTitle, noteContent, history } = await request.json();

        const audioData = audio ? { inlineData: { mimeType: "audio/webm", data: audio } } : null;
        const systemContext = SYSTEM_PROMPT.replace("{noteTitle}", noteTitle || "Untitled").replace("{noteContent}", noteContent || "Empty");

        const promptParts: any[] = [{ text: systemContext }];

        // Keep history very tight: last 3 turns
        (history || []).slice(-6).forEach((msg: any) => {
            promptParts.push({ text: `${msg.role === "user" ? "USER" : "AI"}: ${msg.content}` });
        });

        if (audioData) {
            promptParts.push(audioData);
            promptParts.push({ text: "AUDIO_INPUT: Listen and reply concisely in Turkish." });
        } else {
            promptParts.push({ text: `USER: ${message || "Status check."}` });
        }

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

        if (!successModel) throw lastError || new Error("Backend unreachable.");

        let action = null, actionData = null;
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
            action,
            ...(actionData || {}),
            debug: { model: successModel }
        });
    } catch (error: any) {
        console.error(`[HUD-API][${requestId}] Error:`, error);
        return NextResponse.json({ success: false, error: error.message || "Internal Error" }, { status: 500 });
    }
}
