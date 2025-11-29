"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Plus, Sparkles, PenLine, Hash, Tag } from "lucide-react";
import { toast } from "sonner";
import { createQuestion } from "@/app/forum/actions";
import { motion, AnimatePresence } from "framer-motion";

export function CreateQuestionDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createQuestion(formData);

            if (result.success) {
                toast.success("Sorunuz paylaşıldı! 🚀");
                setOpen(false);
                setFormData({ title: "", content: "", category: "" });
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:scale-105">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Soru Sor</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] border-white/10 bg-background/80 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-black/50 rounded-[32px] p-0 overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-md border border-primary/20 shadow-inner">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                Yeni Soru Oluştur
                                <p className="text-sm font-normal text-muted-foreground mt-1">Toplulukla bilgi paylaşmaya başla</p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2 group">
                                <Label htmlFor="title" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors flex items-center gap-2">
                                    <PenLine className="h-4 w-4" /> Başlık
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Sorunuzun özeti nedir?"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 transition-all backdrop-blur-sm text-lg"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="category" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Kategori
                                </Label>
                                <Input
                                    id="category"
                                    placeholder="Örn: Kuantum, Uzay, Mekanik..."
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 transition-all backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> Detaylar
                                </Label>
                                <div className="min-h-[300px] rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all backdrop-blur-sm">
                                    <MarkdownEditor
                                        id="content"
                                        label=""
                                        placeholder="Sorunuzu detaylandırın... (Markdown desteklenir)"
                                        value={formData.content}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        minHeight="300px"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="rounded-xl hover:bg-white/5"
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl px-8 h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:scale-105"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Paylaşılıyor...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Soruyu Paylaş <Sparkles className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
