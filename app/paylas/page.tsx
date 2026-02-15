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
    Globe
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
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 120,
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
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href} className="block h-full">
                <TiltCard className="h-full" rotationFactor={12}>
                    <div className="
                        relative h-full 
                        bg-white dark:bg-zinc-900
                        border-[3px] border-black dark:border-zinc-200
                        rounded-xl 
                        shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]
                        group-hover:shadow-[6px_6px_0px_0px_#000] dark:group-hover:shadow-[6px_6px_0px_0px_#fff]
                        group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                        transition-all duration-200 ease-out
                        flex flex-col
                        overflow-hidden
                    ">
                        {showBorderBeam && (
                            <BorderBeam
                                size={300}
                                duration={8}
                                delay={0}
                                borderWidth={3}
                                colorFrom="#FACC15"
                                colorTo="#FB7185"
                            />
                        )}

                        {/* Decorative top bar */}
                        <div className={cn("h-4 w-full border-b-[3px] border-black dark:border-zinc-200", color)}></div>

                        <div className="px-5 py-5 flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn(
                                    "w-12 h-12 flex items-center justify-center rounded-lg border-[3px] border-black dark:border-zinc-200 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]",
                                    color
                                )}>
                                    <Icon className="w-6 h-6 text-black stroke-[2.5px]" />
                                </div>
                                <div className="
                                    w-7 h-7 rounded-full border-[2px] border-black dark:border-zinc-200 flex items-center justify-center
                                    bg-transparent group-hover:bg-black dark:group-hover:bg-white transition-colors duration-200
                                ">
                                    <ArrowRight className="w-4 h-4 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-black dark:text-white uppercase mb-1 leading-none tracking-tight">
                                    <GlitchText text={title} className="block" />
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-bold text-xs md:text-sm leading-snug">
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
        <div className="min-h-screen bg-background pb-32 pt-16 md:pt-20 px-4 font-sans relative overflow-hidden">

            {/* TEXTURED PAPER BACKGROUND */}
            <div className="absolute inset-0 opacity-20 dark:opacity-5 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            ></div>

            {/* METEORS - Subtle Background Motion */}
            <Meteors number={15} />

            <div className="max-w-[900px] mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 md:mb-10 pt-4 relative"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[0.9] tracking-tighter uppercase">
                                Paylaşım<br />
                            </h1>
                            <div className="flex items-center">
                                <HyperText
                                    text="MERKEZİ"
                                    className="text-4xl md:text-6xl font-black text-[#FACC15] leading-[0.9] tracking-tighter uppercase text-stroke-black dark:text-stroke-white drop-shadow-[3px_3px_0px_#000] dark:drop-shadow-[3px_3px_0px_#fff]"
                                    duration={1200}
                                />
                            </div>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-foreground font-bold text-sm md:text-base max-w-xs md:text-right leading-tight bg-background/80 backdrop-blur-sm p-3 rounded-lg border-2 border-border/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                        >
                            {loaded ? (
                                userName ?
                                    `Bugün ne paylaşmak istersin, ${userName}?` :
                                    "Bugün ne paylaşmak istersin?"
                            ) : (
                                "Yükleniyor..."
                            )}
                        </motion.p>
                    </div>
                </motion.div>

                {/* Grid - Optimizing for Mobile 2x3 Layout */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                >
                    {/* 1. Article - Yellow (1x1 on Mobile, 2x1 on Desktop if needed, but let's keep it uniform for mobile compactness) */}
                    <FreshCard
                        title="MAKALE"
                        description="Derinlemesine içerik üret."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        accentColor="#FACC15"
                        colSpan="col-span-1 md:col-span-2 lg:col-span-2" // 1x1 on mobile!
                        showBorderBeam={true}
                    />

                    {/* 2. Question - Pink */}
                    <FreshCard
                        title="SORU"
                        description="Topluluğa danış."
                        href="/forum"
                        icon={MessageCircle}
                        color="bg-[#FB7185]"
                        accentColor="#FB7185"
                    />

                    {/* 3. Experiment - Green */}
                    <FreshCard
                        title="DENEY"
                        description="Sonuçları aktar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                        accentColor="#4ADE80"
                    />

                    {/* 4. Book - Blue */}
                    <FreshCard
                        title="KİTAP"
                        description="Kütüphane notları."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]"
                        accentColor="#60A5FA"
                    />

                    {/* 5. Term - Purple */}
                    <FreshCard
                        title="TERİM"
                        description="Sözlüğe katkı sağla."
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                        accentColor="#C084FC"
                    />

                    {/* 6. Blog - Orange */}
                    <FreshCard
                        title="BLOG"
                        description="Serbest yazı."
                        href="/blog"
                        icon={FileText}
                        color="bg-orange-400"
                        accentColor="#fb923c"
                    />

                </motion.div>

                {/* Footer / Search Link */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-6 md:mt-8 pb-8"
                >
                    <Link href="/ara" className="block group">
                        <div className="bg-black dark:bg-white text-white dark:text-black h-14 md:h-16 rounded-xl flex items-center justify-between px-5 md:px-6 border-[3px] border-black dark:border-white hover:bg-[#1a1a1a] dark:hover:bg-zinc-200 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]">
                            <span className="font-bold text-sm md:text-lg flex items-center gap-3">
                                <div className="animate-pulse bg-green-500 w-2 h-2 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                                <span className="font-mono text-gray-300 dark:text-gray-600">_komut_satiri:</span>
                                <span className="text-white dark:text-black">Daha fazlasını ara...</span>
                            </span>
                            <div className="bg-[#FACC15] text-black px-3 py-1 rounded-md font-black text-xs md:text-sm border-2 border-black shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000]">
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
                .dark .text-stroke-white {
                     -webkit-text-stroke: 1.5px white;
                }
                @media (min-width: 768px) {
                    .text-stroke-black {
                        -webkit-text-stroke: 2px black;
                    }
                    .dark .text-stroke-white {
                         -webkit-text-stroke: 2px white;
                    }
                }
            `}</style>
        </div>
    );
}
