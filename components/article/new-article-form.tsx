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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BlogEditor101 } from "@/components/article/blog-editor-101";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const [activeTab, setActiveTab] = useState("content");

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
    const handleDontShowAgain = async (uid: string) => {
        const supabase = createClient();
        await supabase.from("profiles").update({ has_seen_article_guide: true }).eq("id", uid);
        toast.success("Anlaşıldı! 🚀");
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

            {/* New Blog Editor 101 Modal */}
            <BlogEditor101
                open={showGuide}
                onOpenChange={setShowGuide}
                userId={userId}
                onDontShowAgain={handleDontShowAgain}
            />

            {/* Guide Trigger (Small) */}
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform w-12 h-12 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 active:translate-y-[2px] active:shadow-none"
                    onClick={() => setShowGuide(true)}
                    title="İpuçları"
                >
                    <HelpCircle className="w-6 h-6 stroke-[3]" />
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Mobile Tab Control - Sticky Top on Mobile */}
                <div className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b-[3px] border-black p-2 -mx-4 mb-4">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/30 border-[3px] border-black rounded-xl h-12 p-1">
                        <TabsTrigger value="content" className="rounded-lg font-black uppercase tracking-widest text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-[2px_2px_0px_#000] transition-all">
                            📝 Yazı
                        </TabsTrigger>
                        <TabsTrigger value="details" className="rounded-lg font-black uppercase tracking-widest text-xs data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-[2px_2px_0px_#000] transition-all">
                            ⚙️ Ayarlar
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left/Main Column: Title + Editor */}
                    <TabsContent value="content" className="md:col-span-8 space-y-6 mt-0 border-0 p-0">
                        {/* Title Input */}
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Makale Başlığı</Label>
                            <Textarea
                                ref={titleRef}
                                placeholder="ÇARPICI BİR BAŞLIK YAZ..."
                                className="min-h-[60px] sm:min-h-[80px] font-[family-name:var(--font-outfit)] font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter resize-none bg-background border-none focus:ring-0 rounded-none p-0 placeholder:text-muted-foreground/30 shadow-none leading-[0.9] text-foreground"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={150}
                            />
                            <div className="h-1.5 w-24 bg-yellow-500 border border-black shadow-[2px_2px_0px_#000]" />
                        </div>

                        {/* Article Editor */}
                        <div className="bg-card min-h-[600px] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden relative group">
                            <div className="border-b-[3px] border-black p-3 bg-muted/40 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-red-500" />
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-yellow-500" />
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-green-500" />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground mr-2">Metin Editörü</span>
                            </div>
                            <ArticleEditor
                                content={content}
                                onChange={setContent}
                                className="flex-1 p-6 sm:p-10 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-yellow-300 selection:text-black"
                                onUploadImage={uploadToSupabase}
                            />
                        </div>
                    </TabsContent>

                    {/* Right Column: Settings */}
                    <TabsContent value="details" className="md:col-span-4 space-y-6 mt-0 data-[state=inactive]:hidden md:data-[state=inactive]:block border-0 p-0 md:sticky md:top-24">
                        {/* Article Meta */}
                        <div className="bg-card p-5 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] rounded-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black/10">
                                <AlignLeft className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Yazı Detayları</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Category Selector */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-yellow-600" />
                                        Kategori
                                    </Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="w-full h-12 border-2 border-black bg-muted/20 hover:border-yellow-500 font-bold uppercase transition-colors rounded-lg focus:ring-0">
                                            <SelectValue placeholder="Kategori Seç" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat} className="font-bold cursor-pointer hover:bg-yellow-50">{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Kısa Özet</Label>
                                    <Textarea
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        placeholder="Okuyucuyu çekecek 1-2 cümlelik özet..."
                                        className="min-h-[100px] resize-none border-2 border-black bg-muted/20 hover:border-yellow-500 focus:border-yellow-500 rounded-lg transition-colors font-medium placeholder:text-muted-foreground/40"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover Image Upload (Neo-brutalist) */}
                        <div className="bg-card p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={coverInputRef}
                                onChange={handleCoverSelect}
                            />
                            {coverUrl ? (
                                <div className="relative aspect-video w-full group overflow-hidden rounded-lg border-2 border-black cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                                    <img
                                        src={coverUrl}
                                        alt="Article Cover"
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-black uppercase tracking-widest text-sm bg-black px-4 py-2 rounded-full border border-white/20">Değiştir</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCoverUrl(""); }}
                                        className="absolute top-2 right-2 bg-red-600 border-2 border-black text-white p-1.5 hover:bg-red-500 transition-colors rounded-md shadow-[2px_2px_0px_0px_#000] z-10"
                                    >
                                        <X className="w-4 h-4 stroke-[3]" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => coverInputRef.current?.click()}
                                    className="w-full aspect-video border-2 border-dashed border-black hover:bg-yellow-500 hover:text-black hover:border-solid hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground group rounded-lg bg-yellow-500/5"
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                                    ) : (
                                        <>
                                            <div className="p-2 rounded-full border-2 border-transparent group-hover:border-black/20 transition-colors">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <span className="font-black uppercase tracking-widest text-xs">Kapak Resmi Seç</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 p-4 sm:p-5 -mx-4 bg-[#f4f4f5] dark:bg-[#18181b] border-t-[3px] border-black flex flex-col-reverse sm:flex-row justify-between items-center mt-12 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)] gap-4">
                <Button
                    variant="ghost"
                    className="w-full sm:w-auto text-yellow-600 hover:text-yellow-700 hover:bg-yellow-600/10 gap-2 font-black uppercase tracking-widest rounded-lg border-[3px] border-transparent hover:border-yellow-600/20 transition-all h-12 sm:h-auto"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveTab('details');
                        setTimeout(() => coverInputRef.current?.click(), 300);
                    }}
                >
                    <ImageIcon className="w-5 h-5" />
                    Kapak Seç
                </Button>

                <div className="flex w-full sm:w-auto gap-3 items-center">
                    <span className={cn("hidden lg:block text-xs font-black uppercase tracking-widest transition-colors mr-4",
                        content.length > 0 ? "text-muted-foreground" : "text-transparent"
                    )}>
                        {content.length} karakter
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        className="flex-1 sm:flex-none h-12 sm:h-auto text-foreground font-black uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white rounded-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>
                    <Button
                        onClick={() => handleSubmit("pending")}
                        disabled={isSubmitting || !title || !content}
                        className="flex-1 sm:flex-none h-12 sm:h-auto rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest px-8 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] hover:-translate-x-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <Send className="w-5 h-5 mr-2 stroke-[3]" />
                        )}
                        Yayına Gönder
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
