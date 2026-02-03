"use client";

import Link from "next/link";
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
import OrbitingCircles from "@/components/magicui/orbiting-circles";
import { Meteors } from "@/components/magicui/meteors";
import { BorderBeam } from "@/components/magicui/border-beam";

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
            className={cn("relative group h-full", colSpan)}
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href} className="block h-full">
                <div className="
                    relative h-full 
                    bg-white 
                    border-[3px] border-black 
                    rounded-xl 
                    shadow-[3px_3px_0px_0px_#000] 
                    group-hover:shadow-[6px_6px_0px_0px_#000] 
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
                    <div className={cn("h-4 w-full border-b-[3px] border-black", color)}></div>

                    <div className="px-5 py-5 flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between mb-3">
                            <div className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-lg border-[3px] border-black shadow-[2px_2px_0px_0px_#000]",
                                color
                            )}>
                                <Icon className="w-6 h-6 text-black stroke-[2.5px]" />
                            </div>
                            <div className="
                                w-7 h-7 rounded-full border-[2px] border-black flex items-center justify-center
                                bg-transparent group-hover:bg-black transition-colors duration-200
                            ">
                                <ArrowRight className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-1 leading-none tracking-tight">
                                {title}
                            </h3>
                            <p className="text-zinc-600 font-bold text-xs md:text-sm leading-snug">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function PaylasPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F7] pb-32 pt-16 md:pt-20 px-4 font-sans relative overflow-hidden">

            {/* TEXTURED PAPER BACKGROUND */}
            <div className="absolute inset-0 opacity-40 pointer-events-none z-0 mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            ></div>

            {/* METEORS - Subtle Background Motion */}
            <Meteors number={15} />

            <div className="max-w-[900px] mx-auto relative z-10">

                {/* Header with Orbiting Circles */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 md:mb-10 pt-4 relative"
                >
                    {/* ORBITING CIRCLES - Behind Title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] pointer-events-none -z-10 opacity-30 md:opacity-50">
                        <OrbitingCircles
                            className="w-[30px] h-[30px] border-none bg-transparent"
                            duration={20}
                            delay={20}
                            radius={80}
                        >
                            <Atom className="w-8 h-8 text-black" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="w-[30px] h-[30px] border-none bg-transparent"
                            duration={20}
                            delay={10}
                            radius={80}
                        >
                            <Rocket className="w-8 h-8 text-black" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="size-[50px] border-none bg-transparent"
                            radius={150}
                            duration={20}
                            reverse
                        >
                            <Globe className="w-10 h-10 text-black/50" />
                        </OrbitingCircles>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black text-black leading-[0.9] tracking-tighter uppercase">
                            Paylaşım<br />
                            <span className="text-[#FACC15] text-stroke-black drop-shadow-[3px_3px_0px_#000]">Merkezi</span>
                        </h1>
                        <p className="text-black font-bold text-sm md:text-base max-w-xs md:text-right leading-tight bg-[#F9F9F7]/80 backdrop-blur-sm p-2 rounded-lg border-2 border-black/10">
                            Bilim dünyasına katkı sağlamak için bir içerik türü seç.
                        </p>
                    </div>
                </motion.div>

                {/* Grid - Compact Mobile */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                >
                    {/* 1. Article - Yellow (Full Width Mobile) */}
                    <FreshCard
                        title="MAKALE"
                        description="Derinlemesine içerik üret."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        accentColor="#FACC15"
                        colSpan="col-span-2 lg:col-span-2"
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

                    {/* 6. Blog (New? since user asked for standard cards) - Orange */}
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
                        <div className="bg-black text-white h-14 md:h-16 rounded-xl flex items-center justify-between px-5 md:px-6 border-[3px] border-black hover:bg-[#1a1a1a] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                            <span className="font-bold text-sm md:text-lg flex items-center gap-3">
                                <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                <span className="text-gray-400">Daha fazlasını mı arıyorsun?</span>
                            </span>
                            <div className="bg-white text-black px-3 py-1 rounded font-bold text-xs md:text-sm">
                                ARA
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
