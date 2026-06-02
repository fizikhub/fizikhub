# Fizikhub SEO/GEO, Mobil Performans ve Guvenlik Bakimi - 2026-06-02

Bu calisma Fizikhub'in teknik SEO, GEO (Generative Engine Optimization), mobil performans ve guvenlik durumunu canli site, yerel repo ve resmi dokumanlar uzerinden kontrol eder.

## Resmi kaynaklardan kararlar

- Google Search Central, AI Overviews ve AI Mode icin ayri bir teknik gereksinim olmadigini; sayfanin Google Search'te indexlenebilir, snippet'a uygun, metinsel olarak okunabilir ve iyi dahili linklenmis olmasi gerektigini belirtiyor. Bu nedenle Fizikhub'da klasik SEO temeli GEO'nun da temeli olarak korunuyor.
- Google, AI arama icin yeni ozel AI dosyasi veya ozel schema gerekmedigini soyluyor. `llms.txt`, `ai-index.json`, `simulation-learning.json` ve `ai-sitemap.xml` bu yuzden ranking vaadi degil; kanonik kaynak haritasi ve citation rehberi.
- Structured data sayfada gorunen ana icerikle tutarli olmali. Bu calismada riskli HowTo yerine daha genis WebPage/CollectionPage/CreativeWork sinyalleri kullanildi.
- Web.dev Core Web Vitals tarafinda mobil odak LCP, INP/TBT ve CLS izlenmeli. Canli ana sayfada CLS temiz, TTFB hizli; asil risk JS ana-thread isi ve LCP.
- OWASP HTTP Headers rehberi CSP, HSTS, nosniff, referrer policy, permissions policy ve clickjacking kontrolunu temel guvenlik katmani olarak gosteriyor. Fizikhub bu basliklarin cogunu zaten uyguluyor; bu calismada CSP/HSTS kucuk sertlestirme yapildi.
- OpenAI ve Anthropic crawler dokumanlari search botlari ile training/user-triggered botlari ayiriyor. Fizikhub robots yaklasimi search gorunurlugunu desteklerken egitim ve kullanici ajanlarini ayri taniyacak sekilde korunuyor.

## Mevcut durum

- `npm run seo:health` canli site uzerinde basarili calisti.
- Sitemap sayilari: klasik sitemap 665 URL, topic sitemap 30, article sitemap 23, forum sitemap 31, dictionary sitemap 544, AI sitemap 397, author sitemap 9.
- `ai-index.json` 648 item uretiyor ve citation policy `required`.
- Canli Lighthouse mobil ana sayfa: Performance 69, SEO 100, Best Practices 96.
- Mobil metrikler: FCP 1.6 sn, LCP 4.4 sn, TBT 560 ms, CLS 0, TTFB 40 ms.
- `npm audit --audit-level=moderate` ve `npm audit --omit=dev --audit-level=moderate`: 0 vulnerability.
- GSC export izleri 351 URL iceriyor. En buyuk teknik borc aileleri: eski `/blog` URL'leri, non-www/http varyantlari, wildcard/markdown bozulmasi, `_next/static` font URL'leri, arama sorgulu URL'ler ve taslak/test benzeri icerikler. Kodda bu ailelerin cogu 301, 410, noindex veya sitemap filtresiyle temizleniyor.

## Bu calismada uygulananlar

- Ana sayfa hero server-rendered hale getirildi. 3D canvas idle sonrasi kucuk client boundary ile yukleniyor.
- Ana sayfa scroll progress ve back-to-top kontrolleri idle sonrasi yukleniyor.
- Hikaye seridi yalnizca gosterilecek hikaye varsa render ediliyor; bos durumda client chunk cagirilmaz.
- `/paylas`, `/yazar/rehber`, `/kvkk`, `/gizlilik-politikasi`, `/kullanim-sartlari` icin ortak static metadata ve JSON-LD standardi eklendi.
- `/kvkk` icin route-level metadata eklendi; client page oldugu icin onceden root metadata'ya fazla bagimliydi.
- `/nevbara` sitemap disi ve cekirdek SEO disi oldugu icin metadata + header seviyesinde `noindex, follow` yapildi.
- CSP'ye `prefetch-src 'self'` eklendi.
- HSTS `max-age=63072000; includeSubDomains; preload` olarak guclendirildi.
- Normal root head'e AI discovery linkleri ve Supabase preconnect/dns-prefetch eklendi.
- Next, React, React DOM, eslint-config-next, bundle analyzer ve Supabase JS patch seviyelerine guncellendi.

## Sonraki izleme onerileri

- Search Console'da `/blog`, non-www/http, wildcard ve static asset aileleri icin live inspection tekrar istenmeli; kod bu URL'leri temizliyor ama GSC satirlari recrawl zamanina bagli silinir.
- Web Vitals admin panelindeki LCP/INP agregasyonlari route bazinda haftalik izlenmeli.
- Ana sayfa icin sonraki buyuk performans hedefi feed ve navigation client boundary'lerini azaltmak: ozellikle framer-motion ve feed kartlari TBT uzerinde etkili.
- GEO icin `ai-index.json` item kalitesi haftalik kontrol edilmeli: citationText, relatedUrls, clusterSlugs ve answerFormatHints bos kalmamali.

## Kaynaklar

- Google Search Central - AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central - Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central - Robots meta tag and X-Robots-Tag: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Search Central - Structured data general guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central - Canonicalization: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google Search Central - Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- web.dev - Web performance/Core Web Vitals: https://web.dev/performance
- OWASP - HTTP Security Response Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawler policy: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
