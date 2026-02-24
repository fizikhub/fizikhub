"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Plus, Hash, Tag, Atom, Brain, Globe, Zap, Microscope, BookOpen, Layers, FlaskConical } from "lucide-react";
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
            { id: "Kuantum", label: "Kuantum", icon: Atom },
            { id: "Astrofizik", label: "Astrofizik", icon: Rocket },
            { id: "Mekanik", label: "Mekanik", icon: Zap },
            { id: "Termodinamik", label: "Termo.", icon: Zap },
            { id: "Elektromanyetizma", label: "Elek-Mag", icon: Zap },
            { id: "Genel-Fizik", label: "Genel Fizik", icon: Globe },
        ]
    },
    {
        label: "Temel Bilimler",
        categories: [
            { id: "Biyoloji", label: "Biyoloji", icon: Microscope },
            { id: "Kimya", label: "Kimya", icon: FlaskConical },
            { id: "Matematik", label: "Matematik", icon: Hash },
        ]
    },
    {
        label: "Sosyal & Değerler",
        categories: [
            { id: "Edebiyat", label: "Edebiyat", icon: BookOpen },
            { id: "Felsefe", label: "Felsefe", icon: Brain },
            { id: "Diğer", label: "Diğer", icon: Layers },
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
            toast("Giriş yapmanız gerekiyor.", {
                description: "Soru sormak, cevap yazmak ve topluluğa katılmak için hemen giriş yapın.",
                action: {
                    label: "Giriş Yap",
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
                    className="gap-2 h-10 px-6 rounded-[8px] bg-black dark:bg-[#18181b] text-white hover:bg-neutral-800 dark:hover:bg-zinc-800 border-[3px] border-black transition-all shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-outfit font-black tracking-wide uppercase">Soru Sor</span>
                </Button>
            )}
            <DialogContent
                className="sm:max-w-[700px] w-[95vw] border-[3px] border-black bg-white dark:bg-[#27272a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-[8px] h-auto max-h-[85dvh] flex flex-col z-[150] gap-0"
            >
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                <div className="relative flex flex-col h-full sm:max-h-[90vh] z-10">
                    {/* Header - Sleek */}
                    <div className="px-5 py-4 border-b-[3px] border-black bg-white dark:bg-[#18181b] flex items-center justify-between shrink-0">
                        <DialogTitle className="font-[family-name:var(--font-outfit)] text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-black dark:text-zinc-50">
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 text-sm",
                                "bg-[#FFC800] text-black font-black border-[3px] border-black rounded-[4px] shadow-[2px_2px_0px_0px_#000]"
                            )}>
                                {step}
                            </span>
                            <span>{step === 1 ? "KONU SEÇ" : "AYRINTILAR"}</span>
                        </DialogTitle>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            className="rounded-[8px] border-[3px] border-transparent hover:border-black hover:bg-neutral-100 dark:hover:bg-zinc-800 text-black dark:text-zinc-100 transition-all w-9 h-9"
                        >
                            <Plus className="w-5 h-5 rotate-45 stroke-[3px]" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-transparent">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-5 sm:p-6 space-y-6"
                                >
                                    {CATEGORY_GROUPS.map((group, groupIdx) => (
                                        <div key={groupIdx} className="space-y-3">
                                            <h4 className="font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-zinc-400 pl-1">
                                                {group.label}
                                            </h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                {group.categories.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => handleCategorySelect(cat.id)}
                                                        className={cn(
                                                            "group relative flex items-center gap-3 p-3 transition-all duration-200",
                                                            "bg-white dark:bg-[#18181b] border-[3px] border-black rounded-[8px]",
                                                            "shadow-[2px_2px_0px_0px_#000]",
                                                            "hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#000]",
                                                            "active:translate-y-[2px] active:translate-x-[2px] active:shadow-none",
                                                            formData.category === cat.id ? "bg-neutral-100 dark:bg-zinc-800" : ""
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-[6px] border-[2px] border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]"
                                                        )}>
                                                            <cat.icon className="h-4 w-4 stroke-[2.5px] text-black dark:text-zinc-100" />
                                                        </div>
                                                        <span className="font-[family-name:var(--font-inter)] font-black text-xs sm:text-sm uppercase tracking-wide text-black dark:text-zinc-100 text-left line-clamp-1">
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
                                    className="p-5 sm:p-6 pb-20 sm:pb-6 space-y-5"
                                >
                                    {/* Selected Category Tag */}
                                    <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-3 py-1.5 border-[2px] border-black bg-[#FFC800] text-black font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all rounded-[6px]"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {formData.category}
                                            <span className="opacity-50 mx-1">|</span>
                                            <span>DEĞİŞTİR</span>
                                        </button>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2 group">
                                            <Label className="font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-widest text-black dark:text-zinc-100">Başlık</Label>
                                            <Input
                                                placeholder="Sormak istediğin soru nedir?"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className={cn(
                                                    "font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-black bg-white dark:bg-[#18181b] border-[3px] border-black text-black dark:text-zinc-50 rounded-[8px] px-3 py-6 h-auto",
                                                    "focus-visible:ring-0 focus-visible:border-black",
                                                    "shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all placeholder:text-neutral-400 dark:placeholder:text-zinc-600 uppercase"
                                                )}
                                                autoFocus
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <Label className="font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-widest text-black dark:text-zinc-100">Açıklama</Label>
                                            <div className="border-[3px] border-black bg-white dark:bg-[#18181b] shadow-[2px_2px_0px_0px_#000] overflow-hidden rounded-[8px] focus-within:translate-x-[1px] focus-within:translate-y-[1px] focus-within:shadow-[1px_1px_0px_0px_#000] transition-all">
                                                <MarkdownEditor
                                                    id="content"
                                                    label=""
                                                    placeholder="Ayrıntıları paylaş..."
                                                    value={formData.content}
                                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                                    minHeight="200px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2 flex justify-between items-center">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setStep(1)}
                                            className="font-[family-name:var(--font-inter)] font-black border-[3px] border-transparent hover:border-black hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-[8px] transition-all uppercase tracking-widest text-xs px-4"
                                        >
                                            <span className="mr-2">{'<'}</span> GERİ
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className={cn(
                                                "h-10 px-8 font-[family-name:var(--font-inter)] font-black uppercase tracking-widest transition-all rounded-[8px]",
                                                "bg-green-600 hover:bg-green-500 text-white border-[3px] border-black",
                                                "shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                                            )}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="h-4 w-4 border-2 border-white dark:border-zinc-100 border-t-transparent rounded-full animate-spin" />
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    PAYLAŞ <Rocket className="h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
