import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const canonicalBaseUrl = "https://www.fizikhub.com";
const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || canonicalBaseUrl).replace(/\/+$/, "");
const expectedRedirectBaseUrl = baseUrl === canonicalBaseUrl ? canonicalBaseUrl : baseUrl;
const gscExportDir = process.env.GSC_EXPORT_DIR || path.join(os.homedir(), "Downloads");

const privateDisallowPatterns = [
  "Disallow: /profil/",
  "Disallow: /admin/",
  "Disallow: /yazar/",
  "Disallow: /yazar-paneli/",
  "Disallow: /makale/yeni",
  "Disallow: /mesajlar/",
  "Disallow: /notifications/",
  "Disallow: /kurulum/",
  "Disallow: /time-limit/",
  "Disallow: /yonetim/",
];

const forbiddenUrlPatterns = [
  /https?:\/\/fizikhub\.com/i,
  /\/blog(?:\/|\?|$)/i,
  /\/index(?:\?|$)/i,
  /[?&]kategori=/i,
  /[?&]sort=latest/i,
  /\/(?:login|forgot-password|reset-password|profil|admin|yazar-paneli|mesajlar|notifications|kurulum|time-limit|yonetim|paylas)(?:\/|\?|$)/i,
  /\/(?:makale|deney)\/(?:test|tesr|deneme)(?:[-_]|$)/i,
  /\/_next\/static\//i,
  /\.(?:woff2?|ttf|otf|map)(?:\?|$)/i,
];

