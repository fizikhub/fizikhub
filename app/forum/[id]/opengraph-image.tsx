import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FizikHub Forum Sorusu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #09090b 0%, #1a1a2e 50%, #0f3443 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "60px 80px",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Logo badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "40px",
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                            borderRadius: "16px",
                            width: "56px",
                            height: "56px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            color: "white",
                            fontWeight: 700,
                        }}
                    >
                        ?
                    </div>
                    <span style={{ color: "#67e8f9", fontSize: "32px", fontWeight: 700 }}>
                        FizikHub Forum
                    </span>
                </div>
                {/* Question label */}
                <div
                    style={{
                        fontSize: "48px",
                        fontWeight: 800,
                        color: "white",
                        textAlign: "center",
                        lineHeight: 1.3,
                        display: "flex",
                    }}
                >
                    Soru #{id}
                </div>
                {/* CTA */}
                <div
                    style={{
                        fontSize: "20px",
                        color: "#94a3b8",
                        marginTop: "24px",
                        display: "flex",
                    }}
                >
                    Tartışmaya katıl — fizikhub.com/forum/{id}
                </div>
                {/* Decorative gradient line */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        height: "6px",
                        background: "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)",
                        display: "flex",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
