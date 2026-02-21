"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, LibraryBig, Atom, BrainCircuit, WholeWord, Zap, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { createQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface ShareInputCardProps {
    user?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

const CATEGORIES = [
    "Kuantum Fiziği",
    "Genel Görelilik",
    "Klasik Mekanik",
    "Termodinamik",
    "Elektromanyetizma",
    "Optik",
    "Nükleer Fizik",
    "Astrofizik",
    "Diğer"
];

export function ShareInputCard({ user: initialUser }: ShareInputCardProps) {
    const [user, setUser] = useState(initialUser);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                if (profile) setUser(profile);
            }
        };
        if (!initialUser) fetchUser();
    }, [initialUser, supabase]);

    const avatarUrl = user?.avatar_url || "https://github.com/shadcn.png";
    const displayName = user?.full_name || user?.username || "Misafir";
    const firstName = displayName.split(" ")[0];
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"default" | "question">("default");

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    const handleQuickQuestion = (e: React.MouseEvent) => {
        e.preventDefault();
        setMode("question");
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => setMode("default"), 300);
    };

    const submitQuestion = async (status: 'published' | 'draft') => {
        if (!title.trim() || !content.trim() || !category) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createQuestion({
                title,
                content,
                category,
                status
            });

            if (result.success) {
                toast.success(status === 'published' ? "Sorunuz yayınlandı! 🚀" : "Taslak kaydedildi. 📝");
                setTitle("");
                setContent("");
                setCategory("");
                handleClose();
                if (status === 'published') router.push('/forum');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Memoize stars so they don't re-render on every state change
    const stars = useMemo(() => {
        const starCount = 60; // Reduced from 120 for perf
        return Array.from({ length: starCount }).map(() => ({
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: 0.5 + Math.random() * 2,
            opacity: 0.15 + Math.random() * 0.5
        }));
    }, []);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className={cn(
                "group relative flex flex-col overflow-visible rounded-2xl transition-all duration-300",
                "bg-black text-white",
                "border-2 border-zinc-700/80 hover:border-zinc-600",
                "shadow-xl shadow-black/30",
                "w-full mb-6",
                isOpen ? "z-[5000]" : "z-[20]",
                "sm:-mt-4"
            )}
        >
            {/* DEEP SPACE BACKGROUND - Simplified */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
                <div className="absolute inset-0 bg-black" />
                {/* Stars - Fewer, memoized */}
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                        }}
                    />
                ))}
                {/* Subtle nebula glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-900/8 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900/8 blur-[60px] rounded-full" />
            </div>

            {/* HEADER - Terminal Style */}
            <div className="relative h-9 sm:h-10 border-b border-zinc-700/60 bg-zinc-900/60 backdrop-blur-sm flex items-center select-none rounded-t-2xl overflow-hidden z-10">
                <div className="absolute left-3 sm:left-4 flex gap-1.5 z-10">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 text-center text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-[0.15em]">
                    Paylaşım Merkezi
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="p-3 sm:p-5 relative z-[4000]">
                <div className="flex gap-3 sm:gap-4 items-center">
                    {/* Avatar */}
                    <div className="shrink-0">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-zinc-700 rounded-xl ring-2 ring-zinc-800">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-zinc-900 text-white font-bold text-sm sm:text-base rounded-xl">
                                {displayName?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Input Trigger */}
                    <div className="flex-1 min-w-0 relative">
                        {/* QUESTION MODE FORM */}
                        <AnimatePresence mode="wait">
                            {mode === "question" ? (
                                <motion.div
                                    key="question-form"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full bg-zinc-900/80 backdrop-blur-xl rounded-xl p-4 border border-zinc-700 space-y-3 relative overflow-hidden"
                                >
                                    {/* CLOSE BUTTON */}
                                    <button
                                        onClick={handleClose}
                                        className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Hızlı Soru Sor</div>

                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Sorunun başlığı ne olsun?"
                                        className="w-full bg-transparent border-b border-zinc-700 px-2 py-2 text-sm font-medium focus:outline-none placeholder:text-zinc-600 text-white focus:border-yellow-500/60 transition-colors"
                                        autoFocus
                                    />

                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Detayları buraya yazabilirsin..."
                                        className="w-full bg-transparent border-b border-zinc-700 px-2 py-2 text-sm min-h-[80px] focus:outline-none resize-none placeholder:text-zinc-600 text-white focus:border-yellow-500/60 transition-colors"
                                    />

                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all",
                                                    category === cat
                                                        ? "bg-yellow-400 text-zinc-900 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.3)]"
                                                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => submitQuestion('published')}
                                            disabled={isSubmitting}
                                            className="px-5 py-2 rounded-lg text-xs font-bold bg-yellow-400 text-zinc-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                        >
                                            {isSubmitting ? "..." : "Yayınla"} <Zap className="w-3 h-3 fill-zinc-900" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <button
                                    ref={triggerRef}
                                    onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                                    className={cn(
                                        "w-full h-10 sm:h-12 text-left px-3 sm:px-4 flex items-center justify-between transition-all duration-200 group/input relative",
                                        "bg-zinc-900/60 backdrop-blur-sm",
                                        "border border-zinc-700/60 hover:border-zinc-600",
                                        "rounded-xl",
                                        "hover:bg-zinc-800/60",
                                        isOpen && "bg-yellow-400 text-zinc-900 border-yellow-400"
                                    )}
                                >
                                    <span className={cn("font-medium text-xs sm:text-sm truncate mr-2 flex-1 block transition-colors", isOpen ? "text-zinc-900" : "text-zinc-400")}>
                                        {isOpen ? (
                                            "Kapat"
                                        ) : (
                                            <span className="flex items-center gap-1 overflow-hidden">
                                                <span className="truncate shrink min-w-0 sm:hidden">Paylaşmak ister misin,</span>
                                                <span className="truncate shrink min-w-0 hidden sm:inline">Aklında ne var,</span>
                                                <span className="font-bold shrink-0">{firstName}?</span>
                                            </span>
                                        )}
                                    </span>
                                    <div className={cn(
                                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
                                        isOpen ? "bg-zinc-900 text-yellow-400 rotate-45" : "bg-zinc-800 text-zinc-400 hover:text-white"
                                    )}>
                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                                    </div>
                                </button>
                            )}
                        </AnimatePresence>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-2 w-full sm:w-72 bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/50 z-[100] overflow-hidden rounded-xl"
                                >
                                    <div className="p-2 space-y-0.5 relative z-10">
                                        <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-zinc-600">Seçenekler</div>

                                        {[
                                            { href: "/kitap-inceleme/yeni", icon: LibraryBig, label: "Kitap İncelemesi", sub: "Puanla ve İncele", color: "bg-red-500" },
                                            { href: null, action: handleQuickQuestion, icon: BrainCircuit, label: "Hızlı Soru Sor", sub: "Buradan Hızlıca Sor", color: "bg-yellow-400" },
                                            { href: "/makale/yeni?type=term", icon: WholeWord, label: "Terim Ekle", sub: "Sözlüğe Katkı Yap", color: "bg-blue-500" },
                                            { href: "/makale/yeni?type=experiment", icon: Atom, label: "Deney Paylaş", sub: "Bilimsel Çalışman", color: "bg-emerald-500" }
                                        ].map((item, idx) => {
                                            const Comp = item.href ? Link : 'button';
                                            const props = item.href ? { href: item.href } : { onClick: item.action };
                                            return (
                                                <Comp
                                                    key={idx}
                                                    {...props as any}
                                                    className="w-full flex items-center gap-3 p-2.5 hover:bg-zinc-800/80 transition-colors group rounded-lg"
                                                >
                                                    <div className={`w-9 h-9 ${item.color} flex items-center justify-center text-black rounded-lg group-hover:scale-105 transition-transform`}>
                                                        <item.icon className="w-4.5 h-4.5 stroke-[2px]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <h4 className="font-semibold text-sm text-white truncate">{item.label}</h4>
                                                        <p className="text-[10px] text-zinc-500 leading-tight truncate">{item.sub}</p>
                                                    </div>
                                                </Comp>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-3 py-2.5 sm:px-5 sm:py-3 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center rounded-b-2xl relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 w-full justify-center">

                    <Link href="/makale/yeni" className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-5 h-8 sm:h-9 rounded-lg bg-transparent text-zinc-400 border border-zinc-700/60 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all cursor-pointer text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide">
                        <PenTool className="w-3.5 h-3.5" />
                        Blog
                    </Link>

                    <button onClick={handleQuickQuestion} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-5 h-8 sm:h-9 rounded-lg bg-transparent text-zinc-400 border border-zinc-700/60 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all cursor-pointer text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Soru
                    </button>

                    <button onClick={() => setIsOpen(!isOpen)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-5 h-8 sm:h-9 rounded-lg bg-yellow-400 text-zinc-900 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transition-all cursor-pointer text-[10px] sm:text-[11px] font-bold uppercase tracking-wide">
                        <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                        Ekle
                    </button>

                </div>
            </div>
        </motion.div>
    );
}
