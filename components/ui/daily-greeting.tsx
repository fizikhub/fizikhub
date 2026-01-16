"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Atom } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Daha doğal, samimi ve "içerden" espriler
const TIME_BASED_MESSAGES = {
    morning: [ // 06:00 - 12:00
        "Kahve henüz kan dolaşımına karışmadıysa ani hareketlerden kaçın.",
        "Güneş doğdu, fotosentez yapamıyoruz ama kahve var, o da olur.",
        "Uyanmak zor, yatak yerçekimiyle işbirliği yapıyor sanki.",
        "Sabahın köründe burada ne işin var? Azim mi, uykusuzluk mu?",
        "Bugün atomu parçalamayacaksan bile en azından yatağını topla."
    ],
    day: [ // 12:00 - 20:00
        "Evren o kadar büyük ki, senin dertler yanında kuantum altı parçacık kalır.",
        "Odaklanman lazım ama o telefonun çekim gücü kara delikten hallice, biliyorum.",
        "Mola verip boşluğa bakmak da çalışmaya dahil mi? Bence dahil.",
        "Beynin nöron ateşlemesi yavaşladıysa bir çikolata ateşle.",
        "Bugün dünyayı kurtarmasan da olur, kendini kurtar yeter."
    ],
    evening: [ // 20:00 - 24:00
        "Günün yorgunluğunu atmak için buradasın, hoş geldin.",
        "Dışarısı karanlık, içerisi aydınlık... yani umarım ekran parlaklığın kısıktır.",
        "Yıldızlar çıktı, senin çalışma masası hala dağınık mı?",
        "Bu saatte ders çalışıyorsan, ya çok zekisin ya da işi son güne bıraktın.",
        "Karanlık madde kadar gizemli takılma, gel iki çift laf edelim (şaka şaka)."
    ],
    night: [ // 00:00 - 02:00
        "Bu saatte ayaktaysan ya çok büyük bir keşif peşindesin ya da yarın sınav var.",
        "Baykuşlar ve fizikçiler için mesai saati başladı.",
        "Uyku, zayıflar içindir... dermişim, git yat aslında.",
        "Gece sessizliği, tam odaklanmalık... ya da dizi izlemelik.",
        "Beynin şu an alfa dalgası yayıyor olması lazımdı ama buradasın."
    ],
    late: [ // 02:00 - 06:00
        "Ciddi soruyorum, vampir misin? Yat uyu artık.",
        "Beynin şuan %1 kapasiteyle çalışıyor, zorlama bence.",
        "Bu saatte burada kimse yok, bi sen bi ben. Git uyu hadi.",
        "Rüyanda fizik çözmek istemiyorsan yatağa gitme vakti.",
        "Gözlerin kapanıyor... yerçekimine direnme, yastığa teslim ol."
    ]
};

function getGreetingData(hour: number) {
    if (hour >= 6 && hour < 12) return { greeting: "Günaydın", time: 'morning' as keyof typeof TIME_BASED_MESSAGES };
    if (hour >= 12 && hour < 20) return { greeting: "İyi Günler", time: 'day' as keyof typeof TIME_BASED_MESSAGES };
    if (hour >= 20 && hour < 24) return { greeting: "İyi Akşamlar", time: 'evening' as keyof typeof TIME_BASED_MESSAGES };
    if (hour >= 0 && hour < 2) return { greeting: "İyi Geceler", time: 'night' as keyof typeof TIME_BASED_MESSAGES };
    return { greeting: "Uyuman Lazım", time: 'late' as keyof typeof TIME_BASED_MESSAGES };
}

