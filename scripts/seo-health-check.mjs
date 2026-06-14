import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const canonicalBaseUrl = "https://www.fizikhub.com";
const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || canonicalBaseUrl).replace(/\/+$/, "");
const expectedRedirectBaseUrl = baseUrl === canonicalBaseUrl ? canonicalBaseUrl : baseUrl;
const gscExportDir = process.env.GSC_EXPORT_DIR || path.join(os.homedir(), "Downloads");
const gscExampleLimit = Number(process.env.GSC_EXAMPLE_LIMIT || 5);

const privateDisallowPatterns = [
  "Disallow: /profil/",
  "Disallow: /admin/",
  "Disallow: /yazar/",
  "Disallow: /yazar-paneli/",
  "Disallow: /makale/yeni",
  "Disallow: /mesajlar/",
  "Disallow: /notifications/",
  "Disallow: /kurulum/",
  "Disallow: /login",
  "Disallow: /forgot-password",
  "Disallow: /reset-password",
  "Disallow: /basvuru/",
  "Disallow: /time-limit/",
  "Disallow: /yonetim/",
  "Disallow: /abs/",
  "Disallow: /storage/",
  "Disallow: /cdn-cgi/",
  "Disallow: /*?q=*",
];

const forbiddenUrlPatterns = [
  /https?:\/\/fizikhub\.com/i,
  /\/search(?:\?|$)/i,
  /\/blog(?:\/|\?|$)/i,
  /\/index(?:\?|$)/i,
  /\*/i,
  /[?&]kategori=/i,
  /[?&]sort=latest/i,
  /\/makale\/kategori\/[^?#]+[?&]/i,
  /\/(?:login|forgot-password|reset-password|profil|admin|yazar-paneli|mesajlar|notifications|kurulum|time-limit|yonetim|basvuru)(?:\/|\?|$)/i,
  /\/yazar(?:$|\?|\/(?!rehber(?:\/|\?|$)))/i,
  /\/(?:makale\/yeni|makale\/duzenle|kitap-inceleme\/yeni)(?:\/|\?|$)/i,
  /[?&]q=/i,
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

function extractJsonLd(html) {
  return Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi))
    .map((match) => match[1].trim())
    .filter(Boolean)
    .flatMap((raw) => {
      const decoded = raw
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

      try {
        return [JSON.parse(decoded)];
      } catch {
        return [];
      }
    });
}

function walkJson(value, visitor) {
  if (!value || typeof value !== "object") return;
  visitor(value);

  if (Array.isArray(value)) {
    value.forEach((item) => walkJson(item, visitor));
    return;
  }

  Object.values(value).forEach((item) => walkJson(item, visitor));
}

function hasType(node, type) {
  const nodeType = node?.["@type"];
  return Array.isArray(nodeType) ? nodeType.includes(type) : nodeType === type;
}

function typedJsonLdNodes(html, type) {
  const nodes = [];
  for (const graph of extractJsonLd(html)) {
    walkJson(graph, (node) => {
      if (hasType(node, type)) nodes.push(node);
    });
  }
  return nodes;
}

