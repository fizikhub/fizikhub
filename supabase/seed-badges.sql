-- fizikhub/supabase/seed-badges.sql
-- Yeni Neo-Brutalist Animasyonlu Rozetleri Supabase 'badges' tablosuna ekler.
-- Supabase SQL editöründe çalıştırınız.

INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value)
VALUES 
    ('Merhaba Dünya', 'FizikHub''a hoş geldin! Bu alemdeki ilk izin.', 'zap', 'milestone', 'manual', 0),
    ('Soru İşareti', 'İlk sorusunu sorarak merakını evrene duyuranlara.', 'help-circle', 'interaction', 'question_count', 1),
    ('Einstein''ın Mirası', 'İlk makalesini yazarak bilime kalıcı bir iz bırakanlara.', 'book-open', 'contribution', 'article_count', 1),
    ('Newton''un Elması', 'İlk doğru (kabul edilen) cevabı verenlere.', 'check-circle', 'interaction', 'accepted_answer_count', 1),
    ('Sorun Çözücü', '10 cevabı kabul edilerek ustalaşanlara.', 'check-square', 'expertise', 'accepted_answer_count', 10),
    ('Gözlemci', '100 HubPuan''a ulaşarak uzayı izlemeye başlayanlara.', 'eye', 'reputation', 'reputation', 100),
    ('Çırak', '500 HubPuan''a ulaşarak mekanizmaları çözenlere.', 'tool', 'reputation', 'reputation', 500),
    ('Teorisyen', '1.000 HubPuan''a ulaşarak kendi teorilerini üretenlere.', 'edit-3', 'reputation', 'reputation', 1000),
    ('Profesör', '2.500 HubPuan''a ulaşıp kürsü sahibi olanlara.', 'award', 'reputation', 'reputation', 2500),
    ('Kozmolog', '5.000 HubPuan''a ulaşıp evrenin sınırlarını zorlayanlara.', 'globe', 'reputation', 'reputation', 5000),
    ('Kuantum Mekaniği', '10.000 HubPuan efsanesi! Mikro alemlerin hakimi.', 'aperture', 'reputation', 'reputation', 10000),
    ('Popüler', 'İçeriklerinden biri 50+ beğeni alan parlayan yıldızlara.', 'heart', 'social', 'manual', 50),
    ('Bilge Baykuş', 'Gece gündüz demeden bilgelik dağıtan kütüphane muhafızlarına.', 'book', 'expertise', 'manual', 0),
    ('Gece Kuşu', 'Gece yarısı (00:00-05:00) içerik giren uykusuz fızikçilere.', 'moon', 'special', 'manual', 0),
    ('Seri Okuyucu', 'Kısa sürede 50 makale okuyup beyin hücrelerini yakanlara.', 'book-open', 'interaction', 'manual', 50),
    ('Sosyal Kelebek', '5 farklı kişiyi takip eden, topluluk canavarlarına.', 'users', 'social', 'following_count', 5),
    ('Fikir Önderi', 'Fikirleriyle 50 takipçiye ulaşan topluluk liderlerine.', 'star', 'social', 'follower_count', 50),
    ('Keskin Göz', 'Sözlüğe ilk akademik terimini ekleyen dikkatli araştırmacılara.', 'search', 'contribution', 'manual', 1),
    ('Tesla''nın Kıvılcımı', 'Bir günde 5''ten fazla cevap veren enerji patlamalarına.', 'zap', 'interaction', 'manual', 0),
    ('Karadelik', 'Merakına karşı koyamayıp sitenin her köşesini yutanlara. (Gizli Başarım)', 'target', 'secret', 'manual', 0)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    requirement_type = EXCLUDED.requirement_type,
    requirement_value = EXCLUDED.requirement_value;
