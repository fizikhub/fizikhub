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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            toast.success("Kapak resmi yüklendi hocam.");
        } catch (error: any) {
            toast.error(error.message || "Görsel yüklenirken hata oluştu. Aptal site.");
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
    const [activeTab, setActiveTab] = useState("content");

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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Mobile Tab Control - Sticky Top on Mobile */}
                <div className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b-[3px] border-black p-2 -mx-4 mb-4">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/30 border-[3px] border-black rounded-xl h-12 p-1">
                        <TabsTrigger value="content" className="rounded-lg font-black uppercase tracking-widest text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_#000] transition-all">
                            📝 İnceleme
                        </TabsTrigger>
                        <TabsTrigger value="details" className="rounded-lg font-black uppercase tracking-widest text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_#000] transition-all">
                            ⚙️ Kitap Künyesi
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left/Main Column: Review Editor */}
                    <TabsContent value="content" className="md:col-span-8 space-y-6 mt-0 border-0 p-0">
                        {/* Title Input */}
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">İncelenen Kitap</Label>
                            <Textarea
                                ref={titleRef}
                                placeholder="KİTABIN ADI..."
                                className="min-h-[60px] sm:min-h-[80px] font-black text-3xl sm:text-5xl uppercase tracking-tighter resize-none bg-background border-none focus:ring-0 rounded-none p-0 placeholder:text-muted-foreground/30 shadow-none leading-[0.9] text-foreground"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                            />
                        </div>

                        {/* Article Editor */}
                        <div className="bg-card min-h-[600px] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden relative group">
                            <div className="border-b-[3px] border-black p-3 bg-muted/40 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-red-500" />
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-yellow-500" />
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-green-500" />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground mr-2">İçerik Editörü</span>
                            </div>
                            <ArticleEditor
                                content={content}
                                onChange={setContent}
                                className="flex-1 p-6 sm:p-10 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-red-300 selection:text-black"
                                onUploadImage={uploadToSupabase}
                            />
                        </div>
                    </TabsContent>

                    {/* Right Column: Settings */}
                    <TabsContent value="details" className="md:col-span-4 space-y-6 mt-0 data-[state=inactive]:hidden md:data-[state=inactive]:block border-0 p-0 md:sticky md:top-24">
                        {/* Book Details */}
                        <div className="bg-card p-5 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] rounded-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black/10">
                                <Bookmark className="w-5 h-5 text-red-600" />
                                <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Kitap Detayları</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                        <User className="w-3 h-3 text-red-600" />
                                        Yazar
                                    </Label>
                                    <Input
                                        placeholder="Yazarın Adı..."
                                        className="h-12 bg-muted/20 border-2 border-black focus:border-red-600 focus:ring-0 rounded-lg transition-all font-bold text-lg uppercase placeholder:normal-case placeholder:text-muted-foreground/40"
                                        value={bookAuthor}
                                        onChange={(e) => setBookAuthor(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rating System */}
                        <div className="bg-card p-5 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block text-center">Puanın</Label>
                            <div className="h-16 flex items-center justify-center gap-0 sm:gap-1 bg-background px-2 overflow-hidden rounded-lg border-2 border-black hover:border-red-600 transition-colors shadow-inner">
                                {[...Array(10)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setRating(i + 1)}
                                        onMouseEnter={() => setRating(i + 1)}
                                        className={cn(
                                            "flex-1 flex justify-center py-2 hover:scale-125 transition-transform focus:outline-none group relative",
                                        )}
                                        title={`${i + 1}/10`}
                                        type="button"
                                    >
                                        <Star
                                            className={cn(
                                                "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 stroke-[3px]",
                                                i < rating
                                                    ? "fill-red-600 text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.4)] scale-110"
                                                    : "text-muted-foreground/30 fill-transparent scale-90"
                                            )}
                                        />
                                    </button>
                                ))}
                                <div className="ml-2 w-12 flex items-center justify-center font-black text-2xl text-red-600 border-l-[3px] border-black bg-red-50 h-full">{rating}</div>
                            </div>
                        </div>

                        {/* Cover Image Upload (Neo-brutalist) */}
                        <div className="bg-card p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={coverInputRef}
                                onChange={handleCoverSelect}
                            />
                            {coverUrl ? (
                                <div className="relative aspect-[2/3] w-full group overflow-hidden rounded-lg border-2 border-black cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                                    <Image
                                        src={coverUrl}
                                        alt="Book Cover"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-black uppercase tracking-widest text-sm bg-black px-4 py-2 rounded-full border border-white/20">Değiştir</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCoverUrl(null); }}
                                        className="absolute top-2 right-2 bg-red-600 border-2 border-black text-white p-1.5 hover:bg-red-500 transition-colors rounded-md shadow-[2px_2px_0px_0px_#000] z-10"
                                    >
                                        <X className="w-4 h-4 stroke-[3]" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => coverInputRef.current?.click()}
                                    className="w-full h-32 border-2 border-dashed border-black hover:bg-red-600 hover:text-white hover:border-solid hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground group rounded-lg bg-red-500/5"
                                >
                                    <div className="p-2 rounded-full border-2 border-transparent group-hover:border-white/20 transition-colors">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-xs">Kapak Resmi Seç</span>
                                </button>
                            )}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 p-4 sm:p-5 -mx-4 bg-[#f4f4f5] dark:bg-[#18181b] border-t-[3px] border-black flex flex-col-reverse sm:flex-row justify-between items-center mt-12 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)] gap-4">
                <Button
                    variant="ghost"
                    className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-600/10 gap-2 font-black uppercase tracking-widest rounded-lg border-[3px] border-transparent hover:border-red-600/20 transition-all h-12 sm:h-auto"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveTab('details');
                        setTimeout(() => coverInputRef.current?.click(), 300);
                    }}
                >
                    <ImageIcon className="w-5 h-5" />
                    Kapak Seç
                </Button>

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
                        disabled={isSubmitting || !bookTitle || !content || !bookAuthor}
                        className="flex-1 sm:flex-none h-12 sm:h-auto rounded-lg bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest px-8 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] hover:-translate-x-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <Upload className="w-5 h-5 mr-2 stroke-[3]" />
                        )}
                        Yayınla
                    </Button>
                </div>
            </div>
        </div>
    );
}
