"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, LibraryBig, Atom, BrainCircuit, WholeWord, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createQuestion } from "@/app/forum/actions"; // Import action
import { toast } from "sonner"; // Import toast
import { createClient } from "@/lib/supabase"; // Client-side supabase

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
    // Client-side user state to fix "Misafir" persistence
    const [user, setUser] = useState(initialUser);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        // If no user prop or just double checking, fetch on client
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
    const [mode, setMode] = useState<"default" | "question">("default"); // New mode state

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if click is outside BOTH dropdown and trigger button
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
        setIsOpen(true); // Ensure expanded
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => setMode("default"), 300); // Reset mode after animation
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

    // --- STAR GENERATION (Simple CSS/SVG approach for performance) ---
    const [stars, setStars] = useState<{ top: number; left: number; size: number; opacity: number }[]>([]);

    useEffect(() => {
        const starCount = 120;
        const newStars = Array.from({ length: starCount }).map(() => ({
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: 0.5 + Math.random() * 2.5,
            opacity: 0.2 + Math.random() * 0.8
        }));
        setStars(newStars);
    }, []);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-visible rounded-xl transition-all duration-300",
                "bg-black text-white", // PURE BLACK
                "border-[3px] border-white", // White Border
                "shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]", // White/Glass Shadow
                "w-full mb-6",
                isOpen ? "z-[5000]" : "z-[20]", // Z-Index fix - Much higher to overlay all
                "sm:-mt-4" // Move up slightly on desktop/mobile if needed
            )}
        >
            {/* DEEP SPACE BACKGROUND LAYERS */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
                {/* 1. Base - PURE BLACK */}
                <div className="absolute inset-0 bg-black" />

                {/* 2. Stars */}
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}

                {/* 3. Nebula/Galaxy Effects (Subtle Purple/Blue per request) */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-900/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-900/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
            </div>

            {/* HEADER */}
            <div className="relative h-9 sm:h-10 border-b-[3px] border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center select-none rounded-t-xl overflow-hidden z-10">
                <div className="absolute left-3 sm:left-5 flex gap-1.5 sm:gap-2 z-10">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-white/20 shadow-sm" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-white/20 shadow-sm" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-white/20 shadow-sm" />
                </div>
                <div className="text-[10px] sm:text-xs font-black text-white/90 uppercase tracking-[0.2em]">
                    Paylaşım Merkezi
                </div>
            </div>

            <div className="p-3 sm:p-5 relative z-10">
                <div className="flex gap-3 sm:gap-4 items-center">
                    {/* Avatar Area */}
                    <div className="shrink-0">
                        <Avatar className="w-10 h-10 sm:w-14 sm:h-14 border-[2px] border-white shadow-[0px_0px_15px_rgba(255,255,255,0.2)] rounded-xl">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-black text-white font-black text-base sm:text-lg rounded-xl border border-white/20">
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
                                    className="w-full bg-white/10 backdrop-blur-xl rounded-xl p-4 border-[2px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] space-y-3 relative overflow-hidden"
                                >
                                    {/* CLOSE BUTTON */}
                                    <button
                                        onClick={handleClose}
                                        className="absolute top-2 right-2 p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>

                                    <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Hızlı Soru Sor</div>

                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Sorunun başlığı ne olsun?"
                                        className="w-full bg-transparent border-b-[2px] border-white/30 px-2 py-2 text-sm font-bold focus:outline-none placeholder:text-white/30 text-white focus:border-white transition-colors"
                                        autoFocus
                                    />

                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Detayları buraya yazabilirsin..."
                                        className="w-full bg-transparent border-b-[2px] border-white/30 px-2 py-2 text-sm min-h-[80px] focus:outline-none resize-none placeholder:text-white/30 text-white focus:border-white transition-colors"
                                    />

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={cn(
                                                    "px-3 py-1 rounded-lg text-[10px] font-bold border border-white/20 transition-all",
                                                    category === cat
                                                        ? "bg-white text-black shadow-[0px_0px_10px_rgba(255,255,255,0.4)] border-white"
                                                        : "bg-transparent text-white/70 hover:bg-white/10"
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
                                            className="px-6 py-2 rounded-lg text-xs font-black bg-[#FFC800] text-black border-[2px] border-white shadow-[2px_2px_0px_0px_#fff] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSubmitting ? "..." : "Yayınla"} <Zap className="w-3 h-3 fill-black" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <button
                                    ref={triggerRef}
                                    onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                                    className={cn(
                                        "w-full h-10 sm:h-14 text-left px-3 sm:px-5 flex items-center justify-between transition-all duration-200 group/input relative",
                                        "bg-white/5 backdrop-blur-md", // Translucent
                                        "border-[2px] border-white/50 hover:border-white",
                                        "rounded-xl",
                                        "shadow-none hover:bg-white/10",
                                        isOpen && "bg-white text-black border-white"
                                    )}
                                >
                                    <span className={cn("font-bold text-xs sm:text-base truncate mr-2 flex-1 block transition-colors", isOpen ? "text-black" : "text-white")}>
                                        {isOpen ? (
                                            "Kapat"
                                        ) : (
                                            <span className="flex items-center gap-1 overflow-hidden">
                                                <span className="truncate shrink min-w-0 sm:hidden opacity-80">Paylaşmak ister misin,</span>
                                                <span className="truncate shrink min-w-0 hidden sm:inline opacity-80 text-sm">Aklında ne var,</span>
                                                <span className="font-black shrink-0 uppercase tracking-wide">{firstName}?</span>
                                            </span>
                                        )}
                                    </span>
                                    <div className={cn(
                                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-[2px] flex items-center justify-center transition-all duration-300 shrink-0",
                                        isOpen ? "border-black bg-black text-white rotate-45" : "border-white/50 bg-white/10 text-white"
                                    )}>
                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                                    </div>
                                </button>
                            )}
                        </AnimatePresence>

                        {/* Dropdown Menu - Neo Style */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-3 w-full sm:w-72 bg-[#0a0a0a] border-[2px] border-white shadow-[0px_10px_40px_rgba(0,0,0,0.5)] z-[100] overflow-hidden rounded-xl"
                                >
                                    <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
                                    <div className="p-2 space-y-1 relative z-10">
                                        <div className="px-3 py-2 text-[10px] font-black tracking-widest uppercase text-white/40 ml-1">Seçenekler</div>

                                        {[
                                            { href: "/kitap-inceleme/yeni", icon: LibraryBig, label: "Kitap İncelemesi", sub: "Puanla ve İncele", color: "bg-red-500", border: "border-red-500" },
                                            { href: null, action: handleQuickQuestion, icon: BrainCircuit, label: "Hızlı Soru Sor", sub: "Buradan Hızlıca Sor", color: "bg-yellow-400", border: "border-yellow-400" },
                                            { href: "/makale/yeni?type=term", icon: WholeWord, label: "Terim Ekle", sub: "Sözlüğe Katkı Yap", color: "bg-blue-500", border: "border-blue-500" },
                                            { href: "/makale/yeni?type=experiment", icon: Atom, label: "Deney Paylaş", sub: "Bilimsel Çalışman", color: "bg-green-500", border: "border-green-500" }
                                        ].map((item, idx) => {
                                            const Comp = item.href ? Link : 'button';
                                            const props = item.href ? { href: item.href } : { onClick: item.action };
                                            return (
                                                <Comp
                                                    key={idx}
                                                    {...props as any}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-all group rounded-lg border border-transparent hover:border-white/20"
                                                >
                                                    <div className={`relative w-10 h-10 ${item.color} flex items-center justify-center text-black rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform`}>
                                                        <item.icon className="w-5 h-5 stroke-[2.5px]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <h4 className="font-bold text-sm text-white transition-colors truncate">{item.label}</h4>
                                                        <p className="text-[10px] text-white/50 leading-tight truncate font-medium">{item.sub}</p>
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

            {/* Bottom Actions Bar - Neo Style */}
            <div className="px-3 py-3 sm:px-5 sm:py-4 border-t-[2px] border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center gap-2 sm:gap-4 text-[10px] font-bold text-black overflow-x-auto rounded-b-xl relative z-10">

                <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">

                    <Link href="/makale/yeni" className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 h-9 sm:h-10 rounded-xl bg-transparent text-white border-[2px] border-white/30 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer group shrink-0">
                        <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2px]" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Blog</span>
                    </Link>

                    <button onClick={handleQuickQuestion} className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 h-9 sm:h-10 rounded-xl bg-transparent text-white border-[2px] border-white/30 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer group shrink-0">
                        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2px]" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Soru</span>
                    </button>

                    <button onClick={() => setIsOpen(!isOpen)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 h-9 sm:h-10 rounded-xl bg-[#dc2626] text-white border-[2px] border-white shadow-[0px_0px_10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all cursor-pointer group shrink-0">
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px]" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Ekle</span>
                    </button>

                </div>
            </div>
        </motion.div>
    );
}
