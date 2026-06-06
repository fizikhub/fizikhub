import { getIndexNowKey } from "@/lib/indexnow";

export const revalidate = 3600;

export function GET() {
    const key = getIndexNowKey();

    if (!key) {
        return new Response("IndexNow key is not configured.", {
            status: 404,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "private, no-store, max-age=0",
                "X-Robots-Tag": "noindex, nofollow",
            },
        });
    }

    return new Response(`${key}\n`, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
            "X-Robots-Tag": "noindex, nofollow",
        },
    });
}
