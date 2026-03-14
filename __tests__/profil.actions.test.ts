import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUsername } from '../app/profil/actions';
import * as supabaseServer from '../lib/supabase-server';

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Profile Server Actions', () => {
    let mockSupabase: any;
    let mockAuthGetUser: any;
    let mockFrom: any;
    let mockSelect: any;
    let mockEq: any;
    let mockNeq: any;
    let mockSingle: any;
    let mockUpdate: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockAuthGetUser = vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@fizikhub.com' } },
            error: null
        });

        // Setup chained mocks
        mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
        mockNeq = vi.fn().mockReturnValue({ single: mockSingle });
        mockEq = vi.fn().mockReturnValue({ single: mockSingle, neq: mockNeq });
        mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        
        mockFrom = vi.fn().mockReturnValue({
            select: mockSelect,
            update: mockUpdate,
            eq: mockEq
        });

        mockSupabase = {
            auth: { getUser: mockAuthGetUser },
            from: mockFrom,
        };

        vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase);
    });

    describe('updateUsername', () => {
        it('should fail on empty username', async () => {
            const result = await updateUsername('');
            expect(result.success).toBe(false);
            expect(result.error).toBe('Kullanıcı adı boş olamaz.');
        });

        it('should fail on invalid format', async () => {
            const result = await updateUsername('invalid username@!');
            expect(result.success).toBe(false);
            expect(result.error).toBe('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.');
        });

        it('should fail if user has already changed username once', async () => {
            // First call corresponds to getting current profile
            mockSingle.mockResolvedValueOnce({ data: { id: 'user-123', username_changes_count: 1 }, error: null });

            const result = await updateUsername('new_valid_username');
            
            expect(result.success).toBe(false);
            expect(result.error).toBe('Kullanıcı adınızı sadece bir kez değiştirebilirsiniz.');
        });

        it('should fail if username is already taken', async () => {
            mockSingle.mockResolvedValueOnce({ data: { id: 'user-123', username_changes_count: 0 }, error: null });
            
            // Simulate existing user with same username
            mockSingle.mockResolvedValueOnce({ data: { id: 'another-user' }, error: null });

            const result = await updateUsername('taken_username');
            
            expect(result.success).toBe(false);
            expect(result.error).toBe('Bu kullanıcı adı zaten kullanılıyor.');
        });

        it('should succeed when valid and untouched', async () => {
            // 1. Current profile context (no changes yet)
            mockSingle.mockResolvedValueOnce({ data: { id: 'user-123', username_changes_count: 0 }, error: null });
            
            // 2. Existing user check (null = not taken)
            mockSingle.mockResolvedValueOnce({ data: null, error: null });

            const result = await updateUsername('awesome_physics');
            
            expect(result.success).toBe(true);
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                username: 'awesome_physics',
                username_changes_count: 1
            }));
        });
    });
});
