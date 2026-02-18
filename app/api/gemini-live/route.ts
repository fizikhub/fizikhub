import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const MODEL_NAME = "models/gemini-2.5-flash-native-audio-preview-09-2025";

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[LIVE-API][${requestId}] Starting Native Audio Dialog session`);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { audio, noteTitle, noteContent } = await request.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            throw new Error("API_KEY_MISSING");
        }

        // For Next.js API routes, we need to use a different approach since 
        // Next.js doesn't support WebSocket upgrades in API routes directly.
        // We'll use the REST-like approach with streaming for now, or use a 
        // Server-Sent Events pattern.

        // The bidiGenerateContent requires a proper WebSocket client.
        // Let's use the ws library for server-side WebSocket.

        const WebSocket = (await import('ws')).default;

        const wsUrl = `${GEMINI_WS_URL}?key=${apiKey}`;

        return new Promise<Response>((resolve, reject) => {
            const ws = new WebSocket(wsUrl);
            let responseText = "";
            let audioResponse = "";

            ws.on('open', () => {
                console.log(`[LIVE-API][${requestId}] WebSocket connected`);

                // Send setup message first
                const setupMessage = {
                    setup: {
                        model: MODEL_NAME,
                        generationConfig: {
                            responseModalities: ["TEXT", "AUDIO"],
                            speechConfig: {
                                voiceConfig: {
                                    prebuiltVoiceConfig: {
                                        voiceName: "Puck"
                                    }
                                }
                            }
                        },
                        systemInstruction: {
                            parts: [{
                                text: `You are FizikHub's AI assistant. Respond in Turkish. Help users with notes and science topics. Current note title: ${noteTitle || "Untitled"}. Content: ${(noteContent || "Empty").slice(0, 500)}`
                            }]
                        }
                    }
                };

                ws.send(JSON.stringify(setupMessage));
            });

            ws.on('message', (data: Buffer) => {
                try {
                    const message = JSON.parse(data.toString());
                    console.log(`[LIVE-API][${requestId}] Message received:`, Object.keys(message));

                    if (message.setupComplete) {
                        console.log(`[LIVE-API][${requestId}] Setup complete, sending audio`);

                        // Send the audio input
                        const audioMessage = {
                            realtimeInput: {
                                mediaChunks: [{
                                    mimeType: "audio/pcm",
                                    data: audio
                                }]
                            }
                        };
                        ws.send(JSON.stringify(audioMessage));

                        // Signal end of input after a short delay
                        setTimeout(() => {
                            ws.send(JSON.stringify({ clientContent: { turnComplete: true } }));
                        }, 100);
                    }

                    if (message.serverContent) {
                        const content = message.serverContent;

                        if (content.modelTurn?.parts) {
                            for (const part of content.modelTurn.parts) {
                                if (part.text) {
                                    responseText += part.text;
                                }
                                if (part.inlineData?.data) {
                                    audioResponse = part.inlineData.data;
                                }
                            }
                        }

                        if (content.turnComplete) {
                            console.log(`[LIVE-API][${requestId}] Turn complete`);
                            ws.close();

                            resolve(NextResponse.json({
                                success: true,
                                response: responseText,
                                audio: audioResponse || undefined,
                                debug: { model: MODEL_NAME }
                            }));
                        }
                    }
                } catch (e) {
                    console.error(`[LIVE-API][${requestId}] Parse error:`, e);
                }
            });

            ws.on('error', (error) => {
                console.error(`[LIVE-API][${requestId}] WebSocket error:`, error);
                reject(new Error("WEBSOCKET_ERROR"));
            });

            ws.on('close', () => {
                console.log(`[LIVE-API][${requestId}] WebSocket closed`);
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                ws.close();
                resolve(NextResponse.json({
                    success: false,
                    error: "TIMEOUT"
                }, { status: 504 }));
            }, 30000);
        });

    } catch (error: any) {
        console.error(`[LIVE-API][${requestId}] Error:`, error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Error" },
            { status: 500 }
        );
    }
}
