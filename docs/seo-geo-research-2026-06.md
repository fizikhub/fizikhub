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
- `/nevbara` oyun yuzeyi aktif tutuldu; core SEO disi oldugu icin sitemap disi ve `noindex, follow` kalir. Gravity Warrior kontrolu P ile ates edecek sekilde guncellendi.
- CSP'ye `prefetch-src 'self'` eklendi.
- HSTS `max-age=63072000; includeSubDomains; preload` olarak guclendirildi.
- Normal root head'e AI discovery linkleri ve Supabase preconnect/dns-prefetch eklendi.
- Next, React, React DOM, eslint-config-next, bundle analyzer ve Supabase JS patch seviyelerine guncellendi.

## 2026-06-03 derin arastirma ve uygulama notu

- Google'in 2026 AI features dokumani GEO/AEO icin ayri teknik gereksinim olmadigini, sayfanin Google Search'te indexlenebilir ve snippet'a uygun olmasinin temel sart oldugunu tekrar dogruluyor. Bu nedenle Fizikhub'da `max-snippet:-1`, text-first icerik, public robots erisimi, canonical URL ve dahili link agi korunuyor.
- Ayni dokuman onemli icerigin metinsel olarak bulunmasini ve structured data'nin gorunur metinle eslesmesini oneriyor. Bu calismada simülasyonlar icin Course schema yalnizca sayfada zaten gorunen sure, hedef, formul, konu ve ucretsiz erisim bilgileriyle uretildi.
- Google Course list rehberi Course item'lari icin ad, aciklama, provider ve liste sayfasi baglamina vurgu yapiyor. `/simulasyonlar` artik ItemList + Course graph'i yayinliyor; tekil simülasyonlar ayni `#course` dugumunu detay sayfasinda da veriyor.
- Dinamik ve cekirdek public sayfalarda `alternates.languages` icine `tr-TR` ve `x-default` eklendi. Fizikhub su an tek dilli oldugu icin ikisi de ayni kanonik URL'yi isaret ediyor; ileride cok dilli yapiya gecilirse bu alanlar route bazinda genisletilebilir.
- `/ai-index.json` ve `/llms.txt` AI provenance bilgisiyle genisletildi: yayinlayan, editoryal sorumlu, dil/bolge, hedef kitle, guven sinyalleri ve son gozden gecirme tarihi artik makine okunabilir sekilde duruyor.
- Makale ve sozluk metadata'larina citation/DC alanlari eklendi. Bu, sayfada gorunen atif ve kaynak bloklarini metadata tarafinda da destekliyor.
- `__tests__/seo-geo.test.ts` Course schema ve AI provenance icin regresyon testi kazandi.

## 2026-06-03 takip uygulamalari: GSC, konu hub'lari ve Web Vitals

- Search Console tarafinda programatik "request indexing" kullanilmadi; Google URL Inspection API veriyi okumaya yarar, genel sayfalar icin request indexing arayuz uzerinden yapilir. Google Indexing API ise genel Fizikhub sayfalari icin uygun degil; resmi kapsam JobPosting ve canli yayin VideoObject sayfalariyla sinirlidir.
- `npm run seo:gsc-recrawl` komutu eklendi. Komut GSC Coverage export'unu okuyup `docs/gsc-recrawl-plan.md` dosyasina sitemap yeniden gonderim listesi, gunluk request-indexing adaylari ve cleanup live-inspection aileleri uretir.
- Son export'tan uretilen planda 350 URL okundu; 8 sitemap yeniden gonderim hedefi, 25 request-indexing adayi ve 10 cleanup ailesi cikti. En buyuk cleanup aileleri legacy `/blog`, wildcard/bozuk URL, non-www/http, private/noindex ve static asset URL'leri.
- Article baglantisi olmayan 17 topic hub icin ozel konu calisma rehberi eklendi: ozet, temel fikirler, calisma rotasi, sik hata ve formul/kavram odagi. Bu metinler `/konular/[slug]` sayfasinda gorunur hale geldi ve AI index topic aciklamalarina yansitildi.
- Web Vitals izleme LCP, INP, CLS, FCP ve TTFB esikleriyle ortak yardimciya alindi. Browser rating gondermezse API route rating'i sunucu tarafinda turetir.
- Page Experience dashboard artik LCP/INP/CLS basligini, metrik esiklerini, P75 degerini ve SEO oncelik skorunu gosterir. Supabase view icin P75, son gorulme zamani ve issue score ekleyen migration eklendi.

## Sonraki izleme onerileri

- Search Console'da `/blog`, non-www/http, wildcard ve static asset aileleri icin live inspection tekrar istenmeli; kod bu URL'leri temizliyor ama GSC satirlari recrawl zamanina bagli silinir.
- Web Vitals admin panelindeki LCP/INP agregasyonlari route bazinda haftalik izlenmeli.
- Ana sayfa icin sonraki buyuk performans hedefi feed ve navigation client boundary'lerini azaltmak: ozellikle framer-motion ve feed kartlari TBT uzerinde etkili.
- GEO icin `ai-index.json` item kalitesi haftalik kontrol edilmeli: citationText, relatedUrls, clusterSlugs ve answerFormatHints bos kalmamali.

## 2026-06-07 genel kalite, guvenlik ve DB notu

- Google'in AI features dokumani tekrar kontrol edildi: AI Overviews/AI Mode icin ayri bir "GEO hack" yok; indekslenebilirlik, snippet uygunlugu, dahili linkler, metinsel ana icerik, sayfa deneyimi ve gorunen icerikle eslesen structured data temel kalmaya devam ediyor.
- OpenAI crawler dokumani OAI-SearchBot, GPTBot ve ChatGPT-User ayrimini netlestiriyor. Anthropic ClaudeBot, Claude-User ve Claude-SearchBot; Perplexity de PerplexityBot icin robots.txt uyumlulugunu belgeliyor. Fizikhub robots/AI discovery yuzeyi bu ayrimi bozmadan public egitim icerigini kesfedilebilir tutuyor.
- Supabase RLS dokumani public schema tablolarinda RLS'in acik olmasini ve service role anahtarinin browser'a hic tasinmamasini vurguluyor. Kod tarafinda public Supabase config tek helper'a alindi; browser/server client'larda direct non-null env kullanimi kaldirildi.
- Stories storage yazma yolu `<auth.uid()>/...` klasorune tasindi ve yeni migration genis `stories` bucket upload policy'sini kullanici klasoruyle sinirliyor.
- Server-side markdown renderer icin URL/attribute sanitization eklendi. Markdown linklerinde `javascript:` benzeri protokoller etkisizlestiriliyor; raw script/style/event handler ve guvenilmeyen iframe'ler temizleniyor.
- Hard-coded seed parolasi ve mock webhook fallback secret kaldirildi. Bu scriptler artik ilgili env yoksa calismayi reddediyor.
- Email notification HTML'i makale basligi, excerpt, kapak gorseli ve URL'ler icin escape/sanitize kullaniyor.
- Ana hero semantigi iyilestirildi: dekoratif animasyon H1'i `role="img"` altinda gizlemiyor.

## Kaynaklar

- Google Search Central - AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central - Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central - Robots meta tag and X-Robots-Tag: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Search Central - Structured data general guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central - Course list structured data: https://developers.google.com/search/docs/appearance/structured-data/course
- Google Search Central - Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google Search Central - Developer's guide to Search: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Google Search Central - Canonicalization: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google Search Central - Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- web.dev - Web performance/Core Web Vitals: https://web.dev/performance
- OWASP - HTTP Security Response Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP - Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Supabase - Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawler policy: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity robots.txt policy: https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt
