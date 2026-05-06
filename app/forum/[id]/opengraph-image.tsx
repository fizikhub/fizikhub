import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase-server";

export const runtime = "edge";
export const alt = "FizikHub Forum Sorusu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch question title and metadata for a rich OG image
    let title = `Soru #${id}`;
    let category = "Genel";
    let authorName = "";
    let answerCount = 0;

    try {
        const supabase = await createClient();
        const { data: question } = await supabase
            .from('questions')
            .select('title, category, profiles(username), answers(count)')
            .eq('id', id)
            .single();

        if (question) {
            title = question.title || title;
            category = question.category || category;
            authorName = (question.profiles as any)?.username || "";
            answerCount = (question.answers as any)?.[0]?.count || 0;
        }
    } catch {
        // Fallback to generic OG image if DB fails
    }

    // Truncate title if too long for OG image
    const displayTitle = title.length > 80 ? title.substring(0, 77) + "…" : title;

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #09090b 0%, #1a1a2e 50%, #0f3443 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "50px 60px",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Top: Logo + Category */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                borderRadius: "14px",
                                width: "48px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                                color: "white",
                                fontWeight: 700,
                            }}
                        >
                            ?
                        </div>
                        <span style={{ color: "#67e8f9", fontSize: "26px", fontWeight: 700 }}>
                            FizikHub Forum
                        </span>
                    </div>
                    <div
                        style={{
                            background: "#FFBD2E",
                            color: "#000",
                            padding: "6px 16px",
                            borderRadius: "20px",
                            fontSize: "16px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            display: "flex",
                        }}
                    >
                        {category}
                    </div>
                </div>

                {/* Middle: Question title */}
                <div
                    style={{
                        fontSize: displayTitle.length > 50 ? "36px" : "44px",
                        fontWeight: 800,
                        color: "white",
                        lineHeight: 1.3,
                        display: "flex",
                        maxWidth: "90%",
                    }}
                >
                    {displayTitle}
                </div>

                {/* Bottom: Author + Answer count + CTA */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {authorName && (
                            <span style={{ color: "#94a3b8", fontSize: "18px", fontWeight: 600, display: "flex" }}>
                                @{authorName}
                            </span>
                        )}
                        {answerCount > 0 && (
                            <span style={{ color: "#67e8f9", fontSize: "16px", fontWeight: 700, display: "flex" }}>
                                {answerCount} cevap
                            </span>
                        )}
                    </div>
                    <span
                        style={{
                            fontSize: "16px",
                            color: "#64748b",
                            display: "flex",
                        }}
                    >
                        fizikhub.com/forum/{id}
                    </span>
                </div>

                {/* Decorative gradient line */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        height: "6px",
                        background: "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #FFBD2E)",
                        display: "flex",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
