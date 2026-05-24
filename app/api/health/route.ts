import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
export const runtime = "edge";
export const revalidate = 0; // Cacheleme yapılmasın, canlı kontrol

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export async function GET() {
    const startTime = performance.now();
    const includeDiagnostics = process.env.NODE_ENV !== "production";

    // Health Checks
    let isDbHealthy = false;
    let isRedisHealthy = false;
    let dbLatency = -1;
    let redisLatency = -1;
    let dbError: string | null = null;
    let redisError: string | null = null;

    // 1. Supabase (Postgres) Check
    try {
        const dbStart = performance.now();
        const supabase = await createClient();
        // Sadece bağlantıyı test eden hafif bir sorgu
        const { error } = await supabase.from("articles").select("id").limit(1);
        if (error) throw error;

        isDbHealthy = true;
        dbLatency = Math.round(performance.now() - dbStart);
    } catch (error: unknown) {
        dbError = getErrorMessage(error, "Database connection failed");
    }

    // 2. Redis (Upstash) Check - REST API üzerinden ping
    try {
        const redisStart = performance.now();
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
        
        if (redisUrl && redisToken) {
            const res = await fetch(`${redisUrl}/ping`, {
                headers: { Authorization: `Bearer ${redisToken}` },
                cache: "no-store"
            });
            if (!res.ok) throw new Error("Redis REST API returned " + res.status);
            isRedisHealthy = true;
            redisLatency = Math.round(performance.now() - redisStart);
        } else {
            redisError = "Redis credentials missing";
        }
    } catch (error: unknown) {
        redisError = getErrorMessage(error, "Redis ping failed");
    }

    const totalLatency = Math.round(performance.now() - startTime);

    const isSystemHealthy = isDbHealthy && isRedisHealthy;

    const responseData = {
        status: isSystemHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        total_latency_ms: totalLatency,
        ...(includeDiagnostics ? { environment: process.env.NODE_ENV } : {}),
        services: {
            database: {
                status: isDbHealthy ? "up" : "down",
                latency_ms: dbLatency,
                ...(includeDiagnostics ? { error: dbError } : {}),
            },
            redis: {
                status: isRedisHealthy ? "up" : "down",
                latency_ms: redisLatency,
                ...(includeDiagnostics ? { error: redisError } : {}),
            }
        }
    };

    return NextResponse.json(responseData, {
        status: isSystemHealthy ? 200 : 503, // 503 Service Unavailable for degradations
        headers: {
            "Cache-Control": "no-store, max-age=0",
        }
    });
}
