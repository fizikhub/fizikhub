import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local", quiet: true });

const outputPath = process.env.LCP_REPORT_OUT || "docs/lcp-production-priority.md";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase production credentials are required for the LCP report.");

const db = createClient(url, key, { auth: { persistSession: false } });
const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
const { data, error } = await db
    .from("web_vitals_events")
    .select("pathname,value,rating,attribution,created_at")
    .eq("name", "LCP")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);
if (error) throw error;

const grouped = new Map();
for (const event of data || []) {
    const pathname = event.pathname || "(unknown)";
    const group = grouped.get(pathname) || { values: [], poor: 0, needsImprovement: 0, elements: new Map(), lastSeen: null };
    group.values.push(Number(event.value));
    group.poor += event.rating === "poor" ? 1 : 0;
    group.needsImprovement += event.rating === "needs-improvement" ? 1 : 0;
    const attribution = event.attribution || {};
    const element = attribution.element || "(unknown — awaiting enhanced attribution)";
    const resource = attribution.resourceUrl || "";
    const keyName = resource ? `${element} — ${resource}` : element;
    group.elements.set(keyName, (group.elements.get(keyName) || 0) + 1);
    group.lastSeen ||= event.created_at;
    grouped.set(pathname, group);
}

const routes = Array.from(grouped, ([pathname, group]) => {
    group.values.sort((a, b) => a - b);
    const p75 = group.values[Math.min(group.values.length - 1, Math.floor(group.values.length * 0.75))] || 0;
    const topElement = Array.from(group.elements).sort((a, b) => b[1] - a[1])[0]?.[0] || "(unknown)";
    let recommendation = "No priority change; continue sampling.";
    if (pathname.startsWith("/makale/") && p75 >= 2500) recommendation = "Keep the above-fold cover priority/fetchPriority=high; investigate image bytes, TTFB, and element render delay.";
    else if (p75 >= 2500 && topElement.includes("img")) recommendation = "Candidate for priority/fetchPriority=high after confirming the same image dominates new attribution samples.";
    else if (p75 >= 2500) recommendation = "Do not add image priority blindly; LCP is not yet proven to be an image.";
    return { pathname, count: group.values.length, p75: Math.round(p75), poor: group.poor, needsImprovement: group.needsImprovement, topElement, recommendation, lastSeen: group.lastSeen };
}).sort((a, b) => b.p75 - a.p75);

const lines = [
    "# Production LCP Priority Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Window: ${since} to now`,
    `LCP samples: ${(data || []).length}`,
    "",
    "Priority/fetchPriority is reserved for a confirmed above-the-fold image. Text LCP and unknown attribution must not receive speculative image priority.",
    "",
    "| Route | Samples | P75 | Poor | Needs improvement | Dominant LCP element/resource | Decision |",
    "|---|---:|---:|---:|---:|---|---|",
    ...routes.map((route) => `| ${route.pathname} | ${route.count} | ${route.p75} ms | ${route.poor} | ${route.needsImprovement} | ${String(route.topElement).replaceAll("|", "\\|")} | ${route.recommendation} |`),
    "",
    "## Current decision",
    "",
    "- Article detail covers remain priority candidates because they are above the fold and the slowest sampled routes are article pages.",
    "- No additional route receives image priority yet: historical attribution is empty.",
    "- Enhanced attribution now records the LCP selector, resource URL, TTFB, load delay/duration, and render delay. Re-run this report after sufficient new traffic.",
    "",
];

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join("\n"));
console.log(JSON.stringify({ outputPath, samples: (data || []).length, routeCount: routes.length, worstRoutes: routes.slice(0, 5).map(({ pathname, p75 }) => ({ pathname, p75 })) }, null, 2));
