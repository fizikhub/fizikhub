"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Send, WholeWord, BookType, Hash } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TermGuide } from "@/components/term/term-guide";

interface TermEditorProps {
    userId: string;
}

export function TermEditor({ userId }: TermEditorProps) {
    // Term Meta
    const [termName, setTermName] = useState("");
    const [relatedField, setRelatedField] = useState(""); // e.g., Fizik, Biyoloji
    const [content, setContent] = useState("");

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-resize title
    const titleRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [termName]);

    // Submit Logic
    const handleSubmit = async (targetStatus: "draft" | "published") => {
        if (!termName.trim() || !content.trim()) {
            toast.error("Terim adı ve açıklaması gereklidir.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare Metadata
            const metadata = {
                type: "term",
                termName: termName,
                relatedField: relatedField || "Genel Bilim"
            };

            // Prepend Metadata to Content
            const metaString = `<!--meta ${JSON.stringify(metadata)} -->`;
            const finalContent = `${metaString}\n\n${content}`;

            const formData = new FormData();
            formData.append("title", `${termName}`); // Title is just the term name
            formData.append("content", finalContent);
            formData.append("excerpt", `${termName}: ${content.substring(0, 120)}...`); // Simple excerpt
            formData.append("category", "Terim"); // New category
            // No cover image for terms by default, layout handles it
            formData.append("status", targetStatus === "published" ? "published" : "draft"); // Auto publish for now or draft

            const result = await createArticle(formData);

            if (!result.success) throw new Error(result.error || "Terim oluşturulamadı");

            toast.success(targetStatus === "published" ? "Terim paylaşıldı!" : "Taslak kaydedildi!");
            window.location.href = "/profil"; // Redirect to profile or feed

        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
    };

    const [showGuide, setShowGuide] = useState(true);

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <TermGuide open={showGuide} onOpenChange={setShowGuide} />

            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-foreground pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-500 text-white border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <BookType className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Terim Ekle</h1>
                        <p className="text-muted-foreground font-bold text-sm uppercase tracking-wide">Tanımla. Örnekle. Aydınlat.</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowGuide(true)}
                    className="rounded-full border-2 border-foreground hover:bg-muted"
                    title="İpuçları"
                >
                    <WholeWord className="w-5 h-5 text-blue-500" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Left: Term Meta Input */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card p-6 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-border/50">
                            <BookType className="w-5 h-5 text-blue-600" />
                            <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Terim Künyesi</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Terim Adı</Label>
                                <Textarea
                                    ref={titleRef}
                                    placeholder="TERİM..."
                                    className="min-h-[60px] sm:min-h-[80px] font-bold text-2xl sm:text-xl uppercase tracking-tight resize-none bg-background border-2 border-border focus:border-blue-600 focus:ring-0 rounded-xl transition-all placeholder:text-muted-foreground/30 shadow-sm"
                                    value={termName}
                                    onChange={(e) => setTermName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <Hash className="w-3 h-3 text-blue-600" />
                                    Alan / Konu
                                </Label>
                                <Input
                                    placeholder="Örn: Fizik, DNA, Uzay..."
                                    className="h-12 bg-muted/20 border-2 border-border focus:border-blue-600 focus:ring-0 rounded-xl transition-all font-bold text-lg placeholder:font-normal placeholder:text-muted-foreground/40"
                                    value={relatedField}
                                    onChange={(e) => setRelatedField(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium leading-relaxed">
                        <span className="font-bold underline">İpucu:</span> Terimi açıklarken herkesin anlayabileceği bir dil kullanmaya çalış. Karmaşık formüller yerine güzel benzetmeler hayat kurtarır.
                    </div>
                </div>

                {/* Right: Content Editor */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card min-h-[500px] border-2 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden relative">
                        {/* Editor Toolbar Header */}
                        <div className="border-b-2 border-border p-2 bg-muted/30 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500" />
                            <div className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500" />
                            <div className="w-3 h-3 rounded-full bg-sky-500/20 border border-sky-500" />
                        </div>

                        <div className="p-4 border-b border-border/10">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Açıklama / Tanım</Label>
                        </div>

                        <ArticleEditor
                            content={content}
                            onChange={setContent}
                            className="flex-1 p-6 sm:p-8 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-black prose-p:text-lg prose-p:leading-relaxed placeholder:text-muted-foreground/20"
                            onUploadImage={async () => { return ""; }} // No image upload for simple term editor? Or allowed? Let's generic blank function for now or implement if needed. Actually ArticleEditor expects it.
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 py-4 px-4 -mx-4 bg-background/90 backdrop-blur-xl border-t-2 border-foreground/10 flex justify-end items-center mt-12">
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        className="text-muted-foreground hover:text-foreground font-black uppercase border-2 hover:bg-muted rounded-full"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>
                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={isSubmitting || !termName || !content}
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase px-6 border-2 border-blue-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Send className="w-4 h-4 mr-2 stroke-[3]" />
                        )}
                        Paylaş
                    </Button>
                </div>
            </div>
        </div>
    );
}
