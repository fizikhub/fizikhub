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
    type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { m as motion, Variants } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";
import HyperText from "@/components/magicui/hyper-text";
import { GlitchText } from "@/components/magicui/glitch-text";
import { createClient } from "@/lib/supabase";
import { TiltCard } from "@/components/magicui/tilt-card";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// PERF: Lazy-load heavy Three.js WebGL canvas to prevent main-thread blocking
const RealisticStars = dynamic(() => import("@/components/share/realistic-stars").then(mod => mod.RealisticStars), {
    ssr: false,
    loading: () => null
});

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

// PERF: Opacity-only transitions to prevent CLS (no y/scale transforms)
const item: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

// BENTO BOX STYLE CARDS (Agresif Neo-Brutalizm)
interface FreshCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;
    accentColor: string;
    eyebrow: string;
    colSpan?: string;
    rowSpan?: string;
    showBorderBeam?: boolean;
    isLarge?: boolean;
    badge?: string;
    onProtectedClick?: (href: string, title: string) => void;
}

function FreshCard({ title, description, href, icon: Icon, color, accentColor, eyebrow, colSpan = "col-span-1", rowSpan = "row-span-1", showBorderBeam, isLarge, badge, onProtectedClick }: FreshCardProps) {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!onProtectedClick) return;

        event.preventDefault();
        onProtectedClick(href, title);
    };

    return (
        <motion.div
            variants={item}
            className={cn("relative group w-full h-full [perspective:1000px] hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] transition-transform duration-300", colSpan, rowSpan)}
        >
            <Link prefetch={false} href={href} aria-label={`${title} paylaş`} className="block h-full" onClick={handleClick}>
                <TiltCard className="h-full w-full" rotationFactor={8}>
                    <div className={cn(
                        "relative h-full w-full bg-white flex flex-col justify-between overflow-hidden",
                        "border-[3px] border-black rounded-[1.35rem]",
                        "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
                        "transition-all duration-300 ease-out",
                        isLarge ? "p-5 min-[390px]:p-6 md:p-8" : "p-4 min-[390px]:p-5 md:p-6"
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
                        <div className={cn("absolute top-0 left-0 right-0 h-3.5 border-b-[3px] border-black", color)} />
                        <div className={cn("absolute bottom-0 left-0 h-[42%] w-2 border-r-[3px] border-black opacity-0 transition-opacity duration-300 group-hover:opacity-100", color)} />

                        {/* Banner & Icon Header */}
                        <div className="flex items-start justify-between w-full mt-2 mb-4 min-[390px]:mb-5">
                            <div className="flex flex-col gap-2.5 min-[390px]:gap-3">
                                <div className={cn(
                                    "flex items-center justify-center rounded-[1.15rem] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                    color,
                                    isLarge ? "w-16 h-16 sm:w-20 sm:h-20" : "w-14 h-14 min-[390px]:w-16 min-[390px]:h-16"
                                )}>
                                    <Icon className={cn("text-black stroke-[2.6px]", isLarge ? "w-8 h-8 sm:w-10 sm:h-10" : "w-7 h-7 min-[390px]:w-8 min-[390px]:h-8")} />
                                </div>
                                {badge && (
                                    <span className="inline-flex items-center self-start px-3 py-1 bg-black text-white text-[10px] sm:text-xs font-black uppercase rounded-full shadow-[2px_2px_0px_0px_#fff] border border-black -rotate-2">
                                        {badge}
                                    </span>
                                )}
                            </div>

                            <div className={cn(
                                "flex items-center justify-center rounded-full border-[3px] border-black",
                                "bg-white group-hover:bg-black transition-colors duration-300",
                                "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none",
                                isLarge ? "w-12 h-12 sm:w-14 sm:h-14" : "w-10 h-10 min-[390px]:w-12 min-[390px]:h-12"
                            )}>
                                <ArrowRight className={cn(
                                    "text-black group-hover:text-white transition-colors duration-300",
                                    isLarge ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 min-[390px]:w-6 min-[390px]:h-6",
                                    "group-hover:translate-x-1"
                                )} />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="relative z-10 mt-auto">
                            <span className={cn(
                                "mb-2 hidden text-[10px] font-black uppercase text-zinc-400",
                                isLarge ? "min-[380px]:block" : "md:block"
                            )}>
                                {eyebrow}
                            </span>
                            <h3 className={cn(
                                "font-black text-black uppercase mb-1.5 md:mb-2 leading-[0.9]",
                                isLarge ? "text-4xl sm:text-5xl lg:text-6xl" : "text-[2rem] min-[390px]:text-4xl md:text-4xl"
                            )}>
                                <GlitchText text={title} className="block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-zinc-600 transition-all duration-300" />
                            </h3>
                            <p className={cn(
                                "text-zinc-600 font-extrabold leading-snug",
                                isLarge ? "text-sm min-[390px]:text-base sm:text-lg max-w-[92%] sm:max-w-[78%] line-clamp-3" : "text-sm min-[390px]:text-[15px] line-clamp-2"
                            )}>
                                {description}
                            </p>
                        </div>

                        {/* Background Abstract Pattern */}
                        <div className={cn(
                            "absolute pointer-events-none text-black transition-transform duration-700 ease-in-out group-hover:rotate-12 group-hover:scale-110",
                            isLarge ? "-bottom-12 -right-10 opacity-10" : "-bottom-8 -right-8 opacity-[0.04]"
                        )}>
                            <Icon className={cn(isLarge ? "w-64 h-64" : "w-40 h-40")} />
                        </div>
                    </div>
                </TiltCard>
            </Link>
        </motion.div>
    );
}

export default function PaylasPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (isMounted) setIsAuthenticated(true);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    if (isMounted) setUserName(profile.full_name || profile.username || "Bilim İnsanı");
                } else {
                    if (isMounted) setUserName("Bilim İnsanı");
                }
            } else if (isMounted) {
                setIsAuthenticated(false);
            }
            if (isMounted) setLoaded(true);
        };

        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(() => fetchUser(), { timeout: 1600 });
            return () => {
                isMounted = false;
                window.cancelIdleCallback(idleId);
            };
        }

        const timeout = setTimeout(() => fetchUser(), 350);
        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [supabase]);

    const requireAuth = (href: string, title: string) => {
        if (isAuthenticated) {
            router.push(href);
            return;
        }

        const label = title === "SORU" ? "soru sormak" : title === "KİTAP" ? "kitap incelemesi yazmak" : title === "BLOG" ? "blog yazmak" : `${title.toLocaleLowerCase("tr-TR")} paylaşmak`;

        toast(`Fizikhub'a giriş yapmalısın`, {
            description: `${label.charAt(0).toLocaleUpperCase("tr-TR") + label.slice(1)} için giriş yapmalı veya üye olmalısın.`,
            className: "dynamic-island-toast",
            duration: 1800,
        });

        window.setTimeout(() => {
            router.push(`/login?next=${encodeURIComponent(href)}`);
        }, 850);
    };

    return (
        <div className="min-h-screen bg-background px-3 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4 font-sans relative overflow-hidden sm:px-4 md:pt-20">

            {/* REALISTIC STARS - Behind texture */}
            <RealisticStars />

            {/* TEXTURED PAPER BACKGROUND - Reduced Opacity for Star Visibility */}
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-30 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay"
                style={{
                    // Slightly finer grain (0.5) but still visible
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
                }}
            ></div>



            <div className="max-w-[980px] mx-auto relative z-10">

                {/* Header - Compact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-5 pt-2 relative sm:mb-7 md:mb-10"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                        <div className="flex flex-col">
                            <h1 className="text-[clamp(3.2rem,16vw,5.6rem)] md:text-7xl font-black text-[#FACC15] leading-[0.84] uppercase drop-shadow-[4px_4px_0px_#fff] text-stroke-black">
                                Paylaşım<br />
                            </h1>
                            <div className="flex items-center">
                                <HyperText
                                    text="MERKEZİ"
                                    className="text-[clamp(3.2rem,16vw,5.6rem)] md:text-7xl font-black text-white leading-[0.84] uppercase text-stroke-black drop-shadow-[4px_4px_0px_#000]"
                                    duration={1200}
                                />
                            </div>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center md:items-start text-black font-black text-base md:text-base w-full md:w-auto max-w-xl md:max-w-xs md:text-right leading-tight bg-white px-4 py-3 rounded-[1.1rem] border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] min-h-[64px] md:min-h-[62px]"
                        >
                            {loaded ? (
                                userName ?
                                    <span className="line-clamp-2">Bugün ne paylaşmak istersin, {userName}?</span> :
                                    <span>Bugün ne paylaşmak istersin?</span>
                            ) : (
                                <span className="opacity-50">Yükleniyor...</span>
                            )}
                        </motion.p>
                    </div>
                </motion.div>

                {/* ULTRA-PREMIUM BENTO GRID LAYOUT */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-4 auto-rows-[204px] min-[390px]:auto-rows-[216px] sm:gap-5 sm:auto-rows-[220px] md:grid-cols-3 md:gap-6 md:auto-rows-[200px] lg:grid-cols-4"
                >
                    {/* 1. Blog: L-Shape / Double Width & Height (Hero Item) */}
                    <FreshCard
                        title="BLOG"
                        description="Sıra dışı fikirleri, evrensel notları ve teorilerini kağıda (veya internete) dök."
                        href="/makale/yeni?type=blog"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        accentColor="#FACC15"
                        eyebrow="Makale alanı"
                        colSpan="md:col-span-2 lg:col-span-2"
                        rowSpan="row-span-2"
                        showBorderBeam={true}
                        isLarge={true}
                        badge="POPÜLER TERCİH"
                        onProtectedClick={!isAuthenticated ? requireAuth : undefined}
                    />

                    {/* 2. Question: Single Block - Very Vibrant */}
                    <FreshCard
                        title="SORU"
                        description="Kafanı kurcalayan o denklemi topluluğa fırlat."
                        href="/forum?create=true"
                        icon={MessageCircle}
                        color="bg-[#FB7185]"
                        accentColor="#FB7185"
                        eyebrow="Topluluk sorusu"
                        colSpan="md:col-span-1 lg:col-span-2"
                        onProtectedClick={!isAuthenticated ? requireAuth : undefined}
                    />

                    {/* 3. Experiment: Single Block - Vertical Reach */}
                    <FreshCard
                        title="DENEY"
                        description="Laboratuvar sonuçlarını simüle et, kanıtları herkese sun."
                        href="/makale/yeni?type=experiment"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                        accentColor="#4ADE80"
                        eyebrow="Kanıt ve simülasyon"
                        colSpan="md:col-span-1 lg:col-span-1"
                        rowSpan="md:row-span-2 lg:row-span-1"
                        onProtectedClick={!isAuthenticated ? requireAuth : undefined}
                    />

                    {/* 4. Book: Wide Block */}
                    <FreshCard
                        title="KİTAP"
                        description="Okuduğun bilimsel eseri parçalarına ayır ve incele."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]"
                        accentColor="#60A5FA"
                        eyebrow="Okuma notu"
                        colSpan="md:col-span-2 lg:col-span-2"
                        onProtectedClick={!isAuthenticated ? requireAuth : undefined}
                    />

                    {/* 5. Term: Wide Block Bottom */}
                    <FreshCard
                        title="TERİM"
                        description="Bilim lügatine ansiklopedik bir kavram bırak."
                        href="/makale/yeni?type=term"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                        accentColor="#C084FC"
                        eyebrow="Bilim sözlüğü"
                        colSpan="md:col-span-1 lg:col-span-1"
                        onProtectedClick={!isAuthenticated ? requireAuth : undefined}
                    />

                </motion.div>

                {/* Footer / Terminal Search Bar - Hacker Style */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-5 sm:mt-8 md:mt-10"
                >
                    <Link prefetch={false} href="/ara" className="block w-full group">
                        <div className="bg-zinc-950 text-emerald-500 h-16 sm:h-20 rounded-[1.35rem] flex items-center justify-between px-4 sm:px-8 border-[4px] border-black hover:bg-black hover:border-emerald-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[0_0_20px_0px_rgba(16,185,129,0.5)] transition-all duration-300 relative overflow-hidden">
                            {/* Terminal Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

                            <span className="font-bold text-sm sm:text-lg md:text-xl flex items-center gap-2 sm:gap-4 md:gap-5 z-10 w-full">
                                <span className="text-emerald-500 font-mono font-black text-xl sm:text-2xl shrink-0">{`>`}</span>
                                <span className="font-mono text-emerald-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                    <span className="opacity-50">root@fizikhub:~#</span> search_archive
                                </span>
                                <span className="w-2.5 sm:w-3.5 h-6 sm:h-7 bg-emerald-500 animate-[pulse_1s_step-end_infinite] shrink-0 inline-block -ml-1 sm:-ml-2"></span>
                            </span>
                            <div className="bg-emerald-500 text-black px-4 sm:px-6 py-2 rounded font-black text-xs sm:text-sm uppercase border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0 z-10 hidden min-[420px]:block">
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
