"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, Trash2, Send, Star, User, BookOpen, Bookmark, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { BookReviewGuide } from "@/components/book-review/book-review-guide";

interface BookReviewEditorProps {
    userId: string;
}

export function BookReviewEditor({ userId }: BookReviewEditorProps) {
    // Book Meta
    const [bookTitle, setBookTitle] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [rating, setRating] = useState(5);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
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
            if (coverUrl) formData.append("cover_url", coverUrl);
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

    const [showGuide, setShowGuide] = useState(true);

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <BookReviewGuide open={showGuide} onOpenChange={setShowGuide} />

            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-foreground pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-600 text-white border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Kitap İncelemesi</h1>
                        <p className="text-muted-foreground font-bold text-sm uppercase tracking-wide">Analiz Et. Puanla. Paylaş.</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowGuide(true)}
                    className="rounded-full border-2 border-foreground hover:bg-muted"
                    title="İpuçları"
                >
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Left: Book Details Input */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card p-6 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-border/50">
                            <Bookmark className="w-5 h-5 text-red-600" />
                            <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Kitap Detayları</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Kitap Adı</Label>
                                <Textarea
                                    ref={titleRef}
                                    placeholder="KİTABIN ADI..."
                                    className="min-h-[60px] sm:min-h-[80px] font-bold text-2xl sm:text-xl uppercase tracking-tight resize-none bg-background border-2 border-border focus:border-red-600 focus:ring-0 rounded-xl transition-all placeholder:text-muted-foreground/30 shadow-sm"
                                    value={bookTitle}
                                    onChange={(e) => setBookTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <User className="w-3 h-3 text-red-600" />
                                    Yazar
                                </Label>
                                <Input
                                    placeholder="Yazarın Adı..."
                                    className="h-12 bg-muted/20 border-2 border-border focus:border-red-600 focus:ring-0 rounded-xl transition-all font-bold text-lg uppercase placeholder:normal-case placeholder:text-muted-foreground/40"
                                    value={bookAuthor}
                                    onChange={(e) => setBookAuthor(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rating System */}
                    <div className="bg-card p-6 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block text-center">Puanın</Label>
                        <div className="h-14 flex items-center justify-center gap-1 bg-muted/20 px-2 rounded-xl border-2 border-border hover:border-red-600/50 transition-colors">
                            {[...Array(10)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setRating(i + 1)}
                                    onMouseEnter={() => setRating(i + 1)}
                                    className={cn(
                                        "p-1.5 sm:p-1 hover:scale-125 transition-transform focus:outline-none group relative",
                                    )}
                                    title={`${i + 1}/10`}
                                    type="button"
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

                    {/* Cover Image Upload */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={coverInputRef}
                            onChange={handleCoverSelect}
                        />
                        {coverUrl ? (
                            <div className="relative aspect-[2/3] w-full group">
                                <Image
                                    src={coverUrl}
                                    alt="Book Cover"
                                    fill
                                    className="object-cover border-4 border-white dark:border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] rounded-xl"
                                    sizes="(max-width: 768px) 100vw, 300px"
                                />
                                <button
                                    onClick={() => setCoverUrl(null)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 shadow-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 rounded-lg font-bold"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="w-full aspect-[2/3] border-4 border-dashed border-border hover:border-red-600 hover:bg-red-600/5 transition-all flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-red-600 group rounded-xl"
                            >
                                <div className="p-4 rounded-full bg-muted group-hover:bg-red-600/10 transition-colors">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <span className="font-black uppercase tracking-wider text-xs">Kapak Resmi Seç</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Content Editor */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card min-h-[600px] border-2 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden relative">
                        {/* Toolbar placeholder or actual editor toolbar */}
                        <div className="border-b-2 border-border p-2 bg-muted/30 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                        </div>
                        <ArticleEditor
                            content={content}
                            onChange={setContent}
                            className="flex-1 p-6 sm:p-8 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-black prose-p:text-lg prose-p:leading-relaxed"
                            onUploadImage={uploadToSupabase}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 py-4 px-4 -mx-4 bg-background/90 backdrop-blur-xl border-t-2 border-foreground/10 flex justify-between items-center mt-12">
                <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-600/10 gap-2 font-bold uppercase tracking-wide rounded-full"
                    onClick={() => coverInputRef.current?.click()}
                >
                    <ImageIcon className="w-4 h-4" />
                    Kapak Seç
                </Button>

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
                        disabled={isSubmitting || !bookTitle || !content || !bookAuthor}
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white font-black uppercase px-6 border-2 border-red-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Upload className="w-4 h-4 mr-2 stroke-[3]" />
                        )}
                        Yayınla
                    </Button>
                </div>
            </div>
        </div>
    );
}
