import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

type RawWebVitalPayload = {
    id?: unknown;
    name?: unknown;
    value?: unknown;
    delta?: unknown;
    rating?: unknown;
    navigationType?: unknown;
    pathname?: unknown;
    href?: unknown;
    connection?: unknown;
    attribution?: unknown;
};

const ALLOWED_NAMES = new Set(["CLS", "FCP", "INP", "LCP", "TTFB"]);
const ALLOWED_RATINGS = new Set(["good", "needs-improvement", "poor"]);

function asOptionalString(value: unknown, maxLength: number): string | null {
    if (typeof value !== "string") return null;
    return value.slice(0, maxLength);
}

function asOptionalNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function POST(request: NextRequest) {
    let payload: RawWebVitalPayload;

    try {
        payload = await request.json() as RawWebVitalPayload;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = asOptionalString(payload.name, 12);
    const value = asOptionalNumber(payload.value);

    if (!name || !ALLOWED_NAMES.has(name) || value === null) {
        return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
    }

    const rating = asOptionalString(payload.rating, 32);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return new NextResponse(null, {
            status: 204,
            headers: { "Cache-Control": "no-store" },
        });
    }

    try {
        const supabase = createAdminClient();
        const { error } = await supabase.from("web_vitals_events").insert({
            metric_id: asOptionalString(payload.id, 128),
            name,
            value,
            delta: asOptionalNumber(payload.delta),
            rating: rating && ALLOWED_RATINGS.has(rating) ? rating : null,
            navigation_type: asOptionalString(payload.navigationType, 64),
            pathname: asOptionalString(payload.pathname, 512),
            href: asOptionalString(payload.href, 1024),
            connection: payload.connection ?? null,
            attribution: payload.attribution ?? null,
            user_agent: request.headers.get("user-agent"),
        });

        if (error) {
            console.warn("[web-vitals] insert failed", error.message);
        }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.warn("[web-vitals] collection skipped", error);
        }
    }

    return new NextResponse(null, {
        status: 204,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
