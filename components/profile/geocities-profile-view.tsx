"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";

interface GeoCitiesProfileViewProps {
    profile: any;
    articles: any[];
    questions: any[];
    userBadges: any[];
    stats: {
        followersCount: number;
        followingCount: number;
        articlesCount: number;
        questionsCount: number;
    };
}

// Physics Paradoxes for Newton Apple Easter Egg
const PHYSICS_PARADOXES = [
    "🕰️ Eğer zamanda geriye gidersen ve Einstein'ı tanıştırmayı engelersen... görelilik kim icat eder?",
    "🐱 Schrödinger'in kedisi hem ölü hem diri... ta ki veteriner faturasını görene kadar!",
    "🚀 Işık hızında gidersen, aynaya baksan kendini görür müsün?",
    "🌌 Evren genişliyorsa, neyin içine genişliyor?",
    "⚛️ Elektron hem dalga hem parçacık... yani aslında kimlik krizi yaşıyor!",
    "🔮 Heisenberg bir polis tarafından durduruldu. 'Hızınızı biliyor musunuz?' - 'Hayır ama nerede olduğumu biliyorum!'",
    "🌀 Kara deliğe düşersen, spagetifiye olursun. İtalyan mutfağı bunu onaylar!",
    "🎭 Gözlemci etkisi: Parçacıklar izlenince farklı davranır. Sanki tiyatro yapıyorlar!",
    "⏱️ İkiz paradoksu: Uzaya giden ikiz genç kalır. Yani uzay aslında spa salonu!",
    "🐈‍⬛ Kuantum dolanıklık: İki parçacık birbirini hisseder. Evrenin dedikodu ağı!"
];

// Retro Assets - Authentic GeoCities-era GIFs from web archives
const RETRO_ASSETS = {
    // Backgrounds
    STARS_BG: "/retro/stars.svg",
    CHALKBOARD_BG: "/retro/stars.svg",

    // Classic GeoCities GIFs - Fire & Explosions
    FIRE: "https://web.archive.org/web/20091027065851im_/http://www.geocities.com/EnchantedForest/Dell/3043/Flames.gif",
    FIRE_BAR: "https://web.archive.org/web/20090828100629im_/http://geocities.com/Area51/Station/5765/firebar.gif",
    EXPLOSION: "https://web.archive.org/web/20090829014355im_/http://geocities.com/Area51/2548/explode.gif",

    // Aliens & Space
    ALIEN: "https://web.archive.org/web/20091027070942im_/http://geocities.com/Area51/alien.gif",
    ALIEN_DANCE: "https://web.archive.org/web/20090829072851im_/http://geocities.com/Area51/Shadowlands/6583/alien.gif",
    UFO: "https://web.archive.org/web/20090829044754im_/http://geocities.com/Area51/Stargate/2135/ufo.gif",
    PLANET: "https://web.archive.org/web/20090829002131im_/http://geocities.com/Area51/8385/planet.gif",
    ROCKET: "https://web.archive.org/web/20091027042741im_/http://geocities.com/CapeCanaveral/Lab/1832/rocket.gif",

    // Science & Physics
    ATOM: "https://web.archive.org/web/20091027074458im_/http://geocities.com/CapeCanaveral/Hall/9111/atom.gif",
    SPINNING_ATOM: "https://web.archive.org/web/20091027074458im_/http://geocities.com/CapeCanaveral/Hall/9111/atom.gif",
    EARTH: "https://web.archive.org/web/20090829161028im_/http://geocities.com/Area51/Vault/9620/earth.gif",

    // Construction & Signs
    UNDER_CONSTRUCTION: "https://web.archive.org/web/20091027050134im_/http://geocities.com/SiliconValley/Haven/8614/underconstruction.gif",
    CONSTRUCTION: "https://web.archive.org/web/20090831095302im_/http://geocities.com/EnchantedForest/1139/worker08.gif",
    NEW_SIGN: "https://web.archive.org/web/20091027081651im_/http://geocities.com/SiliconValley/Heights/1272/new.gif",

    // Fun Characters
    DANCING_BABY: "https://web.archive.org/web/20090830092151im_/http://geocities.com/Hollywood/1096/baby2.gif",
    DANCING_EINSTEIN: "https://i.gifer.com/7NvC.gif",
    SKULL: "https://web.archive.org/web/20090829171534im_/http://geocities.com/Area51/Dimension/7246/skull.gif",

    // Email & Communication
    MAIL: "https://web.archive.org/web/20090829072048im_/http://geocities.com/EnchantedForest/Cottage/4157/mailbox.gif",

    // Misc
    VISITOR_COUNTER: "/retro/visitor-counter.svg",
    NEWTON_APPLE: "/retro/newton-apple.svg",
};


