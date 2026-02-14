import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FizikHub Blog Makalesi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const title = decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toLocaleUpperCase("tr-TR"));

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #09090b 0%, #1a1a2e 50%, #16213e 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
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
                        marginBottom: "32px",
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            borderRadius: "12px",
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
                        ⚛
                    </div>
                    <span style={{ color: "#a5b4fc", fontSize: "24px", fontWeight: 600 }}>
                        FizikHub Blog
                    </span>
                </div>
                {/* Title */}
                <div
                    style={{
                        fontSize: "52px",
                        fontWeight: 800,
                        color: "white",
                        lineHeight: 1.2,
                        maxWidth: "900px",
                        display: "flex",
                    }}
                >
                    {title.length > 80 ? title.substring(0, 80) + "…" : title}
                </div>
                {/* Subtitle */}
                <div
                    style={{
                        fontSize: "22px",
                        color: "#94a3b8",
                        marginTop: "20px",
                        display: "flex",
                    }}
                >
                    fizikhub.com/blog/{slug}
                </div>
                {/* Decorative gradient line */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        height: "6px",
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                        display: "flex",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
