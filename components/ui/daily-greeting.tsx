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
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[380px] px-4"
                >
                    {/* Main Card - Monochrome Brutalist */}
                    <div className="relative group/card cursor-default">
                        {/* Background Shadow Layer (Static) */}
                        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white rounded-xl border-2 border-zinc-900" />

                        {/* Main Content Layer */}
                        <div className="relative bg-zinc-950 text-zinc-50 border-2 border-white rounded-xl p-0 overflow-hidden transition-transform duration-200 group-hover/card:-translate-y-1 group-hover/card:-translate-x-1">

                            {/* Stars Background Effect */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }}></div>

                            {/* Header Strip */}
                            <div className="flex items-center justify-between px-4 py-2 border-b-2 border-white/20 bg-zinc-900/80 backdrop-blur-sm relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                                        SİSTEM MESAJI
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 hover:bg-white hover:text-black rounded-md transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-5 flex gap-4 relative z-10">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-lg border-2 border-white/20 flex items-center justify-center shadow-inner group-hover/card:border-white transition-colors">
                                        <Atom className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-lg font-black tracking-tight leading-none text-white">
                                        {greeting}, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{userName}</span>.
                                    </h4>
                                    <p className="text-sm font-medium text-zinc-400 leading-snug mt-1">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar Animation (Auto-close visualization) */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="h-1 bg-white/20 relative z-10"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
