"use client";

import { useState, useRef, useTransition } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { createArticle } from "@/app/profil/article-actions";

interface NewArticleFormProps {
    userId: string;
    isFirstArticle: boolean;
}

const categories = [
    "Kuantum Fiziği", "Astrofizik", "Termodinamik", "Mekanik",
    "Elektromanyetizma", "Genel Görelilik", "Parçacık Fiziği", "Genel"
];

export function NewArticleForm({ userId, isFirstArticle }: NewArticleFormProps) {
    // Form States
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Genel");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverUrl, setCoverUrl] = useState("");

    // UI States
    const [isPending, startTransition] = useTransition();
    const [showGuide, setShowGuide] = useState(isFirstArticle);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 1. Image Upload Handler
    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Dosya boyutu 3MB'dan küçük olmalı.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Sadece resim dosyası yükleyebilirsiniz.");
            return;
        }

        try {
            setUploadingImage(true);
            const supabase = createClient();
            const fileName = `${userId}/${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const { error: uploadError } = await supabase.storage
                .from("article-images")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("article-images")
                .getPublicUrl(fileName);

            // Insert image markdown/html into content
            setContent(prev => prev + `<img src="${publicUrl}" alt="Makale görseli" />`);
            toast.success("Görsel eklendi!");
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Görsel yüklenirken hata oluştu.");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // 2. Submit Handler
    const handleSubmit = (targetStatus: "draft" | "pending") => {
        if (!title.trim() || !content.trim()) {
            toast.error("Başlık ve içerik doldurulmalıdır.");
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("excerpt", excerpt);
            formData.append("category", category);
            formData.append("cover_url", coverUrl);
            formData.append("status", targetStatus);

            const result = await createArticle(formData);

            if (result.success) {
                toast.success(targetStatus === "pending" ? "İncelemeye gönderildi!" : "Taslak kaydedildi!");

                // Update profile if first article
                if (isFirstArticle) {
                    const supabase = createClient();
                    await supabase.from("profiles").update({ has_written_article: true }).eq("id", userId);
                }

                router.push("/profil");
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        });
    };

    // 3. Guide Handler
    const closeGuide = () => {
        setShowGuide(false);
        if (dontShowAgain && isFirstArticle) {
            const supabase = createClient();
            supabase.from("profiles").update({ has_seen_article_guide: true }).eq("id", userId).then(() => { });
        }
    };

    return (
        <>
            {/* Guide Dialog */}
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-2 border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-primary" />
                            Makale Yazma Rehberi
                        </DialogTitle>
                        <DialogDescription>
                            Bilimsel makalenizi oluştururken dikkat etmeniz gerekenler:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <h3 className="font-bold text-lg mb-2">📸 Görsel Ekleme</h3>
                            <p className="text-sm text-muted-foreground">
                                Paragraflar arasına görsel eklemek için editörün üstündeki <b>Resim İkonuna</b> tıklayın.
                                Cihazınızdan fotoğraf seçtiğinizde otomatik olarak imlecin olduğu yere eklenecektir.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/30 rounded border">
                                <h4 className="font-bold">✨ Formatlama</h4>
                                <p className="text-sm text-muted-foreground">Kalın, İtalik, Başlık özelliklerini kullanarak yazınızı zenginleştirin.</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded border">
                                <h4 className="font-bold">🚀 Onay Süreci</h4>
                                <p className="text-sm text-muted-foreground">Makaleniz önce admin onayına düşer, onaylandıktan sonra keşfette yayınlanır.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="dont-show-again"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="w-4 h-4 rounded border-primary"
                            />
                            <label htmlFor="dont-show-again" className="text-sm cursor-pointer select-none">
                                Bir daha gösterme
                            </label>
                        </div>
                    </div>

                    <Button onClick={closeGuide} className="w-full font-bold text-lg py-6">
                        Anladım, Yazmaya Başla! 🚀
                    </Button>
                </DialogContent>
            </Dialog>

            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        {isFirstArticle ? "İlk Makaleni Yaz" : "Yeni Makale Oluştur"}
                    </h1>
                    <Button variant="outline" size="sm" onClick={() => setShowGuide(true)} className="gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Rehber
                    </Button>
                </div>

                {/* Main Form Form */}
                <div className="grid gap-6 p-6 border-2 border-dashed border-muted rounded-2xl bg-muted/10">

                    {/* Title */}
                    <div className="space-y-2">
                        <Label className="text-base font-bold uppercase text-muted-foreground">Makale Başlığı</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Kara Deliklerin Gizemi..."
                            className="text-xl font-bold p-6 bg-background/50 border-2 focus-visible:ring-primary/50"
                            maxLength={150}
                        />
                    </div>

                    {/* Category & Cover */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-muted-foreground">Kategori</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="border-2 h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-muted-foreground">Kapak Resmi URL (Opsiyonel)</Label>
                            <Input
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                                placeholder="https://..."
                                className="border-2 h-12"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label className="font-bold text-muted-foreground">Kısa Özet (Opsiyonel)</Label>
                        <Textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Okuyucular için kısa bir giriş yazısı..."
                            className="border-2 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Editor */}
                    <div className="space-y-2">
                        <Label className="font-bold text-muted-foreground flex justify-between">
                            <span>İçerik</span>
                            {uploadingImage && <span className="text-primary animate-pulse text-xs">Görsel yükleniyor...</span>}
                        </Label>
                        <ArticleEditor
                            content={content}
                            onChange={setContent}
                            onImageUpload={handleImageUpload}
                        />
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button variant="ghost" onClick={() => router.back()} disabled={isPending}>
                        İptal
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        disabled={isPending || uploadingImage}
                    >
                        {(isPending) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Taslak Olarak Kaydet
                    </Button>
                    <Button
                        onClick={() => handleSubmit("pending")}
                        disabled={isPending || uploadingImage}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all px-8"
                    >
                        {(isPending) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        İncelemeye Gönder
                    </Button>
                </div>
            </div>
        </>
    );
}
