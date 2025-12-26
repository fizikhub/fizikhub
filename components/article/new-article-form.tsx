"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, X, Trash2, Hash, AlignLeft, Send, Sparkles, HelpCircle, BookOpen, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle, updateArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"] });

interface NewArticleFormProps {
    userId: string;
    isFirstArticle: boolean;
    hasSeenGuide: boolean;
    initialData?: {
        id?: number;
        title: string;
        content: string;
        excerpt: string | null;
        category: string;
        coverUrl: string | null;
        status: string;
    };
}

const categories = [
    "Kuantum Fiziği", "Astrofizik", "Termodinamik", "Mekanik",
    "Elektromanyetizma", "Genel Görelilik", "Parçacık Fiziği", "Genel"
];

export function NewArticleForm({ userId, isFirstArticle, hasSeenGuide, initialData }: NewArticleFormProps) {
    // Form States
    const [title, setTitle] = useState(initialData?.title || "");
    const [category, setCategory] = useState(initialData?.category || "Genel");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Guide State
    // Show guide if user hasn't seen it yet
    const [showGuide, setShowGuide] = useState(!hasSeenGuide);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Auto-resize title
    const titleRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    const coverInputRef = useRef<HTMLInputElement>(null);

    // Generic Upload Helper
    const uploadToSupabase = async (file: File): Promise<string> => {
        if (file.size > 5 * 1024 * 1024) throw new Error("Dosya boyutu 5MB'dan küçük olmalı.");
        if (!file.type.startsWith("image/")) throw new Error("Sadece resim dosyası yükleyebilirsiniz.");

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

        if (uploadError) throw new Error(`Yükleme hatası: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from("article-images")
            .getPublicUrl(fileName);

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
            toast.error(error.message || "Görsel yüklenirken hata oluştu.");
        } finally {
            setUploadingImage(false);
            if (coverInputRef.current) coverInputRef.current.value = "";
        }
    };

    // Guide Handler
    const handleCloseGuide = async () => {
        setShowGuide(false);
        if (dontShowAgain) {
            const supabase = createClient();
            await supabase.from("profiles").update({ has_seen_article_guide: true }).eq("id", userId);
            toast.success("Anlaşıldı, rehberi bir daha göstermeyeceğiz! 🫡");
        }
    };

    // Submit Handler
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

            let result;
            if (initialData?.id) {
                formData.append("id", initialData.id.toString());
                result = await updateArticle(formData);
            } else {
                result = await createArticle(formData);
            }

            if (!result.success) throw new Error(result.error || "Blog oluşturulamadı");

            // Update profile if first article (non-blocking)
            if (isFirstArticle) {
                const supabase = createClient();
                await supabase.from("profiles").update({ has_written_article: true }).eq("id", userId);
            }

            toast.success(targetStatus === "pending" ? "Blog incelemeye gönderildi!" : "Taslak kaydedildi!");
            window.location.href = "/profil";

        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Guide Dialog */}
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-3xl border-2 border-foreground/10 p-0 sm:rounded-3xl shadow-2xl">
                    <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <Sparkles className="w-16 h-16 mb-4 opacity-90 animate-pulse text-yellow-300" />
                            <DialogTitle className={`${orbitron.className} text-3xl sm:text-5xl font-black tracking-tight mb-2 uppercase drop-shadow-md`}>
                                Blog Yazarlığı 101
                            </DialogTitle>
                            <DialogDescription className="text-emerald-50 text-base sm:text-lg font-medium max-w-xl mx-auto opacity-90">
                                "Sadece yazıp geçme, bir başyapıt yarat!" rehberine hoş geldin. İşte Fizikhub&apos;da etkileyici bir blog yazmanın sırları.
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-10">
                        {/* Editor Usage Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b border-border">
                                <Fingerprint className="w-6 h-6 text-emerald-500" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Editörü Efektif Kullanma</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                                    <h4 className="font-bold flex items-center gap-2 mb-2"><ImageImageIcon className="w-4 h-4 text-primary" /> Görsel Dünyası</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Kuru yazı okunmaz! Satır aralarına serpiştirmek için <b>Görsel</b> butonunu, kapak fotoğrafı için alttaki barı kullan.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                                    <h4 className="font-bold flex items-center gap-2 mb-2"><Hash className="w-4 h-4 text-primary" /> Kategorilendirme</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Yazını doğru rafa koy. Alttaki kategorilerden en uygununu seç ki okuyucular seni eliyle koymuş gibi bulsun.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                                    <h4 className="font-bold flex items-center gap-2 mb-2"><AlignLeft className="w-4 h-4 text-primary" /> Özetin Gücü</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Vitrin önemlidir. Kısa özet alanına (alttaki buton) çekici bir giriş cümlesi yazarak tıklanma oranını artırabilirsin.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                                    <h4 className="font-bold flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-primary" /> Taslak Modu</h4>
                                    <p className="text-sm text-muted-foreground">
                                        İlham perisi kaçtı mı? "Taslak" butonuna basıp kaydet, sonra profilinden devam et. Acele etme, mükemmeli hedefle.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Scientific Blog Tips */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b border-border">
                                <Sparkles className="w-6 h-6 text-purple-500" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Bilimsel Yazarlık Tüyoları</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                                        <span className="text-xl">🔍</span>
                                    </div>
                                    <h4 className="font-black text-blue-700 dark:text-blue-300 mb-1">Kaynak Göster</h4>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Okurlar kanıt sever. İddialarını makalelere veya güvenilir kaynaklara dayandır. Link vermekten çekinme.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                                        <span className="text-xl">🎓</span>
                                    </div>
                                    <h4 className="font-black text-purple-700 dark:text-purple-300 mb-1">Sadeleştir</h4>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Einstein der ki: "Basitçe anlatamıyorsan, yeterince anlamamışsındır." Terimleri açıkla, herkesi kucakla.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                                        <span className="text-xl">⚖️</span>
                                    </div>
                                    <h4 className="font-black text-orange-700 dark:text-orange-300 mb-1">Objektif Ol</h4>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Bilim duygularla değil, verilerle yapılır. Kişisel yorumunu kat ama gerçekleri bükme.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Footer Action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border/50">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors cursor-pointer group" onClick={() => setDontShowAgain(!dontShowAgain)}>
                                <div className={cn(
                                    "w-5 h-5 rounded-md border-2 border-muted-foreground group-hover:border-primary flex items-center justify-center transition-colors",
                                    dontShowAgain && "bg-primary border-primary text-primary-foreground"
                                )}>
                                    {dontShowAgain && <Sparkles className="w-3 h-3" />}
                                </div>
                                <label className="text-sm font-bold text-muted-foreground cursor-pointer select-none">
                                    Bu rehberi ezberledim, bir daha gösterme
                                </label>
                            </div>

                            <Button onClick={handleCloseGuide} className="w-full sm:w-auto font-black px-10 h-12 text-lg rounded-full bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Anlaşıldı, Başlıyoruz! 🚀
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Guide Trigger (Small) */}
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background/80 backdrop-blur border shadow-lg hover:scale-110 transition-transform w-8 h-8 opacity-50 hover:opacity-100"
                    onClick={() => setShowGuide(true)}
                    title="Rehberi Göster"
                >
                    <HelpCircle className="w-4 h-4" />
                </Button>
            </div>

            {/* Main Editor Area */}
            <div className="relative min-h-[60vh] flex flex-col gap-6">

                {/* Title Input */}
                <Textarea
                    ref={titleRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Blog Başlığı..."
                    className="w-full resize-none overflow-hidden bg-transparent border-none text-4xl md:text-5xl font-black placeholder:text-muted-foreground/40 focus-visible:ring-0 p-0 leading-tight min-h-[60px]"
                    maxLength={150}
                    rows={1}
                />

                {/* Content Editor */}
                <div className="flex-1 text-lg leading-relaxed text-foreground/90">
                    <ArticleEditor
                        content={content}
                        onChange={setContent}
                        onUploadImage={uploadToSupabase}
                    />
                </div>

                {/* Cover Image Preview */}
                {coverUrl && (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-muted">
                        <img src={coverUrl} alt="Cover" className="w-full max-h-[400px] object-cover" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setCoverUrl("")}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Toolbar - Twitter Style */}
            <div className="sticky bottom-0 z-20 py-4 bg-background/80 backdrop-blur-xl border-t border-foreground/10 flex items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                    {/* Cover Image */}
                    <div className="relative">
                        <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverSelect}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-full w-10 h-10", coverUrl && "bg-emerald-500/10")}
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploadingImage}
                            title="Kapak Resmi Ekle"
                        >
                            {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                        </Button>
                    </div>

                    {/* Category Selector */}
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-auto h-10 border-none shadow-none bg-transparent hover:bg-emerald-500/10 text-emerald-500 gap-2 rounded-full px-3 font-bold">
                            <Hash className="w-4 h-4" />
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Excerpt Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-full w-10 h-10", excerpt && "bg-emerald-500/10")} title="Özet Ekle">
                                <AlignLeft className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="start">
                            <div className="space-y-2">
                                <h4 className="font-bold text-sm">Blog Özeti</h4>
                                <Textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Kısa bir özet yaz..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-bold transition-colors",
                        content.length > 0 ? "text-muted-foreground" : "text-transparent"
                    )}>
                        {content.length} karakter
                    </span>
                    <div className="h-4 w-px bg-foreground/10 mx-2" />

                    <Button
                        variant="ghost"
                        onClick={() => handleSubmit("draft")}
                        className="text-muted-foreground hover:text-foreground font-semibold"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>

                    <Button
                        onClick={() => handleSubmit("pending")}
                        disabled={isSubmitting || !title || !content}
                        className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Blogla
                    </Button>
                </div>
            </div>
        </div>
    );
}
// Helper component for icon
function ImageImageIcon(props: any) {
    return <ImageIcon {...props} />
}
