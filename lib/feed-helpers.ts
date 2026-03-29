
import { FeedItem } from "@/components/home/unified-feed";

export function processFeedData(articles: any[], questions: any[]): FeedItem[] {
    const feedItems: FeedItem[] = [];

    // Add Articles
    articles.forEach((a) => {
        let type: FeedItem['type'] = a.author?.is_writer ? 'article' : 'blog';
        if (a.category === 'Deney') {
            type = 'experiment';
        } else if (a.category === 'Kitap İncelemesi') {
            type = 'book-review';
        } else if (a.category === 'Terim') {
            type = 'term';
        }

        // --- Payload Optimization ---
        // NeoArticleCard expects `summary` or `content` for its preview text.
        // We calculate a summary here. Instead of deleting the content completely
        // (which breaks TermCard, BookReviewCard using regex on content metadata),
        // we heavily truncate it to 500 characters. This preserves the meta block
        // at the top of the Markdown while still saving ~200KB-1MB per SSR!
        if (a.content) {
            if (!a.summary) {
                const tempSummary = a.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                a.summary = tempSummary.substring(0, 200) + (tempSummary.length > 200 ? '...' : '');
            }
            a.content = a.content.length > 500 ? a.content.substring(0, 500) : a.content;
        }

        feedItems.push({
            type: type,
            data: {
                ...a,
                likes_count: 0,
                comments_count: 0
            },
            sortDate: a.created_at
        });
    });

    // Add Questions
    questions.forEach((q) => {
        // --- Payload Optimization ---
        // Strip HTML and truncate question content to a max of 400 chars.
        // QuestionCard only needs the first 160-300 chars for its "Read More" state.
        if (q.content) {
            const plainContent = q.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            q.content = plainContent.length > 400 ? plainContent.substring(0, 400) + '...' : plainContent;
        }

        feedItems.push({
            type: 'question',
            data: {
                ...q,
                answer_count: q.answers?.[0]?.count || 0
            },
            sortDate: q.created_at
        });
    });

    // Sort by date descending
    return feedItems.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
}

export function formatSliderArticles(articles: any[]) {
    return articles
        .filter((a: any) => a.category === 'Makale' || a.author?.is_writer)
        .map((a: any) => {
            // Calculate reading time
            const content = a.content || '';
            const plainText = content.replace(/<[^>]+>/g, ' ');
            const wordCount = plainText.trim().split(/\s+/).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 225));

            return {
                id: a.id,
                title: a.title,
                image: a.image_url || a.image,
                slug: a.slug,
                category: a.category,
                author_name: a.author?.full_name || 'FizikHub',
                created_at: a.created_at,
                reading_time: readingTime
            };
        });
}
