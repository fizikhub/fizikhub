import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

describe('Gemini Client (Centralized)', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        process.env = { ...originalEnv };
        vi.restoreAllMocks();
        vi.doUnmock('@google/generative-ai');
    });

    it('getGeminiApiKey() should return empty string when no env vars are set', async () => {
        delete process.env.GEMINI_API_KEY;
        delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        delete process.env.GOOGLE_AI_API_KEY;

        const { getGeminiApiKey } = await import('@/lib/gemini');
        expect(getGeminiApiKey()).toBe('');
    });

    it('getGeminiApiKey() should prefer GEMINI_API_KEY over others', async () => {
        process.env.GEMINI_API_KEY = 'primary-key';
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'secondary-key';
        process.env.GOOGLE_AI_API_KEY = 'tertiary-key';

        const { getGeminiApiKey } = await import('@/lib/gemini');
        expect(getGeminiApiKey()).toBe('primary-key');
    });

    it('getGeminiApiKey() should fall back to GOOGLE_GENERATIVE_AI_API_KEY', async () => {
        delete process.env.GEMINI_API_KEY;
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'secondary-key';
        delete process.env.GOOGLE_AI_API_KEY;

        const { getGeminiApiKey } = await import('@/lib/gemini');
        expect(getGeminiApiKey()).toBe('secondary-key');
    });

    it('getGeminiApiKey() should fall back to NEXT_PUBLIC_GEMINI_API_KEY', async () => {
        delete process.env.GEMINI_API_KEY;
        delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'public-key';
        delete process.env.GOOGLE_AI_API_KEY;

        const { getGeminiApiKey } = await import('@/lib/gemini');
        expect(getGeminiApiKey()).toBe('public-key');
    });

    it('getGeminiApiKey() should fall back to GOOGLE_AI_API_KEY as last resort', async () => {
        delete process.env.GEMINI_API_KEY;
        delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        process.env.GOOGLE_AI_API_KEY = 'last-resort-key';

        const { getGeminiApiKey } = await import('@/lib/gemini');
        expect(getGeminiApiKey()).toBe('last-resort-key');
    });

    it('getGeminiClient() should return null when no API key is configured', async () => {
        delete process.env.GEMINI_API_KEY;
        delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        delete process.env.GOOGLE_AI_API_KEY;

        const { getGeminiClient } = await import('@/lib/gemini');
        const client = getGeminiClient();
        expect(client).toBeNull();
    });

    it('getGeminiClient() should return a GoogleGenerativeAI instance when API key exists', async () => {
        process.env.GEMINI_API_KEY = 'test-api-key-12345';

        const { getGeminiClient } = await import('@/lib/gemini');
        const client = getGeminiClient();
        expect(client).not.toBeNull();
        expect(client).toBeDefined();
    });

    it('getGeminiClient() should return the same instance on repeated calls (singleton)', async () => {
        process.env.GEMINI_API_KEY = 'singleton-test-key';

        const { getGeminiClient } = await import('@/lib/gemini');
        const client1 = getGeminiClient();
        const client2 = getGeminiClient();
        expect(client1).toBe(client2);
    });

    it('generateEmbedding() should request vectors that match the Postgres vector(768) schema', async () => {
        const embedContent = vi.fn().mockResolvedValue({ embedding: { values: [0.1, 0.2, 0.3] } });
        const getGenerativeModel = vi.fn().mockReturnValue({ embedContent });
        const GoogleGenerativeAI = vi.fn().mockImplementation(function GoogleGenerativeAI() {
            return { getGenerativeModel };
        });

        vi.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI }));
        process.env.GEMINI_API_KEY = 'embedding-test-key';

        const {
            GEMINI_EMBEDDING_DIMENSIONS,
            GEMINI_EMBEDDING_MODEL,
            generateEmbedding,
        } = await import('@/lib/gemini');

        const embedding = await generateEmbedding('Kuantum fiziği nedir?');

        expect(embedding).toEqual([0.1, 0.2, 0.3]);
        expect(getGenerativeModel).toHaveBeenCalledWith({ model: GEMINI_EMBEDDING_MODEL });
        expect(embedContent).toHaveBeenCalledWith({
            content: { role: 'user', parts: [{ text: 'Kuantum fiziği nedir?' }] },
            outputDimensionality: GEMINI_EMBEDDING_DIMENSIONS,
        });
    });
});
