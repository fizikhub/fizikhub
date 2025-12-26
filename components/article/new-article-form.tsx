"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, X, Trash2, Hash, AlignLeft, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle, updateArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NewArticleFormProps {
    userId: string;
    isFirstArticle: boolean;
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

export function NewArticleForm({ userId, isFirstArticle, initialData }: NewArticleFormProps) {
    // Form States
    const [title, setTitle] = useState(initialData?.title || "");
    const [category, setCategory] = useState(initialData?.category || "Genel");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

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

            // Update profile if first article (non-blocking)
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
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Main Editor Area */}
            <div className="relative min-h-[60vh] flex flex-col gap-6">

                {/* Title Input */}
                <Textarea
                    ref={titleRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Blog Başlığı..."
                    className="w-full resize-none overflow-hidden bg-transparent border-none text-4xl md:text-5xl font-black placeholder:text-muted-foreground/40 focus-visible:ring-0 p-0 leading-tight min-h-[60px]"
                    maxLength={150}
                    rows={1}
                />

                {/* Content Editor */}
                <div className="flex-1 text-lg leading-relaxed text-foreground/90">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        onUploadImage={uploadToSupabase}
                    />
                </div>

                {/* Cover Image Preview */}
                {coverUrl && (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-muted">
                        <img src={coverUrl} alt="Cover" className="w-full max-h-[400px] object-cover" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setCoverUrl("")}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Toolbar - Twitter Style */}
            <div className="sticky bottom-0 z-20 py-4 bg-background/80 backdrop-blur-xl border-t border-foreground/10 flex items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                    {/* Cover Image */}
                    <div className="relative">
                        <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverSelect}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-full w-10 h-10", coverUrl && "bg-emerald-500/10")}
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploadingImage}
                            title="Kapak Resmi Ekle"
                        >
                            {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                        </Button>
                    </div>

                    {/* Category Selector */}
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-auto h-10 border-none shadow-none bg-transparent hover:bg-emerald-500/10 text-emerald-500 gap-2 rounded-full px-3 font-bold">
                            <Hash className="w-4 h-4" />
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Excerpt Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-full w-10 h-10", excerpt && "bg-emerald-500/10")} title="Özet Ekle">
                                <AlignLeft className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="start">
                            <div className="space-y-2">
                                <h4 className="font-bold text-sm">Blog Özeti</h4>
                                <Textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Kısa bir özet yaz..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-bold transition-colors",
                        content.length > 0 ? "text-muted-foreground" : "text-transparent"
                    )}>
                        {content.length} karakter
                    </span>
                    <div className="h-4 w-px bg-foreground/10 mx-2" />

                    <Button
                        variant="ghost"
                        onClick={() => handleSubmit("draft")}
                        className="text-muted-foreground hover:text-foreground font-semibold"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>

                    <Button
                        onClick={() => handleSubmit("pending")}
                        disabled={isSubmitting || !title || !content}
                        className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Blogla
                    </Button>
                </div>
            </div>
        </div>
    );
}
