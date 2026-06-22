import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase-admin";

type CspReportEnvelope = {
    "csp-report"?: {
        "document-uri"?: string;
        "violated-directive"?: string;
        "blocked-uri"?: string;
        "source-file"?: string;
        "line-number"?: number;
        "column-number"?: number;
    };
};

type ReportingApiEnvelope = Array<{
    type?: string;
    body?: {
        documentURL?: string;
        effectiveDirective?: string;
        blockedURL?: string;
        sourceFile?: string;
        lineNumber?: number;
        columnNumber?: number;
    };
}>;

const MAX_REPORT_CHARS = 64 * 1024;
const loggedProductionFingerprints = new Set<string>();

type NormalizedCspReport = {
    document?: string;
    directive?: string;
    blocked?: string;
    source?: string;
    line?: number;
    column?: number;
};

function warnReport(report: NormalizedCspReport) {
    if (process.env.NODE_ENV === "production") {
        const fingerprint = createHash("sha256").update(JSON.stringify(report)).digest("hex");
        if (loggedProductionFingerprints.has(fingerprint)) return;
        if (loggedProductionFingerprints.size >= 500) loggedProductionFingerprints.clear();
        loggedProductionFingerprints.add(fingerprint);
        console.warn(JSON.stringify({
            level: "warn",
            message: "csp-report-only-violation",
            fingerprint,
            ...report,
        }));
        return;
    }
    console.warn("[csp-report]", report);
}

function sanitizeUrl(value?: string) {
    if (!value) return null;
    try {
        const url = new URL(value);
        url.search = "";
        url.hash = "";
        return url.toString().slice(0, 1024);
    } catch {
        return value.split(/[?#]/, 1)[0].slice(0, 1024) || null;
    }
}

async function persistReports(reports: NormalizedCspReport[]) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

    const rows = reports.slice(0, 20).map((report) => {
        const normalized = {
            document_url: sanitizeUrl(report.document),
            violated_directive: report.directive?.slice(0, 256) || null,
            blocked_url: sanitizeUrl(report.blocked),
            source_file: sanitizeUrl(report.source),
            line_number: Number.isFinite(report.line) ? report.line : null,
            column_number: Number.isFinite(report.column) ? report.column : null,
        };
        const fingerprint = createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
        return { ...normalized, fingerprint };
    });

    if (rows.length === 0) return;

    try {
        await createAdminClient()
            .from("csp_violation_events")
            .upsert(rows, { onConflict: "fingerprint,report_day", ignoreDuplicates: true });
    } catch {
        // CSP telemetry must never affect the response path.
    }
}

export async function POST(request: NextRequest) {
    let rawReport: string;

    try {
        rawReport = await request.text();
    } catch {
        return NextResponse.json({ error: "Invalid CSP report" }, { status: 400 });
    }

    if (rawReport.length > MAX_REPORT_CHARS) {
        return NextResponse.json({ error: "CSP report too large" }, { status: 413 });
    }

    try {
        const report = JSON.parse(rawReport) as CspReportEnvelope | ReportingApiEnvelope;
        const normalizedReports: NormalizedCspReport[] = [];

        if (Array.isArray(report)) {
            for (const entry of report) {
                if (entry.type !== "csp-violation") continue;
                const normalized = {
                    document: entry.body?.documentURL,
                    directive: entry.body?.effectiveDirective,
                    blocked: entry.body?.blockedURL,
                    source: entry.body?.sourceFile,
                    line: entry.body?.lineNumber,
                    column: entry.body?.columnNumber,
                };
                normalizedReports.push(normalized);
                warnReport(normalized);
            }

            await persistReports(normalizedReports);

            return new NextResponse(null, {
                status: 204,
                headers: {
                    "Cache-Control": "no-store",
                },
            });
        }

        const cspReport = report["csp-report"];

        if (cspReport) {
            const normalized = {
                document: cspReport["document-uri"],
                directive: cspReport["violated-directive"],
                blocked: cspReport["blocked-uri"],
                source: cspReport["source-file"],
                line: cspReport["line-number"],
                column: cspReport["column-number"],
            };
            warnReport(normalized);
            await persistReports([normalized]);
        }
    } catch {
        return NextResponse.json({ error: "Invalid CSP report" }, { status: 400 });
    }

    return new NextResponse(null, {
        status: 204,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
