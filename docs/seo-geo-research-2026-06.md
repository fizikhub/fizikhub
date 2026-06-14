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

## 2026-06-07 derin audit uygulama notu

- Root metadata'daki placeholder Google Search Console verification degeri kaldirildi. Google verification artik yalnizca gercek `NEXT_PUBLIC_GSC_TOKEN` varsa basilir; Bing/Yandex mevcut token davranisini korur.
- Markdown embed guvenligi client ve server renderer icin ortak allowlist'e alindi. Fizikhub artik sadece `https` YouTube, YouTube-nocookie ve PhET embed kaynaklarini kabul eder; bilinmeyen iframe kaynaklari render edilmez.
- Makale sayfasi JSON-LD tarafindaki Article/WebPage/LearningResource URL'leri metadata ile ayni canonical helper'a baglandi. Bu, redirect/canonical ayrismasi durumunda structured data'nin farkli URL soylemesini engeller.
- Makale okuyucusundaki auth/like/bookmark yenilemesi ilk paint sonrasi idle zamana ertelendi. Okuma deneyimi ve LCP/INP butcesi icin kritik olmayan Supabase istekleri daha sakin calisir.
- Akademik atif bloklari tarayicinin anlik `window.location.href` degeri yerine canonical `https://www.fizikhub.com/makale/{slug}` URL'sini kullanir. Query string veya paylasim parametreleri kaynakcalara karismaz.
- Ana sayfadaki dekoratif 3D canvas icin varsayilan particle sayilari, DPR tavan degeri ve bloom multisampling dusuruldu. Gorsel kimlik korunurken mobil ana-thread/GPU maliyeti azaltildi.

## 2026-06-14 genis kapsamli SEO/GEO, guvenlik ve performans bakimi

- Google'in 2026-06-05 tarihli generative AI rehberi tekrar kontrol edildi. Karar degismedi: Google icin GEO/AEO "hack" degil; indexlenebilir, snippet'a uygun, faydali, gorunur metinli ve teknik olarak temiz SEO'nun AI Overviews/AI Mode tarafina yansimasidir.
- Google ayni rehberde `llms.txt` veya ozel AI markup'in Google generative AI gorunurlugu icin gerekli olmadigini belirtiyor. Bu nedenle Fizikhub `llms.txt`, `ai-index.json`, `simulation-learning.json` ve `ai-sitemap.xml` yuzeylerini ranking vaadi olarak degil; OpenAI/Claude/Perplexity/agentic tarayicilar icin kanonik kaynak ve citation manifesti olarak tutar.
- OpenAI crawler dokumani `OAI-SearchBot`, `GPTBot`, `OAI-AdsBot` ve `ChatGPT-User` ayrimini guncel olarak dogruluyor. Fizikhub robots/AI discovery listeleri bu ayrimi taniyacak sekilde genisletildi.
- Google crawler dokumanlarinda `GoogleOther`, `Google-InspectionTool`, `Google-Agent`, `Google-NotebookLM`, `Google-Pinpoint`, `GoogleMessages`, `GoogleProducer`, `FeedFetcher-Google` ve `Google-Read-Aloud` gibi agent/fetcher yuzeyleri kontrol edildi. Public egitim sayfalari bu ajanlar icin session yenileme maliyeti olmadan yanit verecek sekilde proxy bypass listesi guncellendi.
- Eski `/blog` allow sinyali robots.txt'den kaldirildi. URL ailesi proxy tarafinda `/makale`ye 301 ile tasinmaya devam eder; robots tarafinda yeni crawl butcesi kanonik `/makale`, `/konular`, `/sozluk`, `/forum`, `/simulasyonlar` ve `/testler` yuzeylerine odaklanir.
- `ai-index.json` ve `llms.txt` Supabase env veya DB gecici arizalarinda 500 yerine statik topic/simulasyon/core kaynaklariyla 200 fallback doner. Bu, AI crawler ve sitemap sagligi icin kesintisiz kesif saglar.
- AI manifest dosyalari `X-Robots-Tag: noindex, follow` aldi. Google icin bu dosyalar arama sonucu sayfasi olmak zorunda degil; public HTML sayfalari indexlenebilir kalirken manifestler crawler/agent yardimci kaynagi olarak kalir.
- `.well-known/security.txt` eklendi. Guvenlik bildirimi icin `iletisim@fizikhub.com` kanonik temas noktasi saglandi ve SEO saglik scripti bu dosyanin 200/noindex/contact durumunu kontrol eder.
- Next.js `experimental.webVitalsAttribution` LCP, INP ve CLS icin acildi. Mevcut Web Vitals toplama pipeline'i artik attribution alanlarini daha zengin yakalayabilir; admin Page Experience panelinde route bazli sorunun kaynagini bulmak kolaylasir.

