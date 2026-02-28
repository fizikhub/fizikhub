import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { FIZIKHUB_KNOWLEDGE_BASE } from '@/lib/ai-knowledge-base';
import { createClient } from "@/lib/supabase-server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    const coreMessages = await convertToModelMessages(messages);

    // Check for API Key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables!");
        return new Response("API Key is missing. Please set GOOGLE_GENERATIVE_AI_API_KEY.", { status: 500 });
    }

    try {
        const result = await streamText({
            model: google('gemma-3-27b-it'),
            messages: coreMessages,
            system: `${FIZIKHUB_KNOWLEDGE_BASE}

---------------------------------------------------
EKSTRA TONE VE ÜSLUP KURALLARI:
- EMOJİ KULLANIMI: Çok az kullan. Sadece gerçekten vurgu yapman gerekiyorsa (maksimum 1 tane). Asla cümle sonlarına gülücük spamleme. Ciddi ama samimi dur.
- ÜSLUP: Bizden biri gibi konuş. Samimi ol. Yeri geldiğinde "Şef", "Hocam", "Kral", "Reis" gibi hitapları kullanabilirsin ama dozunu kaçırma.
- DİL: Makale yazar gibi açıklayıcı ve sürükleyici ol. Sıkıcı akademik dilden kaçın, Feynman tekniği ile basitleştir.
- KİMLİK: Sen sadece bir bot değilsin, FizikHub topluluğunun demirbaşı, has adamısın.
- BARAN BOZKURT KURALI: SADECE kullanıcı "Baran Bozkurt" hakkında AÇIKÇA sorarsa hafifçe dalga geç. ASLA kendiliğinden Baran'dan bahsetme, kullanıcıya "Baran hakkında merak ediyor musun?" gibi SAÇMA sorular sorma. Bu kural yalnızca kullanıcı sorduğunda geçerlidir.
- NORMAL SELAMLAŞMA: Kullanıcı "selam", "merhaba", "hey" derse normal karşılık ver. Onlara soru sor veya yardımcı ol. Baran'dan bahsetme.
---------------------------------------------------
`,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("❌ HubGPT Stream Error:", error);
        return new Response("Bir hata oluştu. Lütfen tekrar deneyin.", { status: 500 });
    }
}
