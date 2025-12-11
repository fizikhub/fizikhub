"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Plus, Sparkles, PenLine, Hash, Tag, Atom, Brain, Globe, Zap, Microscope, BookOpen, Layers } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
import { toast } from "sonner";
import { createQuestion } from "@/app/forum/actions";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { id: "Kuantum", label: "Kuantum", icon: Atom, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    { id: "Uzay", label: "Uzay", icon: Rocket, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { id: "Mekanik", label: "Mekanik", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { id: "Genel", label: "Genel", icon: Globe, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
    { id: "Teori", label: "Teori", icon: Brain, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
    { id: "Deneysel", label: "Deneysel", icon: Microscope, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
    { id: "Eğitim", label: "Eğitim", icon: BookOpen, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { id: "Diğer", label: "Diğer", icon: Layers, color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20" },
];

interface CreateQuestionDialogProps {
    trigger?: React.ReactNode;
}

export function CreateQuestionDialog({ trigger }: CreateQuestionDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Category, 2: Details
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
            toast.error("Soru sormak için giriş yapmalısınız.");
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
                    className="gap-2 h-10 px-6 rounded-none bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-primary hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] border border-transparent hover:border-black dark:hover:border-white"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-black tracking-wide">SORU SOR</span>
                </Button>
            )}
            <DialogContent className="sm:max-w-[900px] border-2 border-black dark:border-white bg-background shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] p-0 overflow-hidden rounded-none">

                <div className="relative flex flex-col h-[85vh] md:h-auto md:max-h-[85vh]">
                    {/* Header - Industrial */}
                    <div className="px-6 py-6 border-b-2 border-black dark:border-white bg-muted/20 flex items-center justify-between">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">
                                {step === 1 ? "ADIM 1" : "ADIM 2"}
                            </span>
                            <span>{step === 1 ? "KATEGORİ SEÇİMİ" : "SORU DETAYLARI"}</span>
                        </DialogTitle>
                        <div className="flex items-center gap-1">
                            {/* Step Indicators - Squares */}
                            <div className={cn("w-3 h-3 border-2 border-black dark:border-white transition-colors", step >= 1 ? "bg-primary" : "bg-transparent")} />
                            <div className="w-4 h-0.5 bg-black dark:bg-white" />
                            <div className={cn("w-3 h-3 border-2 border-black dark:border-white transition-colors", step >= 2 ? "bg-primary" : "bg-transparent")} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-background">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={cn(
                                                "group relative flex flex-col items-center justify-center gap-4 p-6 border-2 border-black dark:border-white transition-all duration-200",
                                                "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1",
                                                "bg-card hover:bg-primary/5",
                                                formData.category === cat.id ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-1 -translate-x-1" : ""
                                            )}
                                        >
                                            <div className="p-3 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                                <cat.icon className="h-6 w-6" />
                                            </div>
                                            <span className="font-bold text-lg uppercase tracking-tight">{cat.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-8 space-y-8"
                                >
                                    {/* Selected Category Tag */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-xs font-bold px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black uppercase tracking-wider flex items-center gap-2 hover:opacity-80 transition-opacity"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {formData.category}
                                            <span className="opacity-70 ml-1">/ DEĞİŞTİR</span>
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2 group">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary">Başlık</Label>
                                            <Input
                                                placeholder="SORUNUN BAŞLIĞI NE?"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="text-xl md:text-2xl font-black bg-muted/20 border-2 border-black dark:border-white rounded-none p-6 h-auto focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus-visible:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all placeholder:text-muted-foreground/40"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary">Detaylar</Label>
                                            <div className="border-2 border-black dark:border-white p-1 focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all bg-card">
                                                <MarkdownEditor
                                                    id="content"
                                                    label=""
                                                    placeholder="Aklındakileri dök... (Markdown desteklenir)"
                                                    value={formData.content}
                                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                                    minHeight="300px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {step === 2 && (
                        <div className="p-6 border-t-2 border-black dark:border-white bg-muted/20 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="font-bold uppercase tracking-wider hover:bg-transparent hover:underline"
                            >
                                <span className="mr-2">{"<"}</span> Geri Dön
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="h-12 px-8 rounded-none bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-primary hover:text-black border-2 border-transparent hover:border-black dark:hover:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        YÜKLENİYOR...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        YAYINLA <Rocket className="h-4 w-4" />
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
