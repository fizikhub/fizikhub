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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase-client";
import { RealisticStars } from "@/components/share/realistic-stars";

interface BrutalCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    className?: string;
    rotation: string;
}

function BrutalCard({ title, description, href, icon: Icon, color, className, rotation }: BrutalCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{
                scale: 1.05,
                rotate: 0,
                zIndex: 50,
                y: -10
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            className={cn(
                "group relative block w-full border-[3px] border-black p-6 rounded-none cursor-pointer",
                "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300",
                color,
                rotation,
                className
            )}
        >
            <Link href={href} className="flex flex-col h-full justify-between gap-8">
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-black stroke-[3px]" />
                    </div>

                    {/* Decorative tape / pin  */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-zinc-200/80 border-2 border-black/20 rotate-[-5deg] mix-blend-overlay opacity-80" />

                    <div className="w-10 h-10 border-[3px] border-black bg-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black transition-colors">
                        <ArrowRight className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tighter leading-none mb-3">
                        {title}
                    </h3>
                    <p className="text-black font-bold text-lg md:text-xl leading-snug border-t-2 border-black/30 pt-3">
                        {description}
                    </p>
                </div>
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
                    setUserName(profile.full_name || profile.username || "FİZİKÇİ");
                } else {
                    setUserName("FİZİKÇİ");
                }
            }
            setLoaded(true);
        };
        fetchUser();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-[#FFFDF0] pb-24 font-sans relative overflow-hidden">
            {/* NOISE OVERLAY */}
            <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.25]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 pt-12 md:pt-24 relative z-10">
                {/* HERO HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[4px] border-black pb-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute -inset-2 bg-[#FACC15] border-[3px] border-black shadow-[8px_8px_0px_#000] -rotate-1 z-0"></div>
                        <h1 className="relative z-10 text-6xl md:text-8xl lg:text-9xl font-black text-black leading-[0.8] tracking-tighter uppercase ml-2 mt-2">
                            PAYLAŞIM<br />
                            <span className="text-white text-stroke-black drop-shadow-[4px_4px_0px_#000]">MERKEZİ</span>
                        </h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, rotate: -10 }}
                        animate={{ opacity: 1, rotate: 3 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="bg-white border-[3px] border-black p-4 shadow-[6px_6px_0px_#000] rotate-3 max-w-xs"
                    >
                        <p className="text-black font-black text-lg leading-snug uppercase">
                            {loaded ? (
                                userName ?
                                    `MERHABA ${userName.toUpperCase()}! DÜNYAYA NE KATMAK İSTERSİN?` :
                                    "BUGÜN NE PAYLAŞMAK İSTERSİN?"
                            ) : (
                                "YÜKLENİYOR..."
                            )}
                        </p>
                    </motion.div>
                </motion.div>

                {/* THE ASYMMETRIC PINBOARD DESK */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 auto-rows-auto">

                    {/* MAKALE - Big Feature */}
                    <div className="lg:col-span-8 lg:row-span-2">
                        <BrutalCard
                            title="MAKALE"
                            description="Derinlemesine bilimsel içerikler üret. İnsanları aydınlat."
                            href="/makale/yeni"
                            icon={FileText}
                            color="bg-[#FACC15]"
                            rotation="-rotate-1"
                            className="h-full min-h-[300px]"
                        />
                    </div>

                    {/* SORU */}
                    <div className="lg:col-span-4 lg:row-span-1">
                        <BrutalCard
                            title="SORU"
                            description="Kafana takılanları topluluğa sor."
                            href="/forum?create=true"
                            icon={MessageCircle}
                            color="bg-[#FB7185]"
                            rotation="rotate-2"
                        />
                    </div>

                    {/* DENEY */}
                    <div className="lg:col-span-4 lg:row-span-1">
                        <BrutalCard
                            title="DENEY"
                            description="Laboratuvar sonuçlarını aktar."
                            href="/makale/yeni?type=experiment"
                            icon={FlaskConical}
                            color="bg-[#4ADE80]"
                            rotation="-rotate-2"
                        />
                    </div>

                    {/* KİTAP */}
                    <div className="lg:col-span-5 lg:row-span-1">
                        <BrutalCard
                            title="KİTAP"
                            description="Okuduğun kitapların en vurucu incelemelerini yaz."
                            href="/kitap-inceleme/yeni"
                            icon={Library}
                            color="bg-[#60A5FA]"
                            rotation="rotate-1"
                        />
                    </div>

                    {/* TERİM */}
                    <div className="lg:col-span-4 lg:row-span-1">
                        <BrutalCard
                            title="TERİM"
                            description="Bilim sözlüğüne terim ekle."
                            href="/makale/yeni?type=term"
                            icon={BookOpen}
                            color="bg-[#C084FC]"
                            rotation="-rotate-1"
                        />
                    </div>

                    {/* BLOG */}
                    <div className="lg:col-span-3 lg:row-span-1">
                        <BrutalCard
                            title="BLOG"
                            description="Serbest, günlük yazılar."
                            href="/makale/yeni?type=blog"
                            icon={FileText}
                            color="bg-orange-400"
                            rotation="rotate-3"
                        />
                    </div>

                </div>

                {/* SEARCH COMMAND BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 md:mt-24"
                >
                    <Link href="/ara" className="block group">
                        <div className="bg-black text-white p-6 md:p-8 border-[4px] border-black hover:bg-[#1a1a1a] shadow-[8px_8px_0px_#C084FC] group-hover:shadow-[12px_12px_0px_#C084FC] group-hover:-translate-y-1 transition-all flex items-center justify-between">
                            <span className="font-black text-xl md:text-3xl uppercase tracking-tighter flex items-center gap-4">
                                <span className="animate-ping bg-[#4ADE80] w-4 h-4 rounded-none border-2 border-white inline-block"></span>
                                <span className="text-[#C084FC]">&gt;</span> DAHA FAZLASINI ARA...
                            </span>
                            <div className="bg-white text-black px-6 py-2 font-black text-lg md:text-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] rotate-2 group-hover:rotate-0 transition-transform">
                                ENTER
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 2px black;
                }
                @media (min-width: 768px) {
                    .text-stroke-black {
                        -webkit-text-stroke: 3px black;
                    }
                }
            `}</style>
        </div>
    );
}
