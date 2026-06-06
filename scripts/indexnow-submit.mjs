#!/usr/bin/env node

const DEFAULT_SITE_URL = "https://www.fizikhub.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const SITEMAP_PATHS = [
  "/sitemap.xml",
  "/topic-sitemap.xml",
  "/article-sitemap.xml",
  "/forum-sitemap.xml",
  "/dictionary-sitemap.xml",
  "/news-sitemap.xml",
  "/ai-sitemap.xml",
  "/author-sitemap.xml",
];

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function getBaseUrl() {
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

function getIndexNowKey() {
  return (process.env.INDEXNOW_KEY || process.env.NEXT_PUBLIC_INDEXNOW_KEY || "").trim();
}

function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function locs(xml) {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1].trim());
}

function normalizeUrl(rawUrl, baseUrl) {
  const parsed = new URL(rawUrl, baseUrl);
  const canonicalBase = new URL(baseUrl);
  parsed.protocol = canonicalBase.protocol;
  parsed.host = canonicalBase.host;
  parsed.hash = "";
  return parsed.toString();
}

async function getUrlsFromSitemaps(baseUrl) {
  const urls = [];

  for (const path of SITEMAP_PATHS) {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      console.warn(`[indexnow] skipped ${path}: HTTP ${response.status}`);
      continue;
    }
    urls.push(...locs(await response.text()));
  }

  return urls;
}

async function main() {
  const baseUrl = getBaseUrl();
  const key = getIndexNowKey();
  const urlArg = getArgValue("--url");
  const sitemapArg = getArgValue("--sitemap");

  if (!key) {
    console.error("[indexnow] INDEXNOW_KEY is required.");
    process.exit(1);
  }

  const rawUrls = [];
  if (urlArg) rawUrls.push(urlArg);
  if (sitemapArg) {
    const response = await fetch(new URL(sitemapArg, baseUrl));
    if (!response.ok) throw new Error(`Could not fetch sitemap ${sitemapArg}: HTTP ${response.status}`);
    rawUrls.push(...locs(await response.text()));
  }
  if (!urlArg && !sitemapArg) {
    rawUrls.push(...await getUrlsFromSitemaps(baseUrl));
  }

  const canonicalHost = new URL(baseUrl).host;
  const urls = Array.from(new Set(rawUrls.map((url) => normalizeUrl(url, baseUrl))))
    .filter((url) => new URL(url).host === canonicalHost)
    .slice(0, 10000);

  if (urls.length === 0) {
    console.error("[indexnow] no URLs to submit.");
    process.exit(1);
  }

  const batches = chunk(urls, 1000);
  let submitted = 0;

  for (const batch of batches) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: canonicalHost,
        key,
        keyLocation: `${baseUrl}/indexnow-key.txt`,
        urlList: batch,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`IndexNow rejected batch: HTTP ${response.status} ${body}`);
    }

    submitted += batch.length;
    console.log(`[indexnow] submitted ${submitted}/${urls.length}`);
  }

  console.log(`[indexnow] done: ${submitted} canonical URL(s) submitted.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