## 2026-06-14 mobil ana sayfa olcek audit notu

- iPhone 14 Pro Max pratik test viewport'u 430 x 932 CSS px olarak alindi. Bu sinif cihazlarda hedef, ilk ekranda marka/hero etkisini korurken feed'in "tek dev kart" hissine dusmemesi ve yatay kaydirma elemanlarinin sayfa genisligini tasirmamasidir.
- Touch target karari: kritik nav ve aksiyonlarda 44 CSS px altina inilmedi; ana mobil nav item'lari 54 px, header butonlari 44 px, feed aksiyonlari 44 px tutuldu. Bu, Apple'in 44x44 pt pratik alt siniri, Android/Material'in 48dp onerisi ve WCAG 2.2'nin 24x24 CSS px minimumu arasinda Fizikhub'un yogun sosyal feed yapisina uygun denge saglar.
- Hero mobilde 430px genislikte daha kontrollu yukseklik ve baslik cap'ine alindi. H1 hala LCP/marka sinyali olarak guclu, fakat ekranin ilk bolumunu gereksizce kaplamiyor.
- Populer yazilar karuselinde kart genisligi 76vw'den 68vw'ye indirildi, 16:9 oran kullanildi ve eksik `scrollbar-hide` CSS'i global tanimlandi. Boylece sagdan kirpilmis/kaydirma cubugu gorunen hissi azalir.
- Ana feed kartlari mobilde daha dusuk padding, 18-19px baslik ve iki satir excerpt ile daha okunabilir yogunluga alindi. 420px altinda paylas/kaydet ikonlari `more` menusune tasinmaya devam eder; 430px iPhone Pro Max sinifinda dort ana aksiyon gorunur kalir.
- Bottom nav toplam yuksekligi ve merkez paylas butonunun tasmasi azaltildi. Sayfa alt padding'i artirildi; icerik sabit nav tarafindan daha az ezilir.
- Performans acisindan bu degisiklikler yeni client boundary veya paket eklemiyor. Yapilanlar CSS/markup olcegi oldugu icin INP riskini buyutmeden LCP sonrasindaki feed okunabilirligini iyilestirir.

## Kaynaklar

- Google Search Central - Optimizing for generative AI features on Google Search: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central - AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central - Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central - Robots meta tag and X-Robots-Tag: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Search Central - Structured data general guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central - Course list structured data: https://developers.google.com/search/docs/appearance/structured-data/course
- Google Search Central - Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google Search Central - Developer's guide to Search: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Google Search Central - Canonicalization: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google Search Central - Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Crawling Infrastructure - Common crawlers: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Google Crawling Infrastructure - User-triggered fetchers: https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers
- web.dev - Web performance/Core Web Vitals: https://web.dev/performance
- web.dev - Web Vitals: https://web.dev/articles/vitals
- web.dev - Interaction to Next Paint: https://web.dev/articles/inp
- Google Search Central - Introducing INP to Core Web Vitals: https://developers.google.com/search/blog/2023/05/introducing-inp
- W3C WAI - WCAG 2.2 Target Size Minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Android Accessibility Help - Touch target size: https://support.google.com/accessibility/android/answer/7101858
- Apple Human Interface Guidelines - Buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- Blisk - iPhone 14 Pro Max viewport/device metrics: https://blisk.io/devices/details/iphone-14-pro-max
- OWASP - HTTP Security Response Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP - Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- OWASP - Secure Headers Project: https://owasp.org/www-project-secure-headers/
- Supabase - Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawler policy: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity robots.txt policy: https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt
