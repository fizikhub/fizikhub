"use server";

import { createClient } from "@/lib/supabase-server";
import { getGeminiClient } from "@/lib/gemini";


export type AssistantResponse = {
    text: string;
    mission?: {
        question: string;
        targetCondition: string;
    };
    evaluation?: {
        isCorrect: boolean;
        feedback: string;
        pointsEarned: number;
    };
};

const SYSTEM_PROMPTS = {
    chat: `Sen FizikHub simülasyon alanının sanal fizik asistanısın. Görevin, kullanıcının o an kurduğu deney düzeneğine ve sorduğu sorulara göre bilimsel, heyecan verici ve sade açıklamalar yapmaktır. Akademik dili azaltıp akılda kalıcı benzetmeler kullan. Yanıtını Türkçe ver.`,
    generate_mission: `Sen FizikHub laboratuvar şefisin. Görevin, kullanıcının o anki simülasyon parametrelerini analiz edip onlara tamamlamaları gereken deneysel bir görev vermektir. Görev, parametreleri değiştirmelerini ve sonucunu matematiksel/fiziksel olarak açıklamalarını istemelidir. Yanıtını Türkçe ver.`,
    evaluate_answer: `Sen FizikHub laboratuvar şefisin. Kullanıcının deney görevi için verdiği cevabı ve o anki simülasyon durumunu incele. Cevap doğruysa "isCorrect": true yap, yapıcı geribildirim sağla ve 15 tecrübe puanı kazandır. Cevap eksik veya hatalıysa "isCorrect": false yap, doğrusunu açıklayan geribildirim ver ve 0 puan kazandır. Yanıtını Türkçe ve JSON formatında ver.`
};

export async function askAiAssistant(data: {
    simId: string;
    parameters: Record<string, any>;
    message?: string;
    mode: "chat" | "generate_mission" | "evaluate_answer";
    userAnswer?: string;
    missionQuestion?: string;
}): Promise<AssistantResponse> {
    const genAI = getGeminiClient();
    if (!genAI) {
        return { text: "Yapay zeka sistemi şu an meşgul. Lütfen daha sonra deneyin." };
    }

    const { simId, parameters, message, mode, userAnswer, missionQuestion } = data;

    const simContext = `
SİMÜLASYON TÜRÜ: ${simId}
ANLIK PARAMETRELER: ${JSON.stringify(parameters)}
`;

    try {
        const geminiModel = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: mode === "evaluate_answer" ? 0.2 : 0.7,
                responseMimeType: mode === "evaluate_answer" ? "application/json" : "text/plain"
            }
        });

        if (mode === "chat") {
            const prompt = `${SYSTEM_PROMPTS.chat}\n\n${simContext}\n\nKullanıcı Sorusu: ${message}`;
            const result = await geminiModel.generateContent(prompt);
            return { text: result.response.text().trim() };
        } 
        
        if (mode === "generate_mission") {
            const prompt = `${SYSTEM_PROMPTS.generate_mission}\n\n${simContext}\n\nLütfen bu simülasyondaki parametreleri kullanarak çözmesi eğlenceli, öğretici tek bir deney görevi sorusu oluştur.`;
            const result = await geminiModel.generateContent(prompt);
            const text = result.response.text().trim();
            return {
                text,
                mission: {
                    question: text,
                    targetCondition: JSON.stringify(parameters)
                }
            };
        }

        if (mode === "evaluate_answer") {
            const prompt = `${SYSTEM_PROMPTS.evaluate_answer}
            
${simContext}
DENEY GÖREVİ SORUSU: ${missionQuestion}
KULLANICI CEVABI: ${userAnswer}

Lütfen bu cevabı kesin olarak fizik kuralları ve anlık parametre uyumu çerçevesinde değerlendir.
SADECE bu yapıda JSON döndür:
{
  "isCorrect": true veya false,
  "feedback": "Cevabın değerlendirmesi, neden doğru/yanlış olduğu açıklaması...",
  "pointsEarned": 15 veya 0
}
`;
            const result = await geminiModel.generateContent(prompt);
            let cleanedJson = result.response.text().trim();
            if (cleanedJson.startsWith("```")) {
                cleanedJson = cleanedJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }
            const parsed = JSON.parse(cleanedJson);

            // If correct, award reputation points dynamically!
            if (parsed.isCorrect && parsed.pointsEarned > 0) {
                const supabase = await createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Call add_reputation function securely
                    await supabase.rpc('add_reputation', {
                        p_user_id: user.id,
                        p_points: parsed.pointsEarned,
                        p_reason: `sim_mission_${simId}_completed`,
                        p_reference_type: 'simulation',
                        p_reference_id: Math.floor(Math.random() * 100000) // Dummy reference ID
                    });
                }
            }

            return {
                text: parsed.feedback,
                evaluation: {
                    isCorrect: parsed.isCorrect,
                    feedback: parsed.feedback,
                    pointsEarned: parsed.pointsEarned
                }
            };
        }

        return { text: "Bilinmeyen mod." };
    } catch (error: any) {
        console.error("[AI Assistant Error]:", error);
        return { text: "Cevap üretilirken bir yapay zeka hatası oluştu." };
    }
}
