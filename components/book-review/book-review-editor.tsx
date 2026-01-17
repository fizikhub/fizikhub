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

            {/* Book Details */}
            <div className="grid gap-6">
                <div className="space-y-4 p-6 bg-card border-2 border-border rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Kitap Bilgileri
                    </h3>

                    <div className="grid gap-4">
                        <div>
                            <Textarea
                                ref={titleRef}
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                placeholder="Kitabın Adı..."
                                className="text-2xl font-bold bg-transparent border-b-2 border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground min-h-[50px] resize-none"
                                rows={1}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    value={bookAuthor}
                                    onChange={(e) => setBookAuthor(e.target.value)}
                                    placeholder="Yazarın Adı"
                                    className="bg-muted/30 border-border font-medium"
                                />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 bg-muted/30 px-3 py-2 rounded-md border border-border">
                                <span className="text-sm font-bold text-muted-foreground mr-2">Puan:</span>
                                {[...Array(10)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setRating(i + 1)}
                                        className={cn(
                                            "w-2 h-6 rounded-full transition-all",
                                            i < rating ? "bg-emerald-500" : "bg-muted-foreground/20 hover:bg-emerald-500/50"
                                        )}
                                        title={`${i + 1}/10`}
                                    />
                                ))}
                                <span className="ml-2 font-black text-emerald-600 dark:text-emerald-400 min-w-[20px] text-center">{rating}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="min-h-[400px]">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        onUploadImage={uploadToSupabase}
                    />
                </div>

                {/* Cover Image Upload (Similar to NewArticleForm but simplified) */}
                {coverUrl && (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-muted">
                        <img src={coverUrl} alt="Cover" className="w-full max-h-[300px] object-cover" />
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
