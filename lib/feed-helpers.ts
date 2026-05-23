
import { FeedItem, FeedArticleData, FeedQuestionData, FeedAuthor } from "@/components/home/unified-feed";

function buildArticlePreview(article: FeedArticleData): string {
    const explicitPreview = article.excerpt || article.summary;
    if (explicitPreview) return explicitPreview;

    if (!article.content) return "";

    return article.content
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[[^\]]+\]\([^)]*\)/g, (match: string) => match.match(/\[([^\]]+)\]/)?.[1] || " ")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 360);
}

export function processFeedData(articles: FeedArticleData[], questions: FeedQuestionData[]): FeedItem[] {
    const feedItems: FeedItem[] = [];

    // Add Articles
    articles.forEach((originalA) => {
        const a = { ...originalA };
        let type: 'article' | 'blog' | 'experiment' | 'book-review' | 'term' = (a.author as FeedAuthor)?.is_writer ? 'article' : 'blog';
        if (a.category === 'Deney') {
            type = 'experiment';
        } else if (a.category === 'Kitap İncelemesi') {
            type = 'book-review';
        } else if (a.category === 'Terim') {
            type = 'term';
        }

        // Homepage feed must never ship full article bodies to the browser.
        // Build a short fallback preview server-side for cards without an explicit excerpt.
        a.summary = buildArticlePreview(a);
        a.content = null;

        feedItems.push({
            type: type,
            data: {
                ...a,
                likes_count: a.likes_count ?? 0,
                comments_count: a.comments_count ?? 0
            },
            sortDate: a.created_at
        });
    });

    // Add Questions
    questions.forEach((originalQ) => {
        const q = { ...originalQ };
        // --- Payload Optimization ---
        // Strip HTML and truncate question content to a max of 400 chars.
        // QuestionCard only needs the first 160-300 chars for its "Read More" state.
        if (q.content) {
            const plainContent = q.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            q.content = plainContent.length > 400 ? plainContent.substring(0, 400) + '...' : plainContent;
        }

        // Handle answer count safely (could be standard relation count or flat count)
        let answerCount = 0;
        if (typeof q.answer_count === 'number') {
            answerCount = q.answer_count;
        } else if (Array.isArray(q.answers) && q.answers.length > 0) {
            const answersArray = q.answers as Array<{ count?: number | null }>;
            answerCount = answersArray[0]?.count || 0;
        }
        delete q.answers;

        feedItems.push({
            type: 'question',
            data: {
                ...q,
                answer_count: answerCount
            },
            sortDate: q.created_at
        });
    });

    // Sort by date descending
    return feedItems.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
}

export function formatSliderArticles(articles: FeedArticleData[]) {
    return articles
        .filter((a) => a.category === 'Makale' || (a.author as FeedAuthor)?.is_writer)
        .map((a) => {
            return {
                id: String(a.id),
                title: a.title,
                image: (a.cover_url || a.image_url || (a.image as string) || null) as string | null,
                slug: a.slug,
                category: a.category || "Genel",
                author_name: a.author?.full_name || 'FizikHub',
                created_at: a.created_at,
                reading_time: (a.reading_time as number) || 5
            };
        });
}