function authorHasName(author) {
  if (Array.isArray(author)) return author.some(authorHasName);
  return Boolean(author?.name);
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

  const seen = new Set();
  const entries = fs.readdirSync(gscExportDir, { withFileTypes: true })
    .filter((entry) => entry.name.startsWith("fizikhub.com-Coverage"))
    .flatMap((entry) => {
      const entryPath = path.join(gscExportDir, entry.name);
      if (entry.isDirectory()) {
        return fs.readdirSync(entryPath)
          .filter((file) => file.endsWith(".csv"))
          .map((file) => path.join(entryPath, file));
      }
      if (entry.name.endsWith(".zip")) {
        try {
          const table = execFileSync("unzip", ["-p", entryPath, "Tablo.csv"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
          });
          return [{ file: `${entryPath}:Tablo.csv`, text: table }];
        } catch {
          return [];
        }
      }
      return entry.name.endsWith(".csv") ? [entryPath] : [];
    });

  const urls = [];
  for (const entry of entries) {
    const file = typeof entry === "string" ? entry : entry.file;
    const text = typeof entry === "string" ? fs.readFileSync(entry, "utf8") : entry.text;
    for (const match of text.matchAll(/https?:\/\/(?:www\.)?fizikhub\.com[^,\r\n"]*/g)) {
      const key = match[0];
      if (seen.has(key)) continue;
      seen.add(key);
      urls.push({ file, url: match[0] });
    }
  }
  return urls;
}

function gscActionForReason(reason) {
  if (reason === "clean-or-needs-live-check") {
    return "Live URL Inspection ile canonical, indexability ve visible content kontrolü yap.";
  }
  if (reason === "non-canonical-origin" || reason.includes("fizikhub")) {
    return "Non-www/http varyantlarının tek hopta https://www.fizikhub.com hedefine 301 döndüğünü doğrula.";
  }
  if (reason.includes("\\/blog")) {
    return "Legacy /blog URL'lerinin /makale karşılıklarına 301 yönlendiğini ve sitemap/AI index içinde görünmediğini doğrula.";
  }
  if (reason.includes("\\/index")) {
    return "/index varyantını ana sayfaya 301 ile temizle ve GSC doğrulamasını yeniden başlat.";
  }
  if (reason.includes("login|forgot-password|reset-password|profil|admin") || reason.includes("basvuru") || reason.includes("paylas")) {
    return "Private/noindex sayfalarda X-Robots-Tag noindex header'ının canlı yanıtta geldiğini doğrula.";
  }
  if (reason.includes("makale\\/yeni") || reason.includes("makale\\/duzenle") || reason.includes("kitap-inceleme")) {
    return "İçerik oluşturma/düzenleme sayfalarının sitemap dışında kaldığını ve noindex header/meta ile temizlendiğini doğrula.";
  }
  if (reason.includes("[?&]q=")) {
    return "Arama sorgulu URL'lerin canonical ana listeye döndüğünü ve noindex/follow sinyali verdiğini doğrula.";
  }
  if (reason.includes("test|tesr|deneme")) {
    return "Test/taslak benzeri public içerikleri 410/noindex veya yayın dışı bırakma akışıyla temizle.";
  }
  if (reason.includes("_next")) {
    return "Static asset URL'lerinin sitemap dışında kaldığını ve noindex/cache header'ı aldığını doğrula.";
  }
  return "URL ailesini canlı yanıt, canonical ve sitemap kaynağı açısından incele.";
}

function summarizeGscUrls(gscUrls) {
  const summary = {};
  const examples = {};
  const actions = {};

  for (const entry of gscUrls) {
    const reason = forbiddenReason(entry.url) || "clean-or-needs-live-check";
    summary[reason] = (summary[reason] || 0) + 1;

    if (!examples[reason]) examples[reason] = [];
    if (examples[reason].length < gscExampleLimit) {
      examples[reason].push({
        url: entry.url,
        file: path.basename(entry.file),
      });
    }

    actions[reason] = gscActionForReason(reason);
  }

  return { summary, examples, actions };
}

const resourcePaths = [
  "/sitemap-index.xml",
  "/sitemap.xml",
  "/topic-sitemap.xml",
  "/article-sitemap.xml",
  "/forum-sitemap.xml",
  "/dictionary-sitemap.xml",
  "/news-sitemap.xml",
  "/ai-sitemap.xml",
  "/author-sitemap.xml",
  "/feed.xml",
  "/robots.txt",
  "/ai-index.json",
  "/.well-known/security.txt",
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

for (const sitemap of ["/sitemap.xml", "/topic-sitemap.xml", "/article-sitemap.xml", "/forum-sitemap.xml", "/dictionary-sitemap.xml", "/news-sitemap.xml", "/ai-sitemap.xml", "/author-sitemap.xml"]) {
  const badUrls = locs(byPath.get(sitemap).text)
    .map((url) => ({ url, reason: forbiddenReason(url) }))
    .filter((entry) => entry.reason);
  assert(badUrls.length === 0, `${sitemap} contains forbidden URLs: ${JSON.stringify(badUrls.slice(0, 10))}`);
}

const aiIndex = JSON.parse(byPath.get("/ai-index.json").text);
assert(Array.isArray(aiIndex.items) && aiIndex.items.length > 0, "/ai-index.json has no items");
assert(aiIndex.policy?.citation === "required", "/ai-index.json policy must require citation");
assert(Array.isArray(aiIndex.policy?.answerGuidance) && aiIndex.policy.answerGuidance.length > 0, "/ai-index.json has no answer guidance");
const badAiUrls = aiIndex.items
  .map((item) => ({ url: item.url, reason: forbiddenReason(item.url) }))
  .filter((entry) => entry.reason);
assert(badAiUrls.length === 0, `/ai-index.json contains forbidden URLs: ${JSON.stringify(badAiUrls.slice(0, 10))}`);
const badAiDiscoveryItems = aiIndex.items
  .filter((item) => !item.citationText || !item.answerPriority || !Array.isArray(item.answerFormatHints) || item.answerFormatHints.length === 0);
assert(badAiDiscoveryItems.length === 0, `/ai-index.json has weak AI discovery items: ${JSON.stringify(badAiDiscoveryItems.slice(0, 5))}`);

const securityTxt = byPath.get("/.well-known/security.txt");
assert(securityTxt.text.includes("Contact: mailto:iletisim@fizikhub.com"), "/.well-known/security.txt is missing contact");
assert(securityTxt.xRobotsTag?.includes("noindex"), "/.well-known/security.txt should be noindex");

const feedText = byPath.get("/feed.xml").text;
assert((feedText.match(/<item>/g) || []).length > 0, "/feed.xml has no RSS items");
for (const match of feedText.matchAll(/<link>([^<]+)<\/link>/g)) {
  const reason = forbiddenReason(match[1]);
  assert(!reason, `/feed.xml contains forbidden URL ${match[1]} (${reason})`);
}

const redirects = [
  ["/index", `${expectedRedirectBaseUrl}/`],
  ["/blog?kategori=Kuantum&sort=latest", `${expectedRedirectBaseUrl}/makale/kategori/kuantum`],
  ["/blog/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662", `${expectedRedirectBaseUrl}/makale/entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662`],
  ["/kesfet?category=Astrofizik", `${expectedRedirectBaseUrl}/makale/kategori/astrofizik`],
  ["/makale?sort=popular&category=Bilim%20Tarihi", `${expectedRedirectBaseUrl}/makale/kategori/bilim%20tarihi`],
  ["/makale?sort=popular&category=Terim", `${expectedRedirectBaseUrl}/sozluk`],
  ["/forum?sort=newest", `${expectedRedirectBaseUrl}/forum`],
  ["/sartlar", `${expectedRedirectBaseUrl}/kullanim-sartlari`],
  ["/kurallar", `${expectedRedirectBaseUrl}/kullanim-sartlari`],
  ["/search?q=%7Bsearch_term_string%7D", `${expectedRedirectBaseUrl}/ara`],
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

for (const privatePath of ["/login", "/mesajlar", "/makale/yeni", "/yazar"]) {
  const response = await fetchText(privatePath);
  assert(response.xRobotsTag?.includes("noindex"), `${privatePath} is missing X-Robots-Tag noindex`);
}

for (const publicPath of ["/makale", "/paylas", "/yazar/rehber"]) {
  const response = await fetchText(publicPath);
  assert(response.status === 200, `${publicPath} returned ${response.status}`);
  assert(!response.xRobotsTag?.includes("noindex"), `${publicPath} should not have X-Robots-Tag noindex`);
}

const lowValueQuerySample = await fetchText("/forum?q=isik+hizi");
assert(lowValueQuerySample.xRobotsTag?.includes("noindex"), "/forum?q=... is missing X-Robots-Tag noindex");
assert(lowValueQuerySample.xRobotsTag?.includes("follow"), "/forum?q=... should keep follow");

const forumPageSample = await fetchText("/forum");
assert(forumPageSample.status === 200, `/forum returned ${forumPageSample.status}`);
const forumPostings = typedJsonLdNodes(forumPageSample.text, "DiscussionForumPosting");
assert(forumPostings.length > 0, "/forum has no DiscussionForumPosting JSON-LD items");
const forumPostingsWithoutAuthor = forumPostings.filter((posting) => !authorHasName(posting.author));
assert(
  forumPostingsWithoutAuthor.length === 0,
  `/forum has DiscussionForumPosting items without author.name: ${JSON.stringify(forumPostingsWithoutAuthor.slice(0, 3))}`,
);
const weakForumPostings = forumPostings.filter((posting) => !posting.url || !posting.mainEntityOfPage || !posting.datePublished);
assert(
  weakForumPostings.length === 0,
  `/forum has weak DiscussionForumPosting items: ${JSON.stringify(weakForumPostings.slice(0, 3))}`,
);

const wildcardSample = await fetchText("/konular/*");
assert(wildcardSample.status === 410, "/konular/* should return 410");
assert(wildcardSample.xRobotsTag?.includes("noindex"), "/konular/* should include X-Robots-Tag noindex");

const rootTestSample = await fetchText("/test-mkn0gnnsixw");
assert(rootTestSample.status === 410, "/test-mkn0gnnsixw should return 410");
assert(rootTestSample.xRobotsTag?.includes("noindex"), "/test-mkn0gnnsixw should include X-Robots-Tag noindex");

const samplePaths = [
  locs(byPath.get("/topic-sitemap.xml").text)[0],
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
const {
  summary: gscSummary,
  examples: gscExamples,
  actions: gscActions,
} = summarizeGscUrls(gscUrls);

console.log(JSON.stringify({
  baseUrl,
  sitemapCounts: Object.fromEntries(["/sitemap.xml", "/topic-sitemap.xml", "/article-sitemap.xml", "/forum-sitemap.xml", "/dictionary-sitemap.xml", "/news-sitemap.xml", "/ai-sitemap.xml", "/author-sitemap.xml"]
    .map((sitemap) => [sitemap, locs(byPath.get(sitemap).text).length])),
  aiIndexItemCount: aiIndex.items.length,
  forumPostingsChecked: forumPostings.length,
  samplePaths,
  gscExportUrlCount: gscUrls.length,
  gscSummary,
  gscExamples,
  gscActions,
}, null, 2));
