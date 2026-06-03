import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SITE_URL = "https://www.fizikhub.com";
const gscExportDir = process.env.GSC_EXPORT_DIR || path.join(os.homedir(), "Downloads");
const outputPath = process.env.GSC_RECRAWL_PLAN_OUT || "docs/gsc-recrawl-plan.md";
const requestIndexingLimit = Number(process.env.GSC_REQUEST_INDEXING_LIMIT || 25);
const cleanupExampleLimit = Number(process.env.GSC_CLEANUP_EXAMPLE_LIMIT || 8);

const sitemapTargets = [
    "/sitemap-index.xml",
    "/sitemap.xml",
    "/topic-sitemap.xml",
    "/article-sitemap.xml",
    "/forum-sitemap.xml",
    "/dictionary-sitemap.xml",
    "/ai-sitemap.xml",
    "/author-sitemap.xml",
];

const cleanupPatterns = [
    { key: "legacy-blog", pattern: /\/blog(?:\/|\?|$)/i, action: "Legacy /blog URL'inin /makale karşılığına 301 verdiğini live inspection ile doğrula." },
    { key: "non-www-http", pattern: /^http:\/\/|^https:\/\/fizikhub\.com/i, action: "HTTP/non-www varyantının tek hopta https://www.fizikhub.com kanoniğine döndüğünü doğrula." },
    { key: "index-path", pattern: /\/index(?:\?|$)/i, action: "/index varyantının ana sayfaya 301 verdiğini doğrula." },
    { key: "private-noindex", pattern: /\/(?:login|forgot-password|reset-password|profil|admin|yazar-paneli|mesajlar|notifications|kurulum|time-limit|yonetim|basvuru)(?:\/|\?|$)/i, action: "Private/noindex URL'nin X-Robots-Tag noindex ve no-store aldığını doğrula." },
    { key: "writer-private", pattern: /\/yazar(?:$|\?|\/(?!rehber(?:\/|\?|$)))/i, action: "Yazar paneli URL ailesinin public rehber hariç noindex/private kaldığını doğrula." },
    { key: "search-query", pattern: /[?&]q=/i, action: "Arama sorgulu URL'nin noindex,follow verdiğini ve canonical ana arama/list route'una döndüğünü doğrula." },
    { key: "test-draft-content", pattern: /\/(?:makale|deney)\/(?:test|tesr|deneme)(?:[-_]|$)/i, action: "Test/taslak benzeri içerik URL'sinin 410/noindex veya yayın dışı davranışını doğrula." },
    { key: "wildcard-broken", pattern: /\*/i, action: "Wildcard/bozuk URL'nin 410 + noindex verdiğini doğrula." },
    { key: "static-assets", pattern: /\/_next\/static\/|\/_next\/image|\.(?:woff2?|ttf|otf|map)(?:\?|$)/i, action: "Static asset URL'sinin sitemap dışında kaldığını doğrula; request indexing yapma." },
    { key: "sort-latest", pattern: /[?&]sort=latest/i, action: "Sıralama/query varyantının canonical ana listeye döndüğünü ve düşük değerli query ise noindex aldığını doğrula." },
];
const cleanupGroupsWithCanonicalRequest = new Set(["legacy-blog", "non-www-http", "index-path"]);

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
            const url = match[0].trim();
            if (seen.has(url)) continue;
            seen.add(url);
            urls.push({ file, url });
        }
    }
    return urls;
}

