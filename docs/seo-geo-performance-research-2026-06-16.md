# Fizikhub SEO, GEO, Performance ve Guvenlik Notlari

Tarih: 2026-06-16

## Kaynak ozeti

- Google AI Overviews ve AI Mode icin ayri bir teknik indeksleme yolu istemiyor; klasik Google Search temelleri, Googlebot erisimi, kaliteli snippet izni ve indexlenebilir public sayfalar aynen kritik kaliyor.
- Google robots meta dokumani, snippet ve preview direktiflerinin arama sunumunu etkiledigini ve crawler erisiminin engellenmemesi gerektigini belirtiyor.
- Google structured data galerisi Article, Breadcrumb, DiscussionForumPosting, QAPage, ProfilePage ve benzeri tiplerin rich result ve makine okunabilirlik icin dogru yerlestirilmesini oneriyor.
- web.dev Core Web Vitals rehberi performans kalitesini kullanici merkezli sinyallerle ele aliyor; INP ozellikle mobilde etkilesim gecikmelerini azaltmayi hedefliyor.
- Next.js App Router metadata dokumani streaming metadata ve generateMetadata davranislarinin algilanan performans ve LCP uzerindeki etkisini acikliyor.

## Fizikhub icin uygulanan kararlar

- AI index manifesti, oncelikli Fizikhub makaleleri icin arama niyeti, SERP basligi/aciklamasi, cevap ozeti ve kalite sinyalleri tasiyacak sekilde genisletildi.
- Ana sayfa JSON-LD yapisi Fizikhub'un oncelikli fizik konularini ve onemli makale linklerini daha net gosterecek sekilde zenginlestirildi.
- Makale WebPage semasinda ana varlik tekrar Article olarak sabitlendi; FAQ ve tanim parcaciklari `hasPart` ile iliskilendirildi.
- AI sitemap icinden noindex manifest URL'leri cikarildi; bu sayede kesif yuzeyleri korunurken sitemap/noindex celiskisi azaltildi.
- Sitemap index `lastmod` degeri her istekte degisen anlik tarih yerine stabil teknik guncelleme tarihine baglandi.
- Mobil ana sayfada scroll efektleri masaustu odakli yüklenecek hale getirildi; feed ici agir ekstra bloklar idle sonrasina ertelendi.
- PWA service worker kaydi veri tasarrufu veya yavas mobil baglantilarda atlanacak sekilde guncellendi.
- Kritik server action noktalarina admin/yetki kontrolleri eklendi ve time-limit API input siniri guclendirildi.

## Devam edilebilecek yuksek getirili alanlar

- Makale detay sayfalarinda `Article`, `FAQPage`, `BreadcrumbList` ve konu cluster ic linklerinin Search Console performansina gore izlenmesi.
- Forum detayinda gercek cevap oylarini QAPage `upvoteCount` alanina tasimak.
- LCP gorselleri icin production verisiyle hangi sayfalarda priority/fetchPriority sinyali gerektigini netlestirmek.
- CSP'deki `unsafe-inline` bagimliligini nonce/hash tabanli yaklasima kademeli tasimak.
