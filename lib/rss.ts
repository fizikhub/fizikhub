import Parser from 'rss-parser';

export interface ScienceNewsItem {
    title: string;
    link: string;
    pubDate?: string;
    source: string;
}

const FEEDS = [
    { url: 'https://phys.org/rss-feed/', source: 'Phys.org' },
    { url: 'https://www.sciencedaily.com/rss/top_news.xml', source: 'ScienceDaily' },
    { url: 'https://www.duvaR.com.tr/rss', source: 'Duvar' }, // Example backup or local if needed, but keeping to science requests
];

// Curated list of reliable science feeds
const SCIENCE_FEEDS = [
    { url: 'https://p.feedblitz.com/f3.io/8987d605481711204856627054238722', source: 'ScienceDaily (Top)' }, // Specific ScienceDaily
    { url: 'https://phys.org/rss-feed/physics-news/', source: 'Phys.org (Physics)' },
    { url: 'https://phys.org/rss-feed/biology-news/', source: 'Phys.org (Biology)' },
    { url: 'https://phys.org/rss-feed/chemistry-news/', source: 'Phys.org (Chemistry)' },
];

export async function getScienceNews(): Promise<ScienceNewsItem[]> {
    const parser = new Parser();
    let allNews: ScienceNewsItem[] = [];

    try {
        const feedPromises = SCIENCE_FEEDS.map(async (feed) => {
            try {
                const data = await parser.parseURL(feed.url);
                return data.items.map(item => ({
                    title: item.title || '',
                    link: item.link || '',
                    pubDate: item.pubDate,
                    source: feed.source
                }));
            } catch (err) {
                console.error(`Error fetching RSS from ${feed.source}:`, err);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        allNews = results.flat();

        // Sort by date (newest first)
        allNews.sort((a, b) => {
            return new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime();
        });

        // Return top 20 items
        return allNews.slice(0, 20);

    } catch (error) {
        console.error("Global RSS Fetch Error:", error);
        return [
            { title: "FizikHub: Evrenin sirlarini kesfetmeye devam ediyoruz.", link: "/", source: "FizikHub" },
            { title: "Bilim dünyasindan anlik gelismeler burada.", link: "/", source: "FizikHub" }
        ];
    }
}
