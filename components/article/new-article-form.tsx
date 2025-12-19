"use client";

import { useState, useRef } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle } from "@/app/profil/article-actions";
import { Orbitron } from "next/font/google"; // Futuristic font
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react"; // Added Trash2, Upload, X

const orbitron = Orbitron({ subsets: ["latin"] });

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showGuide, setShowGuide] = useState(isFirstArticle);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const coverInputRef = useRef<HTMLInputElement>(null);

    // Generic Upload Helper
    const uploadToSupabase = async (file: File): Promise<string> => {
        console.log("🚀 Upload başladı:", { fileName: file.name, fileSize: file.size, fileType: file.type });

        if (file.size > 5 * 1024 * 1024) throw new Error("Dosya boyutu 5MB'dan küçük olmalı.");
        if (!file.type.startsWith("image/")) throw new Error("Sadece resim dosyası yükleyebilirsiniz.");

        const supabase = createClient();

        // Uzantıyı ekle (önemli!)
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

        console.log("📤 Supabase'e yükleniyor (path):", fileName);

        // Direct upload - no timeout, let it complete naturally
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            });

        if (uploadError) {
            console.error("❌ Upload hatası:", uploadError);
            throw new Error(`Yükleme hatası: ${uploadError.message || "Bilinmeyen hata"}`);
        }

        console.log("✅ Upload başarılı:", uploadData);

        const { data: { publicUrl } } = supabase.storage
            .from("article-images")
            .getPublicUrl(fileName);

        console.log("🔗 Public URL alındı:", publicUrl);
        return publicUrl;
    };

    // Cover Image Handler
    const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const url = await uploadToSupabase(file);
            setCoverUrl(url);
            toast.success("Kapak resmi yüklendi!");
        } catch (error: any) {
            console.error("Cover upload failed:", error);
            toast.error(error.message || "Görsel yüklenirken hata oluştu.");
        } finally {
            setUploadingImage(false);
            if (coverInputRef.current) coverInputRef.current.value = "";
        }
    };

    // 2. Submit Handler
    const handleSubmit = async (targetStatus: "draft" | "pending") => {
        if (!title.trim() || !content.trim()) {
            toast.error("Başlık ve içerik doldurulmalıdır.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("excerpt", excerpt);
            formData.append("category", category);
            formData.append("cover_url", coverUrl);
            formData.append("status", targetStatus);

            const result = await createArticle(formData);

            if (!result.success) {
                throw new Error(result.error || "Makale oluşturulamadı");
            }

            // Update profile if first article (non-blocking)
            if (isFirstArticle) {
                try {
                    const supabase = createClient();
                    await supabase.from("profiles").update({ has_written_article: true }).eq("id", userId);
                } catch (err) {
                    console.error("Profile update failed (non-critical):", err);
                }
            }

            toast.success(targetStatus === "pending" ? "İncelemeye gönderildi!" : "Taslak kaydedildi!");

            // Hard redirect to ensure fresh data
            window.location.href = "/profil";

        } catch (error: any) {
            console.error("Article creation error:", error);
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
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
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-2 border-primary/20 p-0">
                    <div className="bg-gradient-to-r from-primary to-purple-600 p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90 animate-bounce" />
                        <DialogTitle className="text-4xl font-black tracking-tight mb-2 uppercase">
                            Editör Kullanım Kılavuzu 101
                        </DialogTitle>
                        <DialogDescription className="text-blue-100 font-bold text-lg max-w-lg mx-auto">
                            "Bu buton ne işe yarıyor?" dememen için her şeyi tane tane anlattık.
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Feature 1: Bold/Italic */}
                            <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-2xl font-black text-primary">B</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">Kalın & İtalik</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <b>Kalın (B)</b> butonu yazıyı şişmanlatır, önemli yerleri vurgular. <i>İtalik (I)</i> butonu yazıyı yana yatırır, havalı kelimeler için birebirdir.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2: Headings */}
                            <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl font-black text-primary">H1</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">Başlıklar</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Yazının patronu sensin. <b>H1</b> en büyük ana başlıktır. <b>H2</b> ise onun alt başlığıdır. Kitap bölümü ve alt bölümü gibi düşün.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3: Lists */}
                            <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl font-black text-primary">📋</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">Listeler</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Market listesi yapar gibi alt alta yazmak için <b>Madde İşaretli</b> veya <b>Numaralı Liste</b> butonlarına bas. Okuması çok daha kolay olur.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4: Media */}
                            <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl font-black text-primary">📷</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">Görsel & Video</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Kuru kuru yazı gitmez. <b>Resim</b> butonuna basıp fotoğraf yükle veya <b>Youtube</b> butonuyla video yapıştır. Şenlensin ortalık.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 5: Math */}
                            <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl font-black text-primary">∑</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">Matematik</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Einstein değilsen çok kurcalama ama lazım olursa <b>Hesap Makinesi</b> ikonuna bas. Latex kodlarıyla havalı formüller yazabilirsin (örn: E=mc^2).
                                    </p>
                                </div>
                            </div>

                            {/* Feature 6: Link */}
                            <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl font-black text-primary">🔗</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">Bağlantı (Link)</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Başka sayfalara kapı açmak istersen yazıyı seç ve <b>Zincir</b> ikonuna tıkla. Kaynak göstermek için birebirdir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-500/10 rounded-xl border-l-4 border-yellow-500">
                            <h4 className="font-black text-yellow-600 dark:text-yellow-400 mb-1">💡 Küçük Bir İpucu</h4>
                            <p className="text-sm text-muted-foreground">
                                Yazarken <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Ctrl + Z</kbd> ile geri alabilir, <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Ctrl + B</kbd> ile kalın yazabilirsin. Kısa yolları kullan, hız kazan.
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="dont-show-again"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                    className="w-4 h-4 rounded border-primary"
                                />
                                <label htmlFor="dont-show-again" className="text-sm cursor-pointer select-none font-medium">
                                    Bu rehberi ezberledim, bir daha gösterme.
                                </label>
                            </div>

                            <Button onClick={closeGuide} className="font-black px-8">
                                Tamamdır, Anlaşıldı! 👍
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <h1 className={`${orbitron.className} text-3xl font-black tracking-tight text-primary`}>
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
                            <Label className="font-bold text-muted-foreground">Kapak Resmi</Label>
                            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 hover:bg-muted/30 transition-colors text-center">
                                {coverUrl ? (
                                    <div className="relative aspect-video w-full max-h-[200px] rounded overflow-hidden group">
                                        <img src={coverUrl} alt="Kapak" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setCoverUrl("")}
                                                className="gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Kaldır
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => coverInputRef.current?.click()}
                                        className="cursor-pointer py-8 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Upload className="w-8 h-8" />
                                        <span className="font-medium text-sm">Kapak resmi yüklemek için tıkla</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={coverInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleCoverSelect}
                                />
                            </div>
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
                            onUploadImage={uploadToSupabase}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button variant="ghost" onClick={() => window.history.back()} disabled={isSubmitting}>
                        İptal
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        disabled={isSubmitting || uploadingImage}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Taslak Olarak Kaydet
                    </Button>
                    <Button
                        onClick={() => handleSubmit("pending")}
                        disabled={isSubmitting || uploadingImage}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all px-8"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        İncelemeye Gönder
                    </Button>
                </div>
            </div>
        </>
    );
}
