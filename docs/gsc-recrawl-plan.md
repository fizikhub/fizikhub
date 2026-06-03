# Fizikhub GSC Recrawl Plan

Generated at: 2026-06-03T14:49:58.471Z
GSC export source: `/Users/baran/Downloads`
Export URL count: 350

## 1. Resubmit Sitemaps

Search Console > Sitemaps alanında aşağıdaki sitemapleri yeniden gönder:

- https://www.fizikhub.com/sitemap-index.xml
- https://www.fizikhub.com/sitemap.xml
- https://www.fizikhub.com/topic-sitemap.xml
- https://www.fizikhub.com/article-sitemap.xml
- https://www.fizikhub.com/forum-sitemap.xml
- https://www.fizikhub.com/dictionary-sitemap.xml
- https://www.fizikhub.com/ai-sitemap.xml
- https://www.fizikhub.com/author-sitemap.xml

## 2. Request Indexing Candidates

URL Inspection ekranında önce live test yap, sayfa indexlenebilir görünüyorsa Request indexing kullan. Çok sayıda URL için sitemap gönderimi ana yöntemdir; bu liste günlük manuel öncelik listesidir.

1. https://www.fizikhub.com/makale/antimadde-evrenin-ikizi
2. https://www.fizikhub.com/makale/anyonlar-dans-ediyor-kuantum-cift-modellerinde-inanilmaz-permutasyonlar
3. https://www.fizikhub.com/makale/azteklerden-gunumuze-tutun-tarihcesi-kimyasi-ve-etkileri-1769018062247
4. https://www.fizikhub.com/makale/cuce-galaksiler-evrenin-minik-ama-karmasik-yapi-taslari
5. https://www.fizikhub.com/makale/einstein-newtoni-nasil-dovdu-1770977777052
6. https://www.fizikhub.com/makale/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662
7. https://www.fizikhub.com/makale/fisiltidan-cigliga-gorunmez-iplikler-1766409396465
8. https://www.fizikhub.com/makale/fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj
9. https://www.fizikhub.com/makale/gpumony-kara-deliklerin-sirlarini-cozen-super-hizli-bilgisayar-sihirbazi
10. https://www.fizikhub.com/makale/gunes-sistemindeki-en-i-lginc-uydular-mjd9keg7nyk
11. https://www.fizikhub.com/makale/heisenberg-schrodinger-kuantum-simulasyonu
12. https://www.fizikhub.com/makale/hubble-gerilimi-steril-notrino-karanlik-madde
13. https://www.fizikhub.com/makale/isik-hizi-gorelilik
14. https://www.fizikhub.com/makale/isikla-atomlarin-dansi-kuantum-sahnesinde-kim-kimden-kaytariyor
15. https://www.fizikhub.com/makale/kara-delikler-evrenin-supurgeleri
16. https://www.fizikhub.com/makale/karanlik-madde-elektrozayif-gizemi-freeze-in
17. https://www.fizikhub.com/makale/kategori/astrofizik
18. https://www.fizikhub.com/makale/kategori/bilim%20tarihi
19. https://www.fizikhub.com/makale/kategori/biyoloji
20. https://www.fizikhub.com/makale/kategori/doga
21. https://www.fizikhub.com/makale/kategori/egitim
22. https://www.fizikhub.com/makale/kategori/fizik
23. https://www.fizikhub.com/makale/kategori/kimya
24. https://www.fizikhub.com/makale/kategori/klasik%20fizik
25. https://www.fizikhub.com/makale/kategori/kuantum

## 3. Cleanup Live Inspection Families

Bu ailelerde Request indexing yapma; live inspection ile redirect, canonical, 410 veya noindex davranışının Google tarafından görüldüğünü doğrula.

### legacy-blog (76)

Legacy /blog URL'inin /makale karşılığına 301 verdiğini live inspection ile doğrula.

- https://www.fizikhub.com/blog?kategori=Kuantum
- https://www.fizikhub.com/blog?kategori=Teknoloji
- https://www.fizikhub.com/blog?kategori=Doga
- https://www.fizikhub.com/blog?kategori=Astrofizik
- https://www.fizikhub.com/blog?kategori=Fizik
- https://www.fizikhub.com/blog?category=Termodinamik
- https://www.fizikhub.com/blog/tesr-1764435891018
- https://www.fizikhub.com/blog/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662

### wildcard-broken (29)

Wildcard/bozuk URL'nin 410 + noindex verdiğini doğrula.

