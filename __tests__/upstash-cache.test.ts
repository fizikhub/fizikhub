import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('RedisCache', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        process.env = { ...originalEnv };
        vi.restoreAllMocks();
    });

    it('should not be enabled when UPSTASH_REDIS_REST_URL is missing', async () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        expect(cache.isEnabled()).toBe(false);
    });

    it('should not be enabled when UPSTASH_REDIS_REST_TOKEN is missing', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        expect(cache.isEnabled()).toBe(false);
    });

    it('should be enabled when both URL and TOKEN are set', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        expect(cache.isEnabled()).toBe(true);
    });

    it('get() should return null when cache is disabled', async () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        const result = await cache.get('test-key');
        expect(result).toBeNull();
    });

    it('set() should not throw when cache is disabled', async () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        // Should resolve without throwing
        await expect(cache.set('test-key', { data: 'test' })).resolves.toBeUndefined();
    });

    it('del() should not throw when cache is disabled', async () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        await expect(cache.del('test-key')).resolves.toBeUndefined();
    });

    it('invalidateByPrefix() should not throw when cache is disabled', async () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        await expect(cache.invalidateByPrefix('fh:')).resolves.toBeUndefined();
    });

    it('get() should return null when fetch fails', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

        // Mock fetch to simulate network failure
        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        const result = await cache.get('test-key');
        expect(result).toBeNull();

        fetchSpy.mockRestore();
    });

    it('get() should parse JSON response correctly', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

        const testData = { title: 'Test Article', id: 123 };

        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ result: JSON.stringify(testData) }),
        } as Response);

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        const result = await cache.get<typeof testData>('test-key');
        expect(result).toEqual(testData);

        fetchSpy.mockRestore();
    });

    it('get() should return null for cache miss (null result)', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ result: null }),
        } as Response);

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        const result = await cache.get('nonexistent-key');
        expect(result).toBeNull();

        fetchSpy.mockRestore();
    });

    it('set() should call fetch with pipeline containing SET and EXPIRE', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as Response);

        const { RedisCache } = await import('@/lib/upstash');
        const cache = new RedisCache();

        await cache.set('test-key', { hello: 'world' }, 600);

        expect(fetchSpy).toHaveBeenCalledWith(
            'https://test.upstash.io/pipeline',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify([
                    ['SET', 'test-key', JSON.stringify({ hello: 'world' })],
                    ['EXPIRE', 'test-key', 600],
                ]),
            }),
        );

        fetchSpy.mockRestore();
    });
});
