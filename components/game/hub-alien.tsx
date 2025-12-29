"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, Pizza, Droplets, Heart, ShoppingBag, X, Star } from "lucide-react";

// --- Pixel Art Data & Renderer ---

// Palette
const C = {
    _: "transparent",
    G: "#22c55e", // Main Green
    D: "#15803d", // Dark Green (Shadow)
    L: "#4ade80", // Light Green (Highlight)
    B: "#000000", // Black (Eyes/Outline)
    W: "#ffffff", // White (Eye Shine)
    P: "#f472b6", // Pink (Cheeks/Mouth)
    R: "#ef4444", // Red (Mouth inside)
};

// 16x16 Grids
const FRAMES = {
    idle1: [
        "________________",
        "________________",
        "_____GGG________",
        "____GLLLG_______",
        "___GLGGLG_______",
        "__GLLLLLLG______",
        "__GLBLLLBGG_____",
        "__GLBLLLBGG_____",
        "__GLLLLLLLG_____",
        "__GLLP_P LLG____",
        "___GLLLLLG______",
        "____DDDDD_______",
        "_____DDD________",
        "____D_D_D_______",
        "____D___D_______",
        "________________",
    ],
    idle2: [ // Blinking / Bobbing
        "________________",
        "________________",
        "________________",
        "_____GGG________",
        "____GLLLG_______",
        "___GLGGLG_______",
        "__GLLLLLLG______",
        "__GLBLLLBGG_____", // Eyes open
        "__GLLLLLLLG_____",
        "__GLLP_P LLG____",
        "___GLLLLLG______",
        "____DDDDD_______",
        "_____DDD________",
        "____D___D_______",
        "___D_____D______", // Feet wider (squat)
        "________________",
    ],
    blink: [
        "________________",
        "________________",
        "_____GGG________",
        "____GLLLG_______",
        "___GLGGLG_______",
        "__GLLLLLLG______",
        "__GLLLLLLGG_____", // Eyes closed (green line)
        "__GLLLLLLGG_____",
        "__GLLLLLLLG_____",
        "__GLLP_PLLG_____",
        "___GLLLLLG______",
        "____DDDDD_______",
        "_____DDD________",
        "____D_D_D_______",
        "____D___D_______",
        "________________",
    ],
    eat1: [ // Mouth open
        "________________",
        "________________",
        "_____GGG________",
        "____GLLLG_______",
        "___GLGGLG_______",
        "__GLLLLLLG______",
        "__GLBLLLBGG_____",
        "__GLLLLLLLG_____",
        "__GLLRRRLLG_____", // Mouth open
        "__GLLRRRLLG_____",
        "___GLLLLLG______",
        "____DDDDD_______",
        "_____DDD________",
        "____D___D_______",
        "____D___D_______",
        "________________",
    ],
    eat2: [ // Chewing
        "________________",
        "________________",
        "_____GGG________",
        "____GLLLG_______",
        "___GLGGLG_______",
        "__GLLLLLLG______",
        "__GL>LL<BGG_____", // squint? no just normal
        "__GLBLLLBGG_____",
        "__GLLLLLLLG_____",
        "__GLLRRRLLG_____", // Chewing
        "___GLLLLLG______",
        "____DDDDD_______",
        "_____DDD________",
        "____D_D_D_______",
        "____D___D_______",
        "________________",
    ],
    happy1: [ // Hands up
        "________________",
        "________________",
        "_____GGG________",
        "____GLLLG_______",
        "G__GLGGLG__G____",
        "LG_GLLLLLLG_GL___", // Hands up
        "_LGGLBLLLBGG_L___",
        "__GLLLLLLLG_____",
        "__GLLRPPRLLG____", // Big smile
        "__GLLPP PLLG____",
        "___GLLLLLG______",
        "____DDDDD_______",
        "_____DDD________",
        "____D___D_______",
        "____D___D_______",
        "________________",
    ]
};

// ... Wait, mapping characters to colors manually is tedious and error prone if pasted as string array.
// Let's use a cleaner helper.

const PixelSprite = ({ frame, scale = 4 }: { frame: string[], scale?: number }) => {
    const pixelSize = scale;
    const size = 16 * pixelSize;

    return (
        <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
            {frame.map((row, y) =>
                row.split("").map((char, x) => {
                    if (char === "_") return null;
                    const color = C[char as keyof typeof C] || "transparent";
                    return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />;
                })
            )}
        </svg>
    );
};


// --- Main Component ---

interface AlienStats {
    hunger: number;
    hygiene: number;
    happiness: number;
    lastInteracted: number;
}

const STORAGE_KEY = "hub_alien_v3"; // Version bump
const DECAY_RATE_MS = 60000;

