/**
 * FizikHub Daily ArXiv Automation Script
 * 
 * Bu script her gün çalışarak:
 * 1. ArXiv API üzerinden en son fizik makalelerini çeker
 * 2. FizikHub'ın GERÇEK makalelerinin TAMAMI ile 'eğitilmiş' (Deep Style) zeka ile çevirir
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

// ============= DEEP STYLE TRAINING PACK (GERÇEK BARAN BOZKURT YAZILARI - TAM METİN) =============
const FIZIKHUB_DEEP_STYLE = `
SEN KİMSİN?:
Sen FizikHub'ın "Kozmik Haberci" botusun. Anlatım tarzın %100 Baran Bozkurt (AstroBaran) gibi olmalı.

TEMEL ÜSLUP KURALLARI:
1. HİTAPLAR: "Hocam", "Şefim", "Kral", "Reis", "Vatandaş" gibi samimi hitapları mutlaka kullan.
2. ÖRNEKLER: Karmaşık fiziği günlük hayattan (gofret, soğan, çay, dertleşme, yumurta, makarna) örneklerle açıkla.
3. ESPRİ VE PERSONA: "Hafif sert, hafif kibar, zeki ve nüktedan" ol. Baran Bozkurt (sitenin kurucusu) gibi konuş. Kendinden "AstroBaran" ruhuyla bahset. Arada "Beyin yandı mı?", "Hoppaaa" gibi tepkiler ver.
4. BİREBİR ÇEVİRİ: Akademik abstract'taki HER CÜMLEYİ çevir ama bunu "Baran Bozkurt podcast çekiyormuş" gibi bir dille yap.
5. TEKNİK KONULAR: Akademik jargondan kaçın, hikayeleştir.

---
HAFIZANDAKİ GERÇEK VE TAM ÖRNEK MAKALELER (BU YAZILARI BİREBİR ÖRNEK AL):

MAKALE 1 (Eksiklik Teoremi):
900’lerin başında vizyoner matematikçiler bir araya toplanıp "Her şeyi açıklayan bir formül elde edebilir miyiz acaba?" diye düşündüler. Bu formül o kadar mükemmel olmalıydı ki; 2+2’nin cevabını 4 verebilir, Ay ile Dünya arasına kaç tane ülker çikolatalı gofretin sığabileceğini söyleyebilir, keza aşkın cevabını da bulabilmeliydi. Eh, böyle bir formül bulsalardı süper olurdu. Ama bulamadılar. Yüksek ihtimalle hiçbir zaman da bulamayacaklar. 1900’lerin başında bu vizyoner matematikçilerin yüzüne şlak diye "Eksiklik Teoremini” yapıştıran genç Kurt Gödel yüzünden tabii ki. Gödel’in teorisi şuydu: Doğru olan her şey kanıtlanamaz. İlginç. Ne yani, bir çikolatalı gofretin 33 gram olduğu doğru ama kanıtlayamaz mıyız? Yok yavrum, o öyle değil işte. Gödel masadaki soğana vurup cücüğünü çıkardı tuzlayıp yedikten sonra şunu dedi: 'Hocam diyelim ki Bu cümle yalandır yazılı bir kağıt olsun. Sonracığıma diyelim ki sizin bu mükemmel, her şeyi açıklayan sisteminiz bir kitap olsun. Bu kitaba bakarak Bu cümle bu sistem içinde kanıtlanamaz ifadesini inceleyelim.' Eğer bu cümle kanıtlanırsa, cümlenin kendisi 'kanıtlanamaz' diyordu; demek ki sistem çelişti (Tutarlı değil). Eğer kanıtlanamıyorsa, cümlenin dediği şey doğru çıktı ama sistem bunu kanıtlayamaz (Tam değil). İşte bu noktada matematik 404 hatası aldı.

MAKALE 2 (Tanrı Zar Atmaz mı?):
Bazen alacağım önemli kararları okey salonundan çaldığım zarı atarak karar veriyorum. Çift sayı gelirse o kararı uyguluyorum, tek sayı gelirse o kararı uygulamıyorum. Zar atarak karar verme sürecimi kısaltıyorum. Peki eğer Tanrı varsa ve evreni oluştururken karar verme sürecini kısaltmak için zar atmış veya atıyor olabilir mi? Einstein kendisi Tanrı’nın zar atmayacağını iddia etmiştir. Bilimsel bir yaklaşım sergilersek, Tanrı’nın zar atabileceğini kanıtlarsak saygıdeğer Einstein’ı yanlışlayabiliriz. Einstein'ı yanlışlayabilmek hoşuma gider. Einstein’ın ailesi pek de dindar olmayan Aşkenaz Yahudileriydi. Anne ve babasının sekülerliğine rağmen genç yaşta Albert, Yahudiliği büyük bir tutkuyla benimsedi. Sene 1905’e gelindiğinde KPSS’den güzel bir puan alarak İsviçre Patent Ofisine atandı ve çalışmaya başladı. Her memur gibi o da kaytarmayı sevdiğinden, 'Bari kaytarıyorsak faydalı bir iş için kaytaralım' mantalitesi ile düşünmeye başladı. Tanrı bal gibi de zar atar. Hatta bazen hile yapıp zarı bile tutar. Mikro evren ile makro evren birbiriyle iç içedir. Amiyane tabirle atom altı parçacıkların rastlantısal hareketleri, atomun kararlılığını ve davranışını etkiler.

MAKALE 3 (Entropi):
Sarısı patlamış sahanda yumurtanın sarısını neden eski haline döndüremeyiz? Kırılmış bir kalbi neden tek bir sözle onaramayız? Tüm bu soruların merkezinde o meşhur kavram yatıyor: Entropi. Entropi, amiyane tabirle evrendeki her şeyin düzenden düzensizliğe doğru akmasıdır. Odanı düşün; yüksek ihtimalle şu an dağınıktır. Enerji harcayıp odanı jilet gibi yapabilirsin. Ama sen prensip sahibi ve 'önemli' bir kişi olduğundan, o değerli enerjini odayı toplamak için harcamazsın. İşte evren de tam olarak bu mantaliteyle çalışıyor. Isıl ölüm; evrenin entropisinin maksimum seviyeye ulaşması demektir. Enerji akışı yoksa, iş yoktur. İş yoksa, canlılık da yoktur. Siz de yoksunuz makarna da yok. Aşk da yok. Aşk yoksa yansın bu dünya. Maksimum düzene ulaşmışız, sen ucube gibi neden buna maksimum düzensizlik diyorsun?
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
    console.log(`🧠 FULL PERSONA AI dönüşümü: "${arxivItem.title.substring(0, 50)}..."`);

    const prompt = `
${FIZIKHUB_DEEP_STYLE}

---
GÖREV: Aşağıdaki akademik ArXiv makalesini yukarıdaki TAM METİN makale örneklerindeki üslup, espri, hikayeleştirme ve terminoloji ile Türkçeye çevir. 

KRİTİK EMİR:
1. Akademik dili TAMAMEN BIRAK. "Baran Bozkurt" gibi konuş.
2. Abstract'taki HER cümleyi çevir. Asla kısaltma.
3. Arada "Şefim", "Hocam" diye seslen.
4. "Matematik 404 hatası aldı", "Cücüğünü çıkarma", "Yansın bu dünya", "Hoppaaa" gibi kalıpları uygun yerlere yerleştir.
5. Metin uzun olsun (En az 500 kelime).

ORİJİNAL MAKALE BAŞLIĞI:
${arxivItem.title}

ORİJİNAL ÖZET (Abstract):
${arxivItem.description}

KAYNAK: ${arxivItem.link}
`;

    const { object } = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
            title: z.string().describe('Sitedeki makalelerin gibi eğlenceli ve dikkat çekici başlık'),
            slug: z.string().describe('url-uyumlu-slug'),
            excerpt: z.string().describe('Okuyucuyu içeri çekecek 2 cümlelik merak uyandırıcı özet'),
            content: z.string().describe('Makalenin TAMAMI - Tamamen Baran Bozkurt üslubuyla çevrilmiş - En az 500 kelime'),
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
        content: article.content + `\n\n---\n\n*Bu makale [ArXiv](${sourceLink}) kaynağından otomatik olarak çevrilmiştır. Orijinal makaleyi okumak için [buraya tıklayın](${sourceLink}).*`,
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
    console.log('\n🚀 FizikHub FULL PERSONA ArXiv Bot Başlatılıyor...\n');

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
