import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const exportRoot = process.env.GSC_EXPORT_DIR || path.join(os.homedir(), "Downloads");
const outputPath = process.env.GSC_STRUCTURED_REPORT_OUT || "docs/gsc-structured-data-report.md";
const siteOrigin = "https://www.fizikhub.com";
const targetSlug = "aristodan-batlamyusa-evreni-cozmeye-calisan-adamlar";

function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        if (char === '"') {
            if (quoted && text[index + 1] === '"') {
                field += '"';
                index += 1;
            } else {
                quoted = !quoted;
            }
        } else if (char === "," && !quoted) {
            row.push(field);
            field = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
            if (char === "\r" && text[index + 1] === "\n") index += 1;
            row.push(field);
            if (row.some((value) => value.length > 0)) rows.push(row);
            row = [];
            field = "";
        } else {
            field += char;
        }
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
    }
    return rows;
}

function findLatestPerformanceFile() {
    if (!fs.existsSync(exportRoot)) return null;
    const candidates = [];

    for (const entry of fs.readdirSync(exportRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || !entry.name.includes("Performance-on-Search")) continue;
        const directory = path.join(exportRoot, entry.name);
        for (const file of fs.readdirSync(directory)) {
            if (!file.toLocaleLowerCase("tr-TR").includes("sayfa sayısı") || !file.endsWith(".csv")) continue;
            const filePath = path.join(directory, file);
            candidates.push({ filePath, mtime: fs.statSync(filePath).mtimeMs });
        }
    }

    return candidates.sort((a, b) => b.mtime - a.mtime)[0]?.filePath || null;
}

function canonicalUrl(rawUrl) {
    try {
        const url = new URL(rawUrl);
        url.protocol = "https:";
        url.hostname = "www.fizikhub.com";
        url.port = "";
        if (url.pathname === "/blog") url.pathname = "/makale";
        if (url.pathname.startsWith("/blog/")) url.pathname = url.pathname.replace(/^\/blog\//, "/makale/");
        url.search = "";
        url.hash = "";
        return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
    } catch {
        return null;
    }
}

function numberValue(value) {
    const normalized = String(value || "").replace("%", "").replace(",", ".");
    const result = Number(normalized);
    return Number.isFinite(result) ? result : 0;
}

function readPrioritySlugs() {
    const source = fs.readFileSync("lib/seo-priority.ts", "utf8");
    return Array.from(source.matchAll(/\n\s*slug:\s*"([^"]+)"/g), (match) => match[1]);
}

function actionFor(row) {
    if (row.impressions === 0) return "Yeni/ölçümsüz: sitemap ve URL Inspection ile ilk indekslenmeyi izle.";
    if (row.position <= 10 && row.ctr < 2) return "Başlık/meta CTR testi; Article ve Breadcrumb geçerliliğini koru.";
    if (row.position > 10 && row.position <= 30) return "Konu hub iç linklerini ve doğrudan cevap bölümünü güçlendir.";
    if (row.position > 30) return "Arama niyeti ve içerik kapsamını yeniden değerlendir.";
    return "Performansı koru; haftalık değişimi izle.";
}

const performanceFile = findLatestPerformanceFile();
const aggregated = new Map();

if (performanceFile) {
    const rows = parseCsv(fs.readFileSync(performanceFile, "utf8"));
    for (const columns of rows.slice(1)) {
        const canonical = canonicalUrl(columns[0]);
        if (!canonical?.startsWith(`${siteOrigin}/makale/`)) continue;
        const current = aggregated.get(canonical) || { clicks: 0, impressions: 0, weightedPosition: 0 };
        const impressions = numberValue(columns[2]);
        current.clicks += numberValue(columns[1]);
        current.impressions += impressions;
        current.weightedPosition += numberValue(columns[4]) * impressions;
        aggregated.set(canonical, current);
    }
}

const clusterSource = fs.readFileSync("lib/seo-topic-clusters.ts", "utf8");
const prioritySlugs = readPrioritySlugs();
const reportRows = prioritySlugs.map((slug) => {
    const url = `${siteOrigin}/makale/${slug}`;
    const performance = aggregated.get(url) || { clicks: 0, impressions: 0, weightedPosition: 0 };
    const ctr = performance.impressions > 0 ? performance.clicks / performance.impressions * 100 : 0;
    const position = performance.impressions > 0 ? performance.weightedPosition / performance.impressions : 0;
    const row = {
        slug,
        clicks: performance.clicks,
        impressions: performance.impressions,
        ctr,
        position,
        hasCluster: clusterSource.includes(`"${slug}"`),
    };
    return { ...row, action: actionFor(row) };
}).sort((a, b) => (b.slug === targetSlug ? 1 : 0) - (a.slug === targetSlug ? 1 : 0) || b.impressions - a.impressions);

const target = reportRows.find((row) => row.slug === targetSlug);
const lines = [
    "# GSC Structured Data and Topic Cluster Monitoring",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Performance export: ${performanceFile ? `\`${performanceFile}\`` : "not found"}`,
    "",
    "This report maps canonical article performance to the four template signals: Article, FAQPage, BreadcrumbList, and topic-cluster internal links.",
    "",
    "## Aristotle-Ptolemy article",
    "",
    `- URL: ${siteOrigin}/makale/${targetSlug}`,
    `- GSC clicks / impressions: ${target?.clicks || 0} / ${target?.impressions || 0}`,
    `- Average position: ${target?.position ? target.position.toFixed(2) : "no data yet"}`,
    `- Template signals: Article=yes, FAQPage=yes, BreadcrumbList=yes, topic cluster=${target?.hasCluster ? "yes" : "no"}`,
    `- Action: ${target?.action}`,
    "",
    "The available export predates this article. Do not interpret zero impressions as failure until a post-publication export is supplied.",
    "",
    "## Priority article matrix",
    "",
    "| Article | Clicks | Impressions | CTR | Position | Article | FAQ | Breadcrumb | Cluster | Action |",
    "|---|---:|---:|---:|---:|---|---|---|---|---|",
    ...reportRows.map((row) => `| /makale/${row.slug} | ${row.clicks} | ${row.impressions} | ${row.ctr.toFixed(2)}% | ${row.position ? row.position.toFixed(2) : "-"} | yes | yes | yes | ${row.hasCluster ? "yes" : "no"} | ${row.action} |`),
    "",
    "## Weekly workflow",
    "",
    "1. Export Search Console Performance > Pages and place the extracted folder in Downloads.",
    "2. Run `npm run seo:gsc-structured`.",
    "3. For pages with position <= 10 and CTR < 2%, test title/meta without removing valid schema.",
    "4. For positions 10-30, strengthen topic-hub and sibling-article internal links.",
    "5. After template changes, inspect representative URLs and monitor Article/Q&A rich-result status reports.",
    "",
];

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join("\n"));
console.log(JSON.stringify({ outputPath, performanceFile, articleCount: reportRows.length, targetImpressions: target?.impressions || 0 }, null, 2));
