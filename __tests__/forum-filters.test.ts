import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import ForumPage, { generateMetadata } from '../app/forum/page';
import * as supabaseServer from '../lib/supabase-server';

// Mock other components & imports to keep test simple and fast
vi.mock('../components/forum/modern-forum-header', () => ({
    ModernForumHeader: () => 'ModernForumHeader'
}));
vi.mock('../components/forum/forum-sidebar', () => ({
    ForumSidebar: () => 'ForumSidebar'
}));
vi.mock('../components/forum/question-list', () => ({
    QuestionList: () => 'QuestionList'
}));
vi.mock('../components/forum/question-of-the-week', () => ({
    QuestionOfTheWeek: () => 'QuestionOfTheWeek'
}));
vi.mock('../lib/security', () => ({
    buildSafeIlikePattern: (q: string) => `%${q}%`
}));
vi.mock('../lib/seo-utils', () => ({
    getSiteUrl: () => 'https://www.fizikhub.com',
    stripMarkdownForMeta: (s: string) => s || '',
    truncateForMeta: (s: string) => s || ''
}));
vi.mock('../lib/breadcrumbs', () => ({
    BreadcrumbJsonLd: () => 'BreadcrumbJsonLd'
}));

describe('Forum Page Filters and SEO', () => {
    let mockSupabase: {
        from: Mock;
    };
    let mockSelect: Mock;
    let mockEq: Mock;
    let mockIs: Mock;
    let mockOrder: Mock;
    let mockRange: Mock;
    let mockContains: Mock;
    let mockLimit: Mock;
    let mockMaybeSingle: Mock;

    beforeEach(() => {
        vi.clearAllMocks();

        const fluentMock = {};

        mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
        mockRange = vi.fn().mockResolvedValue({ data: [], error: null });
        mockSelect = vi.fn().mockReturnValue(fluentMock);
        mockEq = vi.fn().mockReturnValue(fluentMock);
        mockIs = vi.fn().mockReturnValue(fluentMock);
        mockOrder = vi.fn().mockReturnValue(fluentMock);
        mockLimit = vi.fn().mockReturnValue(fluentMock);
        mockContains = vi.fn().mockReturnValue(fluentMock);

        // Assign fluent mock methods so any chain returns itself
        Object.assign(fluentMock, {
            select: mockSelect,
            eq: mockEq,
            is: mockIs,
            order: mockOrder,
            range: mockRange,
            limit: mockLimit,
            contains: mockContains,
            maybeSingle: mockMaybeSingle,
            then: (resolve: any) => resolve({ data: [], error: null }) // makes query awaitable
        });

        mockSupabase = {
            from: vi.fn().mockReturnValue(fluentMock)
        };

        vi.spyOn(supabaseServer, 'createStaticClient').mockReturnValue(mockSupabase as any);
    });

    it('should build the solved filter query using inner join and accepted answer check', async () => {
        const searchParams = Promise.resolve({ filter: 'solved' });
        
        await ForumPage({ searchParams });

        // Verify select called with inner join and all_answers alias
        expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('answers!inner(id, is_accepted)'));
        expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('all_answers:answers(count)'));

        // Verify query filtered for accepted answers
        expect(mockEq).toHaveBeenCalledWith('answers.is_accepted', true);
    });

    it('should build the unanswered filter query using left join check', async () => {
        const searchParams = Promise.resolve({ filter: 'unanswered' });
        
        await ForumPage({ searchParams });

        // Verify select called with answers(id)
        expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('answers(id)'));

        // Verify query filtered for null answers (no answers exist)
        expect(mockIs).toHaveBeenCalledWith('answers', null);
    });

    it('should generate proper metadata for the forum', async () => {
        const searchParams = Promise.resolve({ category: 'Quantum' });
        const metadata = await generateMetadata({ searchParams });

        expect(metadata.title).toBe('Quantum Forumu ve Soru Cevap');
        expect(metadata.description).toContain('Quantum forumunda soru sor');
        expect(metadata.alternates?.canonical).toContain('category=Quantum');
    });

    it('should generate intent-rich metadata for the main forum page', async () => {
        const metadata = await generateMetadata({ searchParams: Promise.resolve({}) });

        expect(metadata.title).toBe('Bilim ve Fizik Forumu: TYT AYT Fizik Soru Sor');
        expect(metadata.description).toContain('Fizik forumu ve bilim forumu');
        expect(metadata.description).toContain('TYT/AYT/YKS');
        expect(metadata.robots).toEqual(expect.objectContaining({
            index: true,
            follow: true,
            googleBot: expect.objectContaining({
                index: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
            }),
        }));
    });

    it('should noindex low-value forum query variants without blocking links', async () => {
        const metadata = await generateMetadata({ searchParams: Promise.resolve({ filter: 'unanswered' }) });

        expect(metadata.alternates?.canonical).toBe('https://www.fizikhub.com/forum');
        expect(metadata.robots).toEqual(expect.objectContaining({
            index: false,
            follow: true,
            googleBot: expect.objectContaining({
                index: false,
                follow: true,
            }),
        }));
    });
});
