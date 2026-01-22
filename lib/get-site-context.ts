
import { SupabaseClient } from "@supabase/supabase-js";

export async function getSiteContext(supabase: SupabaseClient) {
    try {
        // 1. Fetch published articles with authors
        const { data: articles } = await supabase
            .from('articles')
            .select(`
                title,
                content_text, 
                slug,
                created_at,
                author:profiles!author_id (
                    full_name,
                    username
                )
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(20);

        if (!articles) return "";

        // 2. Format articles for AI
        const articlesContext = articles.map((art: any) => {
            const authorName = art.author?.full_name || art.author?.username || "Anonim";
            const summary = art.content_text ? art.content_text.substring(0, 300) + "..." : "İçerik özeti yok.";
            return `- MAKALE: "${art.title}" (Yazar: ${authorName})
  Özet: ${summary}
  Link: https://fizikhub.com/blog/${art.slug}`;
        }).join("\n\n");

        return `
## GÜNCEL SİTE İÇERİKLERİ (MAKALELER)
Aşağıdaki makaleler şu an sitemizde yayındadır. Kullanıcı bunlarla ilgili sorarsa detaylı bilgi ver:

${articlesContext}
`;

    } catch (error) {
        console.error("Error fetching site context:", error);
        return "";
    }
}
