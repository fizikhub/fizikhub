import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// We fetch the Lora and Inter fonts to use inside the image response
const interRegular = fetch(
    new URL('../../../public/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const loraBold = fetch(
    new URL('../../../public/fonts/Lora-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const hasTitle = searchParams.has('title');
        const title = hasTitle
            ? searchParams.get('title')?.slice(0, 100)
            : 'Fizikhub | Bilimi Ti\'ye Alıyoruz, Ciddi Şekilde';

        const hasAuthor = searchParams.has('author');
        const author = hasAuthor ? searchParams.get('author') : 'Fizikhub Ekibi';

        const hasCategory = searchParams.has('category');
        const category = hasCategory ? searchParams.get('category') : 'Makale';

        // Get fonts
        const [interFont, loraFont] = await Promise.all([interRegular, loraBold]);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: '#050505',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        padding: '80px',
                        fontFamily: '"Inter"',
                    }}
                >
                    {/* Top Accent Line */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                        }}
                    />

                    {/* Logo/Brand */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px',
                            }}
                        >
                            {/* Abstract 'F' shape */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20V8H10V12H18V16H10V24H4V4Z" fill="#000" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 32, fontWeight: 700, color: 'white', letterSpacing: '-0.05em' }}>
                            Fizikhub
                        </span>
                    </div>

                    {/* Category Label */}
                    <div
                        style={{
                            display: 'flex',
                            padding: '8px 16px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            color: '#a1a1aa',
                            fontSize: 20,
                            fontWeight: 500,
                            marginBottom: '32px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {category}
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 64,
                            lineHeight: 1.1,
                            fontFamily: '"Lora"',
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: '40px',
                            maxHeight: '210px',
                            overflow: 'hidden',
                        }}
                    >
                        {title}
                    </div>

                    {/* Author Footer */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 'auto',
                            color: '#a1a1aa',
                            fontSize: 24,
                        }}
                    >
                        <span style={{ color: 'white', marginRight: '8px', fontWeight: 600 }}>{author}</span> tarafından yazıldı
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Inter',
                        data: interFont,
                        style: 'normal',
                        weight: 400,
                    },
                    {
                        name: 'Lora',
                        data: loraFont,
                        style: 'normal',
                        weight: 700,
                    },
                ],
            }
        );
    } catch (e) {
        console.error(e);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
