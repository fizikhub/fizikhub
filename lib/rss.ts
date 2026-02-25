import Parser from 'rss-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ScienceNewsItem {
    title: string;
    link: string;
    pubDate?: string;
    source: string;
}

const FEEDS = [
    { url: 'https://phys.org/rss-feed/', source: 'Phys.org' },
    { url: 'https://www.sciencedaily.com/rss/top_news.xml', source: 'ScienceDaily' },
    { url: 'https://www.duvaR.com.tr/rss', source: 'Duvar' },
];

// Curated list of reliable science feeds
const SCIENCE_FEEDS = [
    { url: 'https://p.feedblitz.com/f3.io/8987d605481711204856627054238722', source: 'ScienceDaily' },
    { url: 'https://phys.org/rss-feed/physics-news/', source: 'Phys.org' },
];

// Translate English titles to Turkish using Gemini
async function translateTitles(titles: string[]): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey || titles.length === 0) return titles;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Translate these science news headlines from English to Turkish. Return ONLY the translations, one per line, in the same order. Keep scientific terms accurate. Do not add numbering or explanation.\n\n${titles.join('\n')}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const translated = text.trim().split('\n').map(l => l.trim()).filter(Boolean);

        // If translation count matches, use them; otherwise fallback
        if (translated.length === titles.length) {
            return translated;
        }
        return titles;
    } catch (error) {
        console.error("Translation error:", error);
        return titles;
    }
}

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

        // Take top 15 items
        allNews = allNews.slice(0, 15);

        // Translate titles to Turkish
        const titles = allNews.map(n => n.title);
        const translatedTitles = await translateTitles(titles);
        allNews = allNews.map((item, i) => ({
            ...item,
            title: translatedTitles[i] || item.title
        }));

        return allNews;

    } catch (error) {
        console.error("Global RSS Fetch Error:", error);
        return [
            { title: "FizikHub: Evrenin sırlarını keşfetmeye devam ediyoruz.", link: "/", source: "FizikHub" },
            { title: "Bilim dünyasından anlık gelişmeler burada.", link: "/", source: "FizikHub" }
        ];
    }
}