export function GeoCitiesProfileView({ profile, articles, questions, userBadges, stats }: GeoCitiesProfileViewProps) {
    const [blink, setBlink] = useState(true);
    const [zeroGravity, setZeroGravity] = useState(false);
    const [currentParadox, setCurrentParadox] = useState<string | null>(null);
    const [quantumMode, setQuantumMode] = useState(false);
    const [easterEggTaps, setEasterEggTaps] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Blinking effect
    useEffect(() => {
        const blinkInterval = setInterval(() => setBlink(b => !b), 500);
        return () => clearInterval(blinkInterval);
    }, []);

    // Reset easter egg taps after timeout
    useEffect(() => {
        if (easterEggTaps > 0 && easterEggTaps < 3) {
            const timeout = setTimeout(() => setEasterEggTaps(0), 2000);
            return () => clearTimeout(timeout);
        }
    }, [easterEggTaps]);

    // Initialize AudioContext
    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    // 8-bit sound generator
    const playSound = useCallback((type: 'bip' | 'boop' | 'quantum' | 'gravity') => {
        if (!soundEnabled) return;

        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            switch (type) {
                case 'bip':
                    oscillator.frequency.value = 800;
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;
                case 'boop':
                    oscillator.frequency.value = 400;
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.15);
                    break;
                case 'quantum':
                    oscillator.frequency.value = 200;
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.5);
                    break;
                case 'gravity':
                    oscillator.frequency.value = 1000;
                    oscillator.type = 'sine';
                    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1);
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 1);
                    break;
            }
        } catch (e) {
            console.log('Audio not available');
        }
    }, [soundEnabled, getAudioContext]);

    // Newton Apple Click Handler
    const handleAppleClick = () => {
        playSound('boop');
        const randomParadox = PHYSICS_PARADOXES[Math.floor(Math.random() * PHYSICS_PARADOXES.length)];
        setCurrentParadox(randomParadox);
        setTimeout(() => setCurrentParadox(null), 5000);
    };

    // Zero Gravity Toggle
    const handleZeroGravity = () => {
        playSound('gravity');
        setZeroGravity(!zeroGravity);
    };

    // Quantum Tunneling Easter Egg
    const handleEasterEggTap = () => {
        playSound('bip');
        const newTaps = easterEggTaps + 1;
        setEasterEggTaps(newTaps);

        if (newTaps >= 3) {
            playSound('quantum');
            setQuantumMode(!quantumMode);
            setEasterEggTaps(0);
        }
    };

    return (
        <div
            className={`
                font-mono min-h-screen relative overflow-x-hidden 
                selection:bg-[#ff00ff] selection:text-white
                transition-all duration-500
                ${quantumMode ? 'invert hue-rotate-180' : ''}
            `}
            style={{
                fontFamily: "'Comic Sans MS', 'Comic Sans', cursive, system-ui",
                backgroundColor: '#000'
            }}
        >
            {/* Tiled Chalkboard Background */}
            <div
                className="fixed inset-0 z-0 opacity-70 pointer-events-none"
                style={{
                    backgroundImage: `url("${RETRO_ASSETS.CHALKBOARD_BG}")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '150px'
                }}
            />

            {/* Stars overlay */}
            <div
                className="fixed inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `url("${RETRO_ASSETS.STARS_BG}")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px'
                }}
            />

            {/* Easter Egg Invisible Pixel - Top Right Corner */}
            <button
                onClick={handleEasterEggTap}
                className="fixed top-4 right-4 w-4 h-4 z-50 opacity-0 hover:opacity-10 cursor-default"
                aria-label="Hidden Easter Egg"
                title={easterEggTaps > 0 ? `${3 - easterEggTaps} more...` : ''}
            />

            {/* CHAOS LAYER - Floating Elements */}
            <div className={`absolute inset-0 z-[1] pointer-events-none overflow-hidden ${zeroGravity ? 'animate-zero-gravity' : ''}`}>
                {/* Desktop Chaos */}
                <img
                    src={RETRO_ASSETS.SPINNING_ATOM}
                    className={`absolute top-[10%] left-[5%] w-16 md:w-20 ${zeroGravity ? 'animate-float-1' : 'animate-bounce'}`}
                    alt="atom"
                />
                <img
                    src={RETRO_ASSETS.DANCING_EINSTEIN}
                    className={`absolute top-[60%] right-[5%] w-20 md:w-24 ${zeroGravity ? 'animate-float-2' : ''}`}
                    alt="einstein"
                />
                <img
                    src={RETRO_ASSETS.UFO}
                    className={`absolute top-[20%] right-[20%] w-16 md:w-24 ${zeroGravity ? 'animate-float-3' : 'animate-hover'}`}
                    alt="ufo"
                />
                <img
                    src={RETRO_ASSETS.ROCKET}
                    className={`absolute bottom-[20%] left-[8%] w-12 md:w-16 ${zeroGravity ? 'animate-float-4' : ''}`}
                    alt="rocket"
                />
                <img
                    src={RETRO_ASSETS.ALIEN}
                    className={`absolute top-[40%] left-[3%] w-12 opacity-70 ${zeroGravity ? 'animate-float-5' : 'animate-pulse'}`}
                    alt="alien"
                />
                <img
                    src={RETRO_ASSETS.EARTH}
                    className={`absolute top-[5%] left-[50%] -translate-x-1/2 w-12 md:w-16 ${zeroGravity ? 'animate-float-6' : 'animate-spin-very-slow'}`}
                    alt="earth"
                />

                {/* Under Construction Signs */}
                <img
                    src={RETRO_ASSETS.UNDER_CONSTRUCTION}
                    className={`absolute bottom-[30%] right-[3%] w-32 md:w-40 opacity-90 ${zeroGravity ? 'animate-float-7' : ''}`}
                    alt="yapim asamasinda"
                />

                {/* Fire at bottom */}
                <img
                    src={RETRO_ASSETS.FIRE}
                    className={`absolute bottom-0 w-full opacity-30 h-24 md:h-32 object-cover ${zeroGravity ? 'opacity-0' : ''}`}
                    alt="fire"
                    style={{ transform: 'scaleY(1.5)' }}
                />

                {/* Mobile-specific elements */}
                <img
                    src={RETRO_ASSETS.SPINNING_ATOM}
                    className={`absolute bottom-[60%] right-[10%] w-10 md:hidden ${zeroGravity ? 'animate-float-1' : ''}`}
                    alt="atom-m"
                />
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto p-2 md:p-4 max-w-5xl">

                {/* Header Marquee */}
                <div className="mb-6 border-4 border-b-black border-r-black border-t-white border-l-white bg-[#000080] text-white p-1 shadow-[6px_6px_0px_0px_#000]">
                    {React.createElement('marquee', { scrollamount: "10" },
                        <span className="text-yellow-300 text-lg md:text-xl font-bold tracking-widest uppercase">
                            🚀 UYARI: @{profile.username?.toUpperCase() || 'USER'} KAOSUNA GİRİŞ YAPTINIZ 🛸 ///
                            FİZİK HUB'DA HER ŞEY GÖRELİDİR ///
                            E=mc² (Eğlence = Müthiş × Çılgınlık²) 🌌
                        </span>
                    )}
                </div>

                {/* Paradox Alert Modal */}
                {currentParadox && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setCurrentParadox(null)}>
                        <div className="bg-[#000080] border-4 border-t-white border-l-white border-b-gray-600 border-r-gray-600 p-6 max-w-md shadow-[8px_8px_0px_0px_#000] animate-scale-in">
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-3 py-1 font-bold mb-4 flex justify-between items-center -mx-6 -mt-6 px-6 pt-2">
                                <span>⚛️ FİZİK PARADOKSU ⚛️</span>
                                <button className="text-white hover:text-red-300" onClick={() => setCurrentParadox(null)}>X</button>
                            </div>
                            <p className="text-[#00ff00] text-lg md:text-xl font-bold leading-relaxed" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
                                {currentParadox}
                            </p>
                        </div>
                    </div>
                )}

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 md:gap-6">

                    {/* Left Column - Profile Card */}
                    <div className="flex flex-col gap-4 items-center lg:items-start bg-black/80 p-4 border-4 border-double border-[#00ff00] backdrop-blur-sm relative">

                        {/* Visitor Counter */}
                        <div className="w-full flex justify-center mb-2">
                            <img src={RETRO_ASSETS.VISITOR_COUNTER} alt="visitor counter" className="w-32" />
                        </div>

                        {/* Avatar */}
                        <div className="w-full relative group text-center">
                            <div className="inline-block relative border-4 border-[#ff00ff] p-1 bg-gradient-to-br from-[#ff00ff] to-[#00ff00] shadow-[4px_4px_0px_0px_#fff]">
                                <img
                                    src={profile.avatar_url || "/default-avatar.png"}
                                    alt="Avatar"
                                    className="w-40 h-40 md:w-48 md:h-48 object-cover border-2 border-black"
                                />
                                <div className="absolute -bottom-3 -right-3 z-20">
                                    <img src={RETRO_ASSETS.FIRE} className="h-10 w-20" alt="fire" />
                                </div>
                            </div>

                            <div
                                className={`mt-3 text-[#00ff00] font-bold bg-black px-3 py-1 inline-block border-2 border-[#00ff00] ${blink ? 'opacity-100' : 'opacity-50'}`}
                                style={{ fontFamily: "'Courier New', monospace" }}
                            >
                                █ ÇEVRİMİÇİ █
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full grid grid-cols-2 gap-2">
                            <button
                                onClick={handleZeroGravity}
                                onMouseEnter={() => playSound('bip')}
                                className={`
                                    bg-[#ff00ff] border-4 border-t-white border-l-white border-b-black border-r-black 
                                    text-white font-black py-3 text-sm uppercase
                                    hover:bg-[#ff66ff] active:border-t-black active:border-l-black active:border-b-white active:border-r-white
                                    shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1
                                    transition-all flex flex-col items-center gap-1
                                `}
                            >
                                <span className="text-lg">🚀</span>
                                <span className="text-xs">{zeroGravity ? 'YERÇEKİMİ AÇ' : 'SIFIR YERÇEKİMİ'}</span>
                            </button>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                onMouseEnter={() => playSound('bip')}
                                className={`
                                    bg-[#00ff00] border-4 border-t-white border-l-white border-b-black border-r-black 
                                    text-black font-black py-3 text-sm uppercase
                                    hover:bg-[#66ff66] active:border-t-black active:border-l-black active:border-b-white active:border-r-white
                                    shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1
                                    transition-all flex flex-col items-center gap-1
                                `}
                            >
                                <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
                                <span className="text-xs">{soundEnabled ? 'SES AÇIK' : 'SES KAPALI'}</span>
                            </button>
                        </div>

                        {/* Newton Apple Easter Egg */}
                        <button
                            onClick={handleAppleClick}
                            className="w-full py-4 bg-gradient-to-b from-gray-700 to-gray-900 border-4 border-t-gray-500 border-l-gray-500 border-b-black border-r-black hover:from-gray-600 hover:to-gray-800 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img
                                    src={RETRO_ASSETS.NEWTON_APPLE}
                                    alt="newton apple"
                                    className="w-16 h-20 group-hover:animate-bounce"
                                />
                                <div className="text-left">
                                    <div className="text-[#ff00ff] font-bold text-sm">🍎 ELMAYA TIKLA</div>
                                    <div className="text-[#00ff00] text-xs">Fizik paradoksu keşfet!</div>
                                </div>
                            </div>
                        </button>

                        {/* Stats Table - Windows 95 Style */}
                        <div className="w-full border-4 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0] shadow-md">
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-1 font-bold text-sm flex justify-between items-center">
                                <span>📊 STATS.EXE</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 bg-gray-400 border border-white text-[8px] flex items-center justify-center">_</div>
                                    <div className="w-3 h-3 bg-gray-400 border border-white text-[8px] flex items-center justify-center">□</div>
                                    <div className="w-3 h-3 bg-red-600 border border-white text-[8px] flex items-center justify-center">X</div>
                                </div>
                            </div>
                            <table className="w-full text-left font-mono text-sm bg-white border border-gray-500">
                                <tbody className="text-black">
                                    <tr className="border-b border-gray-300">
                                        <td className="py-2 px-3 border-r border-gray-300 font-bold bg-gray-100">👥 Takipçi</td>
                                        <td className="py-2 px-3 text-[#ff00ff] font-bold">{stats.followersCount}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="py-2 px-3 border-r border-gray-300 font-bold bg-gray-100">👤 Takip</td>
                                        <td className="py-2 px-3">{stats.followingCount}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="py-2 px-3 border-r border-gray-300 font-bold bg-gray-100">📝 Yazı</td>
                                        <td className="py-2 px-3">{stats.articlesCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-3 border-r border-gray-300 font-bold bg-gray-100">❓ Soru</td>
                                        <td className="py-2 px-3">{stats.questionsCount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Badges */}
                        {userBadges.length > 0 && (
                            <div className="w-full border-4 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0] shadow-md">
                                <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white px-2 py-1 font-bold text-sm">
                                    🏆 BADGES.DLL
                                </div>
                                <div className="bg-white border border-gray-500 p-2 flex flex-wrap gap-2 min-h-[50px]">
                                    {userBadges.map((ub: any, i: number) => (
                                        <div key={i} className="w-8 h-8 hover:scale-125 transition-transform cursor-help" title={ub.badges?.name}>
                                            <CustomBadgeIcon name={ub.badges?.name || 'default'} className="w-full h-full text-black" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Bio & Content */}
                    <div className="relative space-y-4">

                        {/* Bio Window - Winamp Style */}
                        <div className="bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-black border-r-black shadow-[8px_8px_0px_0px_#000]">
                            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87] text-white px-3 py-1 font-bold flex justify-between items-center">
                                <span>🎵 WINAMP - {profile.username || 'user'}.mp3</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 bg-gray-400 border border-white text-[10px] flex items-center justify-center cursor-pointer hover:bg-gray-300">_</div>
                                    <div className="w-4 h-4 bg-gray-400 border border-white text-[10px] flex items-center justify-center cursor-pointer hover:bg-gray-300">□</div>
                                    <div className="w-4 h-4 bg-red-600 border border-white text-[10px] flex items-center justify-center cursor-pointer hover:bg-red-500">X</div>
                                </div>
                            </div>

                            <div className="bg-black text-[#00ff00] p-4 font-mono leading-relaxed border-2 border-inset border-gray-500 min-h-[150px] relative overflow-hidden">
                                <h1 className="text-2xl md:text-3xl mb-2 font-bold uppercase border-b-2 border-[#00ff00] pb-2 text-[#ff00ff]">
                                    @{profile.username || 'username'}
                                </h1>
                                <p className="mb-3 text-[#ffff00] text-lg">{profile.full_name || 'Anonim Kullanıcı'}</p>
                                <p className="text-white text-sm md:text-base whitespace-pre-line leading-relaxed">
                                    {profile.bio || "🔬 Kuantum belirsizliği nedeniyle bio henüz gözlemlenemedi..."}
                                </p>

                                <img src={RETRO_ASSETS.DANCING_EINSTEIN} className="absolute bottom-2 right-2 w-12 opacity-40" alt="einstein" />
                            </div>

                            {/* Winamp Controls */}
                            <div className="flex gap-1 bg-[#c0c0c0] p-1">
                                {['⏮️ GERİ', '▶️ OYNAT', '⏸️ DUR', '⏹️ KAPAT', '⏭️ İLERİ'].map((btn, i) => (
                                    <button
                                        key={i}
                                        onMouseEnter={() => playSound('bip')}
                                        onClick={() => playSound('boop')}
                                        className="flex-1 bg-gray-300 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-black text-xs font-bold py-1 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white hover:bg-gray-200 transition-colors"
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onMouseEnter={() => playSound('bip')}
                                className="bg-purple-800 border-4 border-t-purple-400 border-l-purple-400 border-b-black border-r-black text-white font-black py-4 text-lg hover:bg-purple-700 active:border-t-black active:border-l-black shadow-[4px_4px_0px_0px_#000] active:shadow-none uppercase flex items-center justify-center gap-2"
                            >
                                <span>➕</span> TAKİP ET
                            </button>
                            <button
                                onMouseEnter={() => playSound('bip')}
                                className="bg-blue-800 border-4 border-t-blue-400 border-l-blue-400 border-b-black border-r-black text-white font-black py-4 text-lg hover:bg-blue-700 active:border-t-black active:border-l-black shadow-[4px_4px_0px_0px_#000] active:shadow-none uppercase flex items-center justify-center gap-2"
                            >
                                <span>📧</span> MESAJ
                            </button>
                        </div>

                        {/* Articles Section */}
                        <div className="bg-black/80 border-4 border-[#00ff00] p-4 relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 text-[#00ff00] font-bold border-2 border-[#00ff00] uppercase text-sm">
                                📁 SON_DOSYALAR.TXT
                            </div>
                            <ul className="space-y-3 mt-3">
                                {articles.slice(0, 5).map(article => (
                                    <li key={article.id}>
                                        <Link
                                            href={`/makale/${article.slug}`}
                                            className="flex items-center gap-3 hover:bg-[#00ff00]/20 p-2 transition-colors group"
                                            onMouseEnter={() => playSound('bip')}
                                        >
                                            <span className="text-[#ff00ff] group-hover:animate-pulse">►</span>
                                            <span className="text-white underline decoration-[#00ff00] group-hover:text-[#00ff00] transition-colors">
                                                {article.title}
                                            </span>
                                            <span className="text-[#ffff00] text-xs ml-auto">NEW!</span>
                                        </Link>
                                    </li>
                                ))}
                                {articles.length === 0 && (
                                    <li className="text-gray-500 text-center py-4">
                                        📂 DOSYA BULUNAMADI (ERROR 404)
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Questions Section */}
                        {questions.length > 0 && (
                            <div className="bg-black/80 border-4 border-[#ff00ff] p-4 relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 text-[#ff00ff] font-bold border-2 border-[#ff00ff] uppercase text-sm">
                                    ❓ SORULAR.EXE
                                </div>
                                <ul className="space-y-3 mt-3">
                                    {questions.slice(0, 3).map(question => (
                                        <li key={question.id}>
                                            <Link
                                                href={`/forum/${question.slug}`}
                                                className="flex items-center gap-3 hover:bg-[#ff00ff]/20 p-2 transition-colors group"
                                                onMouseEnter={() => playSound('bip')}
                                            >
                                                <span className="text-[#00ff00] group-hover:animate-pulse">?</span>
                                                <span className="text-white underline decoration-[#ff00ff] group-hover:text-[#ff00ff] transition-colors">
                                                    {question.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Guestbook / Signature */}
                        <div className="text-center py-6 space-y-4">
                            <div className="inline-block bg-gradient-to-r from-[#ff00ff] via-[#00ff00] to-[#ffff00] p-1">
                                <div className="bg-black px-6 py-3">
                                    <span className="text-xl font-bold" style={{
                                        background: 'linear-gradient(90deg, #ff00ff, #00ff00, #ffff00)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        ★ FizikHub.com ★
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs">
                                Bu sayfa en iyi <span className="text-[#00ff00]">Netscape Navigator 4.0</span> ile görüntülenir
                            </p>
                            <div className="flex justify-center gap-2">
                                <div className="text-[10px] border border-gray-600 px-2 py-1 text-gray-400 bg-gray-900">IE 4.0 ✓</div>
                                <div className="text-[10px] border border-gray-600 px-2 py-1 text-gray-400 bg-gray-900">NETSCAPE ✓</div>
                                <div className="text-[10px] border border-gray-600 px-2 py-1 text-gray-400 bg-gray-900">800x600 ✓</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500 pb-20 font-mono space-y-2">
                    {React.createElement('marquee', { scrollamount: "3", className: "text-[#00ff00]" },
                        "🌟 Bu sayfa fizik severlerin kaosu ile çalışmaktadır 🌟 Schrödinger'in sunucusunda barındırılmaktadır 🌟 Hem çalışıyor hem çalışmıyor olabilir 🌟"
                    )}
                    <p className="text-gray-600">*** EOF (End Of Fun) ***</p>
                    <p className="text-[#ff00ff]">
                        💫 Kuantum Tünelleme modu için sağ üst köşeye 3 kez tıkla! 💫
                    </p>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float-1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30px, -40px) rotate(15deg); } 50% { transform: translate(-20px, -60px) rotate(-10deg); } 75% { transform: translate(-40px, -20px) rotate(5deg); } }
                @keyframes float-2 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(-40px, -30px) rotate(-15deg); } 66% { transform: translate(20px, -50px) rotate(10deg); } }
                @keyframes float-3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(40px, -40px); } }
                @keyframes float-4 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-30px, -70px) rotate(20deg); } }
                @keyframes float-5 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(50px, -30px); } }
                @keyframes float-6 { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-40px); } }
                @keyframes float-7 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-20px, -50px) rotate(-5deg); } }
                @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes spin-very-slow { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }
                
                .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 3s ease-in-out infinite; }
                .animate-float-4 { animation: float-4 6s ease-in-out infinite; }
                .animate-float-5 { animation: float-5 4.5s ease-in-out infinite; }
                .animate-float-6 { animation: float-6 3.5s ease-in-out infinite; }
                .animate-float-7 { animation: float-7 5.5s ease-in-out infinite; }
                .animate-hover { animation: hover 2s ease-in-out infinite; }
                .animate-spin-very-slow { animation: spin-very-slow 20s linear infinite; }
            `}</style>
        </div>
    );
}
