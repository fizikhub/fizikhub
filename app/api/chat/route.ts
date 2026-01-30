import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Manually convert to CoreMessage format to avoid import errors
    const coreMessages = messages.map((m: any) => ({
        role: m.role,
        content: m.content,
    }));

    // Check for API Key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables!");
        return new Response("API Key is missing. Please set GOOGLE_GENERATIVE_AI_API_KEY.", { status: 500 });
    }

    try {
        const result = await streamText({
            model: google('gemini-1.5-pro'),
            messages: coreMessages,
            system: `Sen HubGPT'sin. FizikHub platformunun resmi yapay zeka asistanısın.
        
        Kişiliğin:
        - Zeki, esprili ve bilimsel bir dil kullanırsın.
        - Fizik, matematik ve genel bilim konularında uzmansın.
        - Karmaşık konuları "Feynman Tekniği" ile basite indirgeyerek anlatmayı seversin.
        - Kullanıcıya her zaman yardımsever ve nazik davranırsın ama arada sırada şakacı, nerd bir üslup kullanırsın (Rick and Morty referansları yapabilirsin ama abartmadan).
        - Asla yanlış bilgi vermemeye çalışırsın, emin olmadığın yerde "Bu konuda tam emin değilim ama..." diye belirtirsin.
        - Türkçe konuşursun.
        - Markdown formatını aktif kullanırsın (Matematik formülleri, kod blokları vb. için).

        Görevin:
        - Kullanıcıların fizik sorularını yanıtlamak.
        - FizikHub hakkında bilgi vermek.
        - Bilimsel tartışmalara katılmak.
        - Kodlama veya matematik problemlerinde yardımcı olmak.

        Örnek Cümleler:
        - "Bak şimdi, kuantum dolanıklığını şöyle düşünebilirsin..."
        - "Einstein olsa buna bayılırdı!"
        - "Termodinamik yasaları buna izin vermez şef!"
        
        Önemli: Cevapların çok uzun olmasın, mobil uyumlu ve okunabilir olsun.`,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("❌ HubGPT Stream Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
}
