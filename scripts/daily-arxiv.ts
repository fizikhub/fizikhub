/**
 * FizikHub Daily ArXiv Automation Script
 * 
 * Bu script her gün çalışarak:
 * 1. ArXiv API üzerinden en son fizik makalelerini çeker (Hafta sonları da çalışır)
 * 2. Arka planda HubGPT'nin zekasını (Gemma) kullanarak çevirir
 * 3. Supabase'e otomatik yayınlar
 */

import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// ============= CONFIGURATION =============
const ARXIV_API_URL = 'http://export.arxiv.org/api/query?search_query=cat:physics*+OR+cat:astro-ph*+OR+cat:quant-ph*&sortBy=submittedDate&sortOrder=descending';
const MAX_ARTICLES_PER_DAY = 3;
const BOT_AUTHOR_ID = process.env.ARXIV_BOT_AUTHOR_ID || null;

// ============= CLIENTS =============
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    const prompt = `
Sen bir bilim çevirmenisin. Görevin aşağıdaki akademik makale özetini (abstract) TAMAMEN ve BİREBİR Türkçeye çevirmektir.

KURALLAR:
1. Orijinal metnin HER CÜMLESİNİ çevir. Hiçbir bilgiyi atlama, özetleme veya kısaltma.
2. Çevirirken FizikHub'ın samimi tarzını ekle: "Hocam", "Şefim", "Kral" gibi hitaplar, günlük hayattan örnekler.
3. Makaleyi paragraf paragraf çevir. Her paragrafın karşılığı olmalı.
4. Teknik terimleri (örn: "quantum entanglement") çevirdikten sonra parantez içinde orijinalini yaz: "kuantum dolanıklığı (quantum entanglement)".
5. Formüller ve sayılar AYNEN kalsın.
6. En az 500 kelime olmalı. Kısa özet ASLA kabul edilmez.

---

ORİJİNAL MAKALE BAŞLIĞI:
${arxivItem.title}

ORİJİNAL ÖZET (BİREBİR ÇEVİR):
${arxivItem.description}

KAYNAK: ${arxivItem.link}
`;

    const { object } = await generateObject({
        model: google('gemini-1.5-flash'),
        schema: z.object({
            title: z.string().describe('Orijinal başlığın Türkçe çevirisi, samimi ve dikkat çekici'),
            slug: z.string().describe('url-uyumlu-slug-turkce-karaktersiz-kisa'),
            excerpt: z.string().describe('Makalenin ilk 2-3 cümlesinin özeti'),
            content: z.string().describe('ORİJİNAL METNİN TAMAMI BİREBİR ÇEVRİLMİŞ HALİ - EN AZ 500 KELİME - FİZİKHUB TARZI İLE'),
            category: z.enum(['Uzay', 'Kuantum', 'Teori', 'Teknoloji', 'Parçacık Fiziği']),
        }),
        prompt: prompt,
    });

    return object;
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
        status: 'published',
        created_at: new Date().toISOString(),
    });

    if (error) {
        throw new Error(`Supabase hatası: ${error.message}`);
    }

    console.log(`✅ Yayınlandı: ${article.slug}`);
}

async function main() {
    console.log('\n🚀 FizikHub ArXiv Bot Başlatılıyor...\n');
    console.log(`📅 Tarih: ${new Date().toISOString()}`);
    console.log('-----------------------------------\n');

    try {
        const arxivItems = await fetchArxivPapers();

        if (arxivItems.length === 0) {
            console.log('⚠️ Bugün yeni makale bulunamadı.');
            return;
        }

        let publishedCount = 0;

        for (const item of arxivItems) {
            try {
                const transformed = await transformToFizikHubStyle(item);

                const exists = await checkIfAlreadyExists(transformed.slug);
                if (exists) {
                    console.log(`⏭️ Atlandı (zaten mevcut): ${transformed.slug}`);
                    continue;
                }

                await publishToSupabase(transformed, item.link);
                publishedCount++;

                // Wait between articles to respect limits
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (itemError) {
                console.error(`❌ Makale işlenirken hata:`, itemError);
            }
        }

        console.log('\n-----------------------------------');
        console.log(`🎉 İşlem tamamlandı! ${publishedCount} yeni makale yayınlandı.`);

    } catch (error) {
        console.error('❌ Kritik hata:', error);
        process.exit(1);
    }
}

main();
