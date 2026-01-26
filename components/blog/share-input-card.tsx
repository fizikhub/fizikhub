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
                "group relative flex flex-col overflow-visible rounded-xl transition-all duration-300",
                "bg-white text-black", // Force White BG, Black Text (Pop Style)
                "border-[3px] border-black", // Hard Black Border
                "shadow-[6px_6px_0px_0px_#000]", // Hard Black Shadow
                "w-full mb-6 z-[20]"
            )}
        >
            <div className="relative h-10 border-b-[3px] border-black bg-zinc-50 flex items-center justify-center select-none rounded-t-xl overflow-hidden">
                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />

                <div className="absolute left-4 sm:left-5 flex gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border-[1.5px] border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border-[1.5px] border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border-[1.5px] border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]" />
                </div>
                <div className="text-[10px] sm:text-xs font-black text-black/70 uppercase tracking-[0.2em] z-10">Paylaşım Merkezi</div>
            </div>

            <div className="p-4 sm:p-5">
                <div className="flex gap-4 items-center">
                    {/* Avatar Area */}
                    <div className="shrink-0">
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-[3px] border-black shadow-[2px_2px_0px_0px_#000] rounded-xl">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-neo-yellow text-black font-black text-lg rounded-xl">
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
                                    className="w-full bg-white rounded-xl p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] space-y-3"
                                >
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Sorunun başlığı ne olsun?"
                                        className="w-full bg-transparent border-b-[3px] border-black px-2 py-2 text-sm font-bold focus:outline-none placeholder:text-black/40 text-black"
                                        autoFocus
                                    />

                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Detayları buraya yazabilirsin..."
                                        className="w-full bg-transparent border-b-[3px] border-black px-2 py-2 text-sm min-h-[80px] focus:outline-none resize-none placeholder:text-black/40 text-black"
                                    />

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={cn(
                                                    "px-3 py-1 rounded-lg text-[10px] font-black border-[2px] border-black transition-all",
                                                    category === cat
                                                        ? "bg-neo-yellow text-black shadow-[2px_2px_0px_0px_#000]"
                                                        : "bg-white text-black hover:bg-black hover:text-white"
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
                                            className="px-4 py-2 rounded-lg text-xs font-bold text-black border-[2px] border-black hover:bg-black hover:text-white transition-colors"
                                        >
                                            Taslak
                                        </button>
                                        <button
                                            onClick={() => submitQuestion('published')}
                                            disabled={isSubmitting}
                                            className="px-6 py-2 rounded-lg text-xs font-black bg-neo-green text-black border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
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
                                        "w-full h-14 text-left px-5 flex items-center justify-between transition-all duration-200 group/input relative",
                                        "bg-white text-black",
                                        "border-[3px] border-black",
                                        "rounded-xl",
                                        "shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]",
                                        isOpen && "bg-neo-yellow"
                                    )}
                                >
                                    <span className="text-black font-bold text-sm sm:text-base truncate mr-2 flex-1 block">
                                        {isOpen ? (
                                            "Kapat"
                                        ) : (
                                            <span className="flex items-center gap-1 overflow-hidden">
                                                <span className="truncate shrink min-w-0 sm:hidden">Ne düşünüyorsun,</span>
                                                <span className="truncate shrink min-w-0 hidden sm:inline">Ne düşünüyorsun,</span>
                                                <span className="font-black shrink-0 uppercase">{firstName}?</span>
                                            </span>
                                        )}
                                    </span>
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg border-[2px] border-black flex items-center justify-center transition-all duration-300 shrink-0",
                                        isOpen ? "bg-black text-white rotate-45" : "bg-neo-yellow text-black"
                                    )}>
                                        <Plus className="w-5 h-5 stroke-[3px]" />
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
                                    className="absolute top-full right-0 mt-3 w-full sm:w-72 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] z-[100] overflow-hidden rounded-xl"
                                >
                                    <div className="p-2 space-y-2">
                                        <div className="px-3 py-2 text-[10px] font-black tracking-widest uppercase text-black/50 ml-1">Seçenekler</div>

                                        {/* Items with thick borders on hover */}
                                        {[
                                            { href: "/kitap-inceleme/yeni", icon: LibraryBig, label: "Kitap İncelemesi", sub: "Puanla ve İncele", color: "bg-neo-pink" },
                                            { href: null, action: handleQuickQuestion, icon: BrainCircuit, label: "Hızlı Soru Sor", sub: "Buradan Hızlıca Sor", color: "bg-neo-blue" },
                                            { href: "/makale/yeni?type=term", icon: WholeWord, label: "Terim Ekle", sub: "Sözlüğe Katkı Yap", color: "bg-neo-purple" },
                                            { href: "/makale/yeni?type=experiment", icon: Atom, label: "Deney Paylaş", sub: "Bilimsel Çalışman", color: "bg-neo-green" }
                                        ].map((item, idx) => {
                                            const Comp = item.href ? Link : 'button';
                                            const props = item.href ? { href: item.href } : { onClick: item.action };
                                            return (
                                                <Comp
                                                    key={idx}
                                                    {...props as any}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-black hover:text-white transition-all group rounded-lg border-[2px] border-transparent hover:border-black"
                                                >
                                                    <div className={`relative w-10 h-10 ${item.color} border-[2px] border-black flex items-center justify-center text-black rounded-lg shadow-[2px_2px_0px_0px_#000] group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all`}>
                                                        <item.icon className="w-5 h-5 stroke-[2.5px]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <h4 className="font-black text-sm transition-colors truncate">{item.label}</h4>
                                                        <p className="text-[10px] opacity-70 leading-tight truncate font-bold">{item.sub}</p>
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
            <div className="px-5 py-4 border-t-[3px] border-black bg-white flex items-center justify-center gap-4 text-[10px] font-bold text-black overflow-x-auto rounded-b-xl scrollbar-hide relative group/bar">

                {/* Centered Group - Buttons with Hard Shadows */}
                <div className="flex items-center gap-4">

                    <Link href="/makale/yeni" className="flex items-center justify-center gap-2 px-6 h-10 rounded-xl bg-white text-black border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer group shrink-0">
                        <PenTool className="w-4 h-4 stroke-[2.5px]" />
                        <span className="text-[11px] font-black uppercase tracking-wider">Blog</span>
                    </Link>

                    <button onClick={handleQuickQuestion} className="flex items-center justify-center gap-2 px-6 h-10 rounded-xl bg-white text-black border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer group shrink-0">
                        <HelpCircle className="w-4 h-4 stroke-[2.5px]" />
                        <span className="text-[11px] font-black uppercase tracking-wider">Soru</span>
                    </button>

                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center gap-2 px-6 h-10 rounded-xl bg-[#FF4433] text-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer group shrink-0">
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        <span className="text-[11px] font-black uppercase tracking-wider">Ekle</span>
                    </button>

                </div>
            </div>
        </motion.div>
    );
}
