"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createQuestion } from "@/app/forum/actions";

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
                toast.success("Sorunuz paylaşıldı!");
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
                <Button className="gap-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                    <Plus className="h-4 w-4" /> Soru Sor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] border-white/10 bg-background/60 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-black/20 rounded-[32px] p-0 overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative p-6 md:p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-md border border-primary/20">
                                <Plus className="h-5 w-5 text-primary" />
                            </div>
                            Yeni Soru Oluştur
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <Label htmlFor="title" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                Başlık
                            </Label>
                            <Input
                                id="title"
                                placeholder="Sorunuzun özeti..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 transition-all backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2 group">
                            <Label htmlFor="category" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                Kategori
                            </Label>
                            <Input
                                id="category"
                                placeholder="Örn: Kuantum, Uzay..."
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 transition-all backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2 group">
                            <div className="min-h-[300px] rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all backdrop-blur-sm">
                                <MarkdownEditor
                                    id="content"
                                    label="Detaylar"
                                    placeholder="Sorunuzu detaylandırın..."
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    minHeight="300px"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? "Paylaşılıyor..." : "Soruyu Paylaş"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
