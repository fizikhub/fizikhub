import { ImageResponse } from 'next/og';

// export const runtime = 'edge'; // Disabled for stability

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?title=<title>
        const hasTitle = searchParams.has('title');
        const title = hasTitle
            ? searchParams.get('title')?.slice(0, 100)
            : 'FizikHub Forum';

        // ?category=<category>
        const category = searchParams.get('category') || 'Bilim Topluluğu';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#030014',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffffff 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                        fontFamily: 'sans-serif',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background Glows */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-20%',
                            left: '-10%',
                            width: '600px',
                            height: '600px',
                            background: 'rgba(124, 58, 237, 0.3)',
                            filter: 'blur(100px)',
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-20%',
                            right: '-10%',
                            width: '600px',
                            height: '600px',
                            background: 'rgba(59, 130, 246, 0.3)',
                            filter: 'blur(100px)',
                            borderRadius: '50%',
                        }}
                    />

                    {/* Logo / Brand */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '40px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                        }}
                    >
                        <span style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(to right, #a78bfa, #60a5fa)', backgroundClip: 'text', color: 'transparent' }}>
                            FizikHub
                        </span>
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '0 60px',
                            maxWidth: '900px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 900,
                                lineHeight: 1.1,
                                marginBottom: '20px',
                                textShadow: '0 0 40px rgba(0,0,0,0.5)',
                                background: 'linear-gradient(to bottom, #ffffff, #e2e8f0)',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            {title}
                        </div>

                        {/* Category Badge */}
                        <div
                            style={{
                                fontSize: 24,
                                fontWeight: 600,
                                color: '#94a3b8',
                                background: 'rgba(15, 23, 42, 0.6)',
                                padding: '8px 24px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {category}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
