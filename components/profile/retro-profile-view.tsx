"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";

interface RetroProfileViewProps {
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

// Reliable Wikimedia Commons & Stable GIF URLs
const ASSETS = {
    STARS_BG: "https://web.archive.org/web/20091026210214/http://geocities.com/CollegePark/4544/stars.gif", // Classic Geocities stars
    EARTH: "https://upload.wikimedia.org/wikipedia/commons/2/22/Rotating_earth_%28large%29_transparent.gif",
    FIRE: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Fire_animated.gif",
    CONSTRUCTION: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Under_construction_animated.gif",
    MAIL: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_ani.gif", // Alternative mail
    NEW: "https://upload.wikimedia.org/wikipedia/commons/f/fd/New_ani.gif",
    SKULL: "https://web.archive.org/web/20090829023136/http://geocities.com/SunsetStrip/Towers/2962/skull_rotate.gif", // Archive.org skull
    GHOST: "https://web.archive.org/web/20090830064505/http://geocities.com/Area51/Cavern/9253/ghost.gif",
    ALIEN: "https://web.archive.org/web/20090829061611/http://geocities.com/Area51/Corridor/5460/alien2.gif",
    DANCING_BABY: "https://web.archive.org/web/20090831131908/http://geocities.com/Hollywood/Hills/1683/baby.gif", // The legend
    CD: "https://web.archive.org/web/20090808160416/http://geocities.com/Area51/Stargate/3720/cd.gif"
};

export function RetroProfileView({ profile, articles, questions, userBadges, stats }: RetroProfileViewProps) {
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const blinkInterval = setInterval(() => setBlink(b => !b), 500);
        return () => clearInterval(blinkInterval);
    }, []);

    return (
        <div className="font-mono bg-black text-[#00ff00] min-h-screen relative overflow-x-hidden selection:bg-[#ff00ff] selection:text-white">

            {/* Tiled Background */}
            <div className="fixed inset-0 z-0 opacity-50 pointer-events-none"
                style={{
                    backgroundImage: `url("${ASSETS.STARS_BG}")`,
                    backgroundRepeat: 'repeat'
                }}>
            </div>

            {/* CHAOS LAYER - Desktop Overlay */}
            <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden h-full hidden md:block">
                <img src={ASSETS.ALIEN} className="absolute top-[10%] left-[5%] w-16" alt="alien" />
                <img src={ASSETS.DANCING_BABY} className="absolute bottom-[20%] left-[10%] w-24" alt="baby" />
                <img src={ASSETS.FIRE} className="absolute bottom-0 w-full opacity-30 h-32 stretch-fire" alt="fire" />
                <img src={ASSETS.MAIL} className="absolute top-[40%] right-[5%] w-16" alt="mail" />
                <img src={ASSETS.SKULL} className="absolute bottom-[40%] left-[5%]" alt="skull" />
                <img src={ASSETS.GHOST} className="absolute top-[20%] right-[20%] w-16 opacity-70" alt="ghost" />
                <img src={ASSETS.EARTH} className="absolute top-[5%] left-[50%] -translate-x-1/2 w-16" alt="earth" />
                <img src={ASSETS.CD} className="absolute bottom-[10%] right-[10%] w-16 animate-spin-slow" alt="cd" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto p-2 md:p-4 max-w-5xl">

                {/* Header Marquee */}
                <div className="mb-8 border-b-4 border-r-4 border-t-2 border-l-2 border-gray-400 bg-[#000080] text-white p-1 shadow-[4px_4px_0px_0px_#000]">
                    {React.createElement('marquee', { scrollamount: "12", bgcolor: "#000080" },
                        <span className="text-yellow-300 text-xl font-bold tracking-widest uppercase">
                            UYARI: @{profile.username.toUpperCase()} KAOTİK EVRENİNE GİRİŞ YAPTINIZ /// 1337 H4X0R /// İNTERNETE HOŞGELDİNİZ /// DİKKAT: RADYASYON TEHLİKESİ
                        </span>
                    )}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">

                    {/* Left Column */}
                    <div className="flex flex-col gap-6 items-center lg:items-start bg-black/80 p-4 border-4 border-double border-white">

                        {/* Avatar */}
                        <div className="w-full relative group text-center">
                            <div className="inline-block relative border-4 border-outset border-gray-500 p-1 bg-gray-300">
                                <img
                                    src={profile.avatar_url || "/default-avatar.png"}
                                    alt="Admin"
                                    className="w-48 h-48 object-cover border-2 border-inset border-gray-600"
                                />
                                <div className="absolute -bottom-4 -right-4 z-20">
                                    <img src={ASSETS.FIRE} className="h-12 w-24" alt="mini fire" />
                                </div>
                            </div>

                            <div className="mt-2 text-[#00ff00] font-bold blink-animation bg-black px-2 py-1 inline-block border border-[#00ff00]">
                                DURUM: ÇEVRİMİÇİ
                            </div>
                        </div>

                        {/* Valid HTML Icon simulation */}
                        <div className="w-full flex justify-center my-2 gap-2">
                            <img src={ASSETS.CD} className="w-12 animate-spin-slow" alt="cd" />
                            <img src={ASSETS.EARTH} className="w-12" alt="earth" />
                        </div>

                        {/* Stats Table */}
                        <div className="w-full border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0] text-black p-1 shadow-md">
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-0.5 font-bold text-sm mb-1 flex justify-between items-center">
                                <span>ISTATISTIK.EXE</span>
                                <span className="text-xs">X</span>
                            </div>
                            <table className="w-full text-left font-mono text-sm bg-white border border-gray-500">
                                <tbody className="text-black">
                                    <tr className="border-b border-gray-300">
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">SVY</td>
                                        <td className="py-1 px-2 text-red-600 font-bold">99</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">TKPC</td>
                                        <td className="py-1 px-2">{stats.followersCount}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">TKP</td>
                                        <td className="py-1 px-2">{stats.followingCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">YAZI</td>
                                        <td className="py-1 px-2">{stats.articlesCount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Badges */}
                        <div className="w-full border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0] text-black p-1 shadow-md">
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-0.5 font-bold text-sm mb-1">
                                ROZETLER.DLL
                            </div>
                            <div className="bg-white border border-gray-500 p-2 flex flex-wrap gap-2 min-h-[50px]">
                                {userBadges.map((ub: any, i: number) => (
                                    <div key={i} className="w-8 h-8 hover:scale-125 transition-transform cursor-help" title={ub.badges.name}>
                                        <CustomBadgeIcon name={ub.badges.name} className="w-full h-full text-black" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Bio */}
                    <div className="relative">
                        <div className="bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-black border-r-black p-1 shadow-[10px_10px_0px_rgba(0,0,0,0.8)] mb-8">
                            <div className="bg-[#000080] text-white px-2 py-1 font-bold flex justify-between items-center mb-1">
                                <span>WINAMP - {profile.username}.mp3</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 bg-gray-400 border border-white"></div>
                                    <div className="w-3 h-3 bg-gray-400 border border-white"></div>
                                    <div className="w-3 h-3 bg-red-600 border border-white"></div>
                                </div>
                            </div>

                            <div className="bg-black text-[#00ff00] p-4 font-mono leading-relaxed border-2 border-inset border-gray-500 min-h-[150px] relative overflow-hidden">
                                <h1 className="text-3xl mb-2 font-bold uppercase border-b border-[#00ff00] pb-2">
                                    @{profile.username}
                                </h1>
                                <p className="mb-4">{profile.full_name}</p>
                                <p className="text-white text-sm whitespace-pre-line">{profile.bio || "Zeka aranıyor..."}</p>

                                <img src={ASSETS.ALIEN} className="absolute bottom-2 right-2 w-12 opacity-50" alt="alien" />
                            </div>

                            <div className="mt-2 flex gap-1 bg-[#c0c0c0] p-1">
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">GERİ</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">OYNA</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">DUR</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">KAPAT</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">İLERİ</button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button className="bg-purple-900 border-4 border-outset border-purple-400 text-white font-black py-4 text-xl hover:bg-purple-800 active:border-inset shadow-lg flex flex-col items-center gap-1 uppercase">
                                <span>➕</span>
                                TAKİP ET
                            </button>
                            <button className="bg-blue-900 border-4 border-outset border-blue-400 text-white font-black py-4 text-xl hover:bg-blue-800 active:border-inset shadow-lg flex flex-col items-center gap-1 uppercase">
                                <span>📧</span>
                                MESAJ AT
                            </button>
                        </div>

                        {/* Content */}
                        <div className="bg-[#000000]/80 border-4 border-green-600 p-4 mb-6 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-green-500 font-bold border border-green-500 uppercase">
                                SON_YUKLENENLER
                            </div>
                            <ul className="space-y-4 mt-2">
                                {articles.slice(0, 3).map(article => (
                                    <li key={article.id}>
                                        <Link href={`/makale/${article.slug}`} className="flex items-center gap-2 hover:bg-green-900/40 p-1 transition">
                                            <img src={ASSETS.NEW} className="h-6" alt="new" />
                                            <span className="text-white underline">{article.title}</span>
                                        </Link>
                                    </li>
                                ))}
                                {articles.length === 0 && <li className="text-gray-500 text-center">DOSYA BULUNAMADI (404)</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* MOBILE CHAOS ZONE */}
                <div className="block md:hidden mt-8 border-t-2 border-dashed border-gray-600 pt-4">
                    <h3 className="text-center text-yellow-500 font-bold mb-4 blink-animation">/// KAOS ALANI ///</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <img src={ASSETS.DANCING_BABY} className="w-20 object-contain" alt="baby" />
                        <img src={ASSETS.ALIEN} className="w-20 object-contain" alt="alien" />
                        <img src={ASSETS.SKULL} className="w-16 object-contain" alt="skull" />
                        <img src={ASSETS.GHOST} className="w-16 object-contain" alt="ghost" />
                        <img src={ASSETS.CONSTRUCTION} className="w-24 border border-white" alt="construction" />
                    </div>
                </div>


                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500 pb-16 font-mono">
                    <p className="mb-2">*** DOSYA SONU ***</p>
                    <div className="flex justify-center gap-2 mt-2">
                        <div className="text-[10px] border border-gray-600 px-1 text-gray-400">MS IE 4.0</div>
                        <div className="text-[10px] border border-gray-600 px-1 text-gray-400">NETSCAPE</div>
                    </div>
                </div>

            </div>

            <style jsx>{`
                .blink-animation { animation: blinker 1s linear infinite; }
                @keyframes blinker { 50% { opacity: 0; } }
                .animate-spin-slow { animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .stretch-fire { transform: scaleY(1.5); }
            `}</style>
        </div>
    );
}
