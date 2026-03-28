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
import { m as motion, Variants } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";
import HyperText from "@/components/magicui/hyper-text";
import { GlitchText } from "@/components/magicui/glitch-text";
import { createClient } from "@/lib/supabase";
import { TiltCard } from "@/components/magicui/tilt-card";
import { RealisticStars } from "@/components/share/realistic-stars";

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

// BENTO BOX STYLE CARDS (Agresif Neo-Brutalizm)
interface FreshCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    accentColor: string;
    colSpan?: string;
    rowSpan?: string;
    showBorderBeam?: boolean;
    isLarge?: boolean;
    badge?: string;
}

function FreshCard({ title, description, href, icon: Icon, color, accentColor, colSpan = "col-span-1", rowSpan = "row-span-1", showBorderBeam, isLarge, badge }: FreshCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn("relative group w-full h-full perspective-1000", colSpan, rowSpan)}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link prefetch={true} href={href} className="block h-full">
                <TiltCard className="h-full w-full" rotationFactor={8}>
                    <div className={cn(
                        "relative h-full w-full bg-white flex flex-col justify-between overflow-hidden",
                        "border-[3px] border-black rounded-2xl",
                        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
                        "transition-all duration-300 ease-out",
                        isLarge ? "p-6 md:p-8" : "p-5 md:p-6"
                    )}>
                        {showBorderBeam && (
                            <BorderBeam
                                size={400}
                                duration={8}
                                delay={0}
                                borderWidth={4}
                                colorFrom={accentColor}
                                colorTo="#000000"
                            />
                        )}

                        {/* Top Accent Line */}
                        <div className={cn("absolute top-0 left-0 right-0 h-3 border-b-[3px] border-black", color)} />

                        {/* Banner & Icon Header */}
                        <div className="flex items-start justify-between w-full mt-2 mb-4">
                            <div className="flex flex-col gap-3">
                                <div className={cn(
                                    "flex items-center justify-center rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                    color,
                                    isLarge ? "w-16 h-16 sm:w-20 sm:h-20" : "w-14 h-14"
                                )}>
                                    <Icon className={cn("text-black stroke-[2.5px]", isLarge ? "w-8 h-8 sm:w-10 sm:h-10" : "w-7 h-7")} />
                                </div>
                                {badge && (
                                    <span className="inline-flex items-center self-start px-3 py-1 bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_#fff] border border-black transform -rotate-2">
                                        {badge}
                                    </span>
                                )}
                            </div>

                            <div className={cn(
                                "flex items-center justify-center rounded-full border-[3px] border-black",
                                "bg-white group-hover:bg-black transition-colors duration-300",
                                isLarge ? "w-12 h-12" : "w-10 h-10"
                            )}>
                                <ArrowRight className={cn(
                                    "text-black group-hover:text-white transition-colors duration-300",
                                    isLarge ? "w-6 h-6" : "w-5 h-5",
                                    "group-hover:translate-x-1"
                                )} />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="mt-auto">
                            <h3 className={cn(
                                "font-black text-black uppercase mb-1 md:mb-2 leading-[0.9] tracking-tighter",
                                isLarge ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl"
                            )}>
                                <GlitchText text={title} className="block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-zinc-600 transition-all duration-300" />
                            </h3>
                            <p className={cn(
                                "text-zinc-600 font-bold leading-snug",
                                isLarge ? "text-sm sm:text-lg max-w-[80%]" : "text-xs sm:text-sm"
                            )}>
                                {description}
                            </p>
                        </div>

                        {/* Background Abstract Pattern (Visible only on Large Cards) */}
                        {isLarge && (
                            <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700 ease-in-out">
                                <Icon className="w-64 h-64 text-black" />
                            </div>
                        )}
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

    // ... inside component

    return (
        <div className="min-h-screen bg-background pb-24 pt-4 md:pt-20 px-4 font-sans relative overflow-hidden">

            {/* REALISTIC STARS - Behind texture */}
            <RealisticStars />

            {/* TEXTURED PAPER BACKGROUND - Reduced Opacity for Star Visibility */}
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-30 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay"
                style={{
                    // Slightly finer grain (0.5) but still visible
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
                }}
            ></div>



            <div className="max-w-[900px] mx-auto relative z-10">

                {/* Header - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 md:mb-10 pt-2 relative"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 relative z-10">
                        <div className="flex flex-col">
                            <h1 className="text-5xl md:text-7xl font-black text-[#FACC15] leading-[0.85] tracking-tighter uppercase drop-shadow-[4px_4px_0px_#fff] text-stroke-black">
                                Paylaşım<br />
                            </h1>
                            <div className="flex items-center">
                                <HyperText
                                    text="MERKEZİ"
                                    className="text-5xl md:text-7xl font-black text-[#FACC15] leading-[0.85] tracking-tighter uppercase text-stroke-black drop-shadow-[4px_4px_0px_#000]"
                                    duration={1200}
                                />
                            </div>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-black font-bold text-sm md:text-base max-w-xs md:text-right leading-tight bg-white p-3 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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

                {/* ULTRA-PREMIUM BENTO GRID LAYOUT */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[200px]"
                >
                    {/* 1. Blog: L-Shape / Double Width & Height (Hero Item) */}
                    <FreshCard
                        title="BLOG"
                        description="Sıra dışı fikirleri, evrensel notları ve teorilerini kağıda (veya internete) dök."
                        href="/makale/yeni?type=blog"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        accentColor="#FACC15"
                        colSpan="md:col-span-2 lg:col-span-2"
                        rowSpan="row-span-2"
                        showBorderBeam={true}
                        isLarge={true}
                        badge="POPÜLER TERCİH"
                    />

                    {/* 2. Question: Single Block - Very Vibrant */}
                    <FreshCard
                        title="SORU"
                        description="Kafanı kurcalayan o denklemi topluluğa fırlat."
                        href="/forum?create=true"
                        icon={MessageCircle}
                        color="bg-[#FB7185]"
                        accentColor="#FB7185"
                        colSpan="md:col-span-1 lg:col-span-2"
                    />

                    {/* 3. Experiment: Single Block - Vertical Reach */}
                    <FreshCard
                        title="DENEY"
                        description="Laboratuvar sonuçlarını simüle et, kanıtları herkese sun."
                        href="/makale/yeni?type=experiment"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                        accentColor="#4ADE80"
                        colSpan="md:col-span-1 lg:col-span-1"
                        rowSpan="md:row-span-2 lg:row-span-1"
                    />

                    {/* 4. Book: Wide Block */}
                    <FreshCard
                        title="KİTAP"
                        description="Okuduğun bilimsel eseri parçalarına ayır ve incele."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]"
                        accentColor="#60A5FA"
                        colSpan="md:col-span-2 lg:col-span-2"
                    />

                    {/* 5. Term: Wide Block Bottom */}
                    <FreshCard
                        title="TERİM"
                        description="Bilim lügatine ansiklopedik bir kavram bırak."
                        href="/makale/yeni?type=term"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                        accentColor="#C084FC"
                        colSpan="md:col-span-1 lg:col-span-1"
                    />

                </motion.div>

                {/* Footer / Terminal Search Bar - Hacker Style */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-6 sm:mt-8 md:mt-10 pb-12"
                >
                    <Link prefetch={true} href="/ara" className="block w-full group">
                        <div className="bg-zinc-950 text-emerald-500 h-16 sm:h-20 rounded-2xl flex items-center justify-between px-4 sm:px-8 border-[4px] border-black hover:bg-black hover:border-emerald-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[0_0_20px_0px_rgba(16,185,129,0.5)] transition-all duration-300 relative overflow-hidden">
                            {/* Terminal Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

                            <span className="font-bold text-sm sm:text-lg md:text-xl flex items-center gap-2 sm:gap-4 md:gap-5 z-10 w-full">
                                <span className="text-emerald-500 font-mono font-black text-xl sm:text-2xl shrink-0">{`>`}</span>
                                <span className="font-mono text-emerald-400 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                    <span className="opacity-50">root@fizikhub:~#</span> search_archive
                                </span>
                                <span className="w-2.5 sm:w-3.5 h-6 sm:h-7 bg-emerald-500 animate-[pulse_1s_step-end_infinite] shrink-0 inline-block -ml-1 sm:-ml-2"></span>
                            </span>
                            <div className="bg-emerald-500 text-black px-4 sm:px-6 py-2 rounded font-black text-xs sm:text-sm uppercase tracking-widest border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0 z-10 hidden xs:block">
                                EXECUTE
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 1.5px black;
                }
                @media (min-width: 768px) {
                    .text-stroke-black {
                        -webkit-text-stroke: 2px black;
                    }
                }
            `}</style>
        </div>
    );
}
