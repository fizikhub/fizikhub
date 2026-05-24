import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const mockGetUser = vi.fn();
    const mockFrom = vi.fn();
    return {
        mockGetUser,
        mockFrom,
        mockInsert: vi.fn(),
        mockSelect: vi.fn(),
        mockEq: vi.fn(),
        mockCreateNotification: vi.fn(),
        mockSupabase: {
            auth: {
                getUser: mockGetUser,
            },
            from: mockFrom,
        },
    };
});

const {
    mockGetUser,
    mockFrom,
    mockInsert,
    mockSelect,
    mockEq,
} = mocks;

vi.mock("@/lib/supabase-server", () => ({
    createClient: vi.fn(async () => mocks.mockSupabase),
}));

vi.mock("@/app/notifications/actions", () => ({
    createNotification: mocks.mockCreateNotification,
}));

vi.mock("@/lib/admin", () => ({
    isAdminEmail: vi.fn(() => false),
}));

function setupSuccessfulReportInsert(admins: Array<{ id: string; role: string }> = []) {
    mockInsert.mockResolvedValue({ error: null });
    mockEq.mockResolvedValue({ data: admins, error: null });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockImplementation((table: string) => {
        if (table === "reports") return { insert: mockInsert };
        if (table === "profiles") return { select: mockSelect };
        return {};
    });
}

describe("report server actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetUser.mockResolvedValue({
            data: { user: { id: "user-1", email: "user@fizikhub.com" } },
            error: null,
        });
        setupSuccessfulReportInsert();
    });

    it("rejects a short report reason before touching the database", async () => {
        const { createReport } = await import("@/app/actions/report");

        const result = await createReport({
            resourceId: "question-1",
            resourceType: "question",
            reason: "aa",
            description: "Spam gibi görünüyor.",
        });

        expect(result).toEqual({
            success: false,
            error: "Sebep en az 3 karakter olmalıdır.",
        });
        expect(mockGetUser).not.toHaveBeenCalled();
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it("rejects a too-long report description before touching the database", async () => {
        const { createReport } = await import("@/app/actions/report");

        const result = await createReport({
            resourceId: "answer-1",
            resourceType: "answer",
            reason: "Taciz",
            description: "x".repeat(2001),
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe("Açıklama en fazla 2000 karakter olabilir.");
        expect(mockGetUser).not.toHaveBeenCalled();
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it("rejects an invalid resource type before touching the database", async () => {
        const { createReport } = await import("@/app/actions/report");

        const result = await createReport({
            resourceId: "article-1",
            resourceType: "article",
            reason: "Spam",
        } as never);

        expect(result.success).toBe(false);
        expect(result.error).toBeTruthy();
        expect(mockGetUser).not.toHaveBeenCalled();
        expect(mockFrom).not.toHaveBeenCalled();
    });

    it("creates a valid report and stores sanitized validated data", async () => {
        const { createReport } = await import("@/app/actions/report");

        const result = await createReport({
            resourceId: "comment-42",
            resourceType: "comment",
            reason: "Spam içerik",
            description: "Aynı bağlantı sürekli paylaşılıyor.",
        });

        expect(result).toEqual({ success: true });
        expect(mockFrom).toHaveBeenCalledWith("reports");
        expect(mockInsert).toHaveBeenCalledWith({
            reporter_id: "user-1",
            resource_id: "comment-42",
            resource_type: "comment",
            reason: "Spam içerik",
            description: "Aynı bağlantı sürekli paylaşılıyor.",
        });
    });
});
