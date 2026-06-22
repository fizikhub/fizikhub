import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

function makeRequest(body: unknown) {
    return new Request("http://localhost/api/security/csp-report", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    }) as NextRequest;
}

function makeRawRequest(body: string) {
    return new Request("http://localhost/api/security/csp-report", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body,
    }) as NextRequest;
}

describe("CSP report route", () => {
    it("accepts classic CSP violation reports", async () => {
        const { POST } = await import("@/app/api/security/csp-report/route");
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        const response = await POST(makeRequest({
            "csp-report": {
                "document-uri": "https://www.fizikhub.com/makale",
                "violated-directive": "script-src",
                "blocked-uri": "inline",
                "source-file": "https://www.fizikhub.com/makale",
                "line-number": 10,
                "column-number": 5,
            },
        }));

        expect(response.status).toBe(204);
        expect(warn).toHaveBeenCalledWith("[csp-report]", expect.objectContaining({
            document: "https://www.fizikhub.com/makale",
            directive: "script-src",
            blocked: "inline",
        }));

        warn.mockRestore();
    });

    it("accepts Reporting API CSP violation batches", async () => {
        const { POST } = await import("@/app/api/security/csp-report/route");
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        const response = await POST(makeRequest([
            {
                type: "csp-violation",
                body: {
                    documentURL: "https://www.fizikhub.com/",
                    effectiveDirective: "style-src",
                    blockedURL: "inline",
                    sourceFile: "https://www.fizikhub.com/",
                    lineNumber: 12,
                    columnNumber: 2,
                },
            },
        ]));

        expect(response.status).toBe(204);
        expect(warn).toHaveBeenCalledWith("[csp-report]", expect.objectContaining({
            document: "https://www.fizikhub.com/",
            directive: "style-src",
            blocked: "inline",
        }));

        warn.mockRestore();
    });

    it("rejects invalid JSON and oversized reports", async () => {
        const { POST } = await import("@/app/api/security/csp-report/route");

        const invalid = await POST(makeRawRequest("{"));
        const oversized = await POST(makeRawRequest(JSON.stringify({
            "csp-report": {
                "blocked-uri": "x".repeat(70 * 1024),
            },
        })));

        expect(invalid.status).toBe(400);
        expect(oversized.status).toBe(413);
    });

    it("keeps production CSP telemetry observable when the audit table is unavailable", async () => {
        vi.resetModules();
        vi.stubEnv("NODE_ENV", "production");
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { POST } = await import("@/app/api/security/csp-report/route");
        const report = {
            "csp-report": {
                "document-uri": "https://www.fizikhub.com/makale",
                "violated-directive": "script-src-elem",
                "blocked-uri": "inline",
            },
        };

        await POST(makeRequest(report));
        await POST(makeRequest(report));

        expect(warn).toHaveBeenCalledTimes(1);
        expect(JSON.parse(String(warn.mock.calls[0]?.[0]))).toEqual(expect.objectContaining({
            level: "warn",
            message: "csp-report-only-violation",
            directive: "script-src-elem",
            blocked: "inline",
        }));

        warn.mockRestore();
        vi.unstubAllEnvs();
        vi.resetModules();
    });
});
