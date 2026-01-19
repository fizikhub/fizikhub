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
                    className="gap-2 h-10 px-6 rounded-none bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:bg-primary hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] border border-transparent hover:border-black dark:hover:border-white"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-black tracking-wide">SORU SOR</span>
                </Button>
            )}
            <DialogContent className="sm:max-w-[900px] border-none sm:border-2 border-border bg-background/95 backdrop-blur-xl shadow-none sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] p-0 overflow-hidden rounded-none sm:rounded-3xl h-[100dvh] sm:h-auto z-[150]">

                <div className="relative flex flex-col h-full sm:h-auto sm:max-h-[85vh]">
                    {/* Header - Premium */}
                    <div className="px-6 py-4 border-b border-border/50 bg-background/50 flex items-center justify-between shrink-0">
                        <DialogTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg text-xs",
                                "bg-primary text-primary-foreground font-black"
                            )}>
                                {step}
                            </span>
                            <span className="text-foreground/80">{step === 1 ? "Konu Seç" : "Detaylandır"}</span>
                        </DialogTitle>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            className="rounded-full hover:bg-muted"
                        >
                            <Plus className="w-6 h-6 rotate-45" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-muted/5">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 sm:p-8"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategorySelect(cat.id)}
                                                className={cn(
                                                    "group relative flex flex-col items-center justify-start gap-3 p-4 sm:p-6 transition-all duration-200",
                                                    "bg-background border border-border/60 hover:border-primary/50 rounded-2xl",
                                                    "hover:shadow-lg hover:-translate-y-1",
                                                    formData.category === cat.id ? "ring-2 ring-primary ring-offset-2 bg-primary/5" : ""
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                                    cat.bg, cat.color
                                                )}>
                                                    <cat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                                                </div>
                                                <span className="font-bold text-sm sm:text-base text-foreground/80 group-hover:text-foreground text-center">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="p-4 sm:p-8 space-y-6 sm:space-y-8 pb-32 sm:pb-8"
                                >
                                    {/* Selected Category Tag */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-xs font-bold px-4 py-2 bg-primary/10 text-primary rounded-full uppercase tracking-wider flex items-center gap-2 hover:bg-primary/20 transition-colors"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {formData.category}
                                            <span className="opacity-50 mx-1">|</span>
                                            <span>Değiştir</span>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2 group">
                                            <Label className="pl-1 text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Başlık</Label>
                                            <Input
                                                placeholder="Buraya çarpıcı bir başlık..."
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="text-lg sm:text-2xl font-bold bg-transparent border-0 border-b-2 border-border rounded-none px-1 py-4 h-auto focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-muted-foreground/30"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <Label className="pl-1 text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Detaylar</Label>
                                            <div className="rounded-2xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                                                <MarkdownEditor
                                                    id="content"
                                                    label=""
                                                    placeholder="Detayları buraya yazabilirsin..."
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

                    {/* Footer - Fixed at bottom on mobile */}
                    {step === 2 && (
                        <div className="absolute sm:static bottom-0 left-0 right-0 p-4 border-t border-border bg-background/80 backdrop-blur-md flex justify-between items-center gap-3 z-20">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="font-bold rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                                <span className="mr-2">{'<'}</span> <span className="hidden sm:inline">Geri</span>
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={cn(
                                    "h-12 px-6 sm:px-10 rounded-xl font-black uppercase tracking-widest transition-all",
                                    "bg-primary text-primary-foreground hover:bg-primary/90",
                                    "shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                )}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Yayınla <Rocket className="h-4 w-4" />
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
