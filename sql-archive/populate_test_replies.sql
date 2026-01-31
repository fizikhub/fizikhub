-- En son yapılan yoruma 5 tane test yanıtı ekle
-- Bu sayede "Diğer yanıtları gör" butonu kesinlikle çıkmalı

DO $$
DECLARE
    latest_comment_id BIGINT;
    latest_article_id INTEGER;
    my_user_id UUID;
BEGIN
    -- En son yorumu bul (parent olmayan)
    SELECT id, article_id, user_id INTO latest_comment_id, latest_article_id, my_user_id
    FROM article_comments
    WHERE parent_comment_id IS NULL
    ORDER BY created_at DESC
    LIMIT 1;

    -- Eğer yorum varsa, altına 5 tane yanıt ekle
    IF latest_comment_id IS NOT NULL THEN
        INSERT INTO article_comments (article_id, user_id, parent_comment_id, content)
        VALUES
            (latest_article_id, my_user_id, latest_comment_id, 'Test Yanıtı 1 - Görünmeli'),
            (latest_article_id, my_user_id, latest_comment_id, 'Test Yanıtı 2 - Görünmeli'),
            (latest_article_id, my_user_id, latest_comment_id, 'Test Yanıtı 3 - Gizli olmalı (Butona basınca açılacak)'),
            (latest_article_id, my_user_id, latest_comment_id, 'Test Yanıtı 4 - Gizli olmalı'),
            (latest_article_id, my_user_id, latest_comment_id, 'Test Yanıtı 5 - Gizli olmalı');
            
        RAISE NOTICE 'Test yanıtları eklendi! ID: %', latest_comment_id;
    ELSE
        RAISE NOTICE 'Hiç yorum bulunamadı. Önce bir yorum yapın.';
    END IF;
END $$;
