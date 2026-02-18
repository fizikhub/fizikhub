"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

export function LandscapeGuard({ children }: { children: React.ReactNode }) {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Check if mobile (touch device) and in portrait mode
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isPortraitMode = window.innerHeight > window.innerWidth;
            setIsPortrait(isMobile && isPortraitMode);
        };

        checkOrientation();
        window.addEventListener("resize", checkOrientation);
        return () => window.removeEventListener("resize", checkOrientation);
    }, []);

    if (isPortrait) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-[#FFC800] blur-2xl opacity-20 animate-pulse" />
                    <Smartphone className="w-24 h-24 text-white animate-[spin_3s_ease-in-out_infinite]" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                    Telefonu Yan Çevir
                </h2>
                <p className="text-zinc-400 font-medium max-w-xs mx-auto">
                    Bu deney laboratuvarı hassas ölçümler gerektirir. Lütfen daha iyi bir görüş açısı için ekranını döndür.
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
