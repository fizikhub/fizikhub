# Fizikhub SEO/GEO Arastirmasi - 2026-05-25

Bu not, Fizikhub icin teknik SEO, GEO (Generative Engine Optimization), arama veritabani ve gelecekteki teknoloji yol haritasini ozetler. Ana prensip: AI arama icin yapilan her sey klasik SEO temeline dayanacak; ekstra "sihirli" markup yerine indexlenebilir, kaynakli, hizli ve metinsel olarak anlasilir sayfalar uretilecek.

## Resmi kaynaklardan cikan kararlar

- Google Search Central, AI Overviews ve AI Mode icin ayri bir teknik gereksinim olmadigini; sayfanin Google Search'te indexlenebilir ve snippet'a uygun olmasi gerektigini soyluyor. Bu yuzden Fizikhub'da `max-snippet:-1`, public canonical URL'ler, internal link agi, gorunur metin ve structured data tutarliligi oncelikli.
- Google, AI ozellikleri icin yeni bir AI dosyasi veya ozel schema gerekmedigini belirtiyor. Fizikhub'daki `llms.txt`, `ai-index.json` ve `ai-sitemap.xml` bu nedenle ranking vaadi degil; AI crawler'lara kanonik kaynak haritasi veren yardimci kesif yuzeyleri olarak tutulmali.
- Google'in people-first content rehberi, "Who, How, Why" ve E-E-A-T sinyallerini one cikariyor. Fizikhub icin yazar profilleri, kaynakca, guncelleme tarihi, konu agi ve simülasyon/test baglantilari daha degerli sinyaller.
- Structured data, sayfada gorunen ana icerigi temsil etmeli. Bu nedenle Article, QAPage, DefinedTerm, LearningResource, SoftwareApplication, ProfilePage ve BreadcrumbList semalari gorunen metinle ayni hikayeyi anlatmali.
- Supabase/Postgres tarafinda full-text search icin generated `tsvector`, RPC ile ranking, GIN/trigram indeksleri ve Index Advisor kontrolleri dogru yol. Fizikhub'da semantic vector + Turkish FTS hibrit arama bu yaklasima uyuyor.
- OpenAI tarafinda `OAI-SearchBot` ChatGPT search gorunurlugu icin, `GPTBot` model egitimi icin, `ChatGPT-User` kullanici tetiklemeli gezinti icin ayriliyor. Anthropic de `ClaudeBot`, `Claude-SearchBot`, `Claude-User` ayrimini yapiyor. Robots ve crawler bypass davranisi bu ayrimi bozmadan yonetilmeli.

## Bu calismada uygulananlar

- Gemini embedding uretimi uygulama icinde de 768 boyuta sabitlendi. Veritabani `documents.embedding vector(768)` oldugu icin webhook, global search ve backfill ayni boyutta vektor uretir.
- Public global arama ve search-sync webhook'u, forum sorularinda yalnizca `status = 'published'` kayitlarini semantic/text index yuzeyine alacak sekilde daraltildi.
- AI/search/social crawler istekleri public SEO path'lerde Supabase session yenileme isini bypass edecek sekilde hafifletildi. Private path'ler bu bypass'a dahil degil.
- Forum, test ve simülasyon metadata'larinda Googlebot snippet/image/video izinleri tutarli hale getirildi.
- Yeni Supabase migration'i, public search fallback sorgulari ve forum/makale detay okumalari icin ek indeksler ekledi; semantic index sagligi ve public olmayan kayit sızıntılarını izleyen private audit view'lari olusturdu.

## Siradaki buyuk hamleler

- Search Console API baglantisi: GSC sorgu/URL verilerini haftalik cekip `seo_opportunities` tablosuna yazan Vercel Cron veya Supabase Edge Function eklenebilir.
- GEO query lab: Fizik konulari icin "Newton yasalari nasil anlatilir?", "entropi ornekle acikla" gibi intent setleri tutulup ChatGPT/Gemini/Perplexity cevaplarinda Fizikhub citation gorunurlugu manuel veya otomasyonla izlenebilir.
- Icerik kalite paneli: `private.low_value_indexable_content`, `private.search_visibility_violations` ve GSC verileri admin panelinde "SEO teknik borc" sekmesi olarak gosterilebilir.
- Embedding queue: Webhook aninda embedding uretmek yerine Upstash QStash, Supabase Queue veya Vercel Queue ile retry/backoff destekli async pipeline kurulabilir.
- Multilingual hazirlik: Simdilik `tr-TR` dogru. Ileride Ingilizce/Turkce paralel sayfalar acilacaksa hreflang, localized sitemap ve translated canonical stratejisi birlikte tasarlanmali.
- Page experience: Web vitals verisi zaten var. LCP/CLS kaynaklarini route bazinda Supabase aggregate view + admin dashboard ile izlemek, SEO etkisi olan performans regresyonlarini daha erken yakalar.

## Kaynaklar

- Google Search Central - AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central - Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central - Robots meta tag, data-nosnippet, X-Robots-Tag: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Search Central - Structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Next.js App Router metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js sitemap metadata file: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Supabase full-text search: https://supabase.com/docs/guides/database/full-text-search
- Supabase Postgres indexes: https://supabase.com/docs/guides/database/postgres/indexes
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawler policy: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
