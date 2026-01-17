"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, X, Trash2, Hash, AlignLeft, Send, Sparkles, HelpCircle, BookOpen, Fingerprint, Lightbulb, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle, updateArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Orbitron } from "next/font/google"; // Keeping Orbitron for headers if needed, or switch to site font

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

            {/* Neo-Brutalist Guide Dialog */}
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background p-0 border-4 border-foreground shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] sm:rounded-none">

                    {/* Explicit Close Button */}
                    <button
                        onClick={() => setShowGuide(false)}
                        className="absolute right-4 top-4 z-50 p-2 bg-background border-2 border-foreground hover:bg-red-500 hover:text-white transition-colors"
                        title="Kapat"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Brutalist Header */}
                    <div className="bg-foreground text-background p-8 sm:p-10 border-b-4 border-background relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4 leading-none glitch-text">
                                Blog <br /> Yazarlığı <br /> 101
                            </h2>
                            <p className="text-lg sm:text-xl font-bold font-mono opacity-80 max-w-xl">
                                // SİSTEM MESAJI: Sadece yazıp geçme. Bir başyapıt yarat.
                            </p>
                        </div>
                        {/* Decorative Background Pattern */}
                        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]"></div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-12">
                        {/* Editor Usage Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 border-b-4 border-foreground pb-2">
                                <div className="bg-foreground text-background px-3 py-1 font-black text-xl">01</div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">ARAÇ KUTUSU</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-muted/20">
                                    <h4 className="font-black text-lg mb-2 uppercase flex items-center gap-2">
                                        <ImageImageIcon className="w-5 h-5" /> Görsel Ekle
                                    </h4>
                                    <p className="text-sm font-medium text-muted-foreground font-mono">
                                        Metnini görsellerle destekle. Uzun yazılar sıkıcıdır, araya resim serpiştir.
                                    </p>
                                </div>
                                <div className="p-5 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-muted/20">
                                    <h4 className="font-black text-lg mb-2 uppercase flex items-center gap-2">
                                        <Hash className="w-5 h-5" /> Etiketle
                                    </h4>
                                    <p className="text-sm font-medium text-muted-foreground font-mono">
                                        Doğru kategoriyi seç. Okuyucuların seni bulmasını kolaylaştır.
                                    </p>
                                </div>
                                <div className="p-5 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-muted/20">
                                    <h4 className="font-black text-lg mb-2 uppercase flex items-center gap-2">
                                        <AlignLeft className="w-5 h-5" /> Özetle
                                    </h4>
                                    <p className="text-sm font-medium text-muted-foreground font-mono">
                                        Çarpıcı bir giriş cümlesi yaz. Vitrinin güzel olsun.
                                    </p>
                                </div>
                                <div className="p-5 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-muted/20">
                                    <h4 className="font-black text-lg mb-2 uppercase flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" /> Kaydet
                                    </h4>
                                    <p className="text-sm font-medium text-muted-foreground font-mono">
                                        Taslak olarak kaydet, sonra devam et. Mükemmellik aceleye gelmez.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Scientific Blog Tips */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 border-b-4 border-foreground pb-2">
                                <div className="bg-emerald-500 text-black px-3 py-1 font-black text-xl">02</div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">İÇERİK STRATEJİSİ</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-blue-500 translate-x-2 translate-y-2 border-2 border-foreground"></div>
                                    <div className="relative p-6 bg-background border-2 border-foreground h-full flex flex-col">
                                        <LinkIcon className="w-8 h-8 mb-4 text-blue-500" />
                                        <h4 className="font-black text-xl mb-2">KANITLA</h4>
                                        <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
                                            Kaynak göster. Link ver. Bilim dedikoduyla değil, veriyle yapılır.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-purple-500 translate-x-2 translate-y-2 border-2 border-foreground"></div>
                                    <div className="relative p-6 bg-background border-2 border-foreground h-full flex flex-col">
                                        <Lightbulb className="w-8 h-8 mb-4 text-purple-500" />
                                        <h4 className="font-black text-xl mb-2">BASİTLEŞTİR</h4>
                                        <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
                                            "Bir şeyi basitçe anlatamıyorsan, anlamamışsındır." - Einstein
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-orange-500 translate-x-2 translate-y-2 border-2 border-foreground"></div>
                                    <div className="relative p-6 bg-background border-2 border-foreground h-full flex flex-col">
                                        <AlertTriangle className="w-8 h-8 mb-4 text-orange-500" />
                                        <h4 className="font-black text-xl mb-2">OBJEKTİF OL</h4>
                                        <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
                                            Duygularını değil, gerçekleri yaz. Yorumunu kat ama veriyi bükme.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer Action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-4 border-foreground/10">
                            <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-foreground/30 hover:border-foreground transition-colors cursor-pointer group w-full sm:w-auto justify-center" onClick={() => setDontShowAgain(!dontShowAgain)}>
                                <div className={cn(
                                    "w-6 h-6 border-2 border-foreground flex items-center justify-center transition-all",
                                    dontShowAgain ? "bg-foreground" : "bg-transparent"
                                )}>
                                    {dontShowAgain && <X className="w-4 h-4 text-background" />}
                                </div>
                                <label className="text-sm font-black uppercase text-foreground cursor-pointer select-none">
                                    Bu ekranı bir daha gösterme
                                </label>
                            </div>

                            <Button onClick={handleCloseGuide} className="w-full sm:w-auto font-black px-8 h-14 text-xl border-2 border-foreground bg-foreground text-background hover:bg-emerald-500 hover:text-black hover:border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                ANLAŞILDI, BAŞLAT
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
                    className="rounded-full bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all w-10 h-10"
                    onClick={() => setShowGuide(true)}
                    title="Rehberi Göster"
                >
                    <HelpCircle className="w-5 h-5" />
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
