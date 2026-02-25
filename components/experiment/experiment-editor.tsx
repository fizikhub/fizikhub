"use client";

import { useState, useRef, useEffect } from "react";
import { ArticleEditor } from "@/components/article/article-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, Trash2, Send, FlaskConical, List, FileText, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-client";
import { createArticle } from "@/app/profil/article-actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ExperimentGuide } from "@/components/experiment/experiment-guide";
import { Star, GripHorizontal } from "lucide-react";
interface ExperimentEditorProps {
    userId: string;
}

export function ExperimentEditor({ userId }: ExperimentEditorProps) {
    // Experiment Meta
    const [title, setTitle] = useState("");
    const [purpose, setPurpose] = useState("");
    const [materials, setMaterials] = useState<string[]>([]);
    const [newMaterial, setNewMaterial] = useState("");
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [procedure, setProcedure] = useState(""); // Rich text content

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize title
    const titleRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    // Material Handler
    const addMaterial = () => {
        if (newMaterial.trim()) {
            setMaterials([...materials, newMaterial.trim()]);
            setNewMaterial("");
        }
    };

    const removeMaterial = (index: number) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    // Image Upload Logic
    const uploadToSupabase = async (file: File): Promise<string> => {
        if (file.size > 5 * 1024 * 1024) throw new Error("Dosya boyutu 5MB'dan küçük olmalı.");
        if (!file.type.startsWith("image/")) throw new Error("Sadece resim dosyası yükleyebilirsiniz.");

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/experiment-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

        if (uploadError) throw new Error(`Yükleme hatası: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from("article-images")
            .getPublicUrl(fileName);

        return publicUrl;
    };

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

    // Submit Logic
    const handleSubmit = async (targetStatus: "draft" | "published") => {
        if (!title.trim() || !purpose.trim() || !procedure.trim() || materials.length === 0) {
            toast.error("Başlık, amaç, malzemeler ve yapılış kısımları gereklidir.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare Metadata
            const metadata = {
                type: "experiment",
                purpose: purpose,
                materials: materials
            };

            // Prepend Metadata to Content
            const metaString = `<!--meta ${JSON.stringify(metadata)} -->`;
            const finalContent = `${metaString}\n\n${procedure}`;

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", finalContent);
            formData.append("excerpt", `Bu deneyde: ${purpose.substring(0, 100)}...`);
            formData.append("category", "Deney");
            if (coverUrl) formData.append("cover_url", coverUrl);
            formData.append("status", targetStatus === "published" ? "pending" : "draft");

            const result = await createArticle(formData);

            if (!result.success) throw new Error(result.error || "Deney paylaşılamadı");

            toast.success(targetStatus === "published" ? "Deney paylaşıldı!" : "Taslak kaydedildi!");
            window.location.href = "/profil";

        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
            setIsSubmitting(false);
        }
    };

    const [showGuide, setShowGuide] = useState(true);

    return (
        <div className="max-w-4xl mx-auto px-1.5 sm:px-0 space-y-8 animate-in fade-in duration-500 pb-24 relative">
            <ExperimentGuide open={showGuide} onOpenChange={setShowGuide} />

            {/* Guide Trigger Float */}
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform w-12 h-12 text-green-600 hover:text-green-700 hover:bg-green-50 active:translate-y-[2px] active:shadow-none"
                    onClick={() => setShowGuide(true)}
                    title="İpuçları"
                >
                    <Star className="w-6 h-6 stroke-[3] fill-green-600" />
                </Button>
            </div>

            <div className="bg-card border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col gap-0 relative">

                {/* Cover Image Header */}
                {coverUrl && (
                    <div className="relative w-full aspect-[21/9] sm:aspect-[4/1] bg-black border-b-[3px] border-black group">
                        <Image src={coverUrl} alt="Cover" fill className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity border-[3px] border-black shadow-[2px_2px_0px_#000] rounded-[8px]"
                            onClick={() => setCoverUrl(null)}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}

                {/* Top Meta Area (Green Tint) */}
                <div className="px-4 py-5 sm:p-8 border-b-[3px] border-black bg-green-600/10 space-y-5">

                    {/* Title */}
                    <Textarea
                        ref={titleRef}
                        placeholder="DENEYİN ADI..."
                        className="w-full resize-none overflow-hidden bg-transparent border-none text-3xl sm:text-4xl md:text-5xl font-black font-[family-name:var(--font-outfit)] uppercase tracking-tighter placeholder:text-muted-foreground/30 focus-visible:ring-0 p-0 leading-[1.1] min-h-[50px] sm:min-h-[60px]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        rows={1}
                    />

                    {/* Meta Controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                        {/* Purpose */}
                        <div className="flex-1 sm:min-w-[200px] flex items-center bg-background border-[3px] border-black rounded-[8px] px-3 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-green-600/50 transition-all">
                            <FileText className="w-5 h-5 text-green-600 mr-2 shrink-0" />
                            <Input
                                placeholder="Deneyin Amacı Nedir?"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="w-full h-full border-none shadow-none bg-transparent hover:bg-transparent px-0 font-bold focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {/* Add Material Content */}
                        <div className="flex-1 sm:max-w-[300px] flex items-center bg-background border-[3px] border-black rounded-[8px] px-1 h-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-green-600/50 transition-all">
                            <List className="w-5 h-5 text-green-600 ml-2 mr-1 shrink-0" />
                            <Input
                                placeholder="Malzeme Ekle..."
                                value={newMaterial}
                                onChange={(e) => setNewMaterial(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addMaterial()}
                                className="w-full h-full border-none shadow-none bg-transparent hover:bg-transparent px-2 font-bold focus-visible:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground/50"
                            />
                            <Button
                                onClick={addMaterial}
                                size="sm"
                                className="h-8 w-8 bg-green-600 hover:bg-green-500 text-white border-2 border-black rounded-[6px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all mr-1 p-0"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                            </Button>
                        </div>

                        {/* Cover Image Upload Button */}
                        <div className="flex-shrink-0">
                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverSelect} />
                            <Button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingImage}
                                variant="outline"
                                className="w-full sm:w-auto h-12 border-[3px] border-black text-black font-black uppercase tracking-widest bg-green-400 hover:bg-green-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all rounded-[8px] text-xs sm:text-sm text-white"
                            >
                                {uploadingImage ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                Kapak Seç
                            </Button>
                        </div>
                    </div>

                    {/* Materials List (Pills) */}
                    {materials.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {materials.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-background border-2 border-black rounded-full px-3 py-1 text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:border-green-600 transition-colors group">
                                    <span className="truncate max-w-[150px]">{item}</span>
                                    <button onClick={() => removeMaterial(idx)} className="text-muted-foreground hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-red-50 ml-1">
                                        <X className="w-3 h-3 stroke-[3]" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Editor Area */}
                <div className="p-4 sm:p-6 md:p-8 bg-background flex flex-col min-h-[500px]">
                    <ArticleEditor
                        content={procedure}
                        onChange={setProcedure}
                        className="flex-1 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-black prose-p:font-[family-name:var(--font-inter)] prose-p:text-lg prose-p:leading-relaxed selection:bg-green-300 selection:text-black placeholder:text-muted-foreground/30 focus:outline-none"
                        onUploadImage={uploadToSupabase}
                    />
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-6 border-t-[3px] border-black bg-[#f4f4f5] dark:bg-[#18181b] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className={cn("hidden sm:block text-xs font-black uppercase tracking-widest transition-colors",
                        procedure.length > 0 ? "text-muted-foreground" : "text-transparent"
                    )}>
                        {procedure.length} karakter
                    </span>

                    <div className="flex w-full sm:w-auto gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleSubmit("draft")}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none h-12 text-foreground font-black uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white rounded-[8px] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none text-xs sm:text-sm"
                        >
                            Taslak
                        </Button>
                        <Button
                            onClick={() => handleSubmit("published")}
                            disabled={isSubmitting || !title || !procedure}
                            className="flex-1 sm:flex-none h-12 rounded-[8px] bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest px-6 sm:px-8 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-xs sm:text-sm"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FlaskConical className="w-5 h-5 mr-2 stroke-[3]" />}
                            Deneyi Paylaş
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
