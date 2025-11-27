"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useKonamiCode } from "@/hooks/use-konami-code";

export function EasterEggManager() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [formulas, setFormulas] = useState<Array<{ id: number; x: number; y: number; formula: string; rotation: number }>>([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useKonamiCode(() => {
        // Activate konami code Easter egg
        setShowConfetti(true);

        // Create formula rain
        const physicsFormulas = [
            "E = mc²",
            "F = ma",
            "∫ v dt",
            "∑ F = 0",
            "ΔS ≥ 0",
            "∂²ψ/∂t²",
            "∇ × B",
            "ℏω",
            "PV = nRT",
            "λ = h/p",
        ];

        const newFormulas = Array.from({ length: 30 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * window.innerWidth,
            y: -50,
            formula: physicsFormulas[Math.floor(Math.random() * physicsFormulas.length)],
            rotation: Math.random() * 360,
        }));

        setFormulas(newFormulas);

        // Clear after animation
        setTimeout(() => {
            setShowConfetti(false);
            setFormulas([]);
        }, 5000);
    });

    return (
        <>
            {showConfetti && windowSize.width > 0 && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            {formulas.map((formula) => (
                <div
                    key={formula.id}
                    className="fixed text-2xl font-bold text-primary z-50 pointer-events-none animate-formula-fall"
                    style={{
                        left: formula.x,
                        top: formula.y,
                        transform: `rotate(${formula.rotation}deg)`,
                        animation: "formulaFall 5s linear forwards",
                    }}
                >
                    {formula.formula}
                </div>
            ))}

            <style jsx>{`
                @keyframes formulaFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
}
