-- Sample Articles and Dictionary Terms for Fizikhub
-- Run this in Supabase SQL Editor

-- Insert sample articles (make sure you have a user ID first)
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users table

INSERT INTO articles (title, slug, excerpt, content, category, author_id, image_url, created_at) VALUES
(
    'Kuantum Fiziği: Schrödinger''in Kedisi ve Süperpozisyon',
    'schrodinger-kedisi-superpozisyon',
    'Schrödinger''in ünlü kedi deneyini ve kuantum süperpozisyonunu basit bir dille anlatalım. Spoiler: Kediye bir şey olmaz!',
    '# Schrödinger''in Kedisi

Kuantum fiziğinin en ünlü paradokslarından biri olan Schrödinger''in kedisi deneyi, aslında bir düşünce deneyidir. 1935 yılında Erwin Schrödinger tarafından öne sürülmüştür.

## Deney Nasıl Çalışır?

Bir kutuya bir kedi, bir radyoaktif atom, bir Geiger sayacı ve bir zehir şişesi koyuyorsunuz. Eğer atom bozunursa, Geiger sayacı bunu algılayıp zehir şişesini kırıyor ve kedi ölüyor. Atom bozunmazsa kedi yaşıyor.

Kuantum mekaniğine göre, kutuyu açmadan önce atom hem bozunmuş hem de bozunmamış durumda (süperpozisyon). Bu da kediyi hem ölü hem diri yapıyor!

## Gerçekte Ne Oluyor?

Tabii ki gerçekte kedi ya ölü ya diri. Bu deney, kuantum mekaniğinin garip sonuçlarını göstermek için yapılmış bir düşünce deneyi. Gözlem yapana kadar bir sistemin birden fazla durumda olabileceğini gösteriyor.

**Sonuç:** Kediye zarar vermeden kuantum fiziğini anlayabilirsiniz! 🐱',
    'Kuantum Fiziği',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    NOW() - INTERVAL '5 days'
),
(
    'Kara Delikler: Evrenin Süpürgeleri',
    'kara-delikler-evrenin-supurgeleri',
    'Kara delikler evrende her şeyi yutan canavarlarmış gibi gösterilir, ama gerçekte daha ilginçler. Gelin yakından bakalım!',
    '# Kara Delikler Nedir?

Kara delikler, kütleçekimi o kadar güçlü ki ışığın bile kaçamadığı gök cisimleridir. Çok büyük yıldızların ömürlerinin sonunda çökerek oluştururlar.

## Olay Ufku

Kara deliğin etrafındaki ''geri dönüşü olmayan nokta''ya olay ufku denir. Bu noktayı geçtikten sonra artık kurtuluş yoktur!

## Spaghettification (Makarnalaşma)

Kara deliğe yaklaştıkça ayaklarınıza uygulanan çekim kuvveti başınıza uygulanan çekim kuvvetinden çok daha fazla olur. Sonuç? Makarna gibi uzarsınız! 🍝

## İlginç Gerçekler

- Kara delikler aslında ''siyah'' değil, çünkü ışık yaymazlar
- En yakın kara delik 1000 ışık yılı uzaklıkta
- Hawking radyasyonu sayesinde çok yavaş buharlaşıyorlar

**Not:** Kara deliklere gitmek için acele etmeyin, bilet satışları henüz başlamadı! 🎫',
    'Astrofizik',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800',
    NOW() - INTERVAL '3 days'
),
(
    'Zamanı Durdurmak Mümkün mü? Işık Hızı ve Görelilik',
    'isik-hizi-gorelilik',
    'Einstein''ın görelilik teorisine göre, ışık hızında giderseniz zaman durur. Ama biraz daha karmaşık...',
    '# Işık Hızı ve Zaman

Işık saniyede yaklaşık 300,000 kilometre yol alır. Bu evrendeki hız sınırıdır!

## Zaman Genişlemesi

Einstein''ın özel görelilik teorisine göre, hızınız arttıkça zaman yavaşlar. Işık hızına yaklaştıkça bu etki daha belirgin hale gelir.

### İkiz Paradoksu

İki ikizden biri uzay gemisiyle ışık hızına yakın bir hızla yolculuk yaparsa, geri döndüğünde kardeşinden çok daha genç olur!

## Neden Işık Hızını Geçemeyiz?

Hızınız arttıkça kütleniz de artar. Işık hızına ulaşmak için sonsuz enerji gerekir. Bu da imkansız demek!

### Pratik Sonuç

Yani ne yazık ki geç kaldığınız sınavlara ışık hızında giderek zamanı yavaşlatamazsınız. Kusura bakmayın! ⏰

**Önemli:** Işık hızı sadece boşlukta geçerli. Suda veya camda daha yavaş gider.',
    'Modern Fizik',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
    NOW() - INTERVAL '7 days'
),
(
    'Termodinamik: Kaos Her Zaman Kazanır',
    'termodinamik-entropi',
    'Evrende düzen bozulmaya mahkumdur. Odanızın neden sürekli dağıldığını termodinamik yasalarıyla açıklayalım!',
    '# Termodinamiğin Yasaları

Termodinamik, ısı ve enerjinin davranışını inceler. Üç temel yasası vardır:

## Birinci Yasa: Enerji Korunur

Enerji yoktan var edilemez, vardan yok edilemez. Sadece bir formdan diğerine dönüşür.

**Örnek:** Yediğiniz çikolatadaki kimyasal enerji, vücudunuzda hareket enerjisine dönüşür. Veya kilo olarak depolanır... 🍫

## İkinci Yasa: Entropi Artar

Entropi, sistemdeki düzensizlik ölçüsüdür. Kapalı bir sistemde entropi her zaman artar.

**Örnek:** Odanızı ne kadar toplasanız da yine dağılır. Bu fiziksel bir yasa, sizin tembelliğiniz değil! (Belki biraz da o...)

## Üçüncü Yasa: Mutlak Sıfıra Ulaşılamaz

Mutlak sıfır (-273.15°C) teorik olarak mümkün ama pratikte ulaşılamaz.

### İlginç Gerçek

Evren sürekli entropisi artan dev bir sistem. Milyarlarca yıl sonra ''ısıl ölüm'' ile karşılaşabilir!

**Moral:** Odanızın dağınık olması doğal bir süreç. Kabul edin! 🏠',
    'Klasik Fizik',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    NOW() - INTERVAL '10 days'
),
(
    'Kuantum Dolanıklık: Evrenin En Gizemli Bağlantısı',
    'kuantum-dolaniklik',
    'Einstein buna ''uzaktan esrarengiz etki'' diyordu. Modern fizik buna kuantum dolanıklık diyor. İkisi de haklı!',
    '# Kuantum Dolanıklık Nedir?

İki parçacık ''dolanık'' hale geldiğinde, aralarındaki mesafe ne olursa olsun birbirini anında etkiler.

## Einstein''ın İtirazı

Einstein bu olaya inanmıyordu ve buna ''spooky action at a distance'' (uzaktan hayaletimsi etki) dedi. Ama yanıldığı ortaya çıktı!

## Nasıl Çalışır?

İki dolanık parçacıktan birinin durumunu ölçtüğünüzde, diğerinin durumu anında belirlenir. Aralarında 1000 km olsa bile!

### Pratik Kullanımlar

- Kuantum bilgisayarlar
- Kuantum kriptografi
- Kuantum ışınlama (teorik)

## Işınlanabilir miyiz?

Ne yazık ki hayır. En azından yakın zamanda değil. Ama bilgi ışınlamak mümkün!

**Eğlenceli Gerçek:** Dolanıklık sayesinde süper güvenli iletişim yapılabiliyor. NSA bile kıramıyor! 🔒',
    'Kuantum Fiziği',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    NOW() - INTERVAL '1 day'
),
(
    'Sicim Teorisi: 11 Boyutlu Evren',
    'sicim-teorisi-11-boyut',
    'Evrenin temel yapı taşlarının nokta değil, titreşen sicimler olduğunu söyleyen teori. Science fiction gibi ama matematik!',
    '# Sicim Teorisi Nedir?

Sicim teorisi, evrendeki her şeyin aslında minik titreşen sicimlerden oluştuğunu öne sürer.

## Neden 11 Boyut?

Sicim teorisinin matematiksel olarak tutarlı olması için 11 boyut gerekiyor:
- 3 uzay boyutu
- 1 zaman boyutu  
- 7 ekstra boyut (çok küçük ve kıvrılmış)

## Farklı Sicimler, Farklı Parçacıklar

Bir sicimin titreşim frekansı onun hangi parçacık olduğunu belirler:
- Elektron
- Kuark
- Foton
vb.

### M-Teorisi

11 boyutlu sicim teorisinin en gelişmiş hali. ''M'' kelimesinin ne anlama geldiği tartışmalı:
- Membrane (zar)
- Mystery (gizem)
- Magic (sihir)?

## Kanıtı Var mı?

Henüz yok! Ama çok güzel matematik. Belki bir gün... 🎻

**Not:** Ekstra boyutlar o kadar küçük ki göremiyoruz. Planck uzunluğu kadar (10^-35 metre)!',
    'Teorik Fizik',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    NOW() - INTERVAL '2 days'
),
(
    'Antimadde: Evrenin Karanlık İkizi',
    'antimadde-evrenin-ikizi',
    'Her parçacığın bir karşıtı var. Madde ile antimadde buluşunca... PATLAMAAA! 💥',
    '# Antimadde Nedir?

Her madde parçacığının elektrik yükü ters bir ''karşıt parçacığı'' vardır:
- Elektron → Pozitron
- Proton → Antiproton
- Nötron → Antinötron

## Madde + Antimadde = Enerji

Bir parçacık karşıt parçacığıyla buluştuğunda yok olurlar ve saf enerjiye dönüşürler. E=mc² formülünün en saf hali!

### Neden Sadece Madde Var?

Büyük patlamada eşit miktarda madde ve antimadde oluşması gerekirdi. Ama evrenimiz maddeden oluşuyor. 

Neden? Büyük gizem! Belki %0.0001 asimetri vardı, o yüzden sadece madde kaldı.

## CERN''de Antimadde

CERN, antimadde üretiyor ve milisaniyeler boyunca saklayabiliyor. Rekor: 16 dakika!

### Antimadde Bombası?

Hollywood''un aksine, antimadde bombası yapmak imkansız. Üretimi çok pahalı ve zor.

**İlginç:** 1 gram antimadde Hiroshima bombasının 3 katı enerji üretir. Ama 1 gram üretmek 100 trilyon dolara mal olur! 💸',
    'Parçacık Fiziği',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
    NOW() - INTERVAL '4 days'
);

