"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, X, Trash2, Hash, AlignLeft, Send, Sparkles, HelpCircle, BookOpen, Fingerprint, Lightbulb, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle, updateArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { BlogEditor101 } from "@/components/article/blog-editor-101";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"] });

interface NewArticleFormProps {
    userId: string;
    isFirstArticle: boolean;
    hasSeenGuide: boolean;
    initialData?: {
        id?: number;
        title: string;
        content: string;
        excerpt: string | null;
        category: string;
        coverUrl: string | null;
        status: string;
    };
}

const categories = [
    "Kuantum Fiziği", "Astrofizik", "Termodinamik", "Mekanik",
    "Elektromanyetizma", "Genel Görelilik", "Parçacık Fiziği", "Genel"
];

export function NewArticleForm({ userId, isFirstArticle, hasSeenGuide, initialData }: NewArticleFormProps) {
    // Form States
    const [title, setTitle] = useState(initialData?.title || "");
    const [category, setCategory] = useState(initialData?.category || "Genel");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Guide State
    const [showGuide, setShowGuide] = useState(!hasSeenGuide);

    // Auto-resize title
    const titleRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    const coverInputRef = useRef<HTMLInputElement>(null);

    // Generic Upload Helper
    const uploadToSupabase = async (file: File): Promise<string> => {
        if (file.size > 5 * 1024 * 1024) throw new Error("Dosya boyutu 5MB'dan küçük olmalı.");
        if (!file.type.startsWith("image/")) throw new Error("Sadece resim dosyası yükleyebilirsiniz.");

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

        if (uploadError) throw new Error(`Yükleme hatası: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from("article-images")
            .getPublicUrl(fileName);

        return publicUrl;
    };

    // Cover Image Handler
    const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const url = await uploadToSupabase(file);
            setCoverUrl(url);
            toast.success("Kapak resmi yüklendi!");
        } catch (error: any) {
            toast.error(error.message || "Görsel yüklenirken hata oluştu.");
        } finally {
            setUploadingImage(false);
            if (coverInputRef.current) coverInputRef.current.value = "";
        }
    };

    // Guide Handler
    const handleDontShowAgain = async (uid: string) => {
        const supabase = createClient();
        await supabase.from("profiles").update({ has_seen_article_guide: true }).eq("id", uid);
        toast.success("Anlaşıldı! 🚀");
    };

    // Submit Handler
    const handleSubmit = async (targetStatus: "draft" | "pending") => {
        if (!title.trim() || !content.trim()) {
            toast.error("Başlık ve içerik doldurulmalıdır.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("excerpt", excerpt);
            formData.append("category", category);
            formData.append("cover_url", coverUrl);
            formData.append("status", targetStatus);

            let result;
            if (initialData?.id) {
                formData.append("id", initialData.id.toString());
                result = await updateArticle(formData);
            } else {
                result = await createArticle(formData);
            }

            if (!result.success) throw new Error(result.error || "Blog oluşturulamadı");

            if (isFirstArticle) {
                const supabase = createClient();
                await supabase.from("profiles").update({ has_written_article: true }).eq("id", userId);
            }

            toast.success(targetStatus === "pending" ? "Blog incelemeye gönderildi!" : "Taslak kaydedildi!");
            window.location.href = "/profil";

        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-1.5 sm:px-0 animate-in fade-in duration-500 pb-24 relative">
            <BlogEditor101
                open={showGuide}
                onOpenChange={setShowGuide}
                userId={userId}
                onDontShowAgain={handleDontShowAgain}
            />

            {/* Guide Trigger Float */}
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform w-12 h-12 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 active:translate-y-[2px] active:shadow-none"
                    onClick={() => setShowGuide(true)}
                    title="İpuçları"
                >
                    <HelpCircle className="w-6 h-6 stroke-[3]" />
                </Button>
            </div>

            <div className="bg-card border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col gap-0 relative">

                {/* Cover Image Header */}
                {coverUrl && (
                    <div className="relative w-full aspect-[21/9] sm:aspect-[4/1] bg-black border-b-[3px] border-black group">
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity border-[3px] border-black shadow-[2px_2px_0px_#000] rounded-[8px]"
                            onClick={() => setCoverUrl("")}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}

                {/* Top Meta Area (Yellow Tint) */}
                <div className="px-4 py-5 sm:p-8 border-b-[3px] border-black bg-yellow-400/10 space-y-5">

                    {/* Title */}
                    <Textarea
                        ref={titleRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="MAKALE BAŞLIĞI..."
                        className="w-full resize-none overflow-hidden bg-transparent border-none text-3xl sm:text-4xl md:text-5xl font-black font-[family-name:var(--font-outfit)] uppercase tracking-tighter placeholder:text-muted-foreground/30 focus-visible:ring-0 p-0 leading-[1.1] min-h-[50px] sm:min-h-[60px]"
                        maxLength={150}
                        rows={1}
                    />

                    {/* Meta Controls (Responsive Flex/Grid) */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                        {/* Category */}
                        <div className="flex-1 sm:flex-none sm:min-w-[200px] flex items-center bg-background border-[3px] border-black rounded-[8px] px-3 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-yellow-500/50 transition-all">
                            <Hash className="w-5 h-5 text-yellow-600 mr-2 shrink-0" />
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full h-full border-none shadow-none bg-transparent hover:bg-transparent px-0 font-bold uppercase focus:ring-0 text-xs sm:text-sm">
                                    <SelectValue placeholder="Kategori Seç" />
                                </SelectTrigger>
                                <SelectContent className="border-[3px] border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="font-bold cursor-pointer hover:bg-yellow-50">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Excerpt */}
                        <div className="flex-1 flex items-center bg-background border-[3px] border-black rounded-[8px] px-3 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-yellow-500/50 transition-all">
                            <AlignLeft className="w-5 h-5 text-yellow-600 mr-2 shrink-0" />
                            <Input
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Kısa Bir Özet (Opsiyonel)"
                                className="w-full h-full border-none shadow-none bg-transparent hover:bg-transparent px-0 font-bold focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {/* Cover Image Upload */}
                        <div className="flex-shrink-0">
                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverSelect} />
                            <Button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingImage}
                                variant="outline"
                                className="w-full sm:w-auto h-12 border-[3px] border-black text-black font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all rounded-[8px] text-xs sm:text-sm"
                            >
                                {uploadingImage ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                Kapak Seç
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="p-4 sm:p-6 md:p-8 bg-background flex flex-col min-h-[500px]">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        className="flex-1 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-yellow-300 selection:text-black placeholder:text-muted-foreground/30 focus:outline-none"
                        onUploadImage={uploadToSupabase}
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
                            onClick={() => handleSubmit("pending")}
                            disabled={isSubmitting || !title || !content}
                            className="flex-1 sm:flex-none h-12 rounded-[8px] bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest px-6 sm:px-8 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xs sm:text-sm"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2 stroke-[3]" />}
                            Yayına Gönder
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for icon
function ImageImageIcon(props: any) {
    return <ImageIcon {...props} />
}
