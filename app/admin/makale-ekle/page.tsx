"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createArticle } from "./actions";

export default function AddArticlePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        image_url: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === "title") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-");
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            alert("İşlem sunucuya gönderiliyor...");

            const result = await createArticle(formData);

            if (!result.success) {
                alert("HATA: " + result.error);
                toast.error(result.error);
            } else {
                alert("BAŞARILI! Makale yayınlandı.");
                toast.success("Makale başarıyla yayınlandı!");
                router.push("/admin");
                router.refresh();
            }
        } catch (error: any) {
            console.error("Beklenmeyen hata:", error);
            alert("BEKLENMEYEN HATA: " + error.message);
            toast.error("Hata: " + (error.message || "Bilinmeyen bir hata oluştu"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Yeni Makale Ekle</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="Örn: Kuantum Fiziği"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
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
                                required
                                className="h-20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">İçerik (Markdown)</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                className="h-64 font-mono"
                                placeholder="# Başlık..."
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Yayınlanıyor..." : "Makaleyi Yayınla"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