function canonicalizeUrl(rawUrl) {
    try {
        const parsed = new URL(rawUrl);
        parsed.protocol = "https:";
        parsed.hostname = "www.fizikhub.com";
        parsed.port = "";

        if (parsed.pathname === "/index") {
            parsed.pathname = "/";
            parsed.search = "";
        }

        if (parsed.pathname === "/search") {
            parsed.pathname = "/ara";
        }

        if (parsed.pathname === "/blog") {
            const category = parsed.searchParams.get("kategori") || parsed.searchParams.get("category");
            parsed.pathname = category ? `/makale/kategori/${category.trim().toLocaleLowerCase("tr-TR")}` : "/makale";
            parsed.search = "";
        } else if (parsed.pathname.startsWith("/blog/")) {
            parsed.pathname = parsed.pathname.replace(/^\/blog\//, "/makale/");
            parsed.search = "";
        }

        if (parsed.pathname === "/makale" && parsed.searchParams.get("category") === "Terim") {
            parsed.pathname = "/sozluk";
            parsed.search = "";
        }

        return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
    } catch {
        return null;
    }
}

function isIndexingCandidate(url) {
    try {
        const parsed = new URL(url);
        if (parsed.origin !== SITE_URL) return false;
        if (url.includes("*")) return false;
        if (parsed.search) return false;
        if (/\/(?:makale|deney)\/(?:test|tesr|deneme|eee)(?:[-_]|$)/i.test(parsed.pathname)) return false;
        if (parsed.pathname === "/") return true;
        return [
            "/makale/",
            "/deney/",
            "/forum/",
            "/sozluk/",
            "/konular/",
            "/simulasyonlar/",
            "/testler/",
            "/kullanici/",
            "/makale",
            "/forum",
            "/sozluk",
            "/konular",
            "/simulasyonlar",
            "/testler",
            "/paylas",
            "/yazar/rehber",
        ].some((prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(prefix));
    } catch {
        return false;
    }
}

function cleanupGroupFor(url) {
    const match = cleanupPatterns.find((entry) => entry.pattern.test(url));
    return match || null;
}

function buildPlan(gscUrls) {
    const cleanup = new Map();
    const requestCandidates = new Map();

    for (const entry of gscUrls) {
        const group = cleanupGroupFor(entry.url);
        if (group) {
            if (!cleanup.has(group.key)) {
                cleanup.set(group.key, {
                    key: group.key,
                    action: group.action,
                    count: 0,
                    examples: [],
                });
            }
            const bucket = cleanup.get(group.key);
            bucket.count += 1;
            if (bucket.examples.length < cleanupExampleLimit) {
                bucket.examples.push(entry.url);
            }
        }

        const canonical = canonicalizeUrl(entry.url);
        if (group && !cleanupGroupsWithCanonicalRequest.has(group.key)) continue;
        if (canonical && isIndexingCandidate(canonical)) {
            requestCandidates.set(canonical, canonical);
        }
    }

    const requestIndexing = Array.from(requestCandidates.values())
        .sort((a, b) => {
            const rank = (url) => {
                const pathname = new URL(url).pathname;
                if (pathname.startsWith("/konular/")) return 0;
                if (pathname.startsWith("/makale/")) return 1;
                if (pathname.startsWith("/forum/")) return 2;
                if (pathname.startsWith("/sozluk/")) return 3;
                return 4;
            };
            return rank(a) - rank(b) || a.localeCompare(b, "tr-TR");
        })
        .slice(0, requestIndexingLimit);

    return {
        generatedAt: new Date().toISOString(),
        gscExportDir,
        gscUrlCount: gscUrls.length,
        sitemapTargets: sitemapTargets.map((target) => `${SITE_URL}${target}`),
        requestIndexing,
        cleanup: Array.from(cleanup.values()).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)),
    };
}

function renderMarkdown(plan) {
    const lines = [
        "# Fizikhub GSC Recrawl Plan",
        "",
        `Generated at: ${plan.generatedAt}`,
        `GSC export source: \`${plan.gscExportDir}\``,
        `Export URL count: ${plan.gscUrlCount}`,
        "",
        "## 1. Resubmit Sitemaps",
        "",
        "Search Console > Sitemaps alanında aşağıdaki sitemapleri yeniden gönder:",
        "",
        ...plan.sitemapTargets.map((url) => `- ${url}`),
        "",
        "## 2. Request Indexing Candidates",
        "",
        "URL Inspection ekranında önce live test yap, sayfa indexlenebilir görünüyorsa Request indexing kullan. Çok sayıda URL için sitemap gönderimi ana yöntemdir; bu liste günlük manuel öncelik listesidir.",
        "",
        ...(plan.requestIndexing.length > 0 ? plan.requestIndexing.map((url, index) => `${index + 1}. ${url}`) : ["- GSC export içinde request indexing adayı bulunamadı."]),
        "",
        "## 3. Cleanup Live Inspection Families",
        "",
        "Bu ailelerde Request indexing yapma; live inspection ile redirect, canonical, 410 veya noindex davranışının Google tarafından görüldüğünü doğrula.",
        "",
    ];

    for (const group of plan.cleanup) {
        lines.push(`### ${group.key} (${group.count})`);
        lines.push("");
        lines.push(group.action);
        lines.push("");
        group.examples.forEach((url) => lines.push(`- ${url}`));
        lines.push("");
    }

    lines.push("## Notes");
    lines.push("");
    lines.push("- Google URL Inspection API indexed URL verisini okumaya yarar; genel sayfalar için programatik request indexing sağlamaz.");
    lines.push("- Google Indexing API genel Fizikhub sayfaları için uygun değildir; resmi kullanım alanı JobPosting ve canlı yayın VideoObject sayfalarıdır.");
    lines.push("- Çok sayıda yeni/güncellenmiş sayfa için en doğru ölçekli sinyal güncel `<lastmod>` içeren sitemap gönderimidir.");

    return `${lines.join("\n")}\n`;
}

const urls = readGscExportUrls();
const plan = buildPlan(urls);
const markdown = renderMarkdown(plan);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown);

console.log(JSON.stringify({
    outputPath,
    gscUrlCount: plan.gscUrlCount,
    sitemapCount: plan.sitemapTargets.length,
    requestIndexingCount: plan.requestIndexing.length,
    cleanupFamilies: plan.cleanup.map((group) => ({ key: group.key, count: group.count })),
}, null, 2));
