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
            toast.success("Anlaşıldı! 🚀");
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

            {/* Mature Pastel Neo-Brutalist Guide Dialog */}
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background p-0 border-2 border-foreground/80 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] sm:rounded-xl">

                    {/* Explicit Close Button */}
                    <button
                        onClick={() => setShowGuide(false)}
                        className="absolute right-4 top-4 z-50 p-2 bg-red-100 dark:bg-red-900/30 border border-foreground/50 hover:bg-red-500 hover:text-white transition-all rounded-md"
                        title="Kapat"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 border-b-2 border-foreground/20">
                        <DialogTitle className="text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                            <span className="text-4xl">⚓</span>
                            Blog Yazarlığı 101
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium text-lg mt-2 max-w-xl">
                            Sadece yazıp geçme, bir başyapıt yarat! İşte Fizikhub&apos;da etkileyici bir blog yazmanın incelikleri.
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Essential Tools Grid - Sincere Content Restored */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                                Editörün Gücü
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="group p-5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-border rounded-lg hover:border-foreground transition-all">
                                    <h4 className="font-bold flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
                                        <ImageImageIcon className="w-5 h-5" /> Görsel Dünyası
                                    </h4>
                                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                        Kuru yazı okunmaz! Satır aralarına serpiştirmek için <b>Görsel</b> butonunu, kapak fotoğrafı için alttaki barı kullan.
                                    </p>
                                </div>

                                <div className="group p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-border rounded-lg hover:border-foreground transition-all">
                                    <h4 className="font-bold flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                                        <Hash className="w-5 h-5" /> Kategorilendirme
                                    </h4>
                                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                        Yazını doğru rafa koy. Alttaki kategorilerden en uygununu seç ki okuyucular seni eliyle koymuş gibi bulsun.
                                    </p>
                                </div>

                                <div className="group p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-border rounded-lg hover:border-foreground transition-all">
                                    <h4 className="font-bold flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-300">
                                        <AlignLeft className="w-5 h-5" /> Özetin Gücü
                                    </h4>
                                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                        Vitrin önemlidir. Kısa özet alanına (alttaki buton) çekici bir giriş cümlesi yazarak tıklanma oranını artırabilirsin.
                                    </p>
                                </div>

                                <div className="group p-5 bg-slate-100/50 dark:bg-slate-800/30 border border-border rounded-lg hover:border-foreground transition-all">
                                    <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300">
                                        <BookOpen className="w-5 h-5" /> Taslak Modu
                                    </h4>
                                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                        İlham perisi kaçtı mı? "Taslak" butonuna basıp kaydet, sonra profilinden devam et. Acele etme, mükemmeli hedefle.
                                    </p>
                                </div>

                            </div>
                        </section>

                        {/* Tips Section */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                                Bilimsel Yaklaşım
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 p-4 border border-l-4 border-l-blue-500 bg-background shadow-sm rounded-r-lg">
                                    <h4 className="font-bold text-sm mb-1">Kaynak Göster</h4>
                                    <p className="text-xs text-muted-foreground">İddialarını kanıtla.</p>
                                </div>
                                <div className="flex-1 p-4 border border-l-4 border-l-purple-500 bg-background shadow-sm rounded-r-lg">
                                    <h4 className="font-bold text-sm mb-1">Sadeleştir</h4>
                                    <p className="text-xs text-muted-foreground">Herkesin anlayacağı dilden yaz.</p>
                                </div>
                                <div className="flex-1 p-4 border border-l-4 border-l-orange-500 bg-background shadow-sm rounded-r-lg">
                                    <h4 className="font-bold text-sm mb-1">Objektif Ol</h4>
                                    <p className="text-xs text-muted-foreground">Verilere sadık kal.</p>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                            <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => setDontShowAgain(!dontShowAgain)}>
                                <div className={cn(
                                    "w-5 h-5 rounded border-2 border-muted-foreground flex items-center justify-center transition-all",
                                    dontShowAgain && "bg-foreground border-foreground"
                                )}>
                                    {dontShowAgain && <Sparkles className="w-3 h-3 text-background" />}
                                </div>
                                <label className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer">
                                    Bu rehberi bir daha gösterme
                                </label>
                            </div>

                            <Button onClick={handleCloseGuide} className="w-full sm:w-auto font-bold px-8 h-12 text-lg rounded-lg border-2 border-foreground/10 bg-foreground text-background hover:bg-emerald-600 hover:text-white shadow-lg transition-all hover:-translate-y-1">
                                Başlıyoruz 🚀
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
                    className="rounded-full bg-background border border-border shadow-lg hover:scale-110 transition-transform w-10 h-10 text-muted-foreground"
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
