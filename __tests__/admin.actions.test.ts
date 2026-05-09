import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteArticle, approveArticle } from '../app/admin/actions';
import * as supabaseServer from '../lib/supabase-server';
import { createAdminClient } from '../lib/supabase-admin';

// Mock the lib/admin dependency entirely so we can control isAdminEmail
vi.mock('../lib/admin', () => ({
  isAdminEmail: vi.fn((email: string) => email === 'admin@fizikhub.com')
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('../lib/supabase-admin', () => ({
  createAdminClient: vi.fn(),
}));

describe('Admin Server Actions', () => {
  let mockSupabase: any;
  let mockAuthGetUser: any;
  let mockFrom: any;
  let mockDelete: any;
  let mockUpdate: any;
  let mockRpc: any;
  let mockEq: any;
  let mockSingle: any;
  let mockSelect: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSingle = vi.fn().mockResolvedValue({ data: { role: 'user' }, error: null });
    mockEq = vi.fn().mockReturnValue({ single: mockSingle, error: null });
    mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockRpc = vi.fn().mockResolvedValue({ error: null });

    mockFrom = vi.fn().mockImplementation((table) => {
      return { delete: mockDelete, update: mockUpdate, select: mockSelect, eq: mockEq };
    });

    mockAuthGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@fizikhub.com' } },
      error: null
    });

    mockSupabase = {
      auth: { getUser: mockAuthGetUser },
      from: mockFrom,
      rpc: mockRpc
    };

    vi.spyOn(supabaseServer, 'createClient').mockResolvedValue(mockSupabase);
    vi.mocked(createAdminClient).mockReturnValue(mockSupabase);
  });

  describe('deleteArticle', () => {
    it('should fail if user is not authenticated', async () => {
      mockAuthGetUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('Auth error') });
      const result = await deleteArticle(1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Giriş yapmalısınız.');
    });

    it('should fail if user is not an admin (by email or role)', async () => {
      const result = await deleteArticle(1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Bu işlem için admin yetkisi gereklidir.');
    });

    it('should succeed if user is admin by email', async () => {
      mockAuthGetUser.mockResolvedValue({
        data: { user: { id: 'admin-123', email: 'admin@fizikhub.com' } },
        error: null
      });

      const result = await deleteArticle(1);
      expect(result.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('articles');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('should succeed if user is admin by role', async () => {
        // Change single mock to return role=admin
        mockSingle.mockResolvedValueOnce({ data: { role: 'admin' }, error: null });
  
        const result = await deleteArticle(1);
        expect(result.success).toBe(true);
        expect(mockFrom).toHaveBeenCalledWith('articles');
        expect(mockDelete).toHaveBeenCalled();
      });
  });

  describe('approveArticle', () => {
    it('should succeed and add reputation for admin user', async () => {
        mockAuthGetUser.mockResolvedValue({
            data: { user: { id: 'admin-123', email: 'admin@fizikhub.com' } },
            error: null
        });

        // The first single() call checks if user is admin => returns role user (overriden by email check)
        mockSingle.mockResolvedValueOnce({ data: { role: 'user' }, error: null });

        // The second single() call fetches the article author_id
        mockSingle.mockResolvedValueOnce({ data: { author_id: 'target-user-456' }, error: null });
    
        const result = await approveArticle(1);
        expect(result.success).toBe(true);
        
        // Assert table update
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            status: 'published',
            reviewed_by: 'admin-123'
        }));

        // Assert reputation rpc call
        expect(mockRpc).toHaveBeenCalledWith('add_reputation', {
            p_user_id: 'target-user-456',
            p_points: 20,
            p_reason: 'article_published',
            p_reference_type: 'article',
            p_reference_id: 1
        });
    });
  });
});
