"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Plus, Sparkles, Hash, Tag, Atom, Brain, Globe, Zap, Microscope, BookOpen, Layers, FlaskConical } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
import { toast } from "sonner";
import { createQuestion } from "@/app/forum/actions";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

const CATEGORY_GROUPS = [
    {
        label: "Fizik Bilimleri",
        categories: [
            { id: "Kuantum", label: "Kuantum", icon: Atom, bg: "bg-[#C084FC]" },
            { id: "Astrofizik", label: "Astrofizik", icon: Rocket, bg: "bg-[#60A5FA]" },
            { id: "Mekanik", label: "Mekanik", icon: Zap, bg: "bg-[#FACC15]" },
            { id: "Termodinamik", label: "Termo.", icon: Sparkles, bg: "bg-orange-400" },
            { id: "Elektromanyetizma", label: "Elek-Mag", icon: Zap, bg: "bg-[#FB7185]" },
            { id: "Genel-Fizik", label: "Genel Fizik", icon: Globe, bg: "bg-[#4ADE80]" },
        ]
    },
    {
        label: "Temel Bilimler",
        categories: [
            { id: "Biyoloji", label: "Biyoloji", icon: Microscope, bg: "bg-[#4ADE80]" },
            { id: "Kimya", label: "Kimya", icon: FlaskConical, bg: "bg-[#60A5FA]" },
            { id: "Matematik", label: "Matematik", icon: Hash, bg: "bg-[#FACC15]" },
        ]
    },
    {
        label: "Sosyal & Değerler",
        categories: [
            { id: "Edebiyat", label: "Edebiyat", icon: BookOpen, bg: "bg-[#FB7185]" },
            { id: "Felsefe", label: "Felsefe", icon: Brain, bg: "bg-[#C084FC]" },
            { id: "Diğer", label: "Diğer", icon: Layers, bg: "bg-zinc-300" },
        ]
    }
];

interface CreateQuestionDialogProps {
    trigger?: React.ReactNode;
    defaultOpen?: boolean;
}

