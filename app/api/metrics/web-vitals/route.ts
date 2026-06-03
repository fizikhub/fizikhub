import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { isWebVitalName, rateWebVital } from "@/lib/web-vitals-thresholds";

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

type SupabaseMutationError = {
    message?: string;
    code?: string;
};

const ALLOWED_RATINGS = new Set(["good", "needs-improvement", "poor"]);
const MAX_PAYLOAD_CHARS = 64 * 1024;
const MAX_JSON_FIELD_CHARS = 4096;
let didWarnMissingWebVitalsTable = false;

function asOptionalString(value: unknown, maxLength: number): string | null {
    if (typeof value !== "string") return null;
    return value.slice(0, maxLength);
}

function asOptionalNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asSanitizedPathname(value: unknown): string | null {
    const pathname = asOptionalString(value, 512);
    if (!pathname) return null;

    return pathname.split(/[?#]/, 1)[0] || null;
}

function asSanitizedUrl(value: unknown): string | null {
    const rawUrl = asOptionalString(value, 2048);
    if (!rawUrl) return null;

    try {
        const url = new URL(rawUrl);
        url.search = "";
        url.hash = "";
        return url.toString().slice(0, 1024);
    } catch {
        return rawUrl.split(/[?#]/, 1)[0].slice(0, 1024) || null;
    }
}

function asBoundedJsonObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;

    try {
        const serialized = JSON.stringify(value);
        if (!serialized || serialized.length > MAX_JSON_FIELD_CHARS) return null;
        return JSON.parse(serialized) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function isMissingWebVitalsTable(error: SupabaseMutationError) {
    const message = error.message || "";
    return error.code === "PGRST205" || message.includes("web_vitals_events");
}

function warnMissingWebVitalsTableOnce() {
    if (didWarnMissingWebVitalsTable || process.env.NODE_ENV === "production") return;
    didWarnMissingWebVitalsTable = true;
    console.warn("[web-vitals] collection skipped: web_vitals_events table is not available");
}

export async function POST(request: NextRequest) {
    let payload: RawWebVitalPayload;
    let rawPayload: string;

    try {
        rawPayload = await request.text();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (rawPayload.length > MAX_PAYLOAD_CHARS) {
        return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    try {
        payload = JSON.parse(rawPayload) as RawWebVitalPayload;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = asOptionalString(payload.name, 12);
    const value = asOptionalNumber(payload.value);

    if (!isWebVitalName(name) || value === null) {
        return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
    }

    const rating = asOptionalString(payload.rating, 32);
    const normalizedRating = rating && ALLOWED_RATINGS.has(rating)
        ? rating
        : rateWebVital(name, value);

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
            rating: normalizedRating,
            navigation_type: asOptionalString(payload.navigationType, 64),
            pathname: asSanitizedPathname(payload.pathname),
            href: asSanitizedUrl(payload.href),
            connection: asBoundedJsonObject(payload.connection),
            attribution: asBoundedJsonObject(payload.attribution),
            user_agent: asOptionalString(request.headers.get("user-agent"), 512),
        });

        if (error) {
            if (isMissingWebVitalsTable(error)) {
                warnMissingWebVitalsTableOnce();
            } else {
                console.warn("[web-vitals] insert failed", error.message);
            }
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
