"use client";

import imageCompression from 'browser-image-compression';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Loader2,
    Upload,
    ImagePlus
} from "lucide-react";
import { toast } from "sonner";
import { createArticle, updateArticle, uploadArticleImage } from "@/app/yazar/actions";
import NextImage from "next/image";
import { TiptapEditor } from "./tiptap-editor";

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
    const [isInlineUploading, setIsInlineUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inlineImageInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [imageUrl, setImageUrl] = useState(article?.image_url || "");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compression options
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp"
        };

        setIsUploading(true);
        try {
            console.log(`[Compression] Original: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            const compressedFile = await imageCompression(file, options);
            console.log(`[Compression] Compressed: Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

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

    const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compression options
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp"
        };

        setIsInlineUploading(true);
        try {
            console.log(`[Compression] Original: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            const compressedFile = await imageCompression(file, options);
            console.log(`[Compression] Compressed: Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

            const result = await uploadArticleImage(compressedFile);
            if (result.success && result.url) {
                const textarea = textareaRef.current;
                if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const markdownImage = `\n![Görsel Açıklaması](${result.url})\n`;

                    const newText = text.substring(0, start) + markdownImage + text.substring(end);
                    textarea.value = newText;

                    // Re-focus and update cursor
                    textarea.focus();
                    const newCursorPos = start + markdownImage.length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }
                toast.success("Görsel sıkıştırılarak eklendi");
            } else {
                toast.error(result.error || "Yükleme başarısız");
            }
        } catch (error) {
            console.error("Compression/Upload error:", error);
            toast.error("Görsel işlenirken bir hata oluştu");
        } finally {
            setIsInlineUploading(false);
            if (inlineImageInputRef.current) {
                inlineImageInputRef.current.value = "";
            }
        }
    };

    const [content, setContent] = useState(article?.content || "");

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
                        defaultValue={article?.title}
                        placeholder="Makale başlığı..."
                        required
                        className="text-lg font-medium"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select name="category" defaultValue={article?.category} required>
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
                                onChange={handleImageUpload}
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
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Özet (İsteğe bağlı)</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        defaultValue={article?.excerpt || ""}
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
            </div>
        </form>
    );
}
