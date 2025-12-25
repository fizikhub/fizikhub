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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState(article?.image_url || "");
    const [content, setContent] = useState(article?.content || "");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp" as const,
            initialQuality: 0.9
        };

        setIsUploading(true);
        try {
            const compressedFile = await imageCompression(file, options);
            const result = await uploadArticleImage(compressedFile);
            if (result.success && result.url) {
                setImageUrl(result.url);
                toast.success("Kapak görseli eklendi");
            } else {
                toast.error(result.error || "Görsel yüklenemedi");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Görsel işlenirken hata oluştu");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.set("image_url", imageUrl);
        formData.set("content", content);

        try {
            const result = article ? await updateArticle(article.id, formData) : await createArticle(formData);

            if (result.success) {
                toast.success(article ? "Blog güncellendi! 🚀" : "Blog yayına alındı! 🎉");
                router.push("/yazar");
            } else {
                toast.error(result.error || "İşlem başarısız");
            }
        } catch {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-white text-black font-mono">
            {/* Top Bar - Brutalist Header */}
            <div className="sticky top-0 z-50 border-b-4 border-black bg-[#A8E6CF] px-6 py-4 flex items-center justify-between shadow-[0_4px_0_0_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black rounded-none"
                    >
                        ← GERİ
                    </Button>
                    <h1 className="text-xl font-black tracking-tight uppercase hidden md:block">
                        {article ? "BLOG DÜZENLE" : "YENİ BLOG YAZISI"}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white hover:bg-gray-800 border-2 border-black rounded-none shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {article ? "GÜNCELLE" : "YAYINLA"}
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">

                {/* Title Section */}
                <div className="space-y-4">
                    <Input
                        id="title"
                        name="title"
                        defaultValue={article?.title}
                        placeholder="BAŞLIK GİRİN..."
                        required
                        className="text-4xl md:text-6xl font-black border-none bg-transparent placeholder:text-gray-300 focus-visible:ring-0 p-0 h-auto tracking-tight uppercase"
                    />
                </div>

                {/* Meta Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Label className="font-bold text-lg uppercase bg-black text-white inline-block px-2 py-1 rotate-1">Kategori</Label>
                        <Select name="category" defaultValue={article?.category} required>
                            <SelectTrigger className="border-2 border-black rounded-none focus:ring-0 h-12 bg-gray-50 text-lg font-bold">
                                <SelectValue placeholder="BİR KATEGORİ SEÇ" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black rounded-none">
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="font-mono focus:bg-black focus:text-white rounded-none cursor-pointer">
                                        {cat.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <Label className="font-bold text-lg uppercase bg-black text-white inline-block px-2 py-1 -rotate-1">Kapak Görseli</Label>
                        <div className="flex gap-2">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <div className="flex-1 flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex-1 bg-white text-black border-2 border-black hover:bg-black hover:text-white rounded-none transition-all"
                                >
                                    {isUploading ? <Loader2 className="animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {imageUrl ? "DEĞİŞTİR" : "YÜKLE"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Preview */}
                    {imageUrl && (
                        <div className="col-span-1 md:col-span-2 relative aspect-video border-2 border-black overflow-hidden group">
                            <NextImage src={imageUrl} alt="Kapak" fill className="object-cover transition-transform group-hover:scale-105" />
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-black"></span>
                        <Label className="text-2xl font-black uppercase">İçerik</Label>
                    </div>
                    <div className="border-4 border-black p-4 min-h-[500px] shadow-[8px_8px_0_0_rgba(168,230,207,1)] bg-white">
                        <TiptapEditor content={content} onChange={setContent} />
                    </div>
                </div>
            </div>
        </form>
    );
}
