"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    ArrowRight,
    Search,
    Atom,
    Rocket,
    Globe,
    PenTool,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Meteors } from "@/components/magicui/meteors";
import { BorderBeam } from "@/components/magicui/border-beam";
import HyperText from "@/components/magicui/hyper-text";
import { GlitchText } from "@/components/magicui/glitch-text";
import { createClient } from "@/lib/supabase-client";
import { TiltCard } from "@/components/magicui/tilt-card";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95, filter: "blur(10px)" },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

interface FreshCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    accentColor: string;
    colSpan?: string;
    showBorderBeam?: boolean;
}

function FreshCard({ title, description, href, icon: Icon, color, accentColor, colSpan = "col-span-1", showBorderBeam }: FreshCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn("relative group h-full perspective-1000", colSpan)}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href} className="block h-full">
                <TiltCard className="h-full" rotationFactor={15}>
                    <div className="
                        relative h-full 
                        bg-white/80 dark:bg-zinc-900/60
                        backdrop-blur-xl
                        border-[3px] border-black dark:border-white/10
                        rounded-[2rem]
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                        dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]
                        group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                        dark:group-hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]
                        group-hover:-translate-y-1 group-hover:translate-x-1
                        transition-all duration-300 ease-out
                        flex flex-col
                        overflow-hidden
                    ">
                        {showBorderBeam && (
                            <BorderBeam
                                size={400}
                                duration={6}
                                delay={0}
                                borderWidth={3}
                                colorFrom={accentColor}
                                colorTo="#FFF"
                            />
                        )}

                        {/* Glass Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="px-6 py-6 flex flex-col justify-between h-full relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "w-14 h-14 flex items-center justify-center rounded-2xl border-[3px] border-black dark:border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-transform group-hover:rotate-6 duration-300",
                                    color
                                )}>
                                    <Icon className="w-7 h-7 text-black stroke-[2.5px]" />
                                </div>
                                <div className="
                                    w-10 h-10 rounded-full border-[2px] border-black dark:border-white/20 flex items-center justify-center
                                    bg-transparent group-hover:bg-black dark:group-hover:bg-white transition-all duration-300
                                ">
                                    <ArrowRight className="w-5 h-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase mb-2 leading-none tracking-tight">
                                    <GlitchText text={title} className="block" />
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-bold text-sm leading-snug">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </Link>
        </motion.div>
    );
}

export default function PaylasPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserName(profile.full_name || profile.username || "Bilim İnsanı");
                } else {
                    setUserName("Bilim İnsanı");
                }
            }
            setLoaded(true);
        };
        fetchUser();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] pb-32 pt-20 md:pt-24 px-4 font-sans relative overflow-hidden selection:bg-[#FACC15] selection:text-black">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FACC15]/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FB7185]/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-[#C084FC]/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Pattern Overlay */}
            <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Meteors */}
            <Meteors number={20} className="dark:opacity-40" />

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-16 relative"
                >
                    <div className="flex flex-col items-center text-center gap-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                                {loaded ? `Hoş geldin, ${userName}` : "Sistem Hazırlanıyor..."}
                            </span>
                        </div>

                        <div className="relative">
                            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-black to-zinc-600 dark:from-white dark:to-zinc-500 leading-none tracking-tighter uppercase drop-shadow-sm">
                                Paylaşım<br />
                            </h1>
                            <div className="relative inline-block">
                                <div className="absolute -inset-1 bg-[#FACC15] blur-xl opacity-30 dark:opacity-20"></div>
                                <HyperText
                                    text="MERKEZİ"
                                    className="relative text-6xl md:text-8xl font-black text-[#FACC15] leading-none tracking-tighter uppercase text-stroke-black dark:text-stroke-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
                                    duration={1000}
                                />
                            </div>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg max-w-md mx-auto leading-relaxed">
                            Bilimsel birikimini toplulukla paylaş. İçerik türünü seç ve üretmeye başla.
                        </p>
                    </div>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 px-2"
                >
                    {/* 1. Article */}
                    <FreshCard
                        title="MAKALE"
                        description="Derinlemesine bilimsel içerik ve analizler."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]" // Yellow
                        accentColor="#FACC15"
                        colSpan="lg:col-span-2"
                        showBorderBeam={true}
                    />

                    {/* 2. Question */}
                    <FreshCard
                        title="SORU"
                        description="Aklına takılanları topluluğa danış."
                        href="/forum"
                        icon={HelpCircle}
                        color="bg-[#FB7185]" // Rose
                        accentColor="#FB7185"
                    />

                    {/* 3. Experiment */}
                    <FreshCard
                        title="DENEY"
                        description="Laboratuvar sonuçlarını ve gözlemlerini aktar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]" // Green
                        accentColor="#4ADE80"
                    />

                    {/* 4. Book */}
                    <FreshCard
                        title="KİTAP"
                        description="Okuduğun bilimsel eserleri incele."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]" // Blue
                        accentColor="#60A5FA"
                    />

                    {/* 5. Term */}
                    <FreshCard
                        title="TERİM"
                        description="Bilim sözlüğüne yeni kavramlar ekle."
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-[#C084FC]" // Purple
                        accentColor="#C084FC"
                    />

                </motion.div>

                {/* Footer / Search Link */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-12 md:mt-16 pb-12 px-2"
                >
                    <Link href="/ara" className="block group">
                        <div className="relative overflow-hidden bg-black dark:bg-white text-white dark:text-black h-20 rounded-[2rem] flex items-center justify-between px-8 border-[3px] border-black dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                            <span className="font-bold text-lg md:text-xl flex items-center gap-4 relative z-10">
                                <Search className="w-6 h-6" />
                                <span className="font-mono opacity-60">_komut_satiri:</span>
                                <span>Daha fazlasını ara...</span>
                            </span>

                            <div className="hidden md:flex bg-[#FACC15] text-black px-4 py-2 rounded-xl font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                ENTER
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 1.5px black;
                }
                .text-stroke-white {
                    -webkit-text-stroke: 1.5px white;
                }
                @media (min-width: 768px) {
                    .text-stroke-black {
                        -webkit-text-stroke: 2.5px black;
                    }
                    .text-stroke-white {
                        -webkit-text-stroke: 2.5px white;
                    }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
