"use client";

import { useEffect, useRef } from "react";

export function MaintenanceAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const playAudio = () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.5;
                audioRef.current.play()
                    .then(() => {
                        // Play successful, remove listeners
                        document.removeEventListener('click', playAudio);
                        document.removeEventListener('touchstart', playAudio);
                        document.removeEventListener('keydown', playAudio);
                    })
                    .catch((err) => {
                        // Audio play failed (waiting for interaction)
                    });
            }
        };

        // Try to play immediately
        playAudio();

        // Add listeners for user interaction if autoplay fails or is blocked
        document.addEventListener('click', playAudio);
        document.addEventListener('touchstart', playAudio);
        document.addEventListener('keydown', playAudio);

        return () => {
            document.removeEventListener('click', playAudio);
            document.removeEventListener('touchstart', playAudio);
            document.removeEventListener('keydown', playAudio);
        };
    }, []);

    return (
        <audio ref={audioRef} loop>
            <source src="/audio/error_theme.mp3" type="audio/mpeg" />
            <source src="/audio/error_theme.wav" type="audio/wav" />
        </audio>
    );
}
