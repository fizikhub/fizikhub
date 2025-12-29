"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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

export function RetroProfileView({ profile, articles, questions, userBadges, stats }: RetroProfileViewProps) {
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setBlink(b => !b), 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono bg-black text-[#00ff00] min-h-screen relative overflow-x-hidden selection:bg-[#ff00ff] selection:text-white">
            {/* 
        This is a tribute to the 90s web aesthetic. 
        Inline styles are used intentionally for that raw, chaotic feel where needed, 
        but Tailwind makes it manageable. 
      */}

            {/* Background - Tiled Stars */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: 'url("https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif")', // Classic starfield
                    backgroundSize: '200px'
                }}
            />

            {/* Main Container - Windows 95 Style Wrapper */}
            <div className="relative z-10 container mx-auto p-2 max-w-5xl">

                {/* Header Marquee */}
                <div className="mb-4 border-4 border-ridge border-gray-400 bg-blue-800 text-white font-bold p-1 overflow-hidden whitespace-nowrap">
                    <div className="animate-marquee inline-block">
                        *** HOŞGELDİNİZ ***  ADMİNİN MEKANINA GİRİŞ YAPTINIZ  ***  BURASI FİZİKHUB'IN MERKEZİDİR  ***  DİKKAT: YÜKSEK RADYASYON  ***  @BARANBOZKURT  ***
                    </div>
                </div>

                {/* Top Section: Avatar & Info Table */}
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 mb-8">

                    {/* Left Column: Avatar & Counter */}
                    <div className="flex flex-col gap-4">
                        <div className="border-[6px] border-double border-[#ff00ff] p-1 bg-black relative inline-block self-center md:self-start">
                            <div className="relative">
                                {/* Avatar */}
                                <img
                                    src={profile.avatar_url || "/default-avatar.png"}
                                    alt="Admin"
                                    className="w-48 h-48 object-cover sepia-[.3] contrast-125"
                                />

                                {/* THE MUSTACHE (CSS or SVG Overlay) */}
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-8 pointer-events-none filter drop-shadow-lg">
                                    <svg viewBox="0 0 100 40" fill="black">
                                        <path d="M50 10 Q70 0 90 20 Q100 30 90 35 Q80 40 70 30 Q60 20 50 25 Q40 20 30 30 Q20 40 10 35 Q0 30 10 20 Q30 0 50 10 " />
                                    </svg>
                                </div>

                                {/* Spinning "COOL" Badge */}
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-red-600 font-bold rounded-full w-16 h-16 flex items-center justify-center animate-spin-slow border-2 border-red-600 shadow-xl">
                                    COOL!
                                </div>
                            </div>
                            <div className="text-center mt-2 font-bold text-[#ff00ff] blink-animation">
                                {blink ? "ONLINE" : ""}
                            </div>
                        </div>

                        {/* Retro Stats Table */}
                        <div className="border-2 border-gray-600 bg-gray-900 p-2 text-xs">
                            <table className="w-full text-left text-green-400 font-mono">
                                <tbody>
                                    <tr><td className="pr-2">LEVEL:</td><td className="text-white">99 (MAX)</td></tr>
                                    <tr><td className="pr-2">TAKİPÇİ:</td><td className="text-white">{stats.followersCount}</td></tr>
                                    <tr><td className="pr-2">TAKİP:</td><td className="text-white">{stats.followingCount}</td></tr>
                                    <tr><td className="pr-2">YAZILAR:</td><td className="text-white">{stats.articlesCount}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Badges as GIF row */}
                        <div className="flex flex-wrap gap-1 border border-yellow-600 p-1 bg-black/50">
                            {userBadges.map((ub: any, i: number) => (
                                <div key={i} className="w-8 h-8 rounded-none border border-white bg-blue-900 flex items-center justify-center p-0.5" title={ub.badges.name}>
                                    <img src={ub.badges.icon} className="w-full h-full pixelated" alt="badge" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Bio & Content */}
                    <div className="bg-[#000080] border-4 border-outset border-gray-400 p-4 shadow-[10px_10px_0px_rgba(0,0,0,0.8)]">
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-pulse tracking-widest drop-shadow-[4px_4px_0_#000000]">
                            @{profile.username.toUpperCase()}
                        </h1>

                        <h2 className="text-white text-xl mt-2 mb-4 font-serif italic border-b-2 border-dotted border-white pb-2">
                            ~ {profile.full_name} ~
                        </h2>

                        <div className="bg-white text-black p-4 font-serif text-lg leading-relaxed border-2 border-inset border-gray-600 h-64 overflow-y-auto scrollbar-retro relative">
                            <p>{profile.bio || "Henüz bir biyografi yok..."}</p>
                            <p className="mt-4 font-bold text-red-600">
                                NOT: Bu profili görüntülüyorsanız çok şanslısınız. Burası internetin en cool köşesi.
                            </p>
                            <div className="absolute top-2 right-2">
                                <img src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" className="w-12 h-12" alt="dancing baby" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <button className="px-6 py-2 bg-gray-300 border-4 border-outset border-white text-black font-bold active:border-inset active:bg-gray-400">
                                TAKİP ET
                            </button>
                            <button className="px-6 py-2 bg-gray-300 border-4 border-outset border-white text-black font-bold active:border-inset active:bg-gray-400">
                                MESAJ AT
                            </button>
                        </div>
                    </div>
                </div>


                {/* Content Section - Tabs Style Retro */}
                <div className="border-t-4 border-red-600 pt-8 mt-8">
                    <div className="flex justify-center mb-8">
                        <img src="https://web.archive.org/web/20090829023746/http://geocities.com/SunsetStrip/Lounge/9762/construction_lg.gif" alt="Under Construction" className="w-64" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Articles Frame */}
                        <div className="border-4 border-green-500 bg-black p-4 relative">
                            <div className="absolute -top-4 left-4 bg-black px-2 text-green-500 font-bold border border-green-500 text-xl">
                                SON YAZILAR
                            </div>
                            <ul className="space-y-4 mt-2">
                                {articles.slice(0, 5).map(article => (
                                    <li key={article.id} className="border-b border-green-900 pb-2">
                                        <Link href={`/makale/${article.slug}`} className="hover:bg-green-900 hover:text-white block transition-colors">
                                            <span className="text-yellow-400 mr-2">►</span>
                                            <span className="underline decoration-dotted">{article.title}</span>
                                            <span className="block text-xs text-gray-500 mt-1">{format(new Date(article.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                        </Link>
                                    </li>
                                ))}
                                {articles.length === 0 && <li className="text-gray-500 italic">Hiç yazı yok...</li>}
                            </ul>
                        </div>

                        {/* Questions Frame */}
                        <div className="border-4 border-yellow-500 bg-black p-4 relative">
                            <div className="absolute -top-4 left-4 bg-black px-2 text-yellow-500 font-bold border border-yellow-500 text-xl">
                                FORUM KONULARI
                            </div>
                            <ul className="space-y-4 mt-2">
                                {questions.slice(0, 5).map(question => (
                                    <li key={question.id} className="border-b border-yellow-900 pb-2">
                                        <Link href={`/forum/${question.slug}`} className="hover:bg-yellow-900 hover:text-white block transition-colors">
                                            <span className="text-red-400 mr-2">❓</span>
                                            <span className="underline decoration-dotted">{question.title}</span>
                                        </Link>
                                    </li>
                                ))}
                                {questions.length === 0 && <li className="text-gray-500 italic">Hiç soru yok...</li>}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-xs text-gray-400 pb-12 font-serif">
                    <p>BEST VIEWED WITH INTERNET EXPLORER 4.0</p>
                    <p className="mt-2">COPYRIGHT 1999 @BARANBOZKURT INC.</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-20 h-8 bg-gray-400 flex items-center justify-center border border-white text-black text-[10px]">HTML VALID</div>
                        <div className="w-20 h-8 bg-gray-400 flex items-center justify-center border border-white text-black text-[10px]">NO FRAME</div>
                    </div>
                </div>

            </div>

            <style jsx>{`
        .animate-marquee {
            animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .blink-animation {
            animation: blinker 1s linear infinite;
        }
        @keyframes blinker {
            50% { opacity: 0; }
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .pixelated {
            image-rendering: pixelated;
        }
      `}</style>
        </div>
    );
}
