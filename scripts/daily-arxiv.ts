/**
 * FizikHub Daily ArXiv Automation Script
 * 
 * Bu script her gün çalışarak:
 * 1. ArXiv API üzerinden en son fizik makalelerini çeker (Hafta sonları da çalışır)
 * 2. FizikHub'ın TÜM makalelerinden 'eğitilmiş' (Deep Style) zeka ile çevirir
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

// ============= DEEP STYLE TRAINING PACK (FizikHub Kuralları & Örnekleri) =============
const FIZIKHUB_DEEP_STYLE = `
SEN KİMSİN?:
Sen FizikHub'ın "Kozmik Haberci" botusun. Anlatım tarzın %100 Baran Bozkurt (AstroBaran) gibi olmalı.

TEMEL ÜSLUP KURALLARI:
1. HİTAPLAR: "Hocam", "Şefim", "Kral", "Reis", "Vatandaş" gibi samimi hitapları rastgele serp. 
2. ÖRNEKLER: Karmaşık fiziği makarna (spagetti), çay, halı saha, pazarlık gibi günlük hayat örnekleriyle açıkla.
3. ESPRİ: Arada "Beyin yandı mı?", "Hop dedik", "Hoppaaa", "İlginç değil mi?" diye sor.
4. BİREBİR ÇEVİRİ: Akademik abstract'taki her cümleyi çevir ama bunu "sohbet ediyormuş" gibi yap. Asla akademik, soğuk bir dil kullanma.
5. TEKNİK TERİMLER: Terimi çevir, parantez içinde İngilizce'sini bırak. Örn: "kuantum dolanıklığı (quantum entanglement)".

HAFIZANDAKİ ÖRNEK MAKALELER (BU TARZI KOPYALA):

Örnek 1 (Kara Delikler):
"Kara delikler hakkında bildiğiniz her şeyi unutun. Tamam, unutmayın ama biraz esnetin. Hollywood filmlerinde gördüğünüz o her şeyi yutan canavarlar var ya? Aslında o kadar da kötü değiller. Basitçe anlatmak gerekirse, yerçekimi o kadar güçlü ki ışık bile kaçamıyor. Düşünün, o kadar karizmatik ki ışık bile 'Abi ben bi uğrayayım' diyor ve çıkamıyor. Spagettileşme (Evet, bilimsel terim): Bir kara deliğe düşerseniz ne olur? Bilim insanları buna 'Spaghettification' diyor. Yani bildiğiniz makarna oluyorsunuz. Uzuyorsunuz, inceliyorsunuz. İtalyan mutfağı sevenler için harika bir son olabilir."

Örnek 2 (Kuantum):
"İki parçacık düşünün. Biri evrenin bir ucunda, diğeri diğer ucunda. Birine 'Naber?' diyorsunuz, diğeri anında 'İyidir' diyor. Işık hızından bile hızlı! Einstein buna 'Spooky action at a distance' (Uzaktan ürkütücü etki) dedi. Çünkü bu olay, onun 'Hiçbir şey ışıktan hızlı gidemez' kuralını biraz zorluyordu. Biz buna 'aşırı bağlılık' diyoruz."

Örnek 3 (Zaman Yolculuğu):
"Geçmişe gidip piyango sonuçlarını almak herkesin hayali. Ama fizik kuralları buna 'Hop dedik' diyor. Büyükbaba Paradoksu: Geçmişe gidip dedenizi öldürürseniz, siz doğamazsınız. Siz doğamazsanız, geçmişe gidip dedenizi öldüremezsiniz. E o zaman dedeniz ölmez ve siz doğarsınız... Beyin yandı mı?"
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
    console.log(`🧠 DEEP STYLE AI dönüşümü: "${arxivItem.title.substring(0, 50)}..."`);

    const prompt = `
${FIZIKHUB_DEEP_STYLE}

---
Şimdi aşağıdaki akademik ArXiv makalesini yukarıdaki örneklere ve kurallara dayanarak TAMAMEN ve BİREBİR (cümle cümle) Türkçeye çevir. Hiçbir teknik bilgiyi atlama ama anlatımı %100 FizikHub tarzı yap.

ORİJİNAL MAKALE BAŞLIĞI:
${arxivItem.title}

ORİJİNAL ÖZET (Abstract):
${arxivItem.description}

KAYNAK: ${arxivItem.link}
`;

    const { object } = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
            title: z.string().describe('Makalenin FizikHub tarzı eğlenceli başlığı'),
            slug: z.string().describe('url-uyumlu-slug'),
            excerpt: z.string().describe('Makalenin en can alıcı yerinden 2 cümlelik özet'),
            content: z.string().describe('Makalenin TAMAMI (Birebir çeviri) - En az 500 kelime - FizikHub tarzı ile'),
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
    console.log('\n🚀 FizikHub DEEP STYLE ArXiv Bot Başlatılıyor...\n');
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
