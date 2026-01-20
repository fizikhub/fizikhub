"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, LibraryBig, Atom, BrainCircuit, WholeWord } from "lucide-react";
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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col overflow-visible rounded-[2rem] transition-all duration-300",
                "bg-card/80 backdrop-blur-md border border-border/50", // More subtle border
                "shadow-lg dark:shadow-none hover:shadow-xl transition-shadow", // Premium shadow
                "w-full mb-6 z-[20]" // Full width
            )}
        >
            <div className="relative h-7 border-b border-border/40 bg-muted/20 flex items-center justify-center select-none rounded-t-[2rem]">
                <div className="absolute left-4 sm:left-5 flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-sm" />
                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-sm" />
                    <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-sm" />
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-[0.2em]">Paylaş</div>
            </div>

            <div className="p-2 sm:p-3">
                <div className="flex gap-3 items-center">
                    {/* Avatar Area */}
                    <div className="shrink-0">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-background shadow-md rounded-2xl ring-2 ring-border/20">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary font-black rounded-2xl">
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
                                    className="w-full bg-muted/30 rounded-2xl p-4 border border-primary/10 space-y-3"
                                >
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Sorunun başlığı ne olsun?"
                                        className="w-full bg-transparent border-b border-border/50 px-2 py-2 text-sm font-bold focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                                        autoFocus
                                    />

                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Detayları buraya yazabilirsin..."
                                        className="w-full bg-transparent border-b border-border/50 px-2 py-2 text-sm min-h-[80px] focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/50"
                                    />

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold border transition-all",
                                                    category === cat
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => submitQuestion('draft')}
                                            disabled={isSubmitting}
                                            className="px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
                                        >
                                            Taslak Kaydet
                                        </button>
                                        <button
                                            onClick={() => submitQuestion('published')}
                                            disabled={isSubmitting}
                                            className="px-6 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {isSubmitting ? "..." : "Yayınla"}
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <button
                                    ref={triggerRef}
                                    onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                                    className={cn(
                                        "w-full h-12 text-left px-5 flex items-center justify-between transition-all duration-200 group/input relative",
                                        "bg-muted/20 hover:bg-muted/40", // Lighter background
                                        "border border-transparent hover:border-primary/20",
                                        "rounded-2xl",
                                        isOpen && "ring-2 ring-primary/20 bg-primary/5",
                                    )}
                                >
                                    <span className="text-muted-foreground font-medium text-sm sm:text-base group-hover/input:text-primary transition-colors truncate mr-2 flex-1 block">
                                        {isOpen ? (
                                            "Kapat"
                                        ) : (
                                            <span className="flex items-center gap-1 overflow-hidden">
                                                <span className="truncate shrink min-w-0 sm:hidden">Ne düşünüyorsun,</span>
                                                <span className="truncate shrink min-w-0 hidden sm:inline">Ne paylaşmak istersin,</span>
                                                <span className="text-foreground font-bold shrink-0">{firstName}?</span>
                                                <span className="text-primary animate-pulse font-light ml-0.5">|</span>
                                            </span>
                                        )}
                                    </span>
                                    <div className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                                        isOpen ? "bg-primary text-primary-foreground rotate-45" : "bg-background shadow-sm text-foreground/50 group-hover/input:text-primary"
                                    )}>
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </button>
                            )}
                        </AnimatePresence>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-3 w-full sm:w-72 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl z-[100] overflow-hidden rounded-2xl ring-1 ring-black/5"
                                >
                                    <div className="p-1.5 space-y-1">
                                        <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 ml-1">Seçenekler</div>

                                        {/* Kitap İncelemesi - ROSE COLOR */}
                                        <Link
                                            href="/kitap-inceleme/yeni"
                                            className="w-full flex items-center gap-3 p-3 hover:bg-rose-500/10 transition-all group rounded-xl"
                                        >
                                            <div className="relative w-9 h-9 bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 rounded-lg group-hover:scale-105 transition-transform">
                                                <LibraryBig className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-rose-600 transition-colors truncate">Kitap İncelemesi</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight truncate">Puanla ve İncele</p>
                                            </div>
                                        </Link>

                                        {/* Soru Sor - Direct Action */}
                                        <button
                                            onClick={handleQuickQuestion}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-all group rounded-xl text-left"
                                        >
                                            <div className="relative w-9 h-9 bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 rounded-lg group-hover:scale-105 transition-transform">
                                                <BrainCircuit className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-blue-600 transition-colors truncate">Hızlı Soru Sor</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight truncate">Buradan Hızlıca Sor</p>
                                            </div>
                                        </button>

                                        {/* Terim Ekle - CYAN COLOR */}
                                        <Link
                                            href="/makale/yeni?type=term"
                                            className="w-full flex items-center gap-3 p-3 hover:bg-cyan-500/10 transition-all group rounded-xl"
                                        >
                                            <div className="relative w-9 h-9 bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 rounded-lg group-hover:scale-105 transition-transform">
                                                <WholeWord className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-cyan-600 transition-colors truncate">Terim Ekle</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight truncate">Sözlüğe Katkı Yap</p>
                                            </div>
                                        </Link>

                                        {/* Deney Paylaş */}
                                        <Link
                                            href="/makale/yeni?type=experiment"
                                            className="w-full flex items-center gap-3 p-3 hover:bg-emerald-500/10 transition-all group rounded-xl"
                                        >
                                            <div className="relative w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 rounded-lg group-hover:scale-105 transition-transform">
                                                <Atom className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-emerald-600 transition-colors truncate">Deney Paylaş</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight truncate">Bilimsel Çalışman</p>
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar - CENTERED BUTTONS */}
            <div className="px-5 py-3 border-t border-border/30 bg-muted/20 flex items-center justify-center gap-3 text-[10px] font-bold text-muted-foreground overflow-x-auto rounded-b-[2rem] scrollbar-hide relative group/bar">

                {/* Centered Group */}
                <div className="flex items-center gap-3">

                    <Link href="/makale/yeni" className="flex items-center justify-center gap-2 w-[4.5rem] h-8 rounded-full bg-secondary/40 dark:bg-muted/40 text-muted-foreground hover:bg-secondary/60 hover:text-primary hover:shadow-sm border border-border/50 hover:border-primary/30 transition-all cursor-pointer group shrink-0">
                        <PenTool className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Blog</span>
                    </Link>

                    <div className="w-1 h-1 rounded-full bg-border shrink-0 opacity-50" />

                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center gap-2 w-[4.5rem] h-8 rounded-full bg-secondary/40 dark:bg-muted/40 text-muted-foreground hover:bg-secondary/60 hover:text-primary hover:shadow-sm border border-border/50 hover:border-primary/30 transition-all cursor-pointer group shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Ekle</span>
                    </button>

                    <div className="w-1 h-1 rounded-full bg-border shrink-0 opacity-50" />

                    <button onClick={handleQuickQuestion} className="flex items-center justify-center gap-2 w-[4.5rem] h-8 rounded-full bg-secondary/40 dark:bg-muted/40 text-muted-foreground hover:bg-secondary/60 hover:text-primary hover:shadow-sm border border-border/50 hover:border-primary/30 transition-all cursor-pointer group shrink-0">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Soru</span>
                    </button>
                </div>

                {/* Version Absolute Right */}
                <div className="absolute right-5 text-[9px] text-muted-foreground/30 font-mono hidden sm:block">
                    v2.2
                </div>
            </div>
        </motion.div>
    );
}
