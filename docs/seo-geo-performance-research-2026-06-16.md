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

## 2026-06-21 Aristoteles-Batlamyus makalesi odak calismasi

- Canli sayfa denetiminde canonical ve robots sinyalleri dogruydu; ancak meta aciklamasi giristeki kurgu hikayeden uretiliyor, anahtar kelimeler genel kaliyor, gorunur makale metni H2 icermiyor ve gizli SEO kopyasi ikinci bir H1 olusturuyordu.
- Makale `Batlamyus evren modeli`, `Aristoteles evren modeli`, `jeosantrik model`, `episikl`, `deferent`, `ekvant`, `retrograd hareket` ve `Almagest` arama niyetleriyle yuksek oncelikli icerik listesine alindi.
- Arama basligi, meta aciklamasi, H1, dogrudan cevap ozeti, kavram rehberi ve dort gorunur soru-cevap eklendi. Hizli cevap paneli ilk render'da acik tutularak kritik metnin kullanici ve tarayici icin gorunur olmasi saglandi.
- Britannica, Stanford Encyclopedia of Philosophy ve NASA kaynaklari gorunur kaynak listesine ve Article `citation` alanina baglandi.
- Makale kozmoloji konu kumesine eklendi; ana sayfa, makale arsivi, konu hub'i, `llms.txt` ve `ai-index.json` tarafindaki mevcut oncelikli-icerik akisi bu makaleyi otomatik olarak tasiyacak.
- Genel makale sablonundaki `aria-hidden` gizli makale kopyasi kaldirildi. Gorunur SSR icerigi korunurken yinelenen H1 ve gizli metin riski temizlendi.
- Dogrulama: TypeScript basarili, ilgili SEO/GEO testleri 22/22 basarili, ESLint 0 hata (repo genelinde onceden bulunan 239 uyari). Uretim derlemesi compile ve TypeScript adimlarini gecti; statik veri toplama yerel ortamda Supabase DNS erisimi olmadigi icin tamamlanamadi.

## 2026-06-21 izleme, QAPage, LCP ve CSP takip calismasi

- GSC Performance exportlarini kanonik makale URL'lerinde birlestiren `npm run seo:gsc-structured` raporu eklendi. Rapor Article, FAQPage, BreadcrumbList ve konu-cluster baglantisini tiklama, gosterim, TO ve ortalama pozisyonla ayni matriste izler. Mevcut 9 Mayis exportu hedef makalenin 21 Haziran yayinindan once oldugu icin makale dogru bicimde "veri bekleniyor" durumundadir.
- Forum QAPage Answer `upvoteCount` degeri artik sayfada gosterilen gercek `answer_likes` sayisindan gelir. Onceki akista cevaplar `votes: 0` placeholder'i ile normalize edildigi icin schema her cevabi sifir oyla yayinliyordu.
- Son 30 gun production verisinde 147 LCP olayi incelendi. En yuksek makale P75 degerleri kara delik 4672 ms, karanlik madde 3608 ms, siyah cisim 2680 ms ve basit harmonik hareket 2518 ms olarak olculdu. Makale kapaklari ilk ekranda oldugu icin mevcut `priority`/`fetchPriority=high` korunur; baska rotalara attribution kaniti olmadan yeni priority eklenmez.
- Web Vitals attribution artik LCP selector, resource URL, TTFB, resource load delay/duration ve render delay alanlarini acikca serialize eder. Yeni `view_lcp_element_metrics` ve admin tablosu production trafik geldikce hangi eleman/gorselin LCP oldugunu gosterecek.
- CSP nonce/hash gecisinin ilk guvenli asamasi eklendi: enforced politika geriye uyumlu kalirken report-only `script-src` icinden `unsafe-inline` cikarildi ve `report-sample` acildi. Ihlaller gunluk fingerprint ile deduplike edilerek `csp_violation_events` tablosuna yazilir. Bu envanter, public ISR sayfalarini nonce nedeniyle zorunlu dinamik render'a gecirmeden once gerekli hash/nonce kapsamlarini ortaya cikarir.
- Next.js nonce rehberi nonce kullanilan sayfalarin dinamik render edilmesini, ISR/CDN cache'in devre disi kalmasini ve her istekte yeni nonce uretilmesini gerektirir. Bu nedenle nonce enforcement public SEO rotalarina tek seferde uygulanmadi; rapor-only envanterinden sonra hassas/dinamik route ailelerinde kademeli uygulanmalidir.
