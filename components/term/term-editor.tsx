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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const [activeTab, setActiveTab] = useState("content");

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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Mobile Tab Control - Sticky Top on Mobile */}
                <div className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b-[3px] border-black p-2 -mx-4 mb-4">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/30 border-[3px] border-black rounded-xl h-12 p-1">
                        <TabsTrigger value="content" className="rounded-lg font-black uppercase tracking-widest text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_#000] transition-all">
                            📝 Açıklama
                        </TabsTrigger>
                        <TabsTrigger value="details" className="rounded-lg font-black uppercase tracking-widest text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_#000] transition-all">
                            ⚙️ Ayarlar
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left/Main Column: Definition Editor */}
                    <TabsContent value="content" className="md:col-span-8 space-y-6 mt-0 border-0 p-0">
                        {/* Title Input */}
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Terim Adı</Label>
                            <Textarea
                                ref={titleRef}
                                placeholder="TERİMİN ADI..."
                                className="min-h-[60px] sm:min-h-[80px] font-black text-3xl sm:text-5xl uppercase tracking-tighter resize-none bg-background border-none focus:ring-0 rounded-none p-0 placeholder:text-muted-foreground/30 shadow-none leading-[0.9] text-foreground"
                                value={termName}
                                onChange={(e) => setTermName(e.target.value)}
                            />
                        </div>

                        {/* Article Editor for Definition */}
                        <div className="bg-card min-h-[400px] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden relative group">
                            <div className="border-b-[3px] border-black p-3 bg-muted/40 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-red-500" />
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-yellow-500" />
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-green-500" />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground mr-2">Açıklama Editörü</span>
                            </div>
                            <ArticleEditor
                                content={content}
                                onChange={setContent}
                                className="flex-1 p-6 sm:p-10 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-blue-300 selection:text-black"
                                onUploadImage={async () => { return ""; }}
                            />
                        </div>
                    </TabsContent>

                    {/* Right Column: Settings */}
                    <TabsContent value="details" className="md:col-span-4 space-y-6 mt-0 data-[state=inactive]:hidden md:data-[state=inactive]:block border-0 p-0 md:sticky md:top-24">
                        <div className="bg-card p-5 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] rounded-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black/10">
                                <BookType className="w-5 h-5 text-blue-600" />
                                <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Terim Detayı</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-blue-600" />
                                        Alan / Konu
                                    </Label>
                                    <Input
                                        placeholder="Örn: Fizik, DNA, Uzay..."
                                        className="h-12 bg-muted/20 border-2 border-black focus:border-blue-600 focus:ring-0 rounded-lg transition-all font-bold text-lg placeholder:font-normal placeholder:text-muted-foreground/40"
                                        value={relatedField}
                                        onChange={(e) => setRelatedField(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">İlgili Alan Yüzdesi (%)</Label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 text-center py-4 bg-muted/20 border-2 border-black rounded-lg group hover:border-blue-600 transition-colors cursor-help">
                                            <div className="font-black text-3xl text-foreground group-hover:text-blue-600 transition-colors">100</div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Kesinlik</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium italic mt-2 text-center">Bu alan otomatik olarak 100% olarak ayarlanmıştır.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-600/10 border-[3px] border-blue-600 text-foreground text-sm font-medium shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                            <span className="font-black uppercase tracking-widest">İpucu:</span> Terimi açıklarken herkesin anlayabileceği bir dil kullanmaya çalış. Karmaşık formüller yerine güzel benzetmeler hayat kurtarır.
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 p-4 sm:p-5 -mx-4 bg-[#f4f4f5] dark:bg-[#18181b] border-t-[3px] border-black flex justify-end items-center mt-12 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)] gap-4">
                <div className="flex w-full sm:w-auto gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        className="flex-1 sm:flex-none h-12 sm:h-auto text-foreground font-black uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white rounded-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>
                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={isSubmitting || !termName || !content}
                        className="flex-1 sm:flex-none h-12 sm:h-auto rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] hover:-translate-x-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <Send className="w-5 h-5 mr-2 stroke-[3]" />
                        )}
                        Paylaş
                    </Button>
                </div>
            </div>
        </div>
    );
}
