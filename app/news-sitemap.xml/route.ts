import { createClient } from '@supabase/supabase-js';
import { getSiteUrl, isLikelyIndexableArticle, toAbsoluteUrl } from '@/lib/seo-utils';

export const revalidate = 900;

const PUBLICATION_NAME = 'Fizikhub';
const PUBLICATION_LANGUAGE = 'tr';

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function getArticleUrl(baseUrl: string, article: { slug: string; category?: string | null }) {
    let urlPrefix = 'makale';

    if (article.category === 'Deney') urlPrefix = 'deney';

    return `${baseUrl}/${urlPrefix}/${article.slug}`;
}

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
    );

    const baseUrl = getSiteUrl();
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: articles } = await supabase
        .from('articles')
        .select('title, slug, excerpt, category, created_at, cover_url, image_url')
        .eq('status', 'published')
        .not('slug', 'is', null)
        .neq('category', 'Terim')
        .gte('created_at', twoDaysAgo)
        .order('created_at', { ascending: false })
        .limit(1000);

    const urls = (articles || [])
        .flatMap((article) => {
            if (!article.slug || !article.created_at || !isLikelyIndexableArticle(article)) return [];

            const articleUrl = getArticleUrl(baseUrl, { ...article, slug: article.slug });
            const title = article.title || article.slug;
            const imageUrl = toAbsoluteUrl(article.cover_url || article.image_url, baseUrl);
            const imageXml = imageUrl
                ? `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`
                : '';

            return `  <url>
    <loc>${escapeXml(articleUrl)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.created_at).toISOString()}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>${imageXml}
  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300',
        },
    });
}
