import type { NextRequest } from "next/server";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => {
    const insert = vi.fn();
    const from = vi.fn(() => ({ insert }));
    const createAdminClient = vi.fn(() => ({ from }));

    return { createAdminClient, from, insert };
});

vi.mock("@/lib/supabase-admin", () => ({
    createAdminClient: supabaseMocks.createAdminClient,
}));

const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function makeRequest(body: unknown) {
    return new Request("http://localhost/api/metrics/web-vitals", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "user-agent": "vitest",
        },
        body: JSON.stringify(body),
    }) as NextRequest;
}

function makeRawRequest(body: string) {
    return new Request("http://localhost/api/metrics/web-vitals", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "user-agent": "vitest",
        },
        body,
    }) as NextRequest;
}

describe("web vitals route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
        supabaseMocks.insert.mockResolvedValue({ error: null });
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
        process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRoleKey;
    });

    it("rejects unknown metric names before touching Supabase", async () => {
        const { POST } = await import("@/app/api/metrics/web-vitals/route");

        const response = await POST(makeRequest({ name: "BAD", value: 1 }));

        expect(response.status).toBe(400);
        expect(supabaseMocks.createAdminClient).not.toHaveBeenCalled();
    });

    it("stores valid metrics with bounded request fields", async () => {
        const { POST } = await import("@/app/api/metrics/web-vitals/route");

        const response = await POST(makeRequest({
            id: "metric-id",
            name: "LCP",
            value: 1234.5,
            delta: 20,
            rating: "good",
            navigationType: "reload",
            pathname: "/konular/newton-yasalari",
            href: "http://localhost:3000/konular/newton-yasalari",
            connection: { effectiveType: "4g" },
            attribution: { element: "h1" },
        }));

        expect(response.status).toBe(204);
        expect(supabaseMocks.from).toHaveBeenCalledWith("web_vitals_events");
        expect(supabaseMocks.insert).toHaveBeenCalledWith(expect.objectContaining({
            name: "LCP",
            value: 1234.5,
            rating: "good",
            pathname: "/konular/newton-yasalari",
            href: "http://localhost:3000/konular/newton-yasalari",
            connection: { effectiveType: "4g" },
            attribution: { element: "h1" },
            user_agent: "vitest",
        }));
    });

    it("strips query strings from observed URLs and drops oversized JSON fields", async () => {
        const { POST } = await import("@/app/api/metrics/web-vitals/route");

        const response = await POST(makeRequest({
            name: "INP",
            value: 42,
            pathname: "/reset-password?token=secret#section",
            href: "https://www.fizikhub.com/reset-password?token=secret#section",
            connection: { effectiveType: "4g" },
            attribution: { element: "x".repeat(5000) },
        }));

        expect(response.status).toBe(204);
        expect(supabaseMocks.insert).toHaveBeenCalledWith(expect.objectContaining({
            pathname: "/reset-password",
            href: "https://www.fizikhub.com/reset-password",
            rating: "good",
            connection: { effectiveType: "4g" },
            attribution: null,
        }));
    });

    it("derives metric ratings on the server when the browser omits them", async () => {
        const { POST } = await import("@/app/api/metrics/web-vitals/route");

        const response = await POST(makeRequest({
            name: "LCP",
            value: 4300,
            pathname: "/",
        }));

        expect(response.status).toBe(204);
        expect(supabaseMocks.insert).toHaveBeenCalledWith(expect.objectContaining({
            name: "LCP",
            value: 4300,
            rating: "poor",
            pathname: "/",
        }));
    });

    it("rejects oversized metric payloads before touching Supabase", async () => {
        const { POST } = await import("@/app/api/metrics/web-vitals/route");
        const body = JSON.stringify({
            name: "LCP",
            value: 1,
            attribution: { element: "x".repeat(70 * 1024) },
        });

        const response = await POST(makeRawRequest(body));

        expect(response.status).toBe(413);
        expect(supabaseMocks.createAdminClient).not.toHaveBeenCalled();
    });

    it("warns once when the optional web vitals table is not available", async () => {
        const { POST } = await import("@/app/api/metrics/web-vitals/route");
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        supabaseMocks.insert.mockResolvedValue({
            error: {
                code: "PGRST205",
                message: "Could not find the table 'public.web_vitals_events' in the schema cache",
            },
        });

        const first = await POST(makeRequest({ name: "CLS", value: 0.01 }));
        const second = await POST(makeRequest({ name: "CLS", value: 0.02 }));

        expect(first.status).toBe(204);
        expect(second.status).toBe(204);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith("[web-vitals] collection skipped: web_vitals_events table is not available");

        warn.mockRestore();
    });
});
