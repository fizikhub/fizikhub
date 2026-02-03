"use client";

import Link from "next/link";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    Sparkles,
    ArrowRight,
    PenTool,
    Plus,
    Atom
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 50 }
    }
};

interface HubCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    shadowColor: string;
    colSpan?: string;
}

function HubCard({ title, description, href, icon: Icon, color, shadowColor, colSpan = "col-span-1" }: HubCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn("group relative", colSpan)}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href} className="block h-full">
                <div className={cn(
                    "relative h-full overflow-hidden rounded-2xl bg-[#09090b]",
                    "border-2 border-white/10 group-hover:border-white transition-colors duration-300",
                    "flex flex-col justify-between p-6 md:p-8"
                )}>
                    {/* Hard Shadow Element (Absolute) */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                        "bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from),transparent_70%)]",
                        color
                    )} />

                    {/* Icon & Shine */}
                    <div className="relative z-10 flex items-start justify-between">
                        <div className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-md",
                            "group-hover:scale-110 transition-transform duration-300",
                            shadowColor
                        )}>
                            <Icon className="w-6 h-6 text-white stroke-[2px]" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowRight className="w-6 h-6 -rotate-45 text-white" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="relative z-10 mt-8">
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight tracking-tight group-hover:translate-x-1 transition-transform">
                            {title}
                        </h3>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed group-hover:text-zinc-200 transition-colors">
                            {description}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function PaylasPage() {
    return (
        <div className="min-h-screen bg-[#000000] pb-32 pt-24 px-4 md:px-8 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>

            {/* Top Gradient */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-[#FACC15] border-2 border-black shadow-[4px_4px_0px_#000]">
                        <Plus className="w-8 h-8 text-black stroke-[3px]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                        PAYLAŞIM <span className="text-[#FACC15]">MERKEZİ</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
                        Bilim dünyasına katkı sağlamak için bir içerik türü seç. Topluluk senin fikrini bekliyor.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                >
                    {/* 1. Article (Big) */}
                    <HubCard
                        title="Makale Yaz"
                        description="Bilimsel bir konuyu derinlemesine incele ve yayınla."
                        href="/makale/yeni"
                        icon={FileText}
                        color="from-pink-600/20"
                        shadowColor="shadow-[0px_0px_20px_rgba(236,72,153,0.3)]"
                        colSpan="md:col-span-2 lg:col-span-2"
                    />

                    {/* 2. Question */}
                    <HubCard
                        title="Soru Sor"
                        description="Takıldığın yerleri topluluğa danış."
                        href="/forum"
                        icon={MessageCircle}
                        color="from-yellow-400/20"
                        shadowColor="shadow-[0px_0px_20px_rgba(250,204,21,0.3)]"
                    />

                    {/* 3. Experiment */}
                    <HubCard
                        title="Deney Paylaş"
                        description="Laboratuvar sonuçlarını veya ev deneylerini aktar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="from-green-500/20"
                        shadowColor="shadow-[0px_0px_20px_rgba(34,197,94,0.3)]"
                    />

                    {/* 4. Book Review */}
                    <HubCard
                        title="Kitap İncele"
                        description="Okuduğun bilimsel kitapları değerlendir."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="from-blue-500/20"
                        shadowColor="shadow-[0px_0px_20px_rgba(59,130,246,0.3)]"
                    />

                    {/* 5. Term */}
                    <HubCard
                        title="Terim Ekle"
                        description="Fizik sözlüğüne yeni bir kavram kazandır."
                        href="/sozluk"
                        icon={BookOpen}
                        color="from-orange-500/20"
                        shadowColor="shadow-[0px_0px_20px_rgba(249,115,22,0.3)]"
                    />

                </motion.div>
            </div>
        </div>
    );
}
