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

export async function POST(request: NextRequest) {
    try {
        const report = await request.json() as CspReportEnvelope;
        const cspReport = report["csp-report"];

        if (cspReport && process.env.NODE_ENV !== "production") {
            console.warn("[csp-report]", {
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
