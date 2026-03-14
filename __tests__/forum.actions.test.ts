import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQuestion, voteQuestion, toggleAnswerAcceptance } from '../app/forum/actions';
import * as supabaseServer from '../lib/supabase-server';
import * as moderation from '../lib/moderation';

// Mock the moderation dependency
vi.mock('../lib/moderation', () => ({
  checkContent: vi.fn().mockReturnValue({ isClean: true, isFlagged: false }),
  getClientMetadata: vi.fn().mockResolvedValue({ ip: '127.0.0.1', ua: 'Vitest' })
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Forum Server Actions', () => {
    let mockSupabase: any;
    let mockAuthGetUser: any;
    let mockFrom: any;
    let mockRpc: any;
    let mockInsert: any;
    let mockSelect: any;
    let mockEq: any;
    let mockUpdate: any;
    let mockSingle: any;
    let mockDelete: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockAuthGetUser = vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@fizikhub.com' } },
            error: null
        });

        mockSingle = vi.fn().mockResolvedValue({ data: { id: 1, status: 'published' }, error: null });
        mockSelect = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: mockSingle, eq: vi.fn().mockReturnValue({ single: mockSingle }) }) });
        mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) });
        mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ error: null }) });
        mockDelete = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ error: null }) });
        mockEq = vi.fn().mockReturnValue({ single: mockSingle });
        
        mockRpc = vi.fn().mockResolvedValue({ error: null });

        mockFrom = vi.fn().mockReturnValue({
            insert: mockInsert,
            select: mockSelect,
            update: mockUpdate,
            delete: mockDelete,
            eq: mockEq
        });

        mockSupabase = {
            auth: { getUser: mockAuthGetUser },
            from: mockFrom,
            rpc: mockRpc
        };

        vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase);
    });

    describe('createQuestion', () => {
        it('should fail if user is not authenticated', async () => {
            mockAuthGetUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('Auth error') });
            const result = await createQuestion({ title: 'Test', content: 'Test Content', category: 'Fizik' });
            expect(result.success).toBe(false);
            expect(result.error).toBe('Soru sormak için giriş yapmalısınız.');
        });

        it('should create question and add reputation for published questions', async () => {
            const formData = { title: 'Test Question', content: 'What is physics?', category: 'Fizik', status: 'published' as const };
            
            const result = await createQuestion(formData);
            
            expect(result.success).toBe(true);
            expect(mockFrom).toHaveBeenCalledWith('questions');
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Test Question',
                content: 'What is physics?',
                status: 'published',
                author_id: 'user-123'
            }));

            // Assert points added
            expect(mockRpc).toHaveBeenCalledWith('add_reputation', expect.objectContaining({
                p_user_id: 'user-123',
                p_points: 5
            }));
        });
    });

    describe('voteQuestion', () => {
        it('should handle new upvote', async () => {
            // Mock 1: Self-vote check — question author is different from voter
            mockSingle.mockResolvedValueOnce({ data: { author_id: 'author-456' }, error: null });

            // Mock 2: Existing vote returns null (no prior vote)
            mockSingle.mockResolvedValueOnce({ data: null, error: null });
            
            // Mock 3: Return author id for notifications
            mockSingle.mockResolvedValueOnce({ data: { author_id: 'author-456', title: 'Test Q' }, error: null });

            const result = await voteQuestion(1, 1);
            
            expect(result.success).toBe(true);
            expect(result.voteChange).toBe(1);
            expect(mockInsert).toHaveBeenCalledWith({
                question_id: 1,
                user_id: 'user-123',
                vote_type: 1
            });
        });
    });

    describe('toggleAnswerAcceptance', () => {
        it('should fail if user is not the author or admin', async () => {
            mockSingle.mockResolvedValueOnce({ data: { author_id: 'different-user' }, error: null });

            const result = await toggleAnswerAcceptance(10, 1);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Sadece soruyu soran kişi veya admin cevabı onaylayabilir.');
        });

        it('should succeed if user is the author', async () => {
            // 1. Question query returns ownership matches auth user
            mockSingle.mockResolvedValueOnce({ data: { author_id: 'user-123' }, error: null });
            
            // 2. Answer query returns current acceptance state (is_accepted: false)
            mockSingle.mockResolvedValueOnce({ data: { is_accepted: false, author_id: 'author-555' }, error: null });
            
            // 3. Previous accepted answer check returns null (no conflicts)
            mockSingle.mockResolvedValueOnce({ data: null, error: null });

            const result = await toggleAnswerAcceptance(10, 1);
            
            expect(result.success).toBe(true);
            
            // Points awarded to author
            expect(mockRpc).toHaveBeenCalledWith('add_reputation', expect.objectContaining({
                p_user_id: 'author-555',
                p_points: 15
            }));
            
            // Status updated
            expect(mockUpdate).toHaveBeenCalledWith({ is_accepted: true });
        });
    });
});
