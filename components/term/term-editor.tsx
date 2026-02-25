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
            const plainContent = content.replace(/<[^>]*>?/gm, '');
            formData.append("excerpt", `${termName}: ${plainContent.substring(0, 120)}...`); // Simple plain excerpt
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
        <div className="max-w-4xl mx-auto px-1.5 sm:px-0 space-y-8 animate-in fade-in duration-500 pb-24 relative">
            <TermGuide open={showGuide} onOpenChange={setShowGuide} />

            {/* Guide Trigger Float */}
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform w-12 h-12 text-blue-500 hover:text-blue-600 hover:bg-blue-50 active:translate-y-[2px] active:shadow-none"
                    onClick={() => setShowGuide(true)}
                    title="İpuçları"
                >
                    <WholeWord className="w-6 h-6 stroke-[3]" />
                </Button>
            </div>

            <div className="bg-card border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col gap-0 relative">

                {/* Top Meta Area (Blue Tint) */}
                <div className="px-4 py-5 sm:p-8 border-b-[3px] border-black bg-blue-600/10 space-y-5">

                    {/* Title */}
                    <Textarea
                        ref={titleRef}
                        placeholder="TERİM ADI..."
                        className="w-full resize-none overflow-hidden bg-transparent border-none text-3xl sm:text-4xl md:text-5xl font-black font-[family-name:var(--font-outfit)] uppercase tracking-tighter placeholder:text-muted-foreground/30 focus-visible:ring-0 p-0 leading-[1.1] min-h-[50px] sm:min-h-[60px]"
                        value={termName}
                        onChange={(e) => setTermName(e.target.value)}
                        maxLength={150}
                        rows={1}
                    />

                    {/* Meta Controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                        {/* Related Field */}
                        <div className="flex-1 sm:max-w-[300px] flex items-center bg-background border-[3px] border-black rounded-[8px] px-3 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                            <Hash className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                            <Input
                                placeholder="Alan (Örn: Fizik, Biyoloji)"
                                value={relatedField}
                                onChange={(e) => setRelatedField(e.target.value)}
                                className="w-full h-full border-none shadow-none bg-transparent hover:bg-transparent px-0 font-bold focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {/* Certainty badge */}
                        <div className="flex-shrink-0 flex items-center justify-center bg-blue-600/10 border-[3px] border-blue-600 text-blue-700 dark:text-blue-400 rounded-[8px] px-4 h-12 font-black uppercase tracking-widest text-xs sm:text-sm select-none">
                            100% Kesinlik
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="p-4 sm:p-6 md:p-8 bg-background flex flex-col min-h-[500px]">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        className="flex-1 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-blue-300 selection:text-black placeholder:text-muted-foreground/30 focus:outline-none"
                        onUploadImage={async () => { return ""; }}
                    />
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-6 border-t-[3px] border-black bg-[#f4f4f5] dark:bg-[#18181b] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className={cn("hidden sm:block text-xs font-black uppercase tracking-widest transition-colors",
                        content.length > 0 ? "text-muted-foreground" : "text-transparent"
                    )}>
                        {content.length} karakter
                    </span>

                    <div className="flex w-full sm:w-auto gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleSubmit("draft")}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none h-12 text-foreground font-black uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white rounded-[8px] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none text-xs sm:text-sm"
                        >
                            Taslak
                        </Button>
                        <Button
                            onClick={() => handleSubmit("published")}
                            disabled={isSubmitting || !termName || !content}
                            className="flex-1 sm:flex-none h-12 rounded-[8px] bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-6 sm:px-8 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xs sm:text-sm"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2 stroke-[3]" />}
                            Paylaş
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
