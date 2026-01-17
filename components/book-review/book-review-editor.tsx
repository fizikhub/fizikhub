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
            <div className="flex items-center gap-4 border-b-2 border-border/50 pb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Kitap İncelemesi</h1>
                    <p className="text-muted-foreground font-medium text-sm">Okuduğun kitabı toplulukla paylaş.</p>
                </div>
            </div>

            {/* Book Details - Mobile Optimized */}
            <div className="grid gap-6">
                <div className="space-y-6 p-4 sm:p-6 bg-card border-2 border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        <User className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
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
                                placeholder="Kitabın Adı..."
                                className="text-3xl sm:text-4xl font-black bg-transparent border-none px-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/30 min-h-[50px] resize-none leading-tight"
                                rows={1}
                            />
                        </div>

                        {/* Author & Rating - Stacks on Mobile */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Yazar</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                    <Input
                                        value={bookAuthor}
                                        onChange={(e) => setBookAuthor(e.target.value)}
                                        placeholder="Yazarın Adı"
                                        className="pl-9 h-12 bg-muted/30 border-border focus:bg-background transition-all font-medium text-lg"
                                    />
                                </div>
                            </div>

                            {/* Star Rating System */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Puanın</label>
                                <div className="h-12 flex items-center gap-1 bg-muted/30 px-2 rounded-md border border-border hover:border-emerald-500/50 transition-colors">
                                    {[...Array(10)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setRating(i + 1)}
                                            onMouseEnter={() => setRating(i + 1)} // Simplified hover for desktop
                                            className={cn(
                                                "p-1 hover:scale-110 transition-transform focus:outline-none group",
                                            )}
                                            title={`${i + 1}/10`}
                                        >
                                            <Star
                                                className={cn(
                                                    "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
                                                    i < rating
                                                        ? "fill-emerald-500 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                                        : "text-muted-foreground/20"
                                                )}
                                            />
                                        </button>
                                    ))}
                                    <div className="ml-2 w-8 text-center font-black text-lg text-emerald-500">{rating}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="min-h-[400px] border-2 border-border/50 rounded-xl overflow-hidden bg-card/50">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        onUploadImage={uploadToSupabase}
                    />
                </div>

                {/* Cover Image Upload Preview */}
                {coverUrl && (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-muted max-w-sm mx-auto sm:mx-0 shadow-xl rotate-1 hover:rotate-0 transition-all duration-300">
                        <img src={coverUrl} alt="Cover" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setCoverUrl("")}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Kaldır
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-20 py-4 bg-background/80 backdrop-blur-xl border-t border-foreground/10 flex items-center justify-between gap-4">
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
                        className={cn("text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 gap-2", coverUrl && "bg-emerald-500/10")}
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingImage}
                    >
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        {coverUrl ? "Kapağı Değiştir" : "Kapak Ekle"}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => handleSubmit("draft")}
                        className="text-muted-foreground hover:text-foreground font-semibold"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>

                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={isSubmitting || !bookTitle || !content || !bookAuthor}
                        className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Yayınla
                    </Button>
                </div>
            </div>
        </div>
    );
}