export function CreateQuestionDialog({ trigger, defaultOpen = false }: CreateQuestionDialogProps) {
    const [open, setOpen] = useState(defaultOpen);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (defaultOpen) {
            setOpen(true);
        }
    }, [defaultOpen]);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }

        setLoading(true);

        try {
            const result = await createQuestion(formData);

            if (result.success) {
                toast.success("Sorunuz evrene gönderildi! 🚀");
                setOpen(false);
                setFormData({ title: "", content: "", category: "" });
                setStep(1);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (categoryId: string) => {
        setFormData({ ...formData, category: categoryId });
        setStep(2);
    };

    const [supabase] = useState(() => createClient());

    const handleOpen = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            toast("GİRİŞ YAPMAN GEREKİYOR", {
                description: "Soru sormak, cevap yazmak ve topluluğa katılmak için hemen giriş yap.",
                action: {
                    label: "GİRİŞ YAP",
                    onClick: () => window.location.href = "/login"
                },
            });
            return;
        }
        setOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger ? (
                <div onClick={handleOpen} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <Button
                    onClick={handleOpen}
                    className="gap-2 h-10 px-6 rounded-none bg-black dark:bg-white text-white dark:text-black font-bold uppercase border-[3px] border-transparent hover:border-black dark:hover:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-black tracking-wide">SORU SOR</span>
                </Button>
            )}
            <DialogContent
                style={{ transform: "translate(-50%, -50%)" }}
                className="!translate-x-0 !translate-y-0 sm:max-w-[750px] w-[95vw] border-[3px] sm:border-4 border-black dark:border-white bg-[#f4f4f5] dark:bg-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-0 overflow-hidden rounded-none h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col z-[150] gap-0"
            >
                <div className="relative flex flex-col h-full sm:max-h-[90vh]">
                    {/* Header - Neo Brutalist */}
                    <div className="px-5 sm:px-6 py-4 border-b-[3px] sm:border-b-4 border-black dark:border-white bg-white dark:bg-[#18181b] flex items-center justify-between shrink-0 z-10">
                        <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-black dark:text-white">
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-lg",
                                "bg-[#FACC15] text-black font-black border-2 sm:border-[3px] border-black shadow-[2px_2px_0px_0px_#000]"
                            )}>
                                {step}
                            </span>
                            <span>{step === 1 ? "KONU SEÇ" : "DETAYLANDIR"}</span>
                        </DialogTitle>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            className="rounded-none border-[3px] border-transparent hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            <Plus className="w-6 h-6 rotate-45" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white dark:bg-[#18181b] relative">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-5 sm:p-8 space-y-8"
                                >
                                    {CATEGORY_GROUPS.map((group, groupIdx) => (
                                        <div key={groupIdx} className="space-y-4">
                                            <h4 className="text-base sm:text-lg font-black uppercase tracking-widest text-black dark:text-white border-b-[3px] sm:border-b-4 border-black dark:border-white pb-2 inline-block">
                                                {group.label}
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                                {group.categories.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => handleCategorySelect(cat.id)}
                                                        className={cn(
                                                            "group relative flex items-center gap-3 p-3 sm:p-4 transition-all duration-200",
                                                            "bg-white dark:bg-zinc-900 border-2 sm:border-[3px] border-black dark:border-white rounded-none",
                                                            "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]",
                                                            "hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#fff]",
                                                            "active:translate-y-1 active:translate-x-1 active:shadow-none",
                                                            formData.category === cat.id ? "bg-zinc-100 dark:bg-zinc-800" : ""
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-none border-2 sm:border-[3px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]",
                                                            cat.bg
                                                        )}>
                                                            <cat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                                                        </div>
                                                        <span className="font-black text-xs sm:text-sm uppercase tracking-wide text-black dark:text-white text-left line-clamp-2">
                                                            {cat.label}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-5 sm:p-8 space-y-6 pb-24 sm:pb-8"
                                >
                                    {/* Selected Category Tag */}
                                    <div className="flex items-center justify-between pb-4 border-b-[3px] sm:border-b-4 border-black dark:border-white">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2 border-[3px] border-black dark:border-white bg-[#FACC15] text-black font-black uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
                                        >
                                            <Tag className="h-4 w-4" />
                                            {formData.category}
                                            <span className="opacity-50 mx-1">|</span>
                                            <span>DEĞİŞTİR</span>
                                        </button>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="space-y-3 group">
                                            <Label className="text-sm sm:text-base font-black uppercase tracking-widest text-black dark:text-white">Başlık</Label>
                                            <Input
                                                placeholder="BÜYÜK BİR SORU SOR..."
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className={cn(
                                                    "text-lg sm:text-2xl font-black bg-[#f4f4f5] dark:bg-zinc-800 border-[3px] border-black dark:border-white text-black dark:text-white rounded-none px-4 py-6 sm:py-8 h-auto",
                                                    "focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white",
                                                    "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] transition-all placeholder:text-black/30 dark:placeholder:text-white/30"
                                                )}
                                                autoFocus
                                            />
                                        </div>

                                        <div className="space-y-3 group">
                                            <Label className="text-sm sm:text-base font-black uppercase tracking-widest text-black dark:text-white">Detaylar</Label>
                                            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] overflow-hidden rounded-none">
                                                <MarkdownEditor
                                                    id="content"
                                                    label=""
                                                    placeholder="Açıklamanı buraya detaylıca yazabilirsin..."
                                                    value={formData.content}
                                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                                    minHeight="250px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer - Fixed at bottom on mobile, static on desktop */}
                    {step === 2 && (
                        <div className="absolute sm:static bottom-0 left-0 right-0 p-4 sm:p-6 border-t-[3px] sm:border-t-4 border-black dark:border-white bg-[#f4f4f5] dark:bg-zinc-950 flex justify-between items-center z-20">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="font-black border-[3px] border-transparent hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none transition-all uppercase tracking-widest"
                            >
                                <span className="mr-2">{'<'}</span> <span className="hidden sm:inline">GERİ</span>
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={cn(
                                    "h-12 px-6 sm:px-10 font-black uppercase tracking-widest transition-all rounded-none",
                                    "bg-[#FACC15] text-black border-[3px] border-black",
                                    "shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                )}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        YAYINLA <Rocket className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
