import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'AI servisi şu an kullanılamıyor (API Key eksik).' }, { status: 500 });
    }

    try {
        const { text, command } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Lütfen işlem yapılacak metni seçin.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let prompt = '';

        switch (command) {
            case 'improve':
                prompt = `Aşağıdaki metni fizik, bilim veya genel teknoloji bağlamını koruyarak, daha akıcı, okunabilir ve profesyonel bir dille yeniden yaz. Metnin orijinal anlamını değiştirme. Sadece düzeltilmiş metni ver.\n\nMetin: "${text}"`;
                break;
            case 'summarize':
                prompt = `Aşağıdaki metnin ana fikrini ve en önemli noktalarını 1-2 cümle ile kısaca özetle. Sadece özeti ver.\n\nMetin: "${text}"`;
                break;
            case 'continue':
                prompt = `Aşağıdaki metnin gidişatını, tonunu ve bağlamını (fizik, bilim vs.) analiz et ve mantıklı bir şekilde devam ettir. Sadece ekleyeceğin yeni devam metnini (en fazla 2-3 cümle) ver. Orijinal metni tekrarlama.\n\nMetin: "${text}"`;
                break;
            case 'fix_spelling':
                prompt = `Aşağıdaki metnin sadece yazım (imla) ve noktalama hatalarını düzelt. Kelimeleri veya cümle yapısını mecbur kalmadıkça değiştirme. Sadece düzeltilmiş halini ver.\n\nMetin: "${text}"`;
                break;
            default:
                return NextResponse.json({ error: 'Geçersiz komut.' }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const generatedText = response.text().trim();

        return NextResponse.json({ result: generatedText });
    } catch (error) {
        console.error('[Copilot API] Error:', error);
        return NextResponse.json({ error: 'Yapay zeka yanıt verirken bir hata oluştu.' }, { status: 500 });
    }
}
