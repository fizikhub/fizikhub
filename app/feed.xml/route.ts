import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Revalidate RSS feed every hour

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
    );

    const baseUrl = 'https://fizikhub.com';

    // Fetch latest 50 published articles
    const { data: articles } = await supabase
        .from('articles')
        .select(`
            title,
            slug,
            content,
            image_url,
            category,
            created_at,
            updated_at,
            profiles!articles_author_id_fkey(full_name, username)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

    // Determine the most recent article date for lastBuildDate
    const lastBuildDate = articles && articles.length > 0
        ? new Date(articles[0].created_at).toUTCString()
        : new Date().toUTCString();

    const rssItems = (articles || []).map((article) => {
        const author = (article as any).profiles;
        const authorName = author?.full_name || author?.username || 'Fizikhub';

        // Determine URL prefix based on category
        let urlPrefix = 'blog';
        if (article.category === 'Deney') urlPrefix = 'deney';
        else if (article.category === 'Kitap İncelemesi') urlPrefix = 'kitap-inceleme';

        const articleUrl = `${baseUrl}/${urlPrefix}/${article.slug}`;

        // Get first 300 chars of content as description, strip HTML
        const description = article.content
            ? escapeXml(stripHtml(article.content).substring(0, 300) + '...')
            : escapeXml(article.title);

        // Category mapping for RSS
        const categoryMap: Record<string, string> = {
            'Blog': 'Makale',
            'Deney': 'Deney',
            'Kitap İncelemesi': 'Kitap İncelemesi',
            'Terim': 'Terim',
        };
        const rssCategory = categoryMap[article.category] || 'Makale';

        return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${description}</description>
      <author>${escapeXml(authorName)}</author>
      <category>${escapeXml(rssCategory)}</category>
      <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>${article.image_url ? `
      <enclosure url="${escapeXml(article.image_url)}" type="image/jpeg" />` : ''}
    </item>`;
    });

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Fizikhub — Bilimi Ti'ye Alıyoruz</title>
    <link>${baseUrl}</link>
    <description>Fizik makaleleri, bilim deneyleri, kitap incelemeleri ve bilimsel terimler. Türkçe bilim platformu.</description>
    <language>tr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/icon-512.png</url>
      <title>Fizikhub</title>
      <link>${baseUrl}</link>
    </image>
    <copyright>© ${new Date().getFullYear()} Fizikhub. Tüm hakları saklıdır.</copyright>
    <managingEditor>iletisim@fizikhub.com (Fizikhub)</managingEditor>
    <webMaster>iletisim@fizikhub.com (Fizikhub)</webMaster>
    <ttl>60</ttl>
${rssItems.join('\n')}
  </channel>
</rss>`;

    return new Response(rssFeed, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
    });
}
