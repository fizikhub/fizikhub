import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
const mockFrom = vi.fn();
const mockAuth = { getUser: vi.fn() };
const mockSupabase = {
    auth: mockAuth,
    from: mockFrom,
};

vi.mock('@/lib/supabase-server', () => ({
    createClient: vi.fn(async () => mockSupabase),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

vi.mock('@/lib/moderation', () => ({
    checkContent: vi.fn(() => ({ isClean: true, isFlagged: false })),
    getClientMetadata: vi.fn(async () => ({ ip: '127.0.0.1', ua: 'test' })),
}));

vi.mock('@/lib/admin', () => ({
    isAdminEmail: vi.fn((email: string) => email === 'admin@test.com'),
}));

// Helper to set up chain mocks for Supabase queries
function setupChainMock(returnValue: any) {
    const chain: any = {};
    chain.select = vi.fn().mockReturnValue(chain);
    chain.insert = vi.fn().mockReturnValue(chain);
    chain.update = vi.fn().mockReturnValue(chain);
    chain.delete = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.neq = vi.fn().mockReturnValue(chain);
    chain.in = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockResolvedValue(returnValue);
    chain.maybeSingle = vi.fn().mockResolvedValue(returnValue);
    return chain;
}

describe('Forum Input Validation Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.getUser.mockResolvedValue({
            data: { user: { id: 'user1', email: 'user@test.com' } },
            error: null,
        });
    });

    describe('createQuestion — Input Limits', () => {
        it('should reject title exceeding 300 characters', async () => {
            const { createQuestion } = await import('../app/forum/actions');
            const longTitle = 'A'.repeat(301);
            const result = await createQuestion({
                title: longTitle,
                content: 'Valid content',
                category: 'fizik',
            });
            expect(result.success).toBe(false);
            expect(result.error).toContain('300');
        });

        it('should reject content exceeding 20000 characters', async () => {
            const { createQuestion } = await import('../app/forum/actions');
            const longContent = 'A'.repeat(20001);
            const result = await createQuestion({
                title: 'Valid title',
                content: longContent,
                category: 'fizik',
            });
            expect(result.success).toBe(false);
            expect(result.error).toContain('20.000');
        });

        it('should reject empty title', async () => {
            const { createQuestion } = await import('../app/forum/actions');
            const result = await createQuestion({
                title: '',
                content: 'Valid content',
                category: 'fizik',
            });
            expect(result.success).toBe(false);
            expect(result.error).toContain('boş');
        });

        it('should reject empty content', async () => {
            const { createQuestion } = await import('../app/forum/actions');
            const result = await createQuestion({
                title: 'Valid title',
                content: '   ',
                category: 'fizik',
            });
            expect(result.success).toBe(false);
            expect(result.error).toContain('boş');
        });
    });

    describe('voteQuestion — Self-Vote Prevention', () => {
        it('should reject self-vote', async () => {
            // Mock question where author_id matches user
            const questionChain = setupChainMock({ data: { author_id: 'user1' }, error: null });
            mockFrom.mockReturnValue(questionChain);

            const { voteQuestion } = await import('../app/forum/actions');
            const result = await voteQuestion(1, 1);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Kendi sorunuzu');
        });
    });
});

describe('Messaging Input Validation Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.getUser.mockResolvedValue({
            data: { user: { id: 'user1', email: 'user@test.com' } },
            error: null,
        });
    });

    describe('sendMessage — Length Limit', () => {
        it('should reject message exceeding 5000 characters', async () => {
            const { sendMessage } = await import('../app/mesajlar/actions');
            const longMessage = 'X'.repeat(5001);
            const result = await sendMessage('conv1', longMessage);
            expect(result.success).toBe(false);
            expect(result.error).toContain('5.000');
        });

        it('should reject empty message', async () => {
            const { sendMessage } = await import('../app/mesajlar/actions');
            const result = await sendMessage('conv1', '   ');
            expect(result.success).toBe(false);
            expect(result.error).toContain('boş');
        });
    });

    describe('reactToMessage — Emoji Whitelist', () => {
        it('should reject non-whitelisted emoji', async () => {
            const { reactToMessage } = await import('../app/mesajlar/actions');
            const result = await reactToMessage(1, '💀');
            expect(result.success).toBe(false);
            expect(result.error).toContain('Geçersiz');
        });

        it('should reject arbitrary strings as reactions', async () => {
            const { reactToMessage } = await import('../app/mesajlar/actions');
            const result = await reactToMessage(1, 'this-is-not-an-emoji-but-a-very-long-string');
            expect(result.success).toBe(false);
            expect(result.error).toContain('Geçersiz');
        });
    });
});