- https://www.fizikhub.com/abs/2602.23354v1).*
- https://www.fizikhub.com/abs/2602.23356v1).*
- https://www.fizikhub.com/abs/2602.23364v1).*
- https://www.fizikhub.com/abs/2602.22205v1).*
- https://www.fizikhub.com/abs/2602.22206v1).*
- https://www.fizikhub.com/abs/2602.22211v1).*
- https://www.fizikhub.com/abs/2602.20154v1).*
- https://www.fizikhub.com/abs/2602.20155v1).*

### non-www-http (18)

HTTP/non-www varyantının tek hopta https://www.fizikhub.com kanoniğine döndüğünü doğrula.

- https://fizikhub.com/index
- http://www.fizikhub.com/
- https://fizikhub.com/sozluk
- http://fizikhub.com/
- https://fizikhub.com/
- https://fizikhub.com/makale
- https://fizikhub.com/forum
- https://fizikhub.com/testler

### private-noindex (17)

Private/noindex URL'nin X-Robots-Tag noindex ve no-store aldığını doğrula.

- https://www.fizikhub.com/basvuru/yazar
- https://www.fizikhub.com/mesajlar?to=cd8341b2-228f-4981-ac3a-5a84c9adca5e
- https://www.fizikhub.com/login
- https://www.fizikhub.com/kullanici/admin
- https://www.fizikhub.com/mesajlar?to=c7b4285b-e964-44c8-b10d-9867f0c9b0af
- https://www.fizikhub.com/mesajlar?to=8b141a54-6ffc-4942-a631-3238afd80c24
- https://www.fizikhub.com/mesajlar?to=e3ae51c9-3134-407f-b27d-d18770c59a0d
- https://www.fizikhub.com/mesajlar?to=6d382bb4-6080-4d5d-a990-dc74a9935b2b

### static-assets (11)

Static asset URL'sinin sitemap dışında kaldığını doğrula; request indexing yapma.

- https://www.fizikhub.com/_next/static/media/5c0c2bcbaa4149ca-s.p.woff2
- https://www.fizikhub.com/_next/static/media/23081e227a96aa1a-s.p.woff2
- https://www.fizikhub.com/_next/static/media/eaead17c7dbfcd5d-s.p.woff2
- https://www.fizikhub.com/_next/static/media/982ceffe7b733b3b-s.p.woff2
- https://www.fizikhub.com/_next/static/media/dfa8c703fb642da2-s.p.woff2
- https://www.fizikhub.com/_next/static/media/36966cca54120369-s.p.woff2
- https://www.fizikhub.com/_next/static/media/7b0b24f36b1a6d0b-s.p.woff2
- https://www.fizikhub.com/_next/static/media/e4af272ccee01ff0-s.p.woff2

### test-draft-content (4)

Test/taslak benzeri içerik URL'sinin 410/noindex veya yayın dışı davranışını doğrula.

- https://www.fizikhub.com/deney/test-test-testv-mkjszcaj9x1
- https://www.fizikhub.com/makale/test-1773589246705
- https://www.fizikhub.com/makale/test-kitap-i-ncelemesi-mkjtnsvxsvm
- https://www.fizikhub.com/deney/test-mkjp7jklr1j

### search-query (3)

Arama sorgulu URL'nin noindex,follow verdiğini ve canonical ana arama/list route'una döndüğünü doğrula.

- https://www.fizikhub.com/forum?q=I%C5%9F%C4%B1k h%C4%B1z%C4%B1yla giden bir
- https://www.fizikhub.com/ara?q=%7Bsearch_term_string%7D
- https://www.fizikhub.com/_next/image?url=https://yqokiiobwqkuznemzmvq.supabase.co/storage/v1/object/public/article-images/e70ae00e-0d14-4916-bdc4-116335b88bb6/1767186769077.blob&w=1920&q=75

### sort-latest (2)

Sıralama/query varyantının canonical ana listeye döndüğünü ve düşük değerli query ise noindex aldığını doğrula.

- https://www.fizikhub.com/makale?sort=latest&category=Terim
- https://www.fizikhub.com/makale?sort=latest&category=Modern Fizik

### writer-private (2)

Yazar paneli URL ailesinin public rehber hariç noindex/private kaldığını doğrula.

- https://www.fizikhub.com/yazar
- https://www.fizikhub.com/yazar/yeni

### index-path (1)

/index varyantının ana sayfaya 301 verdiğini doğrula.

- https://www.fizikhub.com/index

## Notes

- Google URL Inspection API indexed URL verisini okumaya yarar; genel sayfalar için programatik request indexing sağlamaz.
- Google Indexing API genel Fizikhub sayfaları için uygun değildir; resmi kullanım alanı JobPosting ve canlı yayın VideoObject sayfalarıdır.
- Çok sayıda yeni/güncellenmiş sayfa için en doğru ölçekli sinyal güncel `<lastmod>` içeren sitemap gönderimidir.
