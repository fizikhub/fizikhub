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
import { ImageCropDialog } from "@/components/shared/image-crop-dialog";

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
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Crop Dialog States
    const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>("");

    const titleRef = useRef<HTMLTextAreaElement>(null);

    // Auto-save logic
    const DRAFT_KEY = `draft-book-review-${userId}`;

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                if (parsed.bookTitle) setBookTitle(parsed.bookTitle);
                if (parsed.bookAuthor) setBookAuthor(parsed.bookAuthor);
                if (parsed.rating) setRating(parsed.rating);
                if (parsed.coverUrl) setCoverUrl(parsed.coverUrl);
                if (parsed.content) setContent(parsed.content);

                toast.success("Önceki taslağınız geri yüklendi.");
                setHasUnsavedChanges(true); // Treat restored draft as unsaved changes
            } catch (e) {
                console.error("Draft parsing error", e);
            }
        }
        setIsDraftLoaded(true);
    }, [DRAFT_KEY]);

    // Save draft on changes
    useEffect(() => {
        if (!isDraftLoaded) return; // Don't save before initial load

        const hasContent = bookTitle.trim() || bookAuthor.trim() || content.trim() || coverUrl;

        if (hasContent && !isSubmitting) {
            setHasUnsavedChanges(true);
            const draft = { bookTitle, bookAuthor, rating, coverUrl, content, savedAt: new Date().toISOString() };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } else if (!hasContent) {
            setHasUnsavedChanges(false);
            localStorage.removeItem(DRAFT_KEY);
        }
    }, [bookTitle, bookAuthor, rating, coverUrl, content, isDraftLoaded, isSubmitting, DRAFT_KEY]);

    // Warn before leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && !isSubmitting) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, isSubmitting]);

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

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a local URL for the cropper
        const objectUrl = URL.createObjectURL(file);
        setTempImageSrc(objectUrl);
        setIsCropDialogOpen(true);

        // Reset input so the same file can be selected again
        if (coverInputRef.current) coverInputRef.current.value = "";
    };

    const handleCropComplete = async (croppedFile: File) => {
        try {
            setUploadingImage(true);
            const url = await uploadToSupabase(croppedFile);
            setCoverUrl(url);
            toast.success("Kapak resmi yüklendi hocam.");
        } catch (error: any) {
            toast.error(error.message || "Görsel yüklenirken hata oluştu. Aptal site.");
        } finally {
            setUploadingImage(false);
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
            // Clear draft after successful save
            localStorage.removeItem(DRAFT_KEY);
            setHasUnsavedChanges(false);
            window.location.href = "/profil";

        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
    };

    const [showGuide, setShowGuide] = useState(true);

    return (
        <div className="max-w-4xl mx-auto px-1.5 sm:px-0 space-y-8 animate-in fade-in duration-500 pb-24 relative">
            <BookReviewGuide open={showGuide} onOpenChange={setShowGuide} />

            {/* Guide Trigger Float */}
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform w-12 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 active:translate-y-[2px] active:shadow-none"
                    onClick={() => setShowGuide(true)}
                    title="İpuçları"
                >
                    <Star className="w-6 h-6 stroke-[3] fill-red-600" />
                </Button>
            </div>

            <div className="bg-card border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col gap-0 relative">

                {/* Cover Image Header */}
                {coverUrl && (
                    <div className="relative w-full aspect-[21/9] sm:aspect-[4/1] bg-black border-b-[3px] border-black group">
                        <Image src={coverUrl} alt="Cover" fill className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity border-[3px] border-black shadow-[2px_2px_0px_#000] rounded-[8px]"
                            onClick={() => setCoverUrl(null)}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}

                {/* Top Meta Area (Red Tint) */}
                <div className="px-4 py-5 sm:p-8 border-b-[3px] border-black bg-red-600/10 space-y-5">

                    {/* Title */}
                    <Textarea
                        ref={titleRef}
                        placeholder="KİTABIN ADI..."
                        className="w-full resize-none overflow-hidden bg-transparent border-none text-3xl sm:text-4xl md:text-5xl font-black font-[family-name:var(--font-outfit)] uppercase tracking-tighter placeholder:text-muted-foreground/30 focus-visible:ring-0 p-0 leading-[1.1] min-h-[50px] sm:min-h-[60px] [field-sizing:content]"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        maxLength={150}
                        rows={1}
                    />

                    {/* Meta Controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                        {/* Author */}
                        <div className="flex-1 sm:min-w-[200px] flex items-center bg-background border-[3px] border-black rounded-[8px] px-3 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-red-600/50 transition-all">
                            <User className="w-5 h-5 text-red-600 mr-2 shrink-0" />
                            <Input
                                placeholder="Yazarın Adı..."
                                value={bookAuthor}
                                onChange={(e) => setBookAuthor(e.target.value)}
                                className="w-full h-full border-none shadow-none bg-transparent hover:bg-transparent px-0 font-bold focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/50 uppercase"
                            />
                        </div>

                        {/* Rating System Compact */}
                        <div className="flex-1 sm:max-w-[250px] flex items-center bg-background border-[3px] border-black rounded-[8px] px-2 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex-1 flex items-center justify-between px-1">
                                {[...Array(10)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setRating(i + 1)}
                                        onMouseEnter={() => setRating(i + 1)}
                                        className="focus:outline-none group relative"
                                        title={`${i + 1}/10`}
                                        type="button"
                                    >
                                        <Star
                                            className={cn(
                                                "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 stroke-[2.5px] hover:scale-125",
                                                i < rating
                                                    ? "fill-red-600 text-red-600"
                                                    : "text-muted-foreground/30 fill-transparent"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="ml-2 pl-2 w-10 flex items-center justify-center font-black text-lg text-red-600 border-l-[3px] border-black h-full bg-red-50">{rating}</div>
                        </div>

                        {/* Cover Image Upload Button */}
                        <div className="flex-shrink-0">
                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverSelect} />
                            <Button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingImage}
                                variant="outline"
                                className="w-full sm:w-auto h-12 border-[3px] border-black text-black font-black uppercase tracking-widest bg-red-400 hover:bg-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all rounded-[8px] text-xs sm:text-sm text-white"
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
                        className="flex-1 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-red-300 selection:text-black placeholder:text-muted-foreground/30 focus:outline-none"
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
                            onClick={() => handleSubmit("published")}
                            disabled={isSubmitting || !bookTitle || !content || !bookAuthor}
                            className="flex-1 sm:flex-none h-12 rounded-[8px] bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest px-6 sm:px-8 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xs sm:text-sm"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2 stroke-[3]" />}
                            Yayınla
                        </Button>
                    </div>
                </div>
            </div>
            {tempImageSrc && (
                <ImageCropDialog
                    imageSrc={tempImageSrc}
                    open={isCropDialogOpen}
                    onOpenChange={setIsCropDialogOpen}
                    onCropComplete={handleCropComplete}
                    aspectRatio={16 / 9}
                    title="Kapak Görselini Kırp"
                />
            )}
        </div>
    );
}
