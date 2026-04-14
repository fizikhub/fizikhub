# Fizikhub GEO ve SEO 2025-2026 Master Planı: "Arşa Çıkış"

Google'ın SGE (Search Generative Experience) ve AI Overviews güncellemeleri, geleneksel "anahtar kelime" tabanlı SEO'yu bitirdi. Artık **GEO (Generative Engine Optimization)** çağındayız. Sitenin sadece taranması yetmez; ChatGPT, Perplexity ve Google AI botlarının sitendeki veriyi "kaynak, gerçek (fact) ve otorite" olarak görüp kendi cevaplarında alıntılaması gerekir.

Aşağıdaki plan, Fizikhub'ı geleneksel bir siteden "Yapay Zeka Destekli Otorite Kaynağına" dönüştürmek için adım adım tasarlandı.

## User Review Required

> [!IMPORTANT]  
> Lütfen aşağıdaki planı incele. Özellikle içerik tarafında eklemek istediğin bir şema (örn. yazarlara özel sertifikasyon tagleri) varsa belirtebilirsin. Onayın ardından anında kodlamaya başlayacağım.

---

## 1. GEO (Generative Engine Optimization) Alt Yapısı

Yapay zeka arama motorları düz metin okumayı sevmez, yapısal hiyerarşiyi okur.

### Dinamik OG (Açık Grafik) Görsel Üretimi (Görsel SEO)
Makalelerin statik bir `og-image.jpg` kullanması SEO açısından pasif bir sinyaldir.
- **[YENİ]** `/api/og/article` endpoint'i yazılacak. Kapak fotoğrafı olmayan makaleler için başlık ve yazar bilgisi içeren yüksek tıklama oranlı (CTR) dinamik resimler üretilecek.

### Şema (Schema.org) Ağı – Knowledge Graph Dominasyonu
Zaten Makale ve Organizasyon şemalarını tepeye taşıdık. Şimdi ağı genişletiyoruz:
- **[MODIFY]** `app/kullanici/[username]/page.tsx`: Google'ın yazarların niteliklerini ve otoritesini anlaması için tam teşekküllü `ProfilePage` ve `Person` şeması.
- **[MODIFY]** `app/sozluk/[slug]/page.tsx`: Sözlük terimleri yapay zeka tarafından doğrudan cevap (Featured Snippet) olarak çekilsin diye `DefinedTerm` ve `FAQPage` şeması eklenecek.
- **[MODIFY]** `app/testler/[slug]/page.tsx` ve Sayfalamalar: İlgili `CollectionPage` şemaları eklenecek.

---

## 2. Core Web Vitals ve Semantik Temizlik (Teknik SEO)

Hız ve etkileşim (INP/LCP) 2026'nın en büyük ranking faktörü.

- **Resim Alt Etiketleri (Alt Tags) Denetimi:** Kodlarda yer alan `alt="Avatar"` gibi jenerik veya boş etiketler tespit edilecek. Tüm `<Image>` bileşenlerine içerik odaklı (Fizikhub Yazar, [Makale Adı] Görseli vb.) semantik etiketler basılacak.
- **`<a href>` ile `<Link href>` Revizyonu:** Component klasörümüzdeki eski tarz `<a>` etiketleri Next.js `<Link>` komponentine dönüştürülecek. Bu, pre-fetching (ön belleğe alma) yaparak site içindeki geçiş hızını milisaniyeler düzeyine (sıfır gecikme) çekecek. Bu da Google'ın "Bounce Rate'i" (Hemen Çıkma Oranını) düşürmesini sağlayacak.
- **Orphan (Yetim) Sayfa Önlemi / Çapraz Linkleme:** Makalelerin altına sadece ilgili makaleleri değil, metin içindeki geçen terimleri eşleştiren bir "semantik" linkleme ağı oluşturmak makineler için en değerli şeydir (Bunu kod tabanında analiz edeceğim).

---

## 3. Akıllı Tarama (Sitemap ve Robots Optimizasyon İleri Seviye)

- **[MODIFY]** `app/sitemap.ts`: Her makalenin kapak görseli (`<image:image>`) sitemap dosyasına XML olarak gömülecek (Google Image aramalarında öne çıkmak için). Sadece düz link vermekle yetinmeyeceğiz.

## Verification Plan (Nasıl Test Edeceğiz?)
- Google Search Console tarzı Yapısal Veri Test Aracı'nda (Rich Results Test) yazılan tüm JSON-LD yapılarını doğrulayacağız.
- Oluşturulan dinamik OpenGraph resimlerinin sosyal medya botları tarafından doğru çekildiğini analiz edeceğiz.
- Terminal'de Next.js build'ı alırken gereksiz javascript veya stil yüklenmeden boyutların küçüldüğünden emin olacağız.
