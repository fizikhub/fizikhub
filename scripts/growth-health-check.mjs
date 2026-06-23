const baseUrl = (process.env.SITE_URL || "https://www.fizikhub.com").replace(/\/+$/, "");

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

async function request(path, init = {}) {
    const startedAt = performance.now();
    const response = await fetch(`${baseUrl}${path}`, {
        redirect: "manual",
        headers: { "user-agent": "Fizikhub growth health check" },
        ...init,
    });
    const text = await response.text();
    return {
        path,
        status: response.status,
        headers: response.headers,
        text,
        durationMs: Math.round(performance.now() - startedAt),
    };
}

function htmlSignal(html, pattern) {
    return pattern.test(html);
}

const publicPages = [
    ["/", /<h1[\s>]/i],
    ["/makale", /<main[\s>]/i],
    ["/forum", /<h1[\s>]/i],
    ["/sozluk", /<h1[\s>]/i],
    ["/testler", /<h1[\s>]/i],
    ["/simulasyonlar", /<h1[\s>]/i],
    ["/konular", /<h1[\s>]/i],
];

const pageResults = [];
for (const [path, mainSignal] of publicPages) {
    const result = await request(path);
    assert(result.status === 200, `${path} returned ${result.status}`);
    assert(htmlSignal(result.text, /<title>[^<]+<\/title>/i), `${path} has no title`);
    assert(htmlSignal(result.text, /rel="canonical"/i), `${path} has no canonical`);
    assert(htmlSignal(result.text, mainSignal), `${path} is missing its primary visible content signal`);
    pageResults.push({ path, status: result.status, durationMs: result.durationMs, bytes: Buffer.byteLength(result.text) });
}

const campaignPath = "/makale/aristodan-batlamyusa-evreni-cozmeye-calisan-adamlar?utm_source=whatsapp&utm_medium=social&utm_campaign=fizikhub_share&utm_content=article";
const campaign = await request(campaignPath);
assert([301, 307, 308].includes(campaign.status), `campaign URL did not redirect: ${campaign.status}`);
assert(!campaign.headers.get("location")?.includes("utm_"), "campaign redirect did not clean tracking parameters");
assert(campaign.headers.get("set-cookie")?.includes("fh_attribution="), "campaign redirect did not preserve first-touch attribution");

const login = await request("/login");
assert(login.status === 200, `/login returned ${login.status}`);
assert(login.headers.get("x-robots-tag")?.includes("noindex"), "/login lost its noindex header");

const manifest = await request("/manifest.json");
const manifestData = JSON.parse(manifest.text);
assert(manifest.status === 200, `/manifest.json returned ${manifest.status}`);
assert(manifestData.display === "standalone", "manifest is not installable in standalone mode");
assert(Array.isArray(manifestData.icons) && manifestData.icons.some((icon) => icon.sizes === "512x512"), "manifest has no 512px icon");

console.log(JSON.stringify({
    baseUrl,
    pages: pageResults,
    campaignRedirect: {
        status: campaign.status,
        location: campaign.headers.get("location"),
        attributionCookie: Boolean(campaign.headers.get("set-cookie")?.includes("fh_attribution=")),
    },
    privateRouteNoindex: true,
    pwaManifest: true,
}, null, 2));
