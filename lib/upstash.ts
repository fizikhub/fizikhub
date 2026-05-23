/**
 * Zero-dependency Upstash Redis REST Client for Next.js App Router (Edge & Node runtime compatible)
 * Utilizes lightweight fetch pipelines to ensure atomic executions with maximum efficiency.
 */

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

export class RateLimiter {
    private url: string;
    private token: string;

    constructor() {
        this.url = (process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/+$/, "");
        this.token = (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
    }

    /**
     * Checks if a request should be rate-limited
     * @param identifier Unique string to rate limit (e.g. IP address, User ID)
     * @param limit Maximum allowed requests in the window
     * @param windowSeconds Duration of the rate limiting window in seconds (defaults to 60)
     */
    async limit(identifier: string, limit: number, windowSeconds = 60): Promise<RateLimitResult> {
        // Graceful fallback if Upstash Redis credentials are not configured
        if (!this.url || !this.token) {
            console.warn("Upstash Redis credentials missing. Rate limiting skipped.");
            return {
                success: true,
                limit,
                remaining: limit,
                reset: Math.floor(Date.now() / 1000) + windowSeconds,
            };
        }

        try {
            const now = Math.floor(Date.now() / 1000);
            const windowId = Math.floor(now / windowSeconds);
            const key = `ratelimit:${identifier}:${windowId}`;

            // Single round-trip pipeline execution for performance and atomicity
            const response = await fetch(`${this.url}/pipeline`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([
                    ["INCR", key],
                    ["EXPIRE", key, windowSeconds],
                ]),
                // Keep-alive connection optimization for serverless functions
                keepalive: true,
            });

            if (!response.ok) {
                throw new Error(`Upstash Redis HTTP error: ${response.status}`);
            }

            const data = await response.json();
            
            // Extract INCR result (first command in the pipeline)
            const currentRequests = Number(data[0]?.result || 1);
            const remaining = Math.max(0, limit - currentRequests);
            const reset = (windowId + 1) * windowSeconds;

            return {
                success: currentRequests <= limit,
                limit,
                remaining,
                reset,
            };
        } catch (error) {
            console.error("RateLimiter error:", error);
            // Default to allowing request on system failure to maintain availability
            return {
                success: true,
                limit,
                remaining: 1,
                reset: Math.floor(Date.now() / 1000) + windowSeconds,
            };
        }
    }
}

export const rateLimiter = new RateLimiter();
