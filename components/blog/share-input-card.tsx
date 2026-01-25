"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Plus, HelpCircle, LibraryBig, Atom, BrainCircuit, WholeWord, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
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
    "Kuantum Fiziği", "Genel Görelilik", "Klasik Mekanik", "Termodinamik",
    "Elektromanyetizma", "Optik", "Nükleer Fizik", "Astrofizik", "Diğer"
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
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"default" | "question">("default");

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            const result = await createQuestion({ title, content, category, status });
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
            className="group relative w-full mb-6 z-[20]"
        >
            {/* V34 CARD: CLEANER, MODERN, YELLOW ACCENT */}
            <div className="bg-[#111] rounded-2xl border border-white/20 shadow-[0px_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">

                {/* Header */}
                <div className="bg-[#FFC800] px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-black">
                        <Sparkles className="w-4 h-4 fill-white" />
                        <span className="text-xs font-black uppercase tracking-widest">PAYLAŞIM MERKEZİ</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        <div className="w-1.5 h-1.5 bg-black/30 rounded-full" />
                    </div>
                </div>

                <div className="p-4 sm:p-6 bg-[#111]">
                    <div className="flex gap-4 items-start">
                        <Avatar className="w-12 h-12 border-2 border-[#FFC800] rounded-xl shrink-0">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-zinc-800 text-white font-bold">{displayName?.[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 w-full">
                            <AnimatePresence mode="wait">
                                {mode === "question" ? (
                                    <motion.div
                                        key="question-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4"
                                    >
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Sormak istediğin nedir?"
                                            className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-[#FFC800] px-0 py-2 text-white font-bold text-lg focus:outline-none placeholder:text-zinc-600 transition-colors"
                                            autoFocus
                                        />
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Detaylandır..."
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm text-zinc-300 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#FFC800] resize-none border border-white/5"
                                        />

                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setCategory(cat)}
                                                    className={cn(
                                                        "px-2 py-1 rounded text-[10px] font-bold border border-zinc-700 transition-colors",
                                                        category === cat ? "bg-[#FFC800] text-black border-[#FFC800]" : "text-zinc-400 hover:text-white hover:border-white"
                                                    )}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button onClick={handleClose} className="text-xs text-zinc-500 hover:text-white font-bold px-3">İptal</button>
                                            <button
                                                onClick={() => submitQuestion('published')}
                                                disabled={isSubmitting}
                                                className="bg-[#FFC800] text-black px-6 py-2 rounded-lg text-xs font-black uppercase hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                            >
                                                {isSubmitting ? "..." : "YAYINLA"}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="w-full h-12 bg-zinc-900 border border-white/10 rounded-xl flex items-center px-4 cursor-pointer hover:border-[#FFC800]/50 hover:bg-zinc-800 transition-all group"
                                    >
                                        <span className="text-zinc-500 text-sm font-medium group-hover:text-zinc-300">
                                            Ne düşünüyorsun, <span className="text-white font-bold">{displayName.split(' ')[0]}</span>?
                                        </span>
                                        <Plus className="ml-auto w-5 h-5 text-zinc-600 group-hover:text-[#FFC800] transition-colors" />
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Options Dropdown (When Question Mode is OFF but Menu is Open) */}
                            <AnimatePresence>
                                {isOpen && mode !== "question" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-4 grid grid-cols-2 gap-2"
                                    >
                                        {[
                                            { href: "/kitap-inceleme/yeni", icon: LibraryBig, label: "Kitap İncelemesi", color: "text-pink-400" },
                                            { action: handleQuickQuestion, icon: BrainCircuit, label: "Hızlı Soru Sor", color: "text-blue-400" },
                                            { href: "/makale/yeni?type=term", icon: WholeWord, label: "Terim Ekle", color: "text-purple-400" },
                                            { href: "/makale/yeni?type=experiment", icon: Atom, label: "Deney Paylaş", color: "text-green-400" }
                                        ].map((item, i) => {
                                            const Comp = item.href ? Link : 'button';
                                            const props = item.href ? { href: item.href } : { onClick: item.action };
                                            return (
                                                <Comp
                                                    key={i}
                                                    {...props as any}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 transition-all text-left"
                                                >
                                                    <item.icon className={cn("w-5 h-5", item.color)} />
                                                    <span className="text-xs font-bold text-zinc-300">{item.label}</span>
                                                </Comp>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats/Actions */}
                {!isOpen && (
                    <div className="bg-[#18181b] px-6 py-3 flex items-center gap-6 text-[10px] font-bold text-zinc-500 border-t border-white/5">
                        <Link href="/makale/yeni" className="hover:text-white flex items-center gap-1.5 transition-colors">
                            <PenTool className="w-3 h-3" /> BLOG YAZ
                        </Link>
                        <button onClick={handleQuickQuestion} className="hover:text-white flex items-center gap-1.5 transition-colors">
                            <HelpCircle className="w-3 h-3" /> SORU SOR
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
