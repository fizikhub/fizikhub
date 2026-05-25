import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    mockFrom: vi.fn(),
    mockGenerateEmbedding: vi.fn(),
}));

const { mockFrom, mockGenerateEmbedding } = mocks;

vi.mock("@/lib/supabase-server", () => ({
    createClient: vi.fn(async () => ({
        from: mocks.mockFrom,
    })),
}));

vi.mock("@/lib/gemini", () => ({
    generateEmbedding: mocks.mockGenerateEmbedding,
}));

function createEmptyQuery() {
    const chain = {
        select: vi.fn(),
        eq: vi.fn(),
        or: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
    };

    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.or.mockReturnValue(chain);
    chain.order.mockReturnValue(chain);
    chain.limit.mockResolvedValue({ data: [], error: null });

    return chain;
}

describe("global search topic results", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGenerateEmbedding.mockResolvedValue(null);
        mockFrom.mockImplementation(() => createEmptyQuery());
    });

    it("returns topic hub results for SEO learning queries", async () => {
        const { searchGlobal } = await import("@/app/search/actions");

        const results = await searchGlobal("Newton yasaları");

        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({
                type: "topic",
                id: "newton-yasalari",
                url: "/konular/newton-yasalari",
                category: "Konu Rehberi",
            }),
        ]));
    });

    it("filters fallback forum search to published questions", async () => {
        const questionsQuery = createEmptyQuery();
        mockFrom.mockImplementation((table: string) => table === "questions" ? questionsQuery : createEmptyQuery());

        const { searchGlobal } = await import("@/app/search/actions");

        await searchGlobal("momentum korunumu");

        expect(questionsQuery.eq).toHaveBeenCalledWith("status", "published");
    });
});
