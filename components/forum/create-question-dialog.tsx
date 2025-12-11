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
            <DialogContent className="sm:max-w-[800px] border-white/10 bg-black/80 backdrop-blur-3xl shadow-2xl shadow-black/80 rounded-[32px] p-0 overflow-hidden ring-1 ring-white/10">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-background/0 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/10 via-background/0 to-background/0 pointer-events-none" />

                <div className="relative flex flex-col h-[85vh] md:h-auto md:max-h-[85vh]">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-sm z-20">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                                {step === 1 ? "Kategori Seçimi" : "Soru Detayları"}
                            </span>
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-primary" : "bg-white/10"}`} />
                            <div className={`h-1 w-8 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-primary" : "bg-white/10"}`} />
                            <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-primary" : "bg-white/10"}`} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
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
                                                "group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border transition-all duration-300 hover:scale-105",
                                                "bg-white/5 hover:bg-white/10",
                                                cat.border,
                                                formData.category === cat.id ? "ring-2 ring-primary bg-primary/10" : ""
                                            )}
                                        >
                                            <div className={cn("p-4 rounded-full bg-white/5 transition-transform duration-500 group-hover:rotate-12", cat.bg)}>
                                                <cat.icon className={cn("h-8 w-8", cat.color)} />
                                            </div>
                                            <span className="font-medium text-lg text-foreground/90">{cat.label}</span>

                                            {/* Hover Glow */}
                                            <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10", cat.bg)} />
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
                                    {/* Selected Category Badge */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {formData.category}
                                            <span className="ml-1 opacity-50">Değiştir</span>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Soru Başlığı"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="text-2xl md:text-3xl font-bold bg-transparent border-none px-0 placeholder:text-muted-foreground/30 focus-visible:ring-0 h-auto py-2"
                                                autoFocus
                                            />
                                            <div className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />
                                        </div>

                                        <div className="min-h-[300px] relative group">
                                            <div className="absolute -inset-2 bg-gradient-to-b from-primary/5 to-purple-500/5 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                            <MarkdownEditor
                                                id="content"
                                                label=""
                                                placeholder="Aklındakileri dök... (Markdown kullanabilirsin)"
                                                value={formData.content}
                                                onChange={(value) => setFormData({ ...formData, content: value })}
                                                minHeight="300px"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {step === 2 && (
                        <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center z-20">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Geri
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Gönderiliyor...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 font-semibold">
                                        Yayınla <Sparkles className="h-4 w-4" />
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