async function fetchText(urlOrPath, init = {}) {
  const url = urlOrPath.startsWith("http") ? urlOrPath : `${baseUrl}${urlOrPath}`;
  const response = await fetch(url, {
    headers: { "user-agent": "Fizikhub SEO health check" },
    redirect: "manual",
    ...init,
  });

  return {
    url,
    path: urlOrPath,
    status: response.status,
    location: response.headers.get("location"),
    contentType: response.headers.get("content-type"),
    xRobotsTag: response.headers.get("x-robots-tag"),
    text: await response.text().catch(() => ""),
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function locs(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
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

function forbiddenReason(url) {
  const pattern = forbiddenUrlPatterns.find((candidate) => candidate.test(url));
  if (pattern) return pattern.toString();

  try {
    const parsed = new URL(url);
    if (parsed.origin !== canonicalBaseUrl) return "non-canonical-origin";
  } catch {
    return "invalid-url";
  }

  return null;
}

function readGscExportUrls() {
  if (!fs.existsSync(gscExportDir)) return [];

  const entries = fs.readdirSync(gscExportDir, { withFileTypes: true })
    .filter((entry) => entry.name.startsWith("fizikhub.com-Coverage"))
    .flatMap((entry) => {
      const entryPath = path.join(gscExportDir, entry.name);
      if (entry.isDirectory()) {
        return fs.readdirSync(entryPath)
          .filter((file) => file.endsWith(".csv"))
          .map((file) => path.join(entryPath, file));
      }
      return entry.name.endsWith(".csv") ? [entryPath] : [];
    });

  const urls = [];
  for (const file of entries) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/https?:\/\/(?:www\.)?fizikhub\.com[^,\r\n"]*/g)) {
      urls.push({ file, url: match[0] });
    }
  }
  return urls;
}

const resourcePaths = [
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

const resources = await Promise.all(resourcePaths.map((resource) => fetchText(resource)));
const byPath = new Map(resources.map((resource) => [resource.path, resource]));

for (const resource of resources) {
  assert(resource.status === 200, `${resource.path} returned ${resource.status}`);
}

const robotsText = byPath.get("/robots.txt").text;
for (const disallow of privateDisallowPatterns) {
  assert(!robotsText.includes(disallow), `robots.txt still contains private disallow: ${disallow}`);
}

for (const sitemap of ["/sitemap.xml", "/article-sitemap.xml", "/forum-sitemap.xml", "/dictionary-sitemap.xml", "/news-sitemap.xml"]) {
  const badUrls = locs(byPath.get(sitemap).text)
    .map((url) => ({ url, reason: forbiddenReason(url) }))
    .filter((entry) => entry.reason);
  assert(badUrls.length === 0, `${sitemap} contains forbidden URLs: ${JSON.stringify(badUrls.slice(0, 10))}`);
}

const aiIndex = JSON.parse(byPath.get("/ai-index.json").text);
assert(Array.isArray(aiIndex.items) && aiIndex.items.length > 0, "/ai-index.json has no items");
const badAiUrls = aiIndex.items
  .map((item) => ({ url: item.url, reason: forbiddenReason(item.url) }))
  .filter((entry) => entry.reason);
assert(badAiUrls.length === 0, `/ai-index.json contains forbidden URLs: ${JSON.stringify(badAiUrls.slice(0, 10))}`);

const feedText = byPath.get("/feed.xml").text;
assert((feedText.match(/<item>/g) || []).length > 0, "/feed.xml has no RSS items");
for (const match of feedText.matchAll(/<link>([^<]+)<\/link>/g)) {
  const reason = forbiddenReason(match[1]);
  assert(!reason, `/feed.xml contains forbidden URL ${match[1]} (${reason})`);
}

const redirects = [
  ["/index", `${expectedRedirectBaseUrl}/`],
  ["/blog?kategori=Kuantum&sort=latest", `${expectedRedirectBaseUrl}/makale?category=Kuantum`],
  ["/blog/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662", `${expectedRedirectBaseUrl}/makale/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662`],
];

for (const [source, expected] of redirects) {
  const response = await fetchText(source);
  assert(response.status === 301, `${source} redirect returned ${response.status}`);
  assert(new URL(response.location, baseUrl).toString() === expected, `${source} redirect target is ${response.location}, expected ${expected}`);
}

if (baseUrl === canonicalBaseUrl) {
  const nonCanonical = await fetchText("https://fizikhub.com/sozluk");
  assert([301, 307, 308].includes(nonCanonical.status), `non-www redirect returned ${nonCanonical.status}`);
  assert(new URL(nonCanonical.location).toString() === `${canonicalBaseUrl}/sozluk`, `non-www target is ${nonCanonical.location}`);
}

for (const privatePath of ["/login", "/mesajlar", "/makale/yeni", "/paylas"]) {
  const response = await fetchText(privatePath);
  assert(response.xRobotsTag?.includes("noindex"), `${privatePath} is missing X-Robots-Tag noindex`);
}

const publicSample = await fetchText("/makale");
assert(!publicSample.xRobotsTag?.includes("noindex"), "/makale should not have X-Robots-Tag noindex");

const samplePaths = [
  locs(byPath.get("/article-sitemap.xml").text)[0],
  locs(byPath.get("/forum-sitemap.xml").text)[0],
  locs(byPath.get("/dictionary-sitemap.xml").text)[0],
].filter(Boolean).map((url) => new URL(url).pathname);

for (const samplePath of samplePaths) {
  const sample = await fetchText(samplePath);
  assert(sample.status === 200, `${samplePath} sample returned ${sample.status}`);
  assert(sample.text.includes('rel="canonical"'), `${samplePath} has no canonical link`);
  assert(!sample.text.includes("noindex"), `${samplePath} contains noindex`);
  assert(countJsonLd(sample.text) > 0, `${samplePath} has no JSON-LD`);
  assert(visibleTextLength(sample.text) > 500, `${samplePath} has too little visible text`);
}

const gscUrls = readGscExportUrls();
const gscSummary = gscUrls.reduce((acc, entry) => {
  const reason = forbiddenReason(entry.url) || "clean-or-needs-live-check";
  acc[reason] = (acc[reason] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({
  baseUrl,
  sitemapCounts: Object.fromEntries(["/sitemap.xml", "/article-sitemap.xml", "/forum-sitemap.xml", "/dictionary-sitemap.xml", "/news-sitemap.xml"]
    .map((sitemap) => [sitemap, locs(byPath.get(sitemap).text).length])),
  aiIndexItemCount: aiIndex.items.length,
  samplePaths,
  gscExportUrlCount: gscUrls.length,
  gscSummary,
}, null, 2));