export function DailyGreeting() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [message, setMessage] = useState("");
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();
        const { greeting: greetingText, time } = getGreetingData(hour);
        setGreeting(greetingText);

        // Pick random message for that time
        const msgs = TIME_BASED_MESSAGES[time];
        setMessage(msgs[Math.floor(Math.random() * msgs.length)]);

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Get profile name
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', session.user.id)
                    .single();

                const nameToUse = profile?.full_name?.split(' ')[0] || profile?.username || "Kaşif";
                setUserName(nameToUse);

                // Show greeting after 1 second ONLY if logged in
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 1000);

                // Auto hide after 15 seconds
                const hideTimer = setTimeout(() => setIsVisible(false), 16000);

                return () => {
                    clearTimeout(timer);
                    clearTimeout(hideTimer);
                }
            }
        };

        checkAuth();
    }, [supabase]);

    if (!mounted || !userName) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 150, opacity: 0, rotate: 6 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 150, opacity: 0, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[340px] px-4"
                >
                    {/* Main Card - Monochrome Brutalist */}
                    <div className="relative group/card cursor-default transform transition-transform hover:scale-105 duration-300">
                        {/* Background Shadow Layer (Static) */}
                        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-white rounded-xl border-2 border-zinc-900" />

                        {/* Main Content Layer */}
                        <div className="relative bg-zinc-950 text-zinc-50 border-2 border-white rounded-xl p-0 overflow-hidden shadow-2xl">

                            {/* Realistic Star Field - Generated with CSS Radial Gradients for performance and look */}
                            <div className="absolute inset-0 bg-[#020205]">
                                {/* Static Stars Layer 1 (Small) */}
                                <div className="absolute inset-0 opacity-70"
                                    style={{
                                        backgroundImage: `
                                            radial-gradient(1px 1px at 10px 10px, white, transparent),
                                            radial-gradient(1px 1px at 50px 80px, white, transparent),
                                            radial-gradient(1.5px 1.5px at 120px 40px, white, transparent),
                                            radial-gradient(1px 1px at 200px 150px, white, transparent),
                                            radial-gradient(1.5px 1.5px at 280px 90px, white, transparent),
                                            radial-gradient(1px 1px at 310px 220px, white, transparent),
                                            radial-gradient(1px 1px at 80px 180px, white, transparent),
                                            radial-gradient(1.5px 1.5px at 150px 240px, white, transparent)
                                        `,
                                        backgroundSize: '350px 350px'
                                    }}
                                />
                                {/* Static Stars Layer 2 (Tiny, offsets) */}
                                <div className="absolute inset-0 opacity-40"
                                    style={{
                                        backgroundImage: `
                                            radial-gradient(1px 1px at 30px 50px, white, transparent),
                                            radial-gradient(1px 1px at 150px 20px, white, transparent),
                                            radial-gradient(1px 1px at 250px 280px, white, transparent),
                                            radial-gradient(1px 1px at 50px 250px, white, transparent)
                                        `,
                                        backgroundSize: '200px 200px'
                                    }}
                                />

                                {/* Twinkling Star */}
                                <motion.div
                                    className="absolute top-10 right-10 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_2px_rgba(255,255,255,0.4)]"
                                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.div
                                    className="absolute bottom-12 left-8 w-0.5 h-0.5 bg-blue-200 rounded-full shadow-[0_0_3px_1px_rgba(191,219,254,0.4)]"
                                    animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                />

                                {/* Realistic Shooting Star - Fast and sharp */}
                                <motion.div
                                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                                    style={{ width: '80px', top: '20%', left: '0%' }}
                                    animate={{
                                        x: [250, -100], // Moves left across
                                        y: [-50, 100],  // Moves down
                                        opacity: [0, 1, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatDelay: 6,
                                        ease: "circIn" // Sharp start
                                    }}
                                />

                                {/* Another Shooting Star - Different angle */}
                                <motion.div
                                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
                                    style={{ width: '60px', top: '10%', right: '-10%' }}
                                    animate={{
                                        x: [0, -200],
                                        y: [0, 150],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        repeatDelay: 9,
                                        delay: 3,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>

                            {/* Close Button - Floated */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-2 right-2 p-1.5 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-all z-20"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Body */}
                            <div className="p-4 pt-5 flex gap-3 relative z-10 items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-lg border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover/card:border-white/50 transition-all">
                                        <Atom className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 pr-4">
                                    <h4 className="text-base font-black tracking-tight leading-4 text-white drop-shadow-lg">
                                        {greeting}, <br />
                                        <span className="text-lg bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-extrabold bg-[length:200%_auto] animate-gradient">
                                            {userName}
                                        </span>.
                                    </h4>
                                    <p className="text-xs font-medium text-blue-100/70 leading-snug mt-1.5 drop-shadow-md shadow-black">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar Animation */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
