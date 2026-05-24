import { NextRequest, NextResponse } from "next/server";

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

function warnReport(report: {
    document?: string;
    directive?: string;
    blocked?: string;
    source?: string;
    line?: number;
    column?: number;
}) {
    if (process.env.NODE_ENV === "production") return;
    console.warn("[csp-report]", report);
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

        if (Array.isArray(report)) {
            for (const entry of report) {
                if (entry.type !== "csp-violation") continue;
                warnReport({
                    document: entry.body?.documentURL,
                    directive: entry.body?.effectiveDirective,
                    blocked: entry.body?.blockedURL,
                    source: entry.body?.sourceFile,
                    line: entry.body?.lineNumber,
                    column: entry.body?.columnNumber,
                });
            }

            return new NextResponse(null, {
                status: 204,
                headers: {
                    "Cache-Control": "no-store",
                },
            });
        }

        const cspReport = report["csp-report"];

        if (cspReport) {
            warnReport({
                document: cspReport["document-uri"],
                directive: cspReport["violated-directive"],
                blocked: cspReport["blocked-uri"],
                source: cspReport["source-file"],
                line: cspReport["line-number"],
                column: cspReport["column-number"],
            });
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
