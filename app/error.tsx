"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Console log the error for debugging
        console.error("Yüksek ihtimalle sıçtık:", error);

        // Auto-play audio if possible

    }, [error]);

    return (
        <div className="fixed inset-0 z-[9999] min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden text-center p-6">

            {/* Background Noise/Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />

            {/* Content Container */}
            <div className="relative z-10 max-w-2xl flex flex-col items-center gap-8">

                {/* Galileo Image - Framed */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-900 to-amber-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative rounded-lg border-2 border-amber-900/30 overflow-hidden shadow-2xl">
                        <Image
                            src="/images/galileo-error.jpg"
                            alt="Galileo Galilei - Something went wrong"
                            width={400}
                            height={500}
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 w-auto h-[400px]"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-600">
                            Yüksek İhtimalle Sıçtık.
                        </span>
                    </h1>

                    <div className="space-y-2 text-lg sm:text-xl text-slate-400 font-medium font-mono leading-relaxed max-w-lg mx-auto border-l-2 border-red-900/50 pl-6 text-left">
                        <p>
                            Bu sayfayı görüyorsan belli ki ciddi bir sorun var.
                        </p>
                        <p className="text-slate-500">
                            Bu sorunu ya çözmeye çalışıyoruz ya da hiç farkında bile değiliz.
                        </p>

                        {/* DEBUGGING INFO */}
                        <div className="mt-8 p-4 bg-red-950/30 border border-red-500/20 rounded-lg text-xs font-mono text-red-200 overflow-auto max-h-40 text-left">
                            <p className="font-bold border-b border-red-500/20 pb-1 mb-2">HATA DETAYI (Bunu geliştiriciye ilet):</p>
                            <p>{error.message || "Bilinmeyen Hata"}</p>
                            {error.digest && <p className="mt-1 text-red-400">Digest: {error.digest}</p>}
                        </div>
                    </div>
                </div>

                {/* Audio Element */}
                <audio ref={audioRef} loop>
                    <source src="/audio/error_theme.mp3" type="audio/mpeg" />
                    <source src="/audio/error_theme.wav" type="audio/wav" />
                </audio>

                {/* Reset Button (Optional, maybe hidden or subtle?) */}
                <button
                    onClick={() => reset()}
                    className="mt-8 px-6 py-2 text-sm text-white/20 hover:text-white/80 transition-colors uppercase tracking-[0.3em] hover:bg-white/5 rounded-full"
                >
                    TEKRAR DENE
                </button>

                {/* Technical Error Code */}
                <div className="absolute bottom-[-100px] font-black text-[200px] text-white/5 pointer-events-none select-none">
                    500
                </div>
            </div>
        </div>
    );
}
