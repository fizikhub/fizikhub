"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, Trash2, Send, Star, User, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface BookReviewEditorProps {
    userId: string;
}

export function BookReviewEditor({ userId }: BookReviewEditorProps) {
    // Book Meta
    const [bookTitle, setBookTitle] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [rating, setRating] = useState(5);
    const [coverUrl, setCoverUrl] = useState("");
    const [content, setContent] = useState("");

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize title
    const titleRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [bookTitle]);

    // Image Upload Logic
    const uploadToSupabase = async (file: File): Promise<string> => {
        if (file.size > 5 * 1024 * 1024) throw new Error("Dosya boyutu 5MB'dan küçük olmalı.");
        if (!file.type.startsWith("image/")) throw new Error("Sadece resim dosyası yükleyebilirsiniz.");

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/book-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

        if (uploadError) throw new Error(`Yükleme hatası: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from("article-images")
            .getPublicUrl(fileName);

        return publicUrl;
    };

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

    // Submit Logic
    const handleSubmit = async (targetStatus: "draft" | "published") => {
        if (!bookTitle.trim() || !content.trim() || !bookAuthor.trim()) {
            toast.error("Kitap adı, yazarı ve inceleme içeriği gereklidir.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare Metadata
            const metadata = {
                type: "book-review",
                bookTitle: bookTitle,
                bookAuthor: bookAuthor,
                rating: rating
            };

            // Prepend Metadata to Content
            const metaString = `<!--meta ${JSON.stringify(metadata)} -->`;
            const finalContent = `${metaString}\n\n${content}`;

            const formData = new FormData();
            formData.append("title", `${bookTitle} - Kitap İncelemesi`); // Set a descriptive title
            formData.append("content", finalContent);
            formData.append("excerpt", `Bu incelemede ${bookAuthor} tarafından yazılan ${bookTitle} kitabını değerlendirdim. Puanım: ${rating}/10`);
            formData.append("category", "Kitap İncelemesi");
            formData.append("cover_url", coverUrl);
            formData.append("status", targetStatus === "published" ? "pending" : "draft"); // Use pending for admin approval if needed, or published directly

            const result = await createArticle(formData);

            if (!result.success) throw new Error(result.error || "İnceleme oluşturulamadı");

            toast.success(targetStatus === "published" ? "İnceleme paylaşıldı!" : "Taslak kaydedildi!");
            window.location.href = "/profil";

        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 border-b-4 border-foreground pb-6">
                <div className="w-14 h-14 bg-red-600 text-white border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <BookOpen className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Kitap İncelemesi</h1>
                    <p className="text-muted-foreground font-bold text-sm uppercase tracking-wide">Analiz Et. Puanla. Paylaş.</p>
                </div>
            </div>

            {/* Book Details - Mobile Optimized */}
            <div className="grid gap-6">
                <div className="space-y-6 p-6 bg-card border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] rounded-none">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-border/50">
                        <User className="w-4 h-4 text-red-600" />
                        <h3 className="font-black text-sm uppercase tracking-widest text-foreground">
                            Kitap Detayları
                        </h3>
                    </div>

                    <div className="grid gap-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <Textarea
                                ref={titleRef}
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                placeholder="KİTABIN ADI..."
                                className="text-3xl sm:text-4xl font-black bg-transparent border-none px-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/30 min-h-[50px] resize-none leading-tight uppercase tracking-tight"
                                rows={1}
                            />
                        </div>

                        {/* Author & Rating - Stacks on Mobile */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Yazar</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
                                    <Input
                                        value={bookAuthor}
                                        onChange={(e) => setBookAuthor(e.target.value)}
                                        placeholder="YAZARIN ADI"
                                        className="pl-9 h-12 bg-muted/20 border-2 border-border focus:border-red-600 focus:ring-0 rounded-none transition-all font-bold text-lg uppercase placeholder:normal-case"
                                    />
                                </div>
                            </div>

                            {/* Star Rating System */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Puanın</label>
                                <div className="h-12 flex items-center gap-1 bg-muted/20 px-2 border-2 border-border hover:border-red-600/50 transition-colors">
                                    {[...Array(10)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setRating(i + 1)}
                                            onMouseEnter={() => setRating(i + 1)} // Simplified hover for desktop
                                            className={cn(
                                                "p-1 hover:scale-125 transition-transform focus:outline-none group",
                                            )}
                                            title={`${i + 1}/10`}
                                        >
                                            <Star
                                                className={cn(
                                                    "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 stroke-[2.5px]",
                                                    i < rating
                                                        ? "fill-red-600 text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.4)]"
                                                        : "text-muted-foreground/30 fill-transparent"
                                                )}
                                            />
                                        </button>
                                    ))}
                                    <div className="ml-3 w-10 text-center font-black text-xl text-red-600 border-l-2 border-border/50 pl-3 leading-none">{rating}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="min-h-[500px] border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-card overflow-hidden">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        onUploadImage={uploadToSupabase}
                    />
                </div>

                {/* Cover Image Upload Preview */}
                {coverUrl && (
                    <div className="relative group border-4 border-white dark:border-zinc-800 shadow-2xl max-w-sm mx-auto sm:mx-0 rotate-1 hover:rotate-0 transition-all duration-300">
                        <img src={coverUrl} alt="Cover" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setCoverUrl("")}
                                className="gap-2 rounded-none font-bold"
                            >
                                <Trash2 className="w-4 h-4" />
                                Görleli Kaldır
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 py-4 px-4 -mx-4 bg-background/90 backdrop-blur-xl border-t-2 border-foreground/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverSelect}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-2 font-bold uppercase tracking-wide", coverUrl && "bg-red-500/10")}
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingImage}
                    >
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        {coverUrl ? "Kapağı Değiştir" : "Kapak Ekle"}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        className="text-muted-foreground hover:text-foreground font-black uppercase border-2 hover:bg-muted"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>

                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={isSubmitting || !bookTitle || !content || !bookAuthor}
                        className="rounded-none bg-red-600 hover:bg-red-700 text-white font-black uppercase px-6 border-2 border-red-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Yayınla
                    </Button>
                </div>
            </div>
        </div>
    );
}
