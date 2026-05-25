import { getSiteUrl } from "@/lib/seo-utils";
import { escapeXml } from "@/lib/xml";

export const revalidate = 86400;

export function GET() {
    const baseUrl = getSiteUrl();
    const searchUrl = `${baseUrl}/ara?q={searchTerms}`;
    const suggestionsUrl = `${baseUrl}/api/search/suggestions?q={searchTerms}`;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Fizikhub</ShortName>
  <Description>Fizikhub içinde fizik, bilim, forum, sözlük, test ve simülasyon ara.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="32" height="32" type="image/svg+xml">${escapeXml(`${baseUrl}/favicon.svg`)}</Image>
  <Url type="text/html" method="get" template="${escapeXml(searchUrl)}" />
  <Url type="application/x-suggestions+json" method="get" template="${escapeXml(suggestionsUrl)}" />
</OpenSearchDescription>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
