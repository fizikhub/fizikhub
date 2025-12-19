"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateArticle } from "@/app/admin/actions";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import imageCompression from "browser-image-compression";

// Dynamically import TipTap editor to avoid SSR issues
const TiptapEditor = dynamic(
    () => import("@/components/writer/tiptap-editor").then((mod) => mod.TiptapEditor),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 border rounded-lg flex items-center justify-center bg-muted/20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }
);

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    category?: string | null;
    image_url?: string | null;
    cover_url?: string | null;
    status?: string | null;
}

interface AdminArticleEditorProps {
    article: Article;
}

export function AdminArticleEditor({ article }: AdminArticleEditorProps) {
    const [loading, setLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: article.title || "",
        slug: article.slug || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        category: article.category || "",
        image_url: article.image_url || article.cover_url || "",
        status: article.status || "published"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === "title") {
            const slug = value
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-");
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleContentChange = (markdown: string) => {
        setFormData(prev => ({ ...prev, content: markdown }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        try {
            // Compress image
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            });

            const supabase = createClient();
            const ext = file.name.split(".").pop();
            const fileName = `cover-${article.id}-${Date.now()}.${ext}`;

            const { data, error } = await supabase.storage
                .from("article-images")
                .upload(fileName, compressed, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from("article-images")
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success("Kapak resmi yüklendi!");
        } catch (error: any) {
            toast.error("Resim yüklenemedi: " + error.message);
        } finally {
            setUploadingCover(false);
        }
    };

    const removeCover = () => {
        setFormData(prev => ({ ...prev, image_url: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await updateArticle(article.id, formData);

            if (!result.success) {
                toast.error(result.error || "Bir hata oluştu");
            } else {
                toast.success("Makale başarıyla güncellendi!");
                router.push("/admin/articles");
                router.refresh();
            }
        } catch (error: any) {
            toast.error("Hata: " + (error.message || "Bilinmeyen bir hata oluştu"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Temel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="text-lg font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL (Slug)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="Örn: Kuantum Fiziği"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select value={formData.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Durum seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="published">Yayında</SelectItem>
                                    <SelectItem value="draft">Taslak</SelectItem>
                                    <SelectItem value="pending">Beklemede</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Özet (Kısa Açıklama)</Label>
                        <Input
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Makalenin kısa açıklaması..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Cover Image Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Kapak Resmi</CardTitle>
                </CardHeader>
                <CardContent>
                    {formData.image_url ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <Image
                                src={formData.image_url}
                                alt="Kapak"
                                fill
                                className="object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={removeCover}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col items-center justify-center py-6">
                                {uploadingCover ? (
                                    <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Kapak resmi yüklemek için tıklayın</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                disabled={uploadingCover}
                            />
                        </label>
                    )}

                    <div className="mt-4 space-y-2">
                        <Label htmlFor="image_url">veya URL ile ekle</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            placeholder="https://..."
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Content Editor Card */}
            <Card>
                <CardHeader>
                    <CardTitle>İçerik</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="min-h-[500px]">
                        <TiptapEditor
                            content={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 sticky bottom-4 bg-background p-4 border rounded-lg shadow-lg">
                <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Kaydediliyor...
                        </>
                    ) : (
                        "Değişiklikleri Kaydet"
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    İptal
                </Button>
            </div>
        </form>
    );
}