-- Insert dictionary terms
INSERT INTO dictionary_terms (term, definition, category, created_at) VALUES
('Atom', 'Maddenin kimyasal özelliklerini taşıyan en küçük parçacık. Çekirdek (proton+nötron) ve etrafındaki elektronlardan oluşur. Yunanca ''bölünemez'' anlamına gelir ama ironik şekilde bölünebilir! ⚛️', 'Atom Fiziği', NOW()),
('Big Bang (Büyük Patlama)', 'Evrenin yaklaşık 13.8 milyar yıl önce sonsuz küçük ve sıcak bir noktadan genişlemeye başlamasıyla oluştuğunu öne süren teori. Ama aslında ''patlama'' değil, ''genişleme'' daha doğru bir tanım!', 'Kozmoloji', NOW()),
('Fotoelektrik Olay', 'Işığın bir metale çarpması sonucu elektronların yüzeyden fırlaması olayı. Einstein bununla Nobel kazandı. Güneş panelleri bu prensiple çalışır! ☀️', 'Kuantum Fiziği', NOW()),
('Graviton', 'Kütleçekim kuvvetini taşıdığı düşünülen hipotetik parçacık. Henüz gözlemlenmedi ama teorik olarak var olması gerekiyor. Kuantum fiziğinin en yaramaz çocuğu!', 'Parçacık Fiziği', NOW()),
('Hawking Radyasyonu', 'Stephen Hawking''in öngördüğü teoriye göre kara deliklerin zaman içinde enerji kaybedip buharlaşması. Kara delikler ölümsüz değilmiş!', 'Astrofizik', NOW()),
('Higgs Bozonu', 'Parçacıklara kütle kazandıran Higgs alanının kuantum titreşimi. 2012''de CERN''de keşfedildi. Medyada ''Tanrı Parçacığı'' diye anılır ama fizikçiler bunu sevmez!', 'Parçacık Fiziği', NOW()),
('Kuark', 'Proton ve nötronun içindeki temel parçacıklar. 6 çeşidi var: up, down, charm, strange, top, bottom. İsimler fizikçilerin eğlendiğinin kanıtı! 😄', 'Parçacık Fiziği', NOW()),
('Planck Uzunluğu', 'Fiziksel olarak anlamlı en küçük mesafe: 1.6 × 10^-35 metre. Bundan daha küçük mesafelerde uzay-zaman kavramı çöker. Evrenin ''pikseli''!', 'Kuantum Fiziği', NOW()),
('Süperiletkenlik', 'Bazı malzemelerin çok düşük sıcaklıklarda elektrik direncini tamamen kaybetmesi. Manyetik ray trenlerde kullanılıyor. Geleceğin teknolojisi! 🚄', 'Katı Hal Fiziği', NOW()),
('Zaman Genişlemesi', 'Einstein''ın görelilik teorisine göre hareket eden nesneler için zamanın yavaşlaması. GPS uyduları bu etkiyi hesaba katmazsa 10 km hata yapar!', 'Modern Fizik', NOW()),
('Dalga-Parçacık İkililiği', 'Işık ve maddenin hem dalga hem de parçacık özelliği göstermesi. Kuantum fiziğinin en garip özelliklerinden biri. Schrödinger bile kafa karıştı! 🌊', 'Kuantum Fiziği', NOW()),
('Karadelik Olay Ufku', 'Kara deliğin çevresindeki ''geri dönüşü olmayan nokta''. Bunu geçtikten sonra kaçış imkansız. Evrenin tek yönlü kapısı! 🚪', 'Astrofizik', NOW()),
('Nötrino', 'Neredeyse kütlesiz, elektrik yüksüz parçacık. Her saniye trilyonlarcası vücudunuzdan geçiyor ama hiç fark etmiyorsunuz. Evrenin hayaleti! 👻', 'Parçacık Fiziği', NOW()),
('Entropi', 'Bir sistemdeki düzensizlik ölçüsü. Termodinamiğin ikinci yasasına göre her zaman artar. Odanızın sürekli dağılmasının bilimsel açıklaması!', 'Termodinamik', NOW());

-- Check what was inserted
SELECT 'Articles inserted:' as message, COUNT(*) as count FROM articles;
SELECT 'Dictionary terms inserted:' as message, COUNT(*) as count FROM dictionary_terms;
