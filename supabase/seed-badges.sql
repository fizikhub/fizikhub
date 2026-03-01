-- fizikhub/supabase/seed-badges.sql
-- Yeni Neo-Brutalist Premium Bilim Kahramanları Rozetleri
-- Lütfen bu betiği Supabase SQL editöründe tekrar çalıştırınız.

INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value)
VALUES 
    ('Ay''a İlk Adım', 'FizikHub''a hoş geldin! Bu alemdeki ilk izin. Benim için küçük, insanlık için dev bir adım.', 'moon-landing', 'milestone', 'manual', 0),
    ('Galileo''nun Teleskobu', 'İlk sorusunu sorarak evrene dijital teleskobunu çeviren cesurlara.', 'telescope', 'interaction', 'question_count', 1),
    ('Einstein''ın Zihni', 'İlk makalesini yazarak bilime kalıcı bir iz ve E=mc² parlaklığı bırakanlara.', 'einstein', 'contribution', 'article_count', 1),
    ('Newton''un Elması', 'İlk doğru (kabul edilen) cevabı verenlere. Yerçekimi seni hep doğruya çeksin!', 'newton', 'interaction', 'accepted_answer_count', 1),
    ('Da Vinci''nin Vitruvius''u', '10 cevabı kabul edilerek hem sanatta hem bilimde ustalaşan rönesans ruhlarına.', 'davinci', 'expertise', 'accepted_answer_count', 10),
    ('Gözlemci', '100 HubPuan''a ulaşarak kainatı izlemeye başlayan sabırlı araştırmacılara.', 'eye', 'reputation', 'reputation', 100),
    ('Çırak', '500 HubPuan''a ulaşarak mekanizmaları sökenlere.', 'tool', 'reputation', 'reputation', 500),
    ('Teorisyen', '1.000 HubPuan''a ulaşarak karatahtada kendi teorilerini üretenlere.', 'edit-3', 'reputation', 'reputation', 1000),
    ('Profesör', '2.500 HubPuan''a ulaşıp FizikHub kürsülerinde söz sahibi olanlara.', 'award', 'reputation', 'reputation', 2500),
    ('Kozmolog', '5.000 HubPuan''a ulaşıp evrenin sınırlarını zorlayanlara.', 'globe', 'reputation', 'reputation', 5000),
    ('Kuantum Mekaniği', '10.000 HubPuan efsanesi! Mikro alemlerin ve olasılıkların mutlak hakimi.', 'aperture', 'reputation', 'reputation', 10000),
    ('Mona Lisa''nın Gülümsemesi', 'İçeriklerinden biri 50+ beğeni alan parlayan ve esrarengiz yıldızlara.', 'monalisa', 'social', 'manual', 50),
    ('Schrödinger''in Kedisi', 'Gece gündüz demeden bilgelik dağıtan kütüphane muhafızlarına. Kutu açılana kadar her şey mümkün.', 'cat', 'expertise', 'manual', 0),
    ('Gece Kuşu', 'Gece yarısı (00:00-05:00) içerik giren uykusuz fızikçilere.', 'moon', 'special', 'manual', 0),
    ('Seri Okuyucu', 'Kısa sürede 50 makale okuyup beyin hücrelerini yakanlara.', 'book-open', 'interaction', 'manual', 50),
    ('Kopernik Devrimi', '5 farklı kişiyi takip eden, kendi güneş sistemini kuran topluluk canavarlarına.', 'copernicus', 'social', 'following_count', 5),
    ('Leibniz''in Dehası', 'Fikirleriyle 50 takipçiye ulaşan topluluk liderlerine.', 'leibniz', 'social', 'follower_count', 50),
    ('Bohr Atomu', 'Sözlüğe ilk akademik terimini ekleyen dikkatli araştırmacılara.', 'bohr', 'contribution', 'manual', 1),
    ('Tesla''nın Bobini', 'Bir günde 5''ten fazla cevap veren enerji patlamalarına. Alternatif akım seninle olsun!', 'tesla', 'interaction', 'manual', 0),
    ('Hawking''in Evreni', 'Merakına karşı koyamayıp sitenin her köşesini yutankara. Ufuk çizgisine hoş geldin.', 'hawking', 'secret', 'manual', 0)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    requirement_type = EXCLUDED.requirement_type,
    requirement_value = EXCLUDED.requirement_value;
