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
import { TiptapEditor } from "./tiptap-editor";
import { ImageCropDialog } from "@/components/shared/image-crop-dialog";

interface ArticleEditorProps {
    article?: {
        id: number;
        title: string;
        excerpt: string | null;
        content: string;
        category: string;
        image_url: string | null;
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
                localStorage.setItem(draftKey, JSON.stringify({ title, category, excerpt, imageUrl, content }));
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus('idle'), 2000);
            } catch { }
        }, 5000);

        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    }, [title, category, excerpt, imageUrl, content, isDraftLoaded]);

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
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.set("image_url", imageUrl);
        formData.set("content", content); // Use state content from Tiptap

        try {
            let result;
            if (article) {
                result = await updateArticle(article.id, formData);
            } else {
                result = await createArticle(formData);
            }

            if (result.success) {
                toast.success(article ? "Makale güncellendi" : "Makale oluşturuldu");
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Makale başlığı..."
                        required
                        className="text-lg font-medium"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select name="category" value={category} onValueChange={setCategory} required>
                            <SelectTrigger>
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
                        <Label>Kapak Görseli</Label>
                        <div className="flex gap-2">
                            <Input
                                name="image_url_input"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Görsel URL'si veya yükleyin..."
                                className="flex-1"
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
                                variant="outline"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                        <NextImage
                            src={imageUrl}
                            alt="Kapak önizleme"
                            fill
                            className="object-cover"
                            sizes="(max-width: 896px) 100vw, 896px"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Özet (İsteğe bağlı)</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Makalenin kısa bir özeti..."
                        className="h-20 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label>İçerik</Label>
                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {article ? "Güncelle ve Onaya Gönder" : "Oluştur ve Onaya Gönder"}
                </Button>
                {autoSaveStatus === 'saved' && (
                    <span className="text-xs text-green-500 self-center">✓ Otomatik kaydedildi</span>
                )}
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
