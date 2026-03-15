"use client";

// browser-image-compression loaded dynamically on upload (see handleImageUpload)

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Loader2,
    Upload
} from "lucide-react";
import { toast } from "sonner";
import { createArticle, updateArticle, uploadArticleImage } from "@/app/yazar/actions";
import NextImage from "next/image";
import dynamic from "next/dynamic";
const TiptapEditor = dynamic(() => import("./tiptap-editor").then((mod) => mod.TiptapEditor), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center border-2 border-dashed border-black/20 rounded-lg text-zinc-500 font-bold animate-pulse">Editör yükleniyor...</div>
});
import { ImageCropDialog } from "@/components/shared/image-crop-dialog";
import { ReferenceInput, type Reference } from "./reference-input";

interface ArticleEditorProps {
    article?: {
        id: number;
        title: string;
        excerpt: string | null;
        content: string;
        category: string;
        image_url: string | null;
        references?: Reference[];
    };
}

const CATEGORIES = [
    "Kuantum Fiziği",
    "Astrofizik",
    "Modern Fizik",
    "Klasik Fizik",
    "Parçacık Fiziği",
    "Termodinamik",
    "Elektromanyetizma",
    "Bilim Tarihi",
    "Popüler Bilim"
];

export function ArticleEditor({ article }: ArticleEditorProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(article?.title || "");
    const [category, setCategory] = useState(article?.category || CATEGORIES[0]);

    const [excerpt, setExcerpt] = useState(article?.excerpt || "");
    const [imageUrl, setImageUrl] = useState(article?.image_url || "");
    const [references, setReferences] = useState<Reference[]>(article?.references || []);

    // Crop Dialog States
    const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>("");

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a local URL for the cropper
        const objectUrl = URL.createObjectURL(file);
        setTempImageSrc(objectUrl);
        setIsCropDialogOpen(true);

        // Reset input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCropComplete = async (croppedFile: File) => {

        // Compression options - high quality settings
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp" as const,
            initialQuality: 0.9 // Higher quality to preserve details
        };

        setIsUploading(true);
        try {
            // Dynamic import — only load heavy library when user uploads
            const { default: imageCompression } = await import('browser-image-compression');
            const compressedFile = await imageCompression(croppedFile, options);
            // console.log(`[Compression] Compressed: Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

            const result = await uploadArticleImage(compressedFile);
            if (result.success && result.url) {
                setImageUrl(result.url);
                toast.success("Resim sıkıştırılarak yüklendi");
            } else {
                toast.error(result.error || "Resim yüklenemedi");
            }
        } catch (error) {
            console.error("Compression/Upload error:", error);
            toast.error("Görsel işlenirken bir hata oluştu");
        } finally {
            setIsUploading(false);
        }
    };



    const [content, setContent] = useState(article?.content || "");

    // Auto-save state
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saved'>('idle');
    const draftKey = 'draft-writer-article';
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);

    // Restore draft on mount
    useEffect(() => {
        if (article) return; // Don't restore when editing
        try {
            const saved = localStorage.getItem(draftKey);
            if (saved) {
                const draft = JSON.parse(saved);
                if (draft.title) setTitle(draft.title);
                if (draft.category) setCategory(draft.category);
                if (draft.excerpt) setExcerpt(draft.excerpt);
                if (draft.imageUrl) setImageUrl(draft.imageUrl);
                if (draft.content) setContent(draft.content);
                if (draft.references) setReferences(draft.references);
                toast.info('Önceki taslağınız geri yüklendi.', { duration: 3000 });
            }
        } catch { }
        setIsDraftLoaded(true);
    }, []);

    // Auto-save to localStorage every 5 seconds
    useEffect(() => {
        if (!isDraftLoaded) return;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

        const hasContent = title.trim() || content.trim() || excerpt.trim() || imageUrl;
        if (!hasContent) return;

        autoSaveTimer.current = setTimeout(() => {
            try {
                localStorage.setItem(draftKey, JSON.stringify({ title, category, excerpt, imageUrl, content, references }));
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus('idle'), 2000);
            } catch { }
        }, 5000);

        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    }, [title, category, excerpt, imageUrl, content, references, isDraftLoaded]);

    // Warn before leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasContent = title.trim() || content.trim() || excerpt.trim() || imageUrl;
            if (hasContent && !isSubmitting) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [title, excerpt, content, imageUrl, isSubmitting]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!title.trim() || title.trim().length < 10) {
            toast.error("Başlık en az 10 karakter olmalıdır.");
            return;
        }
        if (!category) {
            toast.error("Lütfen bir kategori seçin.");
            return;
        }
        const plainText = content.replace(/<[^>]*>/g, '').trim();
        const wordCount = plainText ? plainText.split(/\s+/).filter(w => w.length > 0).length : 0;
        if (wordCount < 50) {
            toast.error(`Makale en az 50 kelime içermelidir. Şu an: ${wordCount} kelime.`);
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.set("image_url", imageUrl);
        formData.set("content", content); // Use state content from Tiptap
        formData.set("references", JSON.stringify(references));

        try {
            let result;
            if (article) {
                result = await updateArticle(article.id, formData);
            } else {
                result = await createArticle(formData);
            }

            if (result.success) {
                toast.success(article ? "Makale güncellendi" : "Makale oluşturuldu ve AI incelemesine gönderildi! 🎉");
                try { localStorage.removeItem(draftKey); } catch { }
                router.push("/yazar");
            } else {
                toast.error(result.error || "İşlem başarısız");
            }
        } catch {
            toast.error("Bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateMetrics = () => {
        const text = content.replace(/<[^>]*>/g, '').trim();
        const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
        const readingTime = Math.max(1, Math.ceil(words / 200));
        return { words, readingTime };
    };

    const metrics = calculateMetrics();

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-32 relative">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Başlık</Label>
                    <Input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="İlgi çekici bir başlık yazın..."
                        required
                        className="text-2xl md:text-3xl font-black h-14 tracking-tight border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-xl"
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Kategori</Label>
                        <Select name="category" value={category} onValueChange={setCategory} required>
                            <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl">
                                <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Kapak Görseli</Label>
                        <div className="flex gap-2">
                            <Input
                                name="image_url_input"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Görsel URL'si veya yükleyin..."
                                className="flex-1 h-12 bg-muted/30 border-none rounded-xl"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="h-12 w-12 rounded-xl"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Upload className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-muted bg-muted/50 group">
                        <NextImage
                            src={imageUrl}
                            alt="Kapak önizleme"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 896px) 100vw, 896px"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => setImageUrl("")}
                                className="font-bold tracking-wider uppercase"
                            >Kaldır</Button>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="excerpt" className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Özet (İsteğe bağlı)</Label>
                        <span className="text-xs text-muted-foreground/60 font-mono">{excerpt.length}/200</span>
                    </div>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
                        placeholder="Makalenin kısa ve vurucu bir özeti..."
                        className="h-24 resize-none bg-muted/30 border-none rounded-xl text-md"
                    />
                </div>

                <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-end pb-2">
                        <Label className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Makale İçeriği</Label>
                        <div className="flex gap-4 text-xs font-mono text-muted-foreground/70">
                            <span>{metrics.words} kelime</span>
                            <span>~{metrics.readingTime} dk okuma</span>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border bg-background shadow-sm">
                        <TiptapEditor
                            content={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                {/* References Section */}
                <div className="pt-8 mt-8 border-t border-dashed border-muted-foreground/20">
                    <ReferenceInput references={references} onChange={setReferences} />
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t shadow-2xl flex items-center justify-center md:pb-6">
                <div className="w-full max-w-4xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="font-bold tracking-wider"
                        >
                            İptal Et
                        </Button>
                        {autoSaveStatus === 'saved' && (
                           <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                               ✓ Taslak Kaydedildi
                           </span>
                        )}
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="h-12 px-8 rounded-full font-black tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> İŞLENİYOR...</>
                        ) : (
                            article ? "GÜNCELLE VE ONAYA GÖNDER" : "OLUŞTUR VE AI İNCELEMESİNE GÖNDER"
                        )}
                    </Button>
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
        </form>
    );
}
