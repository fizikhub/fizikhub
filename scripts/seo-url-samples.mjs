const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.fizikhub.com").replace(/\/+$/, "");
const format = (process.env.FORMAT || "json").toLowerCase();

async function getText(path) {
    const response = await fetch(`${baseUrl}${path}`, {
        headers: { "user-agent": "Fizikhub SEO URL sampler" },
    });

    if (!response.ok) {
        throw new Error(`${path} returned ${response.status}`);
    }

    return response.text();
}

function locs(xml) {
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
}

function typeFor(url) {
    const path = new URL(url).pathname;
    if (path.startsWith("/makale/") || path.startsWith("/deney/")) return "article";
    if (path.startsWith("/forum/")) return "forum";
    if (path.startsWith("/sozluk/")) return "dictionary";
    if (path.startsWith("/konular/")) return "topic";
    if (path.startsWith("/testler/")) return "quiz";
    if (path.startsWith("/simulasyonlar/")) return "simulation";
    return "core";
}

function pushUnique(samples, url, priorityReason) {
    if (!url || samples.some((sample) => sample.url === url)) return;
    samples.push({
        url,
        type: typeFor(url),
        priorityReason,
    });
}

const [rootSitemap, articleSitemap, forumSitemap, dictionarySitemap] = await Promise.all([
    getText("/sitemap.xml"),
    getText("/article-sitemap.xml"),
    getText("/forum-sitemap.xml"),
    getText("/dictionary-sitemap.xml"),
]);

const samples = [];
[
    `${baseUrl}/`,
    `${baseUrl}/makale`,
    `${baseUrl}/konular`,
    `${baseUrl}/sozluk`,
    `${baseUrl}/testler`,
    `${baseUrl}/simulasyonlar`,
    `${baseUrl}/sitemap-index.xml`,
    `${baseUrl}/ai-index.json`,
].forEach((url) => pushUnique(samples, url, "core-surface"));

locs(articleSitemap).slice(0, 10).forEach((url) => pushUnique(samples, url, "published-indexable-article"));
locs(dictionarySitemap).slice(0, 5).forEach((url) => pushUnique(samples, url, "dictionary-entity"));
locs(forumSitemap).slice(0, 5).forEach((url) => pushUnique(samples, url, "quality-forum-question"));
locs(rootSitemap)
    .filter((url) => new URL(url).pathname.startsWith("/konular/"))
    .slice(0, 6)
    .forEach((url) => pushUnique(samples, url, "topic-cluster"));
locs(rootSitemap)
    .filter((url) => ["/testler/", "/simulasyonlar/"].some((prefix) => new URL(url).pathname.startsWith(prefix)))
    .slice(0, 8)
    .forEach((url) => pushUnique(samples, url, "learning-resource"));

const selected = samples.slice(0, 30).map((sample, index) => ({
    priority: index + 1,
    ...sample,
}));

if (format === "csv") {
    console.log("priority,type,url,priorityReason");
    for (const sample of selected) {
        console.log([sample.priority, sample.type, sample.url, sample.priorityReason]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(","));
    }
} else {
    console.log(JSON.stringify({
        baseUrl,
        generatedAt: new Date().toISOString(),
        count: selected.length,
        samples: selected,
    }, null, 2));
}
