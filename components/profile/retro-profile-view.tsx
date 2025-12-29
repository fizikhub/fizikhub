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

// Animated emoji component
const AnimatedEmoji = ({ emoji, className = "" }: { emoji: string; className?: string }) => (
    <span className={`inline-block animate-bounce-slow ${className}`}>{emoji}</span>
);

// Floating decoration component
const FloatingDecor = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <div
        className="absolute animate-float pointer-events-none"
        style={{ animationDelay: `${delay}s` }}
    >
        {children}
    </div>
);

export function RetroProfileView({ profile, articles, questions, userBadges, stats }: RetroProfileViewProps) {
    const [blink, setBlink] = useState(true);
    const [counter, setCounter] = useState(1337);

    useEffect(() => {
        const blinkInterval = setInterval(() => setBlink(b => !b), 500);
        const counterInterval = setInterval(() => setCounter(c => c + Math.floor(Math.random() * 10)), 2000);
        return () => {
            clearInterval(blinkInterval);
            clearInterval(counterInterval);
        };
    }, []);

    return (
        <div className="font-mono bg-black text-[#00ff00] min-h-screen relative overflow-x-hidden selection:bg-[#ff00ff] selection:text-white">

            {/* Animated Starfield Background - Pure CSS */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="stars-layer-1"></div>
                <div className="stars-layer-2"></div>
                <div className="stars-layer-3"></div>
            </div>

            {/* Floating Emoji Decorations - Scattered */}
            <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
                <FloatingDecor delay={0}><span className="text-4xl absolute top-[10%] left-[5%]">🚀</span></FloatingDecor>
                <FloatingDecor delay={0.5}><span className="text-3xl absolute top-[20%] right-[10%]">👽</span></FloatingDecor>
                <FloatingDecor delay={1}><span className="text-4xl absolute top-[40%] left-[2%]">🌍</span></FloatingDecor>
                <FloatingDecor delay={1.5}><span className="text-3xl absolute top-[60%] right-[5%]">🔥</span></FloatingDecor>
                <FloatingDecor delay={2}><span className="text-4xl absolute top-[80%] left-[8%]">💀</span></FloatingDecor>
                <FloatingDecor delay={0.3}><span className="text-3xl absolute top-[15%] left-[80%]">⭐</span></FloatingDecor>
                <FloatingDecor delay={0.8}><span className="text-4xl absolute top-[50%] right-[2%]">🛸</span></FloatingDecor>
                <FloatingDecor delay={1.2}><span className="text-3xl absolute top-[70%] left-[90%]">🌙</span></FloatingDecor>
                <FloatingDecor delay={1.8}><span className="text-4xl absolute top-[30%] left-[3%]">✨</span></FloatingDecor>
                <FloatingDecor delay={2.2}><span className="text-3xl absolute top-[85%] right-[15%]">🎸</span></FloatingDecor>
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto p-2 md:p-4 max-w-5xl">

                {/* Header Marquee */}
                <div className="mb-4 border-4 border-ridge border-gray-400 bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 text-white font-bold p-2 overflow-hidden whitespace-nowrap">
                    {React.createElement('marquee', { scrollamount: "8" },
                        <span className="text-yellow-300 text-lg md:text-xl tracking-wider">
                            ★★★ YÜCE MÜCE ADMİNİN PROFİLİNE GİRİŞ YAPTINIZ ★★★ HOŞGELDİNİZ ★★★ DİKKAT: YÜKSEK RADYASYON ★★★ @BARANBOZKURT ★★★
                        </span>
                    )}
                </div>

                {/* Visitor Counter */}
                <div className="text-center mb-4 p-2 bg-gray-800 border-2 border-gray-600 inline-block mx-auto w-full">
                    <span className="text-gray-400 text-xs">Bu sayfayı </span>
                    <span className="text-green-400 font-bold text-lg animate-pulse">{counter}</span>
                    <span className="text-gray-400 text-xs"> kişi ziyaret etti! 🔥</span>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 md:gap-6">

                    {/* Left Column */}
                    <div className="flex flex-col gap-4 items-center lg:items-start">

                        {/* Avatar Frame */}
                        <div className="border-[6px] border-double border-[#ff00ff] p-2 bg-black relative group">
                            <div className="relative">
                                <img
                                    src={profile.avatar_url || "/default-avatar.png"}
                                    alt="Admin"
                                    className="w-44 h-44 md:w-52 md:h-52 object-cover sepia-[.2] contrast-110 rounded-sm"
                                />

                                {/* Corner Decorations */}
                                <div className="absolute -top-3 -left-3 text-2xl animate-spin-slow">⭐</div>
                                <div className="absolute -top-3 -right-3 text-2xl animate-spin-slow" style={{ animationDirection: 'reverse' }}>⭐</div>
                                <div className="absolute -bottom-3 -left-3 text-2xl animate-bounce-slow">🔥</div>
                                <div className="absolute -bottom-3 -right-3 text-2xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🔥</div>

                                {/* COOL Badge */}
                                <div className="absolute -top-5 -right-5 bg-yellow-400 text-red-600 font-black text-sm rounded-full w-14 h-14 flex items-center justify-center animate-spin-slow border-4 border-red-600 shadow-xl z-20">
                                    COOL!
                                </div>
                            </div>

                            {/* Online Status */}
                            <div className="text-center mt-2 font-bold text-[#ff00ff] text-lg">
                                {blink ? "● ONLINE" : "○ ONLINE"}
                            </div>
                        </div>

                        {/* Stats Table */}
                        <div className="w-full max-w-[320px] border-2 border-green-500 bg-black p-3 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-green-500 to-transparent"></div>

                            <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                                <span className="animate-pulse">▶</span> STATS.TXT
                            </h3>

                            <table className="w-full text-left font-mono text-sm relative z-10">
                                <tbody className="text-green-300">
                                    <tr className="border-b border-green-900">
                                        <td className="py-1">LEVEL:</td>
                                        <td className="py-1 text-white font-bold">99 (MAX) 🏆</td>
                                    </tr>
                                    <tr className="border-b border-green-900">
                                        <td className="py-1">TAKİPÇİ:</td>
                                        <td className="py-1 text-white font-bold">{stats.followersCount} 👥</td>
                                    </tr>
                                    <tr className="border-b border-green-900">
                                        <td className="py-1">TAKİP:</td>
                                        <td className="py-1 text-white font-bold">{stats.followingCount} 👤</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1">YAZILAR:</td>
                                        <td className="py-1 text-white font-bold">{stats.articlesCount} 📝</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Badges */}
                        <div className="w-full max-w-[320px] border-2 border-yellow-500 bg-black p-3">
                            <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                                <span className="animate-bounce">🏅</span> ROZETLER
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                {userBadges.map((ub: any, i: number) => (
                                    <div key={i} className="w-10 h-10 border-2 border-yellow-600 bg-gray-900 flex items-center justify-center p-1 hover:scale-110 transition-transform" title={ub.badges.name}>
                                        <CustomBadgeIcon name={ub.badges.name} className="w-full h-full text-yellow-400" />
                                    </div>
                                ))}
                                {userBadges.length === 0 && <span className="text-gray-500 text-sm">Henüz rozet yok</span>}
                            </div>
                        </div>

                        {/* Spinning Globe (CSS) */}
                        <div className="text-6xl animate-spin-slow" style={{ animationDuration: '4s' }}>🌍</div>
                    </div>

                    {/* Right Column: Bio */}
                    <div className="bg-gradient-to-br from-[#000080] to-[#000050] border-4 border-outset border-gray-400 p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] relative">

                        {/* Welcome Banner (CSS) */}
                        <div className="absolute -top-4 right-4 bg-red-600 text-white px-3 py-1 font-bold text-sm animate-pulse border-2 border-white z-20">
                            🎉 HOŞGELDİN! 🎉
                        </div>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 animate-pulse tracking-tight md:tracking-wide break-words">
                            @{profile.username.toUpperCase()}
                        </h1>

                        <h2 className="text-white text-base md:text-xl mt-2 mb-4 font-serif italic border-b-2 border-dotted border-white pb-2 flex flex-wrap items-center gap-2">
                            <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs px-2 py-0.5 animate-pulse font-bold">★ NEW!</span>
                            ~ {profile.full_name} ~
                            <span className="text-xl">👑</span>
                        </h2>

                        <div className="bg-white text-black p-4 font-serif text-base leading-relaxed border-4 border-inset border-gray-400 min-h-[200px] max-h-[300px] overflow-y-auto relative">
                            <p>{profile.bio || "Henüz bir biyografi yok... Ama bu profil o kadar havalı ki, biyografiye bile ihtiyaç yok! 😎"}</p>

                            {/* Corner decoration */}
                            <div className="absolute top-2 right-2 text-3xl opacity-30">📜</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col md:flex-row gap-3">
                            <button className="flex-1 px-6 py-3 bg-gradient-to-b from-gray-200 to-gray-400 border-4 border-outset border-white text-black font-bold text-lg active:border-inset active:from-gray-400 active:to-gray-200 flex items-center justify-center gap-2">
                                👤 TAKİP ET
                            </button>
                            <button className="flex-1 px-6 py-3 bg-gradient-to-b from-gray-200 to-gray-400 border-4 border-outset border-white text-black font-bold text-lg active:border-inset active:from-gray-400 active:to-gray-200 flex items-center justify-center gap-2">
                                ✉️ MESAJ AT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Emoji Row */}
                <div className="my-8 flex flex-wrap justify-center gap-3 md:gap-6 text-3xl md:text-5xl">
                    <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎸</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💀</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>👽</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🚀</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>🌙</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>⭐</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.7s' }}>🛸</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>💎</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.9s' }}>🎮</span>
                </div>

                {/* Under Construction Banner */}
                <div className="border-4 border-dashed border-yellow-500 bg-yellow-900/30 p-4 mb-8 text-center">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="text-4xl animate-pulse">🚧</span>
                        <span className="text-yellow-300 font-bold text-xl md:text-2xl animate-pulse">UNDER CONSTRUCTION</span>
                        <span className="text-4xl animate-pulse">🚧</span>
                    </div>
                    <p className="text-yellow-500 text-sm mt-2">Bu bölüm yapım aşamasında... Çok yakında daha fazla içerik!</p>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {/* Articles */}
                    <div className="border-4 border-green-500 bg-black/80 p-4 relative">
                        <div className="absolute -top-4 left-4 bg-black px-3 py-1 text-green-400 font-bold border-2 border-green-500 flex items-center gap-2">
                            📰 SON YAZILAR
                        </div>

                        <ul className="space-y-3 mt-4">
                            {articles.slice(0, 5).map(article => (
                                <li key={article.id} className="border-b border-green-900 pb-2 group">
                                    <Link href={`/makale/${article.slug}`} className="block hover:bg-green-900/50 p-1 transition-colors">
                                        <span className="text-yellow-400 mr-2">►</span>
                                        <span className="text-green-300 group-hover:text-white underline decoration-dotted">{article.title}</span>
                                        <span className="block text-xs text-gray-500 mt-1">{format(new Date(article.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                    </Link>
                                </li>
                            ))}
                            {articles.length === 0 && <li className="text-gray-500 italic">Henüz yazı yok...</li>}
                        </ul>
                    </div>

                    {/* Questions */}
                    <div className="border-4 border-orange-500 bg-black/80 p-4 relative">
                        <div className="absolute -top-4 left-4 bg-black px-3 py-1 text-orange-400 font-bold border-2 border-orange-500 flex items-center gap-2">
                            ❓ FORUM KONULARI
                        </div>

                        <ul className="space-y-3 mt-4">
                            {questions.slice(0, 5).map(question => (
                                <li key={question.id} className="border-b border-orange-900 pb-2 group">
                                    <Link href={`/forum/${question.slug}`} className="block hover:bg-orange-900/50 p-1 transition-colors">
                                        <span className="text-red-400 mr-2">▶</span>
                                        <span className="text-orange-300 group-hover:text-white underline decoration-dotted">{question.title}</span>
                                    </Link>
                                </li>
                            ))}
                            {questions.length === 0 && <li className="text-gray-500 italic">Henüz soru yok...</li>}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500 pb-16 border-t-2 border-gray-800 pt-8">
                    <div className="flex justify-center gap-2 mb-4 flex-wrap">
                        <span className="text-2xl">🖥️</span>
                        <span className="text-2xl">📟</span>
                        <span className="text-2xl">📀</span>
                        <span className="text-2xl">💾</span>
                        <span className="text-2xl">🔊</span>
                    </div>
                    <p className="mb-2">BEST VIEWED WITH INTERNET EXPLORER 4.0 @ 800x600</p>
                    <p className="text-gray-600">© 1999 @BARANBOZKURT INC. All rights reserved.</p>
                    <div className="flex justify-center gap-3 mt-4">
                        <div className="px-3 py-1 bg-gray-700 border-2 border-outset border-gray-500 text-[10px] font-bold text-gray-300">HTML 3.2</div>
                        <div className="px-3 py-1 bg-gray-700 border-2 border-outset border-gray-500 text-[10px] font-bold text-gray-300">NO FRAMES</div>
                        <div className="px-3 py-1 bg-gray-700 border-2 border-outset border-gray-500 text-[10px] font-bold text-gray-300">MIDI ON</div>
                    </div>
                </div>

            </div>

            <style jsx>{`
                /* Starfield layers */
                .stars-layer-1, .stars-layer-2, .stars-layer-3 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent;
                }
                .stars-layer-1 {
                    background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
                                      radial-gradient(2px 2px at 40px 70px, white, transparent),
                                      radial-gradient(1px 1px at 90px 40px, white, transparent),
                                      radial-gradient(2px 2px at 130px 80px, white, transparent),
                                      radial-gradient(1px 1px at 160px 120px, white, transparent);
                    background-size: 200px 200px;
                    animation: stars-move 100s linear infinite;
                }
                .stars-layer-2 {
                    background-image: radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.8), transparent),
                                      radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.6), transparent),
                                      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent);
                    background-size: 250px 250px;
                    animation: stars-move 150s linear infinite;
                }
                .stars-layer-3 {
                    background-image: radial-gradient(1px 1px at 25px 50px, rgba(255,200,100,0.9), transparent),
                                      radial-gradient(1px 1px at 75px 150px, rgba(100,200,255,0.8), transparent),
                                      radial-gradient(2px 2px at 125px 100px, rgba(255,100,200,0.7), transparent);
                    background-size: 300px 300px;
                    animation: stars-move 200s linear infinite reverse;
                }
                @keyframes stars-move {
                    from { transform: translateY(0); }
                    to { transform: translateY(-1000px); }
                }
                
                /* Float animation */
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(5deg); }
                    75% { transform: translateY(10px) rotate(-5deg); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                /* Slow bounce */
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 1.5s ease-in-out infinite;
                }
                
                /* Slow spin */
                .animate-spin-slow {
                    animation: spin 4s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
