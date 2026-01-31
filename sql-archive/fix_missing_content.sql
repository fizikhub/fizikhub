-- SQL Script to fix missing content on Homepage and Forum (UPDATED)
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- 1. Find a user to assign content to
    SELECT id INTO target_user_id FROM profiles WHERE username = 'Klausy';
    
    -- If klausy not found, pick the first available user profile
    IF target_user_id IS NULL THEN
        SELECT id INTO target_user_id FROM profiles LIMIT 1;
    END IF;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'No user profile found. Please sign up a user first.';
    END IF;

    RAISE NOTICE 'Using User ID: %', target_user_id;

    -- 1.5 Ensure 'summary' column exists (Fix for Schema Mismatch)
    BEGIN
        ALTER TABLE public.articles ADD COLUMN summary text;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column summary already exists in articles.';
    END;

    -- 2. Upsert Articles (Force status to published)
    INSERT INTO public.articles (title, slug, summary, content, category, author_id, status, image_url, created_at, views)
    VALUES
    (
        'Evrenin Başlangıcı: Büyük Patlama ve Ötesi',
        'evrenin-baslangici-buyuk-patlama',
        'Evrenin nasıl başladığını, kozmik mikrodalga arka alan ışınımını ve Büyük Patlama teorisinin detaylarını inceliyoruz.',
        '<h1>Büyük Patlama Nedir?</h1><p>Evrenimiz yaklaşık 13.8 milyar yıl önce tek bir noktadan genişleyerek bugünkü halini aldı.</p>',
        'Kozmoloji',
        target_user_id,
        'published',
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop',
        NOW(),
        120
    ),
    (
        'Kuantum Mekaniği: Görünmeyenin Fiziği',
        'kuantum-mekanigi-gorunmeyenin-fizigi',
        'Atom altı parçacıkların gizemli dünyasına, süperpozisyondan dolanıklığa uzanan bir yolculuk.',
        '<h1>Kuantum Dünyası</h1><p>Klasik fizik kurallarının işlemediği bir yer burası. Schrödinger''in kedisi hem canlı hem ölü olabilir mi?</p>',
        'Kuantum Fiziği',
        target_user_id,
        'published',
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop',
        NOW() - INTERVAL '1 day',
        85
    ),
    (
        'Yapay Zeka ve Bilimin Geleceği',
        'yapay-zeka-ve-bilimin-gelecegi',
        'Yapay zeka teknolojilerinin bilimsel araştırmalardaki rolü ve veri analizini nasıl devrimselleştirdiği.',
        '<h1>AI ve Bilim</h1><p>Yapay zeka, karmaşık protein katlanmalarından uzak galaksilerin sınıflandırılmasına kadar her yerde.</p>',
        'Teknoloji',
        target_user_id,
        'published',
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop',
        NOW() - INTERVAL '2 days',
        200
    )
    ON CONFLICT (slug) 
    DO UPDATE SET 
        status = 'published',
        image_url = EXCLUDED.image_url,
        summary = EXCLUDED.summary,
        author_id = target_user_id; -- Reassign to valid user to avoid FK issues

    -- 3. Upsert Forum Questions
    INSERT INTO public.questions (title, content, category, author_id, votes, created_at, tags)
    VALUES
    (
        'Işık hızı aşılabilir mi?',
        'Einstein''ın görelilik teorisine göre ışık hızı evrensel bir hız sınırıdır. Peki solucan delikleri veya warp sürücüleri teorik olarak bunu aşmamıza izin verir mi?',
        'Astrofizik',
        target_user_id,
        42,
        NOW(),
        '{fizik,isik-hizi}'
    ),
    (
        'Kara deliklerin içine düşersek ne olur?',
        'Olay ufkunu geçtikten sonra spagettileşme süreci nasıl işler? Bilgi paradoksu hakkında ne düşünüyorsunuz?',
        'Kozmoloji',
        target_user_id,
        28,
        NOW() - INTERVAL '1 hour',
        '{kara-delik,kozmoloji}'
    ),
    (
        'Zaman yolculuğu teorik olarak mümkün mü?',
        'Geçmişe gitmek paradokslar yaratır mı? Büyükbaba paradoksu veya çoklu evrenler yorumu bunu nasıl çözer?',
        'Genel Görelilik',
        target_user_id,
        15,
        NOW() - INTERVAL '3 hours',
        '{zaman,gorelilik}'
    ),
    (
        'Kuantum dolanıklık nedir?',
        'İki parçacığın birbirinden haberdar olması ve mesafeden bağımsız etkileşimi nasıl açıklanır? Einstein buna neden "uzaktan hayalet etki" dedi?',
        'Kuantum Fiziği',
        target_user_id,
        33,
        NOW() - INTERVAL '5 hours',
        '{kuantum}'
    ),
    (
        'Evrenin sonu nasıl gelecek?',
        'Büyük Donma mı, Büyük Çöküş mü yoksa Büyük Yırtılma mı? Karanlık enerjinin rolü nedir?',
        'Kozmoloji',
        target_user_id,
        19,
        NOW() - INTERVAL '1 day',
        '{evren,kozmoloji}'
    )
    ON CONFLICT DO NOTHING; -- Assuming id/title constraints might exist, but questions usually allow dupes unless constrained. 

END $$;