export function HubAlien() {
    const [stats, setStats] = useState<AlienStats>({
        hunger: 100,
        hygiene: 100,
        happiness: 100,
        lastInteracted: Date.now(),
    });

    const [mood, setMood] = useState<"idle" | "eating" | "cleaning" | "happy">("idle");
    const [showShop, setShowShop] = useState(false);
    const [frameIndex, setFrameIndex] = useState(0);
    const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

    // Load/Save Stats (Same as before)
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const now = Date.now();
                const elapsed = now - parsed.lastInteracted;
                const decayTicks = Math.floor(elapsed / DECAY_RATE_MS);
                if (decayTicks > 0) {
                    parsed.hunger = Math.max(0, parsed.hunger - (decayTicks * 2));
                    parsed.hygiene = Math.max(0, parsed.hygiene - (decayTicks * 1.5));
                    parsed.happiness = Math.max(0, parsed.happiness - (decayTicks * 1));
                }
                setStats(parsed);
            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stats, lastInteracted: Date.now() }));
    }, [stats]);

    useEffect(() => {
        const decay = setInterval(() => {
            setStats(prev => ({
                ...prev,
                hunger: Math.max(0, prev.hunger - 1),
                hygiene: Math.max(0, prev.hygiene - 0.5),
                happiness: Math.max(0, prev.happiness - 0.5)
            }));
        }, DECAY_RATE_MS);
        return () => clearInterval(decay);
    }, []);

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % 4); // 4 beat cycle
        }, 250);
        return () => clearInterval(interval);
    }, []);


    // Interaction Handlers
    const triggerAnimation = useCallback((emoji: string) => {
        setFloatingEmoji(emoji);
        setTimeout(() => setFloatingEmoji(null), 1000);
    }, []);

    const handleFeed = () => {
        if (stats.hunger >= 100) return;
        setMood("eating");
        triggerAnimation("🍕");
        setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 25), happiness: Math.min(100, prev.happiness + 5) }));
        setTimeout(() => setMood("idle"), 2000);
    };

    const handleClean = () => {
        if (stats.hygiene >= 100) return;
        setMood("cleaning");
        triggerAnimation("🫧");
        setStats(prev => ({ ...prev, hygiene: 100, happiness: Math.min(100, prev.happiness + 10) }));
        setTimeout(() => setMood("idle"), 2000);
    };

    const handlePet = () => {
        setMood("happy");
        triggerAnimation("💖");
        setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 15) }));
        setTimeout(() => setMood("idle"), 1500);
    };


    // Determine Current Frame
    const getCurrentFrame = () => {
        // Idle Cycle: Idle1 -> Idle1 -> Idle2 (Bob) -> Idle2
        // Blink occasionally

        let frameData = FRAMES.idle1;

        if (mood === "eating") {
            frameData = frameIndex % 2 === 0 ? FRAMES.eat1 : FRAMES.eat2;
        } else if (mood === "happy") {
            frameData = frameIndex % 2 === 0 ? FRAMES.happy1 : FRAMES.idle1;
        } else if (mood === "cleaning") {
            frameData = frameIndex % 2 === 0 ? FRAMES.idle2 : FRAMES.idle1; // Just bob logic for now, cleaning is effect
        } else {
            // Idle logic
            if (frameIndex === 3 && Math.random() > 0.7) return FRAMES.blink; // Random blink
            frameData = frameIndex < 2 ? FRAMES.idle1 : FRAMES.idle2;
        }

        return frameData;
    };

    // Low stats overrides
    const isSick = stats.hunger < 20 || stats.hygiene < 20;

    return (
        <div className="relative w-full font-sans select-none">
            {/* Main Container - Retro Game Boy Style ish */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-gray-700 shadow-2xl overflow-hidden ring-4 ring-black/20">

                {/* Screen Area */}
                <div className="relative h-48 bg-[#2d1b2e] flex items-center justify-center overflow-hidden border-b-4 border-gray-700">

                    {/* Background Pattern (Stars) */}
                    <div className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>


                    {/* Status Icons Floating */}
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                        {stats.hunger < 30 && <span className="animate-bounce">🍔</span>}
                        {stats.hygiene < 30 && <span className="animate-pulse">💩</span>}
                    </div>

                    {/* Floating Emoji */}
                    {floatingEmoji && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-2xl animate-bounce z-30">
                            {floatingEmoji}
                        </div>
                    )}

                    {/* The ALIEN (SVG) */}
                    <div
                        onClick={handlePet}
                        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 z-10 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    >
                        <PixelSprite frame={getCurrentFrame()} scale={8} />
                    </div>
                </div>

                {/* Control Panel */}
                <div className="p-4 bg-gray-800">

                    {/* Retro Stat Bars */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <RetroBar label="HP" value={stats.hunger} color="bg-green-500" />
                        <RetroBar label="HYG" value={stats.hygiene} color="bg-blue-400" />
                        <RetroBar label="FUN" value={stats.happiness} color="bg-pink-500" />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center gap-2">
                        <RetroButton onClick={handleFeed} icon={<Pizza className="w-4 h-4" />} label="FEED" />
                        <RetroButton onClick={handleClean} icon={<Droplets className="w-4 h-4" />} label="WASH" />
                        <RetroButton onClick={() => setShowShop(!showShop)} icon={<ShoppingBag className="w-4 h-4" />} label="SHOP" active={showShop} />
                    </div>
                </div>

                {/* Shop Overlay */}
                {showShop && (
                    <div className="absolute inset-0 bg-black/90 p-4 z-40 flex flex-col items-center justify-center text-green-400 font-mono">
                        <div className="text-xl mb-4 blink">GM SHOP</div>
                        <div className="text-sm text-center mb-6">OUT OF STOCK</div>
                        <button onClick={() => setShowShop(false)} className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black">
                            CLOSE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RetroBar({ label, value, color }: { label: string, value: number, color: string }) {
    // Pixelated bar
    const segments = 10;
    const filled = Math.ceil((value / 100) * segments);

    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">{label}</span>
            <div className="flex gap-[2px]">
                {[...Array(segments)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 flex-1 rounded-[1px] ${i < filled ? color : 'bg-gray-700'}`}
                    />
                ))}
            </div>
        </div>
    );
}

function RetroButton({ onClick, icon, label, active }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex-1 py-3 flex flex-col items-center justify-center gap-1
                bg-gray-700 border-b-4 border-gray-900 rounded active:border-b-0 active:translate-y-1
                hover:bg-gray-600 transition-colors
                ${active ? 'bg-gray-600 border-b-0 translate-y-1' : ''}
            `}
        >
            <div className="text-gray-300">{icon}</div>
            <span className="text-[10px] font-bold text-gray-300 tracking-widest">{label}</span>
        </button>
    )
}
