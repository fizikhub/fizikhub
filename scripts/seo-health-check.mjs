const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.fizikhub.com").replace(/\/+$/, "");

async function getText(path) {
    const response = await fetch(`${baseUrl}${path}`, {
        headers: { "user-agent": "Fizikhub SEO health check" },
        redirect: "manual",
    });
    return {
        path,
        status: response.status,
        location: response.headers.get("location"),
        contentType: response.headers.get("content-type"),
        text: await response.text().catch(() => ""),
    };
}

function countLoc(xml) {
    return (xml.match(/<loc>/g) || []).length;
}

function firstLoc(xml) {
    const match = xml.match(/<loc>([^<]+)<\/loc>/);
    return match ? match[1] : null;
}

function pathFromLoc(loc) {
    if (!loc) return null;
    try {
        return new URL(loc).pathname;
    } catch {
        return null;
    }
}

function countJsonLd(html) {
    return (html.match(/application\/ld\+json/g) || []).length;
}

function visibleTextLength(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .length;
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const checks = [
    "/sitemap-index.xml",
    "/sitemap.xml",
    "/article-sitemap.xml",
    "/forum-sitemap.xml",
    "/dictionary-sitemap.xml",
    "/news-sitemap.xml",
    "/feed.xml",
    "/robots.txt",
    "/ai-index.json",
];

const results = await Promise.all(checks.map(getText));
const byPath = new Map(results.map((result) => [result.path, result]));

for (const result of results) {
    assert(result.status === 200, `${result.path} returned ${result.status}`);
}

const sitemapCount = countLoc(byPath.get("/sitemap.xml").text);
const sitemapIndexCount = countLoc(byPath.get("/sitemap-index.xml").text);
const articleCount = countLoc(byPath.get("/article-sitemap.xml").text);
const forumCount = countLoc(byPath.get("/forum-sitemap.xml").text);
const dictionaryCount = countLoc(byPath.get("/dictionary-sitemap.xml").text);
const feedItemCount = (byPath.get("/feed.xml").text.match(/<item>/g) || []).length;
const robotsText = byPath.get("/robots.txt").text;
const aiIndex = JSON.parse(byPath.get("/ai-index.json").text);

assert(sitemapIndexCount >= 5, "/sitemap-index.xml does not list all child sitemaps");
assert(sitemapCount > 0, "/sitemap.xml has no URLs");
assert(articleCount > 0, "/article-sitemap.xml has no article URLs");
assert(dictionaryCount > 0, "/dictionary-sitemap.xml has no dictionary URLs");
assert(feedItemCount > 0, "/feed.xml has no RSS items");
assert(Array.isArray(aiIndex.items) && aiIndex.items.length > 0, "/ai-index.json has no items");
assert(aiIndex.items.some((item) => item.type === "article"), "/ai-index.json has no article items");
assert(aiIndex.items.some((item) => item.type === "dictionary"), "/ai-index.json has no dictionary items");
assert(aiIndex.items.some((item) => item.type === "simulation"), "/ai-index.json has no simulation items");
assert(robotsText.includes("/sitemap-index.xml"), "robots.txt does not advertise sitemap index");
assert(robotsText.includes("/article-sitemap.xml"), "robots.txt does not advertise article sitemap");
assert(robotsText.includes("/forum-sitemap.xml"), "robots.txt does not advertise forum sitemap");
assert(robotsText.includes("/dictionary-sitemap.xml"), "robots.txt does not advertise dictionary sitemap");
assert(robotsText.includes("/ai-index.json"), "robots.txt does not allow/reference ai-index.json");

const redirect = await getText("/blog/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662");
assert([301, 308].includes(redirect.status), `/blog/:slug redirect returned ${redirect.status}`);
assert(redirect.location?.includes("/makale/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662"), "/blog/:slug redirect target is wrong");

const samplePaths = [
    pathFromLoc(firstLoc(byPath.get("/article-sitemap.xml").text)),
    pathFromLoc(firstLoc(byPath.get("/forum-sitemap.xml").text)),
    pathFromLoc(firstLoc(byPath.get("/dictionary-sitemap.xml").text)),
    "/simulasyonlar/basit-sarkac",
].filter(Boolean);

const sampleResults = await Promise.all(samplePaths.map(getText));
for (const sample of sampleResults) {
    assert(sample.status === 200, `${sample.path} sample returned ${sample.status}`);
    assert(sample.text.includes('rel="canonical"') || sample.text.includes("rel=\"canonical\""), `${sample.path} has no canonical link`);
    assert(!sample.text.includes("noindex"), `${sample.path} contains noindex`);
    assert(countJsonLd(sample.text) > 0, `${sample.path} has no JSON-LD`);
    assert(visibleTextLength(sample.text) > 500, `${sample.path} has too little visible text`);
}

console.log(JSON.stringify({
    baseUrl,
    sitemapIndexCount,
    sitemapCount,
    articleCount,
    forumCount,
    dictionaryCount,
    feedItemCount,
    aiIndexItemCount: aiIndex.items.length,
    samplePaths,
    blogRedirectStatus: redirect.status,
    blogRedirectLocation: redirect.location,
}, null, 2));
