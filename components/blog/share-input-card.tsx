"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, MessageCircle, LibraryBig, Atom, Zap, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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

const ACTION_BUTTONS = [
    {
        label: "MAKALE YAZ",
        sub: "Bilgini Paylaş",
        icon: PenTool,
        href: "/makale/yeni",
        color: "bg-[#FFC800]",
        hover: "hover:bg-[#FFD633]"
    },
    {
        label: "SORU SOR",
        sub: "Topluluğa Danış",
        icon: MessageCircle,
        action: "question",
        color: "bg-[#38bdf8]",
        hover: "hover:bg-[#7dd3fc]"
    },
    {
        label: "KİTAP İNCELE",
        sub: "Kütüphaneye Ekle",
        icon: LibraryBig,
        href: "/kitap-inceleme/yeni",
        color: "bg-[#f472b6]",
        hover: "hover:bg-[#f9a8d4]"
    },
    {
        label: "DENEY PAYLAŞ",
        sub: "Sonuçları Göster",
        icon: Atom,
        href: "/makale/yeni?type=experiment",
        color: "bg-[#4ade80]",
        hover: "hover:bg-[#86efac]"
    }
];

export function ShareInputCard({ user: initialUser }: ShareInputCardProps) {
    const [user, setUser] = useState(initialUser);
    const [supabase] = useState(() => createClient());
    const [isQuestionMode, setIsQuestionMode] = useState(false);

    // Question Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

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
                setIsQuestionMode(false);
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

    const handleAction = (action: string) => {
        if (action === "question") {
            setIsQuestionMode(true);
        }
    };

    return (
        <div className="w-full relative mb-8 group z-[50]">
            {/* BACKGROUND DECORATION */}
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 rounded-xl" />

            {/* MAIN CARD CONTAINER */}
            <div className="relative bg-white border-[3px] border-black rounded-xl overflow-hidden flex flex-col md:flex-row">

                {/* LEFT: USER IDENTITY (Desktop) / TOP (Mobile) */}
                <div className="md:w-64 bg-neutral-100 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white border-[3px] border-black rounded-lg mb-3 mx-auto overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src={user?.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="bg-[#FFC800] text-black font-black text-2xl rounded-none">
                                    {user?.full_name?.charAt(0) || "?"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <h3 className="font-black text-lg leading-tight uppercase">
                            {user?.full_name || "MİSAFİR"}
                        </h3>
                        <p className="text-xs font-bold text-neutral-500 font-mono mt-1 mb-4">
                            @{user?.username || "ziyaretci"}
                        </p>

                        <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                            PAYLAŞIM MERKEZİ
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTIONS GRID */}
                <div className="flex-1 p-6 relative bg-white">
                    <AnimatePresence mode="wait">
                        {isQuestionMode ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-dashed border-neutral-200">
                                    <h4 className="font-black text-xl uppercase flex items-center gap-2">
                                        <MessageCircle className="w-6 h-6 fill-[#FFC800]" /> HIZLI SORU
                                    </h4>
                                    <button
                                        onClick={() => setIsQuestionMode(false)}
                                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors border-2 border-transparent hover:border-black"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Sorunun başlığı nedir?"
                                        className="w-full bg-neutral-50 border-[3px] border-neutral-200 focus:border-black rounded-lg px-4 py-3 font-bold text-lg outline-none transition-colors placeholder:text-neutral-300"
                                        autoFocus
                                    />
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Detayları buraya yazabilirsin..."
                                        className="w-full bg-neutral-50 border-[3px] border-neutral-200 focus:border-black rounded-lg px-4 py-3 font-medium min-h-[100px] outline-none transition-colors resize-none placeholder:text-neutral-300"
                                    />

                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs font-bold border-[2px] rounded-md transition-all uppercase",
                                                    category === cat
                                                        ? "bg-black text-white border-black shadow-[2px_2px_0px_#00000030]"
                                                        : "bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setIsQuestionMode(false)}
                                        className="px-5 py-2.5 font-bold text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={() => submitQuestion('published')}
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-[#FFC800] text-black font-black uppercase text-sm border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-[#FFD633] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Yayınlanıyor..." : "Yayınla"}
                                        <Zap className="w-4 h-4 fill-black" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                                    {ACTION_BUTTONS.map((btn, idx) => {
                                        const Wrapper = btn.href ? Link : 'button';
                                        const props = btn.href ? { href: btn.href } : { onClick: () => handleAction(btn.action!) };

                                        return (
                                            <Wrapper
                                                key={idx}
                                                {...props as any}
                                                className={cn(
                                                    "group relative flex flex-col justify-center p-5 border-[3px] border-black rounded-xl transition-all h-28 sm:h-32",
                                                    btn.color,
                                                    "shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                                                )}
                                            >
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-5 h-5 text-black" />
                                                </div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div className="p-2 bg-black/10 rounded-lg">
                                                        <btn.icon className="w-5 h-5 text-black" strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                                <span className="font-black text-lg text-black leading-none mt-1">
                                                    {btn.label}
                                                </span>
                                                <span className="text-xs font-bold text-black/60 font-mono mt-1">
                                                    {btn.sub}
                                                </span>
                                            </Wrapper>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* DECORATIVE SCREWS */}
            <div className="absolute top-2 left-2 w-3 h-3 border-[2px] border-neutral-400 rounded-full bg-white flex items-center justify-center z-[60] pointer-events-none sm:block hidden">
                <div className="w-full h-[2px] bg-neutral-400 rotate-45" />
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 border-[2px] border-neutral-400 rounded-full bg-white flex items-center justify-center z-[60] pointer-events-none sm:block hidden">
                <div className="w-full h-[2px] bg-neutral-400 rotate-45" />
            </div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-[2px] border-neutral-400 rounded-full bg-white flex items-center justify-center z-[60] pointer-events-none sm:block hidden">
                <div className="w-full h-[2px] bg-neutral-400 rotate-45" />
            </div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-[2px] border-neutral-400 rounded-full bg-white flex items-center justify-center z-[60] pointer-events-none sm:block hidden">
                <div className="w-full h-[2px] bg-neutral-400 rotate-45" />
            </div>
        </div>
    );
}
