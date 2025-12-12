"use client";

import { useState, useRef } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, HelpCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

interface NewArticleFormProps {
    userId: string;
    isFirstArticle: boolean;
}

const categories = [
    "Kuantum Fiziği",
    "Astrofizik",
    "Termodinamik",
    "Mekanik",
    "Elektromanyetizma",
    "Genel Görelilik",
    "Parçacık Fiziği",
    "Genel"
];

export function NewArticleForm({ userId, isFirstArticle }: NewArticleFormProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Genel");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showGuide, setShowGuide] = useState(isFirstArticle);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (3MB max)
        if (file.size > 3 * 1024 * 1024) {
            toast.error("Fotoğraf 3MB'dan küçük olmalıdır");
            return;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            toast.error("Sadece resim dosyaları yüklenebilir");
            return;
        }

        try {
            const supabase = createClient();

            // Upload to Supabase Storage
            const fileName = `${userId}/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from("article-images")
                .upload(fileName, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("article-images")
                .getPublicUrl(fileName);

            // Insert image into editor at cursor
            setContent(prev => prev + `<img src="${publicUrl}" alt="Yüklenen fotoğraf" />`);

            toast.success("Fotoğraf yüklendi!");
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Fotoğraf yüklenirken hata oluştu");
        }
    };

    const handleSubmit = async (status: "draft" | "pending") => {
        if (!title.trim() || !content.trim()) {
            toast.error("Başlık ve içerik gereklidir");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();

            // Generate slug
            const slug = title
                .toLowerCase()
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ş/g, "s")
                .replace(/ı/g, "i")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim();

            const { error } = await supabase.from("articles").insert({
                title,
                slug,
                excerpt: excerpt || null,
                content,
                category,
                cover_url: coverUrl || null,
                author_id: userId,
                status,
            });

            if (error) throw error;

            // Mark user as having written an article
            if (isFirstArticle) {
                await supabase
                    .from("profiles")
                    .update({ has_written_article: true })
                    .eq("id", userId);
            }

            toast.success(
                status === "draft"
                    ? "Taslak kaydedildi!"
                    : "Makale incelemeye gönderildi!"
            );

            router.push("/profil");
            router.refresh();
        } catch (error) {
            console.error("Article creation error:", error);
            toast.error("Makale oluşturulurken hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const closeGuide = () => {
        setShowGuide(false);
        if (dontShowAgain && isFirstArticle) {
            // Mark guide as seen
            const supabase = createClient();
            supabase
                .from("profiles")
                .update({ has_seen_article_guide: true })
                .eq("id", userId)
                .then(() => { });
        }
    };

    return (
        <>
            {/* Beginner Guide Dialog */}
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                            <HelpCircle className="w-6 h-6" />
                            Makale Yazma Rehberi
                        </DialogTitle>
                        <DialogDescription>
                            İlk makalenizi mi yazıyorsunuz? Bu kısa rehber size yardımcı olacak!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">1. Başlık Yazın</h3>
                            <p className="text-sm text-muted-foreground">
                                Dikkat çekici ve açıklayıcı bir başlık seçin. Örnek: "Kuantum Dolanıklığı Nedir?"
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">2. Kategori Seçin</h3>
                            <p className="text-sm text-muted-foreground">
                                Makalenizin hangi fizik alanına ait olduğunu belirtin.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">3. İçerik Yazın</h3>
                            <p className="text-sm text-muted-foreground">
                                Editörün üst kısmındaki toolbar'ı kullanarak yazınızı formatlayabilirsiniz:
                            </p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                <li><strong>B</strong> - Kalın yazı</li>
                                <li><strong>I</strong> - İtalik yazı</li>
                                <li><strong>U</strong> - Altı çizili yazı</li>
                                <li><strong>H1/H2</strong> - Başlıklar</li>
                                <li><strong>📷</strong> - Fotoğraf ekle</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">4. Fotoğraf Ekleyin</h3>
                            <p className="text-sm text-muted-foreground">
                                📷 butonuna tıklayarak cihazınızdan fotoğraf seçebilirsiniz. Fotoğraf paragraflar arasına otomatik olarak eklenir.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">5. Gönder</h3>
                            <p className="text-sm text-muted-foreground">
                                "İncelemeye Gönder" butonuna tıkladığınızda makaleniz admin onayı için gönderilir. Onaylandıktan sonra yayınlanacaktır.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                            <input
                                type="checkbox"
                                id="dont-show-again"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="dont-show-again" className="text-sm">
                                Bir daha gösterme
                            </label>
                        </div>
                    </div>

                    <Button onClick={closeGuide} className="w-full">
                        Anladım, Başlayalım!
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Article Form */}
            <div className="space-y-6">
                {/* Help Button */}
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGuide(true)}
                        className="gap-2"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Yardım
                    </Button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-black uppercase tracking-wider">
                        Başlık <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Kuantum Dolanıklığı Nedir?"
                        className="text-xl font-bold border-2"
                        maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">{title.length}/200</p>
                </div>

                {/* Category & Cover URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-wider">
                            Kategori
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="border-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cover_url" className="text-sm font-black uppercase tracking-wider">
                            Kapak Resmi URL (opsiyonel)
                        </Label>
                        <Input
                            id="cover_url"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            type="url"
                            placeholder="https://..."
                            className="border-2"
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-black uppercase tracking-wider">
                        Özet (opsiyonel)
                    </Label>
                    <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Makalenizin kısa bir özeti..."
                        rows={3}
                        className="resize-none border-2"
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{excerpt.length}/500</p>
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                    <Label className="text-sm font-black uppercase tracking-wider">
                        İçerik <span className="text-destructive">*</span>
                    </Label>
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        onImageUpload={handleImageUpload}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                        className="border-2"
                    >
                        İptal
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleSubmit("draft")}
                        disabled={isLoading}
                        className="border-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Taslak Kaydet
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleSubmit("pending")}
                        disabled={isLoading}
                        className="bg-foreground text-background hover:bg-foreground/90"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        İncelemeye Gönder
                    </Button>
                </div>
            </div>
        </>
    );
}
