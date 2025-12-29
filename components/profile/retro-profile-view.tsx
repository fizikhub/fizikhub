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

export function RetroProfileView({ profile, articles, questions, userBadges, stats }: RetroProfileViewProps) {
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const blinkInterval = setInterval(() => setBlink(b => !b), 500);
        return () => {
            clearInterval(blinkInterval);
        };
    }, []);

    return (
        <div className="font-mono bg-black text-[#00ff00] min-h-screen relative overflow-x-hidden selection:bg-[#ff00ff] selection:text-white">

            {/* Tiled Background GIF */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'url("https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif")',
                    backgroundSize: '250px'
                }}>
            </div>

            {/* CHAOS LAYER - The "Trash" - Mobile: Grid/Flow, Desktop: Absolute Chaos */}
            <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden h-full hidden md:block">
                {/* Desktop Absolute Chaos */}
                <img src="https://media.giphy.com/media/KxhIhXaAmjOVy/giphy.gif" className="absolute top-[5%] left-[5%] w-32" alt="snoop" />
                <img src="https://media.giphy.com/media/uzWoRrlxnbLbe/giphy.gif" className="absolute top-[15%] right-[10%] w-40" alt="elon" />
                <img src="https://media.giphy.com/media/Lopx9eUIqBZhK/giphy.gif" className="absolute bottom-[5%] left-[20%] w-full max-w-[500px] opacity-50" alt="fire" />
                <img src="https://media.giphy.com/media/3o7TKSjRrfPHjGWglq/giphy.gif" className="absolute top-[40%] left-[2%] w-24" alt="mail" />
                <img src="https://media.giphy.com/media/5wWf7H89PisM6An8UAU/giphy.gif" className="absolute top-[60%] right-[2%] w-24" alt="skull" />
                <img src="https://media.giphy.com/media/l41lFw057lAJcYt0Y/giphy.gif" className="absolute bottom-[20%] left-[5%] w-32" alt="alien" />
                <img src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" className="absolute top-[20%] left-[40%] w-20" alt="baby" />
                <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" className="absolute bottom-[10%] right-[10%] w-24" alt="cat" />
                <img src="https://media.giphy.com/media/26FPCXdkvB3PIy5lsk/giphy.gif" className="absolute top-[10%] left-[80%] w-24" alt="ghost" />
                <img src="https://media.giphy.com/media/3o6Zxp2c5l9N5t9uBa/giphy.gif" className="absolute top-[80%] right-[40%] w-32" alt="computer" />
                <img src="https://media.giphy.com/media/AhjXalOPA2rj2/giphy.gif" className="absolute top-[2%] left-[50%] w-20" alt="earth" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto p-2 md:p-4 max-w-5xl">

                {/* Header Marquee */}
                <div className="mb-8 border-b-4 border-r-4 border-t-2 border-l-2 border-gray-400 bg-[#000080] text-white p-1 shadow-[4px_4px_0px_0px_#000]">
                    {React.createElement('marquee', { scrollamount: "12", bgcolor: "#000080" },
                        <span className="text-yellow-300 text-xl font-bold tracking-widest uppercase">
                            Warning: You have entered the chaotic realm of @{profile.username} /// 1337 H4X0R /// Welcome to the Internet ///
                        </span>
                    )}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">

                    {/* Left Column */}
                    <div className="flex flex-col gap-6 items-center lg:items-start bg-black/80 p-4 border-4 border-double border-white">

                        {/* Avatar Frame */}
                        <div className="w-full relative group text-center">
                            <div className="inline-block relative border-4 border-outset border-gray-500 p-1 bg-gray-300">
                                <img
                                    src={profile.avatar_url || "/default-avatar.png"}
                                    alt="Admin"
                                    className="w-48 h-48 object-cover border-2 border-inset border-gray-600"
                                />
                                <div className="absolute -bottom-4 right-[-20px] z-20">
                                    <img src="https://media.giphy.com/media/P7JmDW7IkB7ZW/giphy.gif" className="h-12" alt="mini fire" />
                                </div>
                            </div>

                            {/* Running Text Under Avatar */}
                            <div className="mt-2 text-[#00ff00] font-bold blink-animation bg-black px-2 py-1 inline-block border border-[#00ff00]">
                                STATUS: ONLINE
                            </div>
                        </div>

                        {/* Valid HTML Badge */}
                        <div className="w-full flex justify-center my-2">
                            <img src="https://media.giphy.com/media/3o7qDXO07Y7iYQadZ6/giphy.gif" className="w-16 animate-spin-slow" alt="cd" />
                        </div>

                        {/* Stats Table */}
                        <div className="w-full border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0] text-black p-1 shadow-md">
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-0.5 font-bold text-sm mb-1 flex justify-between items-center">
                                <span>STATS.EXE</span>
                                <span className="text-xs">X</span>
                            </div>
                            <table className="w-full text-left font-mono text-sm bg-white border border-gray-500">
                                <tbody className="text-black">
                                    <tr className="border-b border-gray-300">
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">LVL</td>
                                        <td className="py-1 px-2 text-red-600 font-bold">99</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">FLWR</td>
                                        <td className="py-1 px-2">{stats.followersCount}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">FLNG</td>
                                        <td className="py-1 px-2">{stats.followingCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 px-2 border-r border-gray-300 font-bold bg-gray-100">POST</td>
                                        <td className="py-1 px-2">{stats.articlesCount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Badges */}
                        <div className="w-full border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 bg-[#c0c0c0] text-black p-1 shadow-md">
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-0.5 font-bold text-sm mb-1">
                                BADGES.DLL
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
                                <p className="text-white text-sm whitespace-pre-line">{profile.bio || "Searching for intelligence..."}</p>

                                {/* Tiny decorative GIFs inside Bio */}
                                <img src="https://media.giphy.com/media/Vse57EWCo2Va/giphy.gif" className="absolute bottom-2 right-2 w-12 opacity-50" alt="ufo" />
                            </div>

                            <div className="mt-2 flex gap-1 bg-[#c0c0c0] p-1">
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">PREV</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">PLAY</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">PAUSE</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">STOP</button>
                                <button className="flex-1 bg-gray-300 border-2 border-outset border-white text-black text-xs font-bold py-1 active:border-inset">NEXT</button>
                            </div>
                        </div>

                        {/* Action Buttons Frame */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button className="bg-purple-900 border-4 border-outset border-purple-400 text-white font-black py-4 text-xl hover:bg-purple-800 active:border-inset shadow-lg flex flex-col items-center gap-1">
                                <span>➕</span>
                                TAKİP ET
                            </button>
                            <button className="bg-blue-900 border-4 border-outset border-blue-400 text-white font-black py-4 text-xl hover:bg-blue-800 active:border-inset shadow-lg flex flex-col items-center gap-1">
                                <span>📧</span>
                                MESAJ AT
                            </button>
                        </div>

                        {/* Content Sections */}
                        <div className="bg-[#000000]/80 border-4 border-green-600 p-4 mb-6 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-green-500 font-bold border border-green-500">
                                LATEST_UPLOADS
                            </div>
                            <ul className="space-y-4 mt-2">
                                {articles.slice(0, 3).map(article => (
                                    <li key={article.id}>
                                        <Link href={`/makale/${article.slug}`} className="flex items-center gap-2 hover:bg-green-900/40 p-1 transition">
                                            <img src="https://media.giphy.com/media/10Hv6G6k0p9KWA/giphy.gif" className="w-6 h-6 rotate-180" alt="arrow" />
                                            <span className="text-white underline">{article.title}</span>
                                        </Link>
                                    </li>
                                ))}
                                {articles.length === 0 && <li className="text-gray-500 text-center">FILE NOT FOUND (404)</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* MOBILE ONLY CHAOS - Because random absolute positioning sucks on mobile */}
                <div className="block md:hidden mt-8 border-t-2 border-dashed border-gray-600 pt-4">
                    <h3 className="text-center text-yellow-500 font-bold mb-4 blink-animation">/// CHAOS ZONE ///</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <img src="https://media.giphy.com/media/KxhIhXaAmjOVy/giphy.gif" className="w-24 object-contain" alt="snoop" />
                        <img src="https://media.giphy.com/media/uzWoRrlxnbLbe/giphy.gif" className="w-32 object-contain" alt="elon" />
                        <img src="https://media.giphy.com/media/5wWf7H89PisM6An8UAU/giphy.gif" className="w-20 object-contain" alt="skull" />
                        <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" className="w-20 object-contain" alt="cat" />
                        <img src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" className="w-20 object-contain" alt="baby" />
                        <img src="https://media.giphy.com/media/l41lFw057lAJcYt0Y/giphy.gif" className="w-24 object-contain" alt="alien" />
                        <img src="https://media.giphy.com/media/Lopx9eUIqBZhK/giphy.gif" className="w-full h-12 object-cover opacity-70" alt="fire" />
                    </div>
                </div>


                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500 pb-16 font-mono">
                    <p className="mb-2">*** EOF ***</p>
                    <img src="https://media.giphy.com/media/26FPCXdkvB3PIy5lsk/giphy.gif" className="w-8 mx-auto" alt="ghost" />
                </div>

            </div>

            <style jsx>{`
                .blink-animation { animation: blinker 1s linear infinite; }
                @keyframes blinker { 50% { opacity: 0; } }
                .animate-spin-slow { animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

