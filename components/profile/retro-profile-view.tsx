"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
                <div className="mb-4 border-4 border-ridge border-gray-400 bg-blue-800 text-white font-bold p-1 overflow-hidden whitespace-nowrap text-xl tracking-widest text-yellow-300">
                    {React.createElement('marquee', { scrollamount: "10", scrolldelay: "0", loop: "infinite" },
                        "*** YÜCE MÜCE ADMİNİN PROFİLİNE GİRİŞ YAPTINIZ. HOŞGELDİNİZ. ***  DİKKAT: YÜKSEK RADYASYON  ***  @BARANBOZKURT  ***"
                    )}
                </div>

                {/* Top Section: Avatar & Info Table */}
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 mb-8">

                    {/* Left Column: Avatar & Counter */}
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <div className="border-[6px] border-double border-[#ff00ff] p-1 bg-black relative inline-block group">
                            <div className="relative">
                                {/* Avatar */}
                                <img
                                    src={profile.avatar_url || "/default-avatar.png"}
                                    alt="Admin"
                                    className="w-48 h-48 object-cover sepia-[.3] contrast-125"
                                />

                                {/* Spinning "COOL" Badge */}
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-red-600 font-bold rounded-full w-16 h-16 flex items-center justify-center animate-spin-slow border-2 border-red-600 shadow-xl z-20">
                                    COOL!
                                </div>

                                {/* GIF: Flames at bottom */}
                                <img src="https://media.giphy.com/media/P7JmDW7IkB7ZW/giphy.gif" className="absolute bottom-0 left-0 w-full h-8 opacity-70 mix-blend-screen" alt="fire" />
                            </div>
                            <div className="text-center mt-2 font-bold text-[#ff00ff] blink-animation">
                                {blink ? "ONLINE" : ""}
                            </div>
                        </div>

                        {/* Retro Stats Table */}
                        <div className="border-2 border-gray-600 bg-gray-900 p-2 text-xs relative overflow-hidden w-full max-w-[300px]">
                            {/* GIF: Matrix rain background effect */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url(https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif)', backgroundSize: 'cover' }}></div>

                            <table className="w-full text-left text-green-400 font-mono relative z-10 text-sm">
                                <tbody>
                                    <tr><td className="pr-2">LEVEL:</td><td className="text-white">99 (MAX)</td></tr>
                                    <tr><td className="pr-2">TAKİPÇİ:</td><td className="text-white">{stats.followersCount}</td></tr>
                                    <tr><td className="pr-2">TAKİP:</td><td className="text-white">{stats.followingCount}</td></tr>
                                    <tr><td className="pr-2">YAZILAR:</td><td className="text-white">{stats.articlesCount}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Badges - Removed pixelated class to prevent glitches */}
                        <div className="flex flex-wrap gap-1 border border-yellow-600 p-1 bg-black/50 justify-center md:justify-start max-w-[300px]">
                            {userBadges.map((ub: any, i: number) => (
                                <div key={i} className="w-8 h-8 rounded-none border border-white bg-blue-900 flex items-center justify-center p-0.5" title={ub.badges.name}>
                                    <CustomBadgeIcon name={ub.badges.name} className="w-full h-full text-white" />
                                </div>
                            ))}
                        </div>

                        {/* GIF: Spinning Earth (Reliable Link) */}
                        <div className="flex justify-center">
                            <img src="https://media.giphy.com/media/AhjXalOPA2rj2/giphy.gif" className="w-16 h-16" alt="earth" />
                        </div>
                    </div>

                    {/* Right Column: Bio & Content */}
                    <div className="bg-[#000080] border-4 border-outset border-gray-400 p-4 shadow-[10px_10px_0px_rgba(0,0,0,0.8)] relative mt-4 md:mt-0 w-full">
                        {/* GIF: Welcome banner (Hidden on mobile to save space) */}
                        <div className="absolute -top-6 right-2 md:right-10 z-20 hidden md:block">
                            <img src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif" className="h-12" alt="welcome" />
                        </div>

                        <h1 className="text-2xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-pulse tracking-widest drop-shadow-[2px_2px_0_#000000] break-words">
                            @{profile.username.toUpperCase()}
                        </h1>

                        <h2 className="text-white text-lg md:text-xl mt-2 mb-4 font-serif italic border-b-2 border-dotted border-white pb-2 flex flex-wrap items-center gap-2">
                            <span className="bg-red-600 text-white text-xs px-1 animate-pulse">NEW!</span>
                            ~ {profile.full_name} ~
                        </h2>

                        <div className="bg-white text-black p-4 font-serif text-lg leading-relaxed border-2 border-inset border-gray-600 h-64 overflow-y-auto scrollbar-retro relative">
                            <p>{profile.bio || "Henüz bir biyografi yok..."}</p>


                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-50 md:opacity-100 pointer-events-none">
                                <img src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" className="w-12 h-12" alt="dancing baby" />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
                            <button className="w-full md:w-auto px-6 py-2 bg-gray-300 border-4 border-outset border-white text-black font-bold active:border-inset active:bg-gray-400">
                                TAKİP ET
                            </button>
                            <button className="w-full md:w-auto px-6 py-2 bg-gray-300 border-4 border-outset border-white text-black font-bold active:border-inset active:bg-gray-400">
                                MESAJ AT
                            </button>
                            {/* GIF: Mailbox */}
                            <img src="https://media.giphy.com/media/3o7TKSjRrfPHjGWglq/giphy.gif" className="h-10 hidden md:block" alt="email" />
                        </div>
                    </div>
                </div>


                {/* Content Section - Tabs Style Retro */}
                <div className="border-t-4 border-red-600 pt-8 mt-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 z-20">
                        <img src="https://media.giphy.com/media/Vse57EWCo2Va/giphy.gif" alt="ufo" className="h-12 md:h-16" />
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
                        <img src="https://media.giphy.com/media/3o6gDWzmAzrpi5DdBm/giphy.gif" alt="Under Construction" className="w-full md:w-64 max-w-[200px]" />
                        <img src="https://media.giphy.com/media/26brQLhV3G26G35C0/giphy.gif" className="w-24 h-24" alt="pizza" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Articles Frame */}
                        <div className="border-4 border-green-500 bg-black p-4 relative">
                            <div className="absolute -top-4 left-4 bg-black px-2 text-green-500 font-bold border border-green-500 text-xl">
                                SON YAZILAR
                            </div>
                            {/* GIF: Arrow */}
                            <div className="absolute -right-4 top-10">
                                <img src="https://media.giphy.com/media/10Hv6G6k0p9KWA/giphy.gif" className="w-12" alt="arrow" />
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

                {/* GIF ZONE - Massive Grid of chaos */}
                <div className="mt-12 mb-12 border-4 border-dashed border-white p-4 bg-purple-900/30">
                    <h3 className="text-center text-2xl font-bold text-white mb-4 blink-animation">*** GIF ZONE ***</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center justify-items-center">
                        <img src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" className="w-16 md:w-24" alt="dancing baby" />
                        <img src="https://media.giphy.com/media/KxhIhXaAmjOVy/giphy.gif" className="w-16 md:w-24" alt="snoop" />
                        <img src="https://media.giphy.com/media/3o7TKSjRrfPHjGWglq/giphy.gif" className="w-16 md:w-24" alt="mailbox" />
                        <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" className="w-16 md:w-24" alt="cat" />
                        <img src="https://media.giphy.com/media/5wWf7H89PisM6An8UAU/giphy.gif" className="w-16 md:w-24" alt="skeleton" />
                        <img src="https://media.giphy.com/media/l41lFw057lAJcYt0Y/giphy.gif" className="w-16 md:w-24" alt="alien" />
                        <img src="https://media.giphy.com/media/3o7qDXO07Y7iYQadZ6/giphy.gif" className="w-16 md:w-24" alt="cd" />
                        <img src="https://media.giphy.com/media/3o6Zxp2c5l9N5t9uBa/giphy.gif" className="w-16 md:w-24" alt="computer" />
                        <img src="https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif" className="w-24" alt="welcome" />
                        <img src="https://media.giphy.com/media/AhjXalOPA2rj2/giphy.gif" className="w-16 md:w-24" alt="earth" />
                        <img src="https://media.giphy.com/media/Lopx9eUIqBZhK/giphy.gif" className="w-16 md:w-24" alt="fire" />
                        <img src="https://media.giphy.com/media/26FPCXdkvB3PIy5lsk/giphy.gif" className="w-16 md:w-24" alt="ghost" />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-xs text-gray-400 pb-12 font-serif">
                    <p>BEST VIEWED WITH INTERNET EXPLORER 4.0</p>
                    <p className="mt-2">COPYRIGHT 1999 @BARANBOZKURT INC.</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-20 h-8 bg-gray-400 flex items-center justify-center border border-white text-black text-[10px] font-bold">HTML VALID</div>
                        <div className="w-20 h-8 bg-gray-400 flex items-center justify-center border border-white text-black text-[10px] font-bold">NO FRAME</div>
                        <div className="w-20 h-8 bg-gray-400 flex items-center justify-center border border-white text-black text-[10px] font-bold">MS IE 4.0</div>
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
        /* Hide scrollbar for retro feel */
        .scrollbar-retro::-webkit-scrollbar {
            width: 12px;
        }
        .scrollbar-retro::-webkit-scrollbar-track {
            background: #c0c0c0;
            border: 2px solid white;
            border-style: inset;
        }
        .scrollbar-retro::-webkit-scrollbar-thumb {
            background: #c0c0c0;
            border: 2px solid white;
            border-style: outset;
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
      `}</style>
        </div>
    );
}
