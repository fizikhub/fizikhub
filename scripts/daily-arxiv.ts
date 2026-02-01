/**
 * FizikHub Daily ArXiv Automation Script
 * 
 * Bu script her gün çalışarak:
 * 1. ArXiv API üzerinden en son fizik makalelerini çeker (Hafta sonları da çalışır)
 * 2. Gemini Flash ile FizikHub tarzına çevirir
 * 3. Supabase'e otomatik yayınlar
 * 
 * Maliyet: 0 TL (Tamamen ücretsiz API'ler kullanılır)
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============= CONFIGURATION =============
// ArXiv API (Search) üzerinden son fizik makalelerini çeker
const ARXIV_API_URL = 'http://export.arxiv.org/api/query?search_query=cat:physics*+OR+cat:astro-ph*+OR+cat:quant-ph*&sortBy=submittedDate&sortOrder=descending';
const MAX_ARTICLES_PER_DAY = 3; // Günde kaç makale çekilecek
const BOT_AUTHOR_ID = process.env.ARXIV_BOT_AUTHOR_ID || null; // Supabase'deki bot kullanıcı ID'si

// ============= CLIENTS =============
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// ============= STYLE GUIDE (FizikHub Tarzı) =============
const FIZIKHUB_STYLE_GUIDE = `
Sen FizikHub'ın "Kozmik Haberci" botusun. Görevi, sıkıcı akademik makaleleri eğlenceli ve anlaşılır hale getirmek.

ÜSLUP KURALLARI:
1. "Hocam", "Şefim", "Kral" gibi samimi hitaplar kullan.
2. Karmaşık terimleri günlük hayattan örneklerle açıkla (makarna, çay, halı saha gibi).
3. Ara sıra espri yap ama bilimsel doğruluğu koru.
4. "Beyin yandı mı?", "Hoppaaa", "İlginç değil mi?" gibi FizikHub kalıplarını kullan.
5. Akademik jargondan kaçın, herkesin anlayacağı dilde yaz.
6. Her makalenin sonunda okuyucuyu düşünmeye davet et.

ÖRNEK ÜSLUP:
- "Einstein görse gözleri yaşarırdı" 
- "Amiyane tabirle, atomlar da sosyalleşmek istiyor"
- "Bu noktada matematik 404 hatası aldı"

ÖNEMLİ: Bilimsel gerçekleri (sayılar, formüller, isimler) değiştirme, sadece anlatım dilini FizikHub'a uyarla.
`;

// ============= HELPER FUNCTIONS =============

interface ArxivItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    creator: string;
}

async function fetchArxivPapers(): Promise<ArxivItem[]> {
    console.log('📡 ArXiv API (Search) üzerinden makaleler çekiliyor...');

    const url = `${ARXIV_API_URL}&max_results=${MAX_ARTICLES_PER_DAY}`;
    const response = await fetch(url);
    const xmlText = await response.text();

    // Atom XML parsing (ArXiv API <entry> formatını kullanır)
    const items: ArxivItem[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xmlText)) !== null && items.length < MAX_ARTICLES_PER_DAY) {
        const entryXml = match[1];

        const title = entryXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim() || '';
        const link = entryXml.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || '';
        const summary = entryXml.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.replace(/\s+/g, ' ').trim() || '';
        const published = entryXml.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';
        const author = entryXml.match(/<name>([\s\S]*?)<\/name>/)?.[1]?.trim() || 'ArXiv';

        if (title && summary) {
            items.push({
                title,
                link,
                description: summary,
                pubDate: published,
                creator: author
            });
        }
    }

    console.log(`✅ ${items.length} makale bulundu.`);
    return items;
}

async function transformToFizikHubStyle(arxivItem: ArxivItem): Promise<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
}> {
    console.log(`🧠 AI dönüşümü: "${arxivItem.title.substring(0, 50)}..."`);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
${FIZIKHUB_STYLE_GUIDE}

---

Aşağıdaki ArXiv makalesini FizikHub tarzında Türkçeye çevir ve yeniden yaz:

ORIJINAL BAŞLIK: ${arxivItem.title}

ORIJINAL ÖZET (Abstract): ${arxivItem.description}

KAYNAK: ${arxivItem.link}

---

Lütfen şu formatta cevap ver (JSON):
{
    "title": "Türkçe, eğlenceli ve dikkat çekici başlık",
    "slug": "url-uyumlu-slug-turkce-karaktersiz",
    "excerpt": "2-3 cümlelik merak uyandırıcı özet",
    "content": "Makalenin tam içeriği, en az 300 kelime, FizikHub tarzında",
    "category": "Uzay veya Kuantum veya Teori veya Teknoloji veya Parçacık Fiziği"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // JSON'u parse et
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('AI geçerli JSON üretmedi');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
}

async function checkIfAlreadyExists(slug: string): Promise<boolean> {
    const { data } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .single();

    return !!data;
}

async function publishToSupabase(article: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
}, sourceLink: string): Promise<void> {
    console.log(`📤 Supabase'e yayınlanıyor: "${article.title}"`);

    const { error } = await supabase.from('articles').insert({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content + `\n\n---\n\n*Bu makale [ArXiv](${sourceLink}) kaynağından otomatik olarak çevrilmiştir. Orijinal makaleyi okumak için [buraya tıklayın](${sourceLink}).*`,
        category: article.category,
        author_id: BOT_AUTHOR_ID,
        status: 'published', // 'draft' yaparak admin onayı bekleyebilirsin
        created_at: new Date().toISOString(),
    });

    if (error) {
        throw new Error(`Supabase hatası: ${error.message}`);
    }

    console.log(`✅ Yayınlandı: ${article.slug}`);
}

// ============= MAIN EXECUTION =============

async function main() {
    console.log('\n🚀 FizikHub ArXiv Bot Başlatılıyor...\n');
    console.log(`📅 Tarih: ${new Date().toISOString()}`);
    console.log('-----------------------------------\n');

    try {
        // 1. ArXiv'den makaleleri çek
        const arxivItems = await fetchArxivPapers();

        if (arxivItems.length === 0) {
            console.log('⚠️ Bugün yeni makale bulunamadı.');
            return;
        }

        let publishedCount = 0;

        for (const item of arxivItems) {
            try {
                // 2. AI ile dönüştür
                const transformed = await transformToFizikHubStyle(item);

                // 3. Daha önce yayınlanmış mı kontrol et
                const exists = await checkIfAlreadyExists(transformed.slug);
                if (exists) {
                    console.log(`⏭️ Atlandı (zaten mevcut): ${transformed.slug}`);
                    continue;
                }

                // 4. Yayınla
                await publishToSupabase(transformed, item.link);
                publishedCount++;

                // Rate limiting için kısa bekleme
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (itemError) {
                console.error(`❌ Makale işlenirken hata:`, itemError);
                // Bir makale hata verse bile diğerlerine devam et
            }
        }

        console.log('\n-----------------------------------');
        console.log(`🎉 İşlem tamamlandı! ${publishedCount} yeni makale yayınlandı.`);

    } catch (error) {
        console.error('❌ Kritik hata:', error);
        process.exit(1);
    }
}

// Script'i çalıştır
main();
