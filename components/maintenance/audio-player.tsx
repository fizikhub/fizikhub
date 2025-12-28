"use client";

import { useState, useRef, useEffect } from "react";

export function MaintenanceAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        // Try autoplay first
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    setShowButton(false);
                })
                .catch(() => {
                    // Autoplay blocked, show button
                    setShowButton(true);
                });
        }
    }, []);

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            setShowButton(false);
        }
    };

    return (
        <>
            <audio ref={audioRef} loop>
                <source src="/audio/error_theme.mp3" type="audio/mpeg" />
            </audio>

            {showButton && (
                <button
                    onClick={handlePlay}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-red-900/50 to-amber-900/50 border border-amber-500/30 rounded-lg text-amber-400 font-bold text-lg hover:from-red-800/50 hover:to-amber-800/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    🔊 Müziği Aç
                </button>
            )}
        </>
    );
}
