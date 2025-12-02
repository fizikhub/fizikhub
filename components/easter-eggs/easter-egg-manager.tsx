"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cat, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export function EasterEggManager() {
    // State for Midnight Schrödinger
    const [showSchrodinger, setShowSchrodinger] = useState(false);
    const [catState, setCatState] = useState<"alive" | "dead" | null>(null);

    // State for Einstein Mode
    const [isEinsteinMode, setIsEinsteinMode] = useState(false);

    // Refs for Scroll Speed
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(0);
    const scrollSpeedTimeout = useRef<NodeJS.Timeout>(null);

    // Refs for Pull Down
    const touchStartY = useRef(0);
    const pullThreshold = 300; // pixels

    // Refs for Shake
    const lastX = useRef(0);
    const lastY = useRef(0);
    const lastZ = useRef(0);
    const lastShakeTime = useRef(0);

    useEffect(() => {
        // --- 1. Midnight Schrödinger Check ---
        const checkTime = () => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0 && !sessionStorage.getItem("schrodinger_shown")) {
                setShowSchrodinger(true);
                sessionStorage.setItem("schrodinger_shown", "true");
            }
        };

        // Check every minute
        const timeInterval = setInterval(checkTime, 60000);
        checkTime(); // Initial check

        // --- 2. Scroll Speed (Relativistic Blur) ---
        const handleScroll = () => {
            const now = Date.now();
            const currentScrollY = window.scrollY;
            const timeDiff = now - lastScrollTime.current;

            if (timeDiff > 50) { // Check every 50ms
                const distance = Math.abs(currentScrollY - lastScrollY.current);
                const speed = distance / timeDiff; // pixels per ms

                if (speed > 4) { // Threshold for "Light Speed"
                    document.body.style.filter = "blur(4px) hue-rotate(90deg)";
                    document.body.style.transition = "filter 0.1s";

                    if (!document.getElementById("light-speed-warning")) {
                        const warning = document.createElement("div");
                        warning.id = "light-speed-warning";
                        warning.innerText = "⚠️ IŞIK HIZINA YAKLAŞIYORSUNUZ! ⚠️";
                        warning.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-full font-bold z-[100] animate-pulse shadow-[0_0_50px_rgba(255,0,0,0.8)] pointer-events-none";
                        document.body.appendChild(warning);
                    }

                    if (scrollSpeedTimeout.current) clearTimeout(scrollSpeedTimeout.current);
                    scrollSpeedTimeout.current = setTimeout(() => {
                        document.body.style.filter = "";
                        const warning = document.getElementById("light-speed-warning");
                        if (warning) warning.remove();
                    }, 200);
                }

                lastScrollY.current = currentScrollY;
                lastScrollTime.current = now;
            }
        };
        window.addEventListener("scroll", handleScroll);

        // --- 3. Pull Down (Time Machine) ---
        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                touchStartY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (window.scrollY === 0 && touchStartY.current > 0) {
                const touchY = e.touches[0].clientY;
                const pullDistance = touchY - touchStartY.current;

                if (pullDistance > pullThreshold) {
                    // Trigger Time Machine
                    toast("🕰️ Zaman Makinesi Çalıştırılıyor...", {
                        description: "Geçmişe gidiliyor: 1905 (Annus Mirabilis)",
                        duration: 3000,
                    });

                    // Sepia effect for "old time" feel
                    document.documentElement.style.filter = "sepia(1) contrast(1.2)";
                    setTimeout(() => {
                        document.documentElement.style.filter = "";
                        toast.success("Günümüze dönüldü!");
                    }, 5000);

                    touchStartY.current = 0; // Reset
                }
            }
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);

        // --- 4. Shake Event (Quantum Fluctuation) ---
        const handleMotion = (e: DeviceMotionEvent) => {
            if (!e.accelerationIncludingGravity) return;

            const { x, y, z } = e.accelerationIncludingGravity;
            if (!x || !y || !z) return;

            const now = Date.now();
            if (now - lastShakeTime.current > 100) {
                const diff = Math.abs(x - lastX.current + y - lastY.current + z - lastZ.current);

                if (diff > 25) { // Shake threshold
                    toast("⚛️ Kuantum Dalgalanması Tespit Edildi!", {
                        icon: "🌊",
                        style: {
                            background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                            color: "white",
                            border: "none"
                        }
                    });

                    // Randomly displace elements slightly
                    const elements = document.querySelectorAll("div, p, h1, h2, button");
                    elements.forEach((el) => {
                        if (Math.random() > 0.8) {
                            const htmlEl = el as HTMLElement;
                            htmlEl.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                            setTimeout(() => {
                                htmlEl.style.transform = "";
                            }, 500);
                        }
                    });

                    lastShakeTime.current = now;
                }

                lastX.current = x;
                lastY.current = y;
                lastZ.current = z;
            }
        };

        if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
            window.addEventListener("devicemotion", handleMotion);
        }

        // --- 5. Listen for Einstein Mode Event ---
        const handleEinstein = () => {
            setIsEinsteinMode(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => setIsEinsteinMode(false), 5000); // Lasts 5 seconds
        };
        window.addEventListener("einstein-mode-trigger", handleEinstein);

        return () => {
            clearInterval(timeInterval);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("devicemotion", handleMotion);
            window.removeEventListener("einstein-mode-trigger", handleEinstein);
        };
    }, []);

    const handleCatChoice = (choice: "alive" | "dead") => {
        setCatState(choice);
        setTimeout(() => {
            setShowSchrodinger(false);
            setCatState(null);
            if (choice === "alive") {
                toast.success("Kedi yaşıyor! 😺");
            } else {
                toast("Kedi ne yazık ki... 👻", { icon: "⚰️" });
            }
        }, 1000);
    };

    return (
        <>
            {/* Midnight Schrödinger Dialog */}
            <Dialog open={showSchrodinger} onOpenChange={setShowSchrodinger}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Ghost className="h-6 w-6" />
                            Gece Yarısı Paradoksu
                        </DialogTitle>
                        <DialogDescription>
                            Saat 00:00. Kutuyu açtın. Schrödinger'in kedisi ne durumda?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center gap-4 py-4">
                        <Button
                            variant={catState === "alive" ? "default" : "outline"}
                            onClick={() => handleCatChoice("alive")}
                            className="w-32 h-32 flex flex-col gap-2 text-xl"
                        >
                            <Cat className="h-12 w-12" />
                            Canlı
                        </Button>
                        <Button
                            variant={catState === "dead" ? "destructive" : "outline"}
                            onClick={() => handleCatChoice("dead")}
                            className="w-32 h-32 flex flex-col gap-2 text-xl"
                        >
                            <Ghost className="h-12 w-12" />
                            Ölü
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Einstein Mode Overlay */}
            {isEinsteinMode && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center animate-in fade-in zoom-in duration-300">
                    <div className="relative">
                        {/* Simple CSS Art for Einstein Hair/Mustache */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-white/10 backdrop-blur-[2px]" />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/800px-Albert_Einstein_Head.jpg"
                            alt="Einstein"
                            className="w-96 h-auto rounded-full border-8 border-white shadow-2xl animate-bounce"
                        />
                        <h1 className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] whitespace-nowrap">
                            E = mc²
                        </h1>
                    </div>
                </div>
            )}
        </>
    );
}
