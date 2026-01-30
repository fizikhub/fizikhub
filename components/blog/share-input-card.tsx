"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, MessageCircle, LibraryBig, Atom, Zap, X, Send } from "lucide-react";
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

// Compact action buttons configuration
const ACTIONS = [
    { icon: PenTool, label: "Makale", href: "/makale/yeni", color: "hover:text-[#FFC800]" },
    { icon: LibraryBig, label: "Kitap", href: "/kitap-inceleme/yeni", color: "hover:text-[#f472b6]" },
    { icon: Atom, label: "Deney", href: "/makale/yeni?type=experiment", color: "hover:text-[#4ade80]" }
];

export function ShareInputCard({ user: initialUser }: ShareInputCardProps) {
    const [user, setUser] = useState(initialUser);
    const [supabase] = useState(() => createClient());

    // States
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const avatarUrl = user?.avatar_url || "";
    const nameInitial = user?.full_name?.charAt(0) || "?";

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser && !user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                if (profile) setUser(profile);
            }
        };
        fetchUser();
    }, [initialUser, supabase, user]);

    const submitQuestion = async () => {
        if (!title.trim() || !content.trim() || !category) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createQuestion({ title, content, category, status: 'published' });
            if (result.success) {
                toast.success("Sorun topluluğa iletildi! 🚀");
                setTitle("");
                setContent("");
                setCategory("");
                setIsExpanded(false);
                router.push('/forum');
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
        <div className="w-full relative mb-10 z-[50]">
            <motion.div
                layout
                className={cn(
                    "bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] rounded-xl overflow-hidden transition-all",
                    isExpanded ? "p-0" : "p-2"
                )}
            >
                {!isExpanded ? (
                    // --- COMPACT VIEW ---
                    <div className="flex items-center gap-3">
                        {/* Avatar Trigger */}
                        <div className="shrink-0 pl-1">
                            <Avatar className="w-10 h-10 border-[2px] border-black rounded-lg shadow-sm">
                                <AvatarImage src={avatarUrl} className="object-cover" />
                                <AvatarFallback className="bg-[#FFC800] text-black font-black rounded-lg">
                                    {nameInitial}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Fake Input */}
                        <div
                            onClick={() => setIsExpanded(true)}
                            className="flex-1 bg-neutral-100 border-[2px] border-transparent hover:border-black/10 hover:bg-neutral-200 rounded-lg px-4 py-2.5 cursor-pointer group transition-all"
                        >
                            <span className="text-sm font-bold text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                Hızlıca bir soru sor veya tartışma başlat...
                            </span>
                        </div>

                        {/* Quick Actions (Desktop only mostly, or squeeze on mobile) */}
                        <div className="hidden sm:flex items-center gap-1 pr-1">
                            {ACTIONS.map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={cn("p-2.5 rounded-lg text-neutral-400 hover:bg-black hover:text-white transition-all", action.color)}
                                    title={action.label}
                                >
                                    <action.icon className="w-5 h-5" strokeWidth={2.5} />
                                </Link>
                            ))}
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="p-2.5 rounded-lg text-black bg-[#FFC800] border-[2px] border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ml-1"
                            >
                                <Zap className="w-5 h-5 fill-black" />
                            </button>
                        </div>
                        {/* Mobile Action (Just the main trigger) */}
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="p-2 sm:hidden rounded-lg text-black bg-[#FFC800] border-[2px] border-black shadow-[2px_2px_0px_#000]"
                        >
                            <Zap className="w-5 h-5 fill-black" />
                        </button>
                    </div>
                ) : (
                    // --- EXPANDED FORM VIEW ---
                    <div className="flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b-[2px] border-black bg-neutral-50">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#FFC800] border-[2px] border-black rounded-md">
                                    <MessageCircle className="w-4 h-4 text-black" />
                                </div>
                                <span className="font-black uppercase text-sm tracking-wide">Hızlı Soru Oluştur</span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1.5 hover:bg-black hover:text-white rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-4 space-y-4">
                            <div>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Sorunun başlığı ne olsun?"
                                    className="w-full text-lg font-black placeholder:text-neutral-300 outline-none"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Detayları buraya yazabilirsin..."
                                    className="w-full min-h-[100px] text-sm font-medium text-neutral-600 placeholder:text-neutral-300 outline-none resize-none"
                                />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t-[2px] border-dashed border-neutral-200">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={cn(
                                            "px-3 py-1 text-[10px] font-bold border-[2px] rounded-md transition-all uppercase",
                                            category === cat
                                                ? "bg-black text-white border-black shadow-[2px_2px_0px_#00000030]"
                                                : "bg-white text-neutral-400 border-neutral-200 hover:border-black hover:text-black"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 py-3 bg-neutral-50 border-t-[2px] border-black flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 hidden sm:flex">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Topluluk anında görecek
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Link href="/makale/yeni" className="text-xs font-bold text-neutral-500 hover:text-black underline decoration-2 decoration-[#FFC800] underline-offset-4 mr-2">
                                    Makale mi yazacaksın?
                                </Link>
                                <button
                                    onClick={submitQuestion}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-black text-white font-bold text-xs uppercase rounded-lg shadow-[3px_3px_0px_#FFC800] hover:shadow-[1px_1px_0px_#FFC800] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Gönderiliyor..." : "Yayınla"}
                                    <Send className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
