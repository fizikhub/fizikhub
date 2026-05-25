import { createStaticClient, hasSupabasePublicConfig } from "@/lib/supabase-server";
import { escapeXml } from "@/lib/xml";
import { getSiteUrl, isIndexableProfile } from "@/lib/seo-utils";

export const revalidate = 3600;

type ProfileSitemapRow = {
    username: string | null;
    full_name: string | null;
    bio: string | null;
    is_writer: boolean | null;
    is_verified: boolean | null;
    created_at: string | null;
    updated_at: string | null;
};

export async function GET() {
    const baseUrl = getSiteUrl();
    let profiles: ProfileSitemapRow[] = [];

    if (hasSupabasePublicConfig()) {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from("profiles")
            .select("username, full_name, bio, is_writer, is_verified, created_at, updated_at")
            .not("username", "is", null)
            .order("updated_at", { ascending: false, nullsFirst: false })
            .limit(1000);

        if (error) {
            console.error("author-sitemap error:", error);
        }

        profiles = (data || []) as ProfileSitemapRow[];
    }

    const urls = profiles
        .filter((profile) => isIndexableProfile(profile))
        .map((profile) => `  <url>
    <loc>${escapeXml(`${baseUrl}/kullanici/${profile.username}`)}</loc>
    <lastmod>${escapeXml(new Date(profile.updated_at || profile.created_at || Date.now()).toISOString())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${profile.is_writer || profile.is_verified ? "0.62" : "0.45"}</priority>
  </url>`)
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
