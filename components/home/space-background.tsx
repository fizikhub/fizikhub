import React, { useEffect, useState } from "react";

export function SpaceBackground() {
    const [ufo, setUfo] = useState<{ id: number } | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        const starCount = 80;
        const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: (Math.random() * 0.03) + 0.01
            });
        }

        let animationFrameId: number = 0;
        let isVisible = false;

        const render = () => {
            if (!canvas || !ctx || !isVisible) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            stars.forEach(star => {
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0.2) star.speed = -star.speed;
                ctx.globalAlpha = Math.max(0.2, Math.min(1, star.opacity));
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationFrameId) animationFrameId = requestAnimationFrame(render);
            else if (!isVisible && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
            }
        }, { rootMargin: "100px" });

        observer.observe(canvas);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const ufoInterval = setInterval(() => {
            setUfo({ id: Date.now() });
            setTimeout(() => setUfo(null), 12000);
        }, 35000);
        return () => clearInterval(ufoInterval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
            <style jsx>{`
                @keyframes planet-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes shooting-star {
                    0% { transform: rotate(45deg) scale(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: rotate(45deg) scale(1.5) translateX(600px); opacity: 0; }
                }
                @keyframes ufo-move {
                    0% { left: -10%; top: 20%; transform: rotate(15deg) scale(0.8); }
                    30% { left: 30%; top: 50%; transform: rotate(-10deg) scale(1); }
                    60% { left: 70%; top: 30%; transform: rotate(10deg) scale(0.9); }
                    100% { left: 110%; top: 40%; transform: rotate(0deg) scale(0.8); }
                }
                .planet {
                    animation: planet-float 15s ease-in-out infinite;
                    will-change: transform;
                }
                .shooting-star-container {
                    animation: shooting-star 1.5s ease-out infinite;
                    animation-delay: 5s;
                    will-change: transform;
                    position: absolute;
                    width: 200px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #fff, transparent);
                }
                .ufo-container {
                    animation: ufo-move 12s linear forwards;
                    will-change: transform, left, top;
                    position: absolute;
                }
            `}</style>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 block w-full h-full"
                style={{ background: 'black' }}
            />

            <div
                className="planet absolute top-[15%] right-[10%] w-[120px] h-[120px] sm:w-[250px] sm:h-[250px] rounded-full mix-blend-screen opacity-20"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(100, 100, 255, 0.4), transparent 70%)",
                    filter: "blur(30px)",
                }}
            />

            <div
                className="planet absolute bottom-[25%] left-[10%] w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full mix-blend-screen opacity-15"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(100, 200, 255, 0.3), transparent 70%)",
                    filter: "blur(40px)",
                    animationDelay: "-5s"
                }}
            />

            <div className="shooting-star-container top-[10%] left-[20%]" />
            <div className="shooting-star-container top-[40%] left-[60%] animation-delay-[10s]" />

            {ufo && (
                <div key={ufo.id} className="ufo-container">
                    <div className="relative w-20 h-8 sm:w-24 sm:h-10">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 sm:w-10 sm:h-6 bg-cyan-400/20 rounded-t-full border border-cyan-200/40 z-10" />
                        <div className="absolute top-0 w-full h-full bg-slate-400 rounded-[50%] z-0"
                            style={{ background: 'linear-gradient(to bottom, #94a3b8, #64748b)' }} />
                        <div className="absolute top-[40%] left-[5%] w-[90%] h-[60%] bg-slate-900 rounded-[50%] z-[-1]" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-cyan-500/30 blur-sm rounded-[50%]" />
                    </div>
                </div>
            )}
        </div>
    );
}
