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
import { Star } from "lucide-react";

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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <ExperimentGuide open={showGuide} onOpenChange={setShowGuide} />

            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-foreground pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-600 text-white border-2 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]">
                        <FlaskConical className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Deney Paylaş</h1>
                        <p className="text-muted-foreground font-bold text-sm uppercase tracking-wide">Hipotez. Gözlem. Sonuç.</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowGuide(true)}
                    className="rounded-full border-2 border-foreground hover:bg-muted"
                    title="İpuçları"
                >
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Left Column: Details */}
                <div className="md:col-span-1 space-y-6">
                    {/* Purpose Card */}
                    <div className="bg-card p-6 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-border/50">
                            <FileText className="w-5 h-5 text-green-600" />
                            <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Deneyin Amacı</h3>
                        </div>

                        <Textarea
                            placeholder="Bu deneyi neden yapıyoruz?"
                            className="min-h-[100px] resize-none bg-background border-2 border-border focus:border-green-600 focus:ring-0 rounded-xl transition-all placeholder:text-muted-foreground/40 font-medium"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                    </div>

                    {/* Materials Card */}
                    <div className="bg-card p-6 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-border/50">
                            <List className="w-5 h-5 text-green-600" />
                            <h3 className="font-black uppercase tracking-widest text-foreground text-sm">Malzemeler</h3>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <Input
                                placeholder="Ekle..."
                                value={newMaterial}
                                onChange={(e) => setNewMaterial(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addMaterial()}
                                className="h-10 bg-muted/20 border-2 border-border focus:border-green-600 rounded-lg font-bold placeholder:font-normal"
                            />
                            <Button onClick={addMaterial} size="icon" className="h-10 w-10 bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 rounded-lg">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>

                        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                            {materials.map((item, idx) => (
                                <li key={idx} className="flex items-center justify-between p-2 bg-muted/30 border border-border rounded-lg group hover:border-green-500/50 transition-colors">
                                    <span className="font-medium text-sm">{item}</span>
                                    <button onClick={() => removeMaterial(idx)} className="text-muted-foreground hover:text-red-600 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                            {materials.length === 0 && (
                                <li className="text-center text-muted-foreground text-xs py-4 italic">Henüz malzeme eklenmedi.</li>
                            )}
                        </ul>
                    </div>

                    {/* Cover Image Upload */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={coverInputRef}
                            onChange={handleCoverSelect}
                        />
                        {coverUrl ? (
                            <div className="relative aspect-[2/3] w-full group">
                                <Image
                                    src={coverUrl}
                                    alt="Experiment Cover"
                                    fill
                                    className="object-cover border-4 border-white dark:border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] rounded-xl"
                                />
                                <button
                                    onClick={() => setCoverUrl(null)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 shadow-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 rounded-lg font-bold"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="w-full aspect-[2/3] border-4 border-dashed border-border hover:border-green-600 hover:bg-green-600/5 transition-all flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-green-600 group rounded-xl"
                            >
                                <div className="p-4 rounded-full bg-muted group-hover:bg-green-600/10 transition-colors">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <span className="font-black uppercase tracking-wider text-xs">Kapak Resmi Seç</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Procedure Editor */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Deneyin Adı</Label>
                        <Textarea
                            ref={titleRef}
                            placeholder="DENEYİN ADI..."
                            className="min-h-[80px] font-bold text-4xl uppercase tracking-tight resize-none bg-background border-none focus:ring-0 rounded-none p-0 placeholder:text-muted-foreground/30 shadow-none leading-tight"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="bg-card min-h-[600px] border-2 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden relative">
                        <div className="border-b-2 border-border p-3 bg-muted/30 flex items-center justify-between">
                            <span className="font-black text-xs uppercase tracking-widest text-muted-foreground">Yapılış Aşamaları & Sonuç</span>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                            </div>
                        </div>
                        <ArticleEditor
                            content={procedure}
                            onChange={setProcedure}
                            className="flex-1 p-6 sm:p-8 outline-none prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-black prose-p:text-lg prose-p:leading-relaxed"
                            onUploadImage={uploadToSupabase}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="sticky bottom-0 z-40 py-4 px-4 -mx-4 bg-background/90 backdrop-blur-xl border-t-2 border-foreground/10 flex justify-between items-center mt-12">
                <Button
                    variant="ghost"
                    className="text-green-600 hover:text-green-700 hover:bg-green-600/10 gap-2 font-bold uppercase tracking-wide rounded-full"
                    onClick={() => coverInputRef.current?.click()}
                >
                    <ImageIcon className="w-4 h-4" />
                    Kapak Seç
                </Button>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        className="text-muted-foreground hover:text-foreground font-black uppercase border-2 hover:bg-muted rounded-full"
                        disabled={isSubmitting}
                    >
                        Taslak
                    </Button>
                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={isSubmitting || !title || !procedure}
                        className="rounded-full bg-green-600 hover:bg-green-700 text-white font-black uppercase px-6 border-2 border-green-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <FlaskConical className="w-4 h-4 mr-2" />
                        )}
                        Deneyi Paylaş
                    </Button>
                </div>
            </div>
        </div>
    );
}
