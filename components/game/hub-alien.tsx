"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AlienShop } from "./alien-shop";
import { Info, Sparkles, Zap, Heart, Droplets, Utensils, Music } from "lucide-react";

// --- Configuration ---
const STORAGE_KEY = "hub_alien_pro_v1";
const DECAY_RATE_MS = 60000;

// Sprite Configuration (Assumed 4x4 based on standard prompts)
// Rows: 0: Idle, 1: Walk/Action, 2: Eat, 3: Happy/Special
const SPRITE_SIZE = 128; // Display size
const SHEET_ROWS = 8;
const SHEET_COLS = 8;

interface AlienStats {
    hunger: number;
    hygiene: number;
    happiness: number;
    energy: number;
    balance: number; // Currency
    items: string[]; // Inventory (equipped/owned)
    lastInteracted: number;
}

export function HubAlien() {
    // --- State ---
    const [stats, setStats] = useState<AlienStats>({
        hunger: 100,
        hygiene: 100,
        happiness: 100,
        energy: 100,
        balance: 500, // Starting money
        items: [],
        lastInteracted: Date.now(),
    });

    const [mood, setMood] = useState<"idle" | "walking" | "eating" | "happy" | "sleeping">("idle");
    const [showShop, setShowShop] = useState(false);
    const [frameIndex, setFrameIndex] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [position, setPosition] = useState(50); // Percent X
    const [floatingText, setFloatingText] = useState<{ id: number, text: string, type: 'gain' | 'loss' | 'info' }[]>([]);

    // --- Persistence ---
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Calculate elapsed time decay
                const minutesPassed = (Date.now() - parsed.lastInteracted) / 60000;
                if (minutesPassed > 1) {
                    parsed.hunger = Math.max(0, parsed.hunger - (minutesPassed * 0.5));
                    parsed.hygiene = Math.max(0, parsed.hygiene - (minutesPassed * 0.3));
                    parsed.energy = Math.max(0, parsed.energy - (minutesPassed * 0.2));
                }
                setStats(parsed);
            } catch (e) {
                console.error("Failed to load alien save", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stats, lastInteracted: Date.now() }));
    }, [stats]);


    // --- Game Loop (Decay & AI) ---
    useEffect(() => {
        const loop = setInterval(() => {
            setStats(prev => ({
                ...prev,
                hunger: Math.max(0, prev.hunger - 0.5), // Faster decay for demo
                hygiene: Math.max(0, prev.hygiene - 0.3),
                energy: prev.energy < 100 && mood === "sleeping" ? Math.min(100, prev.energy + 2) : Math.max(0, prev.energy - 0.1),
                happiness: Math.max(0, prev.happiness - 0.2)
            }));

            // Random AI Movement
            if (mood === "idle" && Math.random() > 0.8) {
                setMood("walking");
                setDirection(Math.random() > 0.5 ? "right" : "left");
                setTimeout(() => setMood("idle"), 2000);
            }
        }, 2000);
        return () => clearInterval(loop);
    }, [mood]);

    // --- Animation Loop ---
    useEffect(() => {
        const animLoop = setInterval(() => {
            // Update Frame
            setFrameIndex(prev => (prev + 1) % SHEET_COLS);

            // Update Position (if walking)
            if (mood === "walking") {
                setPosition(prev => {
                    const move = direction === "right" ? 2 : -2;
                    const newPos = prev + move;
                    if (newPos > 90) { setDirection("left"); return 90; }
                    if (newPos < 10) { setDirection("right"); return 10; }
                    return newPos;
                });
            }
        }, 200); // 5 FPS pixel art feel
        return () => clearInterval(animLoop);
    }, [mood, direction]);


    // --- Interactions ---
    const addFloatingText = (text: string, type: 'gain' | 'loss' | 'info') => {
        const id = Date.now();
        setFloatingText(prev => [...prev, { id, text, type }]);
        setTimeout(() => setFloatingText(prev => prev.filter(t => t.id !== id)), 2000);
    };

    const handleFeed = (foodItem?: any) => {
        if (stats.hunger >= 100) {
            addFloatingText("Tokum! 🤢", "info");
            return;
        }
        setMood("eating");
        setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 30), happiness: Math.min(100, prev.happiness + 5) }));
        addFloatingText("+30 Tokluk", "gain");
        setTimeout(() => setMood("idle"), 2000); // Eating animation duration
    };

    const handleWash = () => {
        setMood("happy"); // Shower uses happy anim for now
        setStats(prev => ({ ...prev, hygiene: 100 }));
        addFloatingText("Tertemiz! ✨", "gain");
        setTimeout(() => setMood("idle"), 2000);
    };

    const handleSleep = () => {
        if (mood === "sleeping") {
            setMood("idle");
            addFloatingText("Günaydın! ☀️", "info");
        } else {
            setMood("sleeping");
            addFloatingText("İyi geceler... 💤", "info");
        }
    };

    const handleBuy = (item: any) => {
        if (stats.balance >= item.price) {
            setStats(prev => ({
                ...prev,
                balance: prev.balance - item.price,
                items: [...prev.items, item.id] // Simple inventory
            }));

            if (item.category === "food") {
                handleFeed();
            } else {
                addFloatingText("Satın Alındı!", "gain");
            }
        }
    };


    // --- Render Logic ---
    const getSpriteStyle = () => {
        // Map logical mood to sprite row
        let row = 0; // Idle
        if (mood === "walking") row = 1;
        if (mood === "eating") row = 2; // Assuming row 2 is eating
        if (mood === "happy") row = 3; // Assuming row 3 is happy
        if (mood === "sleeping") row = 0; // Idle frame but maybe darkened

        // Calculate bg pos
        // background-size: 400% 400% (since 4x4)
        // x pos: frameIndex * (100 / (cols - 1)) ? No, standard css sprite steps
        // Actually simplest is percentage: 0%, 33.33%, 66.66%, 100%

        const xPct = (frameIndex / (SHEET_COLS - 1)) * 100;
        const yPct = (row / (SHEET_ROWS - 1)) * 100;

        return {
            backgroundImage: `url('/assets/alien-sprites.png')`,
            backgroundSize: `${SHEET_COLS * 100}% ${SHEET_ROWS * 100}%`,
            backgroundPosition: `${xPct}% ${yPct}%`,
            backgroundRepeat: "no-repeat",
            width: `64px`,
            height: `64px`,
            imageRendering: "pixelated" as const,
            transform: `scale(2.5) ${direction === "left" ? "scaleX(-1)" : ""}`,
        };
    };

    // Determine environmental visuals
    const isNight = mood === "sleeping";
    const bgInfo = stats.items.find(i => i.startsWith("bg_")); // Check for equipped BG

    // Default Planet: "Kepler-186f" (Purple/Red alien vibe)
    let planetGradient = "from-indigo-900 via-purple-900 to-slate-900";
    if (bgInfo === "bg_mars") planetGradient = "from-orange-900 via-red-900 to-stone-900";
    if (bgInfo === "bg_ice") planetGradient = "from-cyan-900 via-blue-900 to-slate-900";


    return (
        <div className="card-glass relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none group">

            {/* --- PLANET ENVIRONMENT --- */}
            <div className={`relative h-64 w-full transition-colors duration-1000 bg-gradient-to-b ${planetGradient}`}>

                {/* 1. Starfield (Animated) */}
                <div className="absolute inset-0 opacity-50"
                    style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', animation: 'stars-move 100s linear infinite' }}>
                </div>

                {/* 2. Celestial Body (Moon/Sun) */}
                <div className={`absolute top-4 right-8 w-16 h-16 rounded-full blur-[1px] transition-all duration-1000 ${isNight ? 'bg-yellow-100/80 shadow-[0_0_30px_rgba(255,255,200,0.5)]' : 'bg-orange-400/80 shadow-[0_0_40px_rgba(255,165,0,0.8)]'}`}></div>

                {/* 3. Landscape/Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 z-0"></div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#1a1226] border-t border-white/5 z-0 skew-x-12 scale-110 origin-bottom"></div>

                {/* 4. Weather / Particles */}
                {/* (Can add CSS rain/snow here later) */}


                {/* --- THE ALIEN --- */}
                <div
                    className="absolute bottom-12 transition-all duration-500 ease-linear z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    style={{ left: `${position}%`, transform: `translateX(-50%)` }}
                >
                    {/* Character Sprite */}
                    <div style={getSpriteStyle()} />

                    {/* Speech Bubble / Floating Text */}
                    {floatingText.map(ft => (
                        <div key={ft.id} className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold text-white border border-white/20 animate-fade-up">
                            {ft.text}
                        </div>
                    ))}

                    {/* Accessories Overlay (Simple absolute positioning) */}
                    {stats.items.includes("space_helmet") && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl opacity-90 pointer-events-none">🧑‍🚀</div>
                    )}
                    {stats.items.includes("crown") && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl rotate-12 drop-shadow-lg">👑</div>
                    )}

                    {/* Status Icons */}
                    {mood === "sleeping" && <div className="absolute -top-8 right-0 text-xl animate-pulse">💤</div>}
                    {stats.hunger < 30 && mood !== "sleeping" && <div className="absolute -top-8 -left-4 text-xl animate-bounce">🍔</div>}
                </div>

            </div>


            {/* --- HUD (Heads Up Display) --- */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                {/* Status Bars */}
                <div className="flex flex-col gap-1 w-32">
                    <StatusBar value={stats.hunger} icon={<Utensils className="w-3 h-3" />} color="bg-orange-500" />
                    <StatusBar value={stats.hygiene} icon={<Droplets className="w-3 h-3" />} color="bg-blue-500" />
                    <StatusBar value={stats.happiness} icon={<Heart className="w-3 h-3" />} color="bg-pink-500" />
                    <StatusBar value={stats.energy} icon={<Zap className="w-3 h-3" />} color="bg-yellow-500" />
                </div>

                {/* Balance & Settings */}
                <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 bg-black/40 backdrop-blur rounded-full border border-white/10 flex items-center gap-2 text-yellow-400 font-bold font-mono text-xs shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        {stats.balance}
                    </div>
                    <button className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/50 hover:text-white transition-colors">
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>


            {/* --- CONTROL PANEL --- */}
            <div className="bg-[#120f16] p-3 border-t border-white/5 z-20 relative grid grid-cols-4 gap-2">
                <GameButton
                    onClick={() => handleFeed()}
                    icon={<Utensils className="w-5 h-5" />}
                    label="Besle"
                    color="hover:bg-orange-500/20 hover:text-orange-400"
                />
                <GameButton
                    onClick={handleWash}
                    icon={<Droplets className="w-5 h-5" />}
                    label="Yıka"
                    color="hover:bg-blue-500/20 hover:text-blue-400"
                />
                <GameButton
                    onClick={handleSleep}
                    icon={mood === "sleeping" ? <Sparkles className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                    label={mood === "sleeping" ? "Uyan" : "Uyu"}
                    color="hover:bg-indigo-500/20 hover:text-indigo-400"
                />
                <GameButton
                    onClick={() => setShowShop(!showShop)}
                    icon={<Sparkles className="w-5 h-5" />}
                    label="Mağaza"
                    active={showShop}
                    color="hover:bg-purple-500/20 hover:text-purple-400"
                />
            </div>

            {showShop && (
                <AlienShop onClose={() => setShowShop(false)} onBuy={handleBuy} balance={stats.balance} />
            )}


            {/* --- CSS Globals for specific animations --- */}
            <style jsx global>{`
                @keyframes stars-move {
                    from { background-position: 0 0; }
                    to { background-position: -1000px 1000px; }
                }
                @keyframes fade-up {
                    0% { opacity: 0; transform: translate(-50%, 10px); }
                    100% { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-up { animation: fade-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
}

// --- Sub Components ---

function StatusBar({ value, icon, color }: { value: number, icon: React.ReactNode, color: string }) {
    return (
        <div className="flex items-center gap-2 group/bar">
            <div className="text-white/40">{icon}</div>
            <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div
                    className={`h-full ${color} transition-all duration-500 rounded-full shadow-[0_0_10px_currentColor]`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function GameButton({ onClick, icon, label, color, active }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center gap-1 py-3 rounded-xl
                bg-white/5 border border-white/5 transition-all duration-200
                active:scale-95 text-gray-400
                ${active ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : ''}
                ${color}
            `}
        >
            {icon}
            <span className="text-[10px] font-bold tracking-wide">{label}</span>
        </button>
    );
}
