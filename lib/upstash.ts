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

// ─────────────────────────────────────────────────────────────────────────────
// General-Purpose Redis Cache — edge-compatible, zero-dependency via REST API
// ─────────────────────────────────────────────────────────────────────────────

export class RedisCache {
    private url: string;
    private token: string;
    private enabled: boolean;

    constructor() {
        this.url = (process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/+$/, "");
        this.token = (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
        this.enabled = Boolean(this.url && this.token);
    }

    /**
     * Fetch a cached value by key. Returns null on miss or when Redis is unavailable.
     */
    async get<T>(key: string): Promise<T | null> {
        if (!this.enabled) return null;

        try {
            const response = await fetch(`${this.url}/GET/${encodeURIComponent(key)}`, {
                headers: { Authorization: `Bearer ${this.token}` },
                // Next.js edge-compatible — no node:http dependency
                cache: "no-store",
            });

            if (!response.ok) return null;

            const data = await response.json();
            if (data.result === null || data.result === undefined) return null;

            return JSON.parse(data.result) as T;
        } catch {
            return null;
        }
    }

    /**
     * Store a value in Redis with a TTL (time-to-live) in seconds.
     * @param key   Cache key (prefix with namespace, e.g. "articles:list")
     * @param value Serializable data to store
     * @param ttl   Time-to-live in seconds (default: 300 = 5 minutes)
     */
    async set(key: string, value: unknown, ttl = 300): Promise<void> {
        if (!this.enabled) return;

        try {
            await fetch(`${this.url}/pipeline`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([
                    ["SET", key, JSON.stringify(value)],
                    ["EXPIRE", key, ttl],
                ]),
                keepalive: true,
            });
        } catch {
            // Silently fail — cache is a best-effort optimization
        }
    }

    /**
     * Delete a specific cache key.
     */
    async del(key: string): Promise<void> {
        if (!this.enabled) return;

        try {
            await fetch(`${this.url}/DEL/${encodeURIComponent(key)}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${this.token}` },
            });
        } catch {
            // Silently fail
        }
    }

    /**
     * Invalidate all keys matching a prefix using SCAN + DEL.
     * Useful for cache-busting after article updates.
     * @param prefix Key prefix to match (e.g. "articles:")
     */
    async invalidateByPrefix(prefix: string): Promise<void> {
        if (!this.enabled) return;

        try {
            // Use SCAN to find matching keys (cursor-based, safe for production)
            let cursor = "0";
            do {
                const response = await fetch(
                    `${this.url}/SCAN/${cursor}/MATCH/${encodeURIComponent(prefix + "*")}/COUNT/100`,
                    {
                        headers: { Authorization: `Bearer ${this.token}` },
                    }
                );
                if (!response.ok) break;

                const data = await response.json();
                cursor = data.result[0];
                const keys: string[] = data.result[1];

                if (keys.length > 0) {
                    await fetch(`${this.url}/pipeline`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(keys.map((k) => ["DEL", k])),
                    });
                }
            } while (cursor !== "0");
        } catch {
            // Silently fail
        }
    }

    /** Check if Redis credentials are configured. */
    isEnabled(): boolean {
        return this.enabled;
    }
}

export const redisCache = new RedisCache();

