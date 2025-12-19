"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateArticle } from "@/app/admin/actions";

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
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value }));
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
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
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
                        <Label htmlFor="image_url">Kapak Resmi URL</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            placeholder="https://..."
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Özet (Kısa Açıklama)</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            className="h-20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">İçerik (Markdown / HTML)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="h-96 font-mono text-sm"
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
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
            </CardContent>
        </Card>
    );
}
