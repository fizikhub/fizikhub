"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Camera, Upload, Fingerprint, Save } from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        avatarUrl: "",
        bio: ""
    });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Lütfen bir resim dosyası seçin");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'den küçük olmalı");
            return;
        }

        setUploading(true);
        try {
            const resizedFile = await resizeImage(file, 500, 500, 0.8);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, resizedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
            toast.success("Fotoğraf yüklendi!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Fotoğraf yüklenirken hata oluştu");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await completeOnboarding(formData);

            if (result?.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <div className="inline-block">
                        <Logo />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            PERSONEL KAYDI
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
                            <Fingerprint className="h-3 w-3" />
                            <span>KİMLİK OLUŞTURMA PROTOKOLÜ</span>
                        </div>
                    </div>
                </div>

                {/* Industrial Card */}
                <div className="bg-background border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 md:p-8 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black dark:border-white" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black dark:border-white" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black dark:border-white" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black dark:border-white" />

                    <form onSubmit={handleSubmit} className="space-y-8 mt-4">

                        {/* Avatar Upload - ID Card Style */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div
                                className="relative group cursor-pointer w-32 h-32 bg-muted/20 border-2 border-dashed border-black/30 dark:border-white/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {formData.avatarUrl ? (
                                    <img
                                        src={formData.avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-2">
                                        <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2 group-hover:text-primary" />
                                        <span className="text-[10px] font-mono uppercase text-muted-foreground group-hover:text-primary">FOTOĞRAF YÜKLE</span>
                                    </div>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider">KOD ADI (KULLANICI ADI)</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <Input
                                        id="username"
                                        placeholder="kullaniciadi"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="pl-9 h-12 bg-muted/20 border-2 border-black/10 dark:border-white/10 focus:border-primary rounded-none transition-all font-mono"
                                        required
                                        minLength={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider">TAM İSİM</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Adınız Soyadınız"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="h-12 bg-muted/20 border-2 border-black/10 dark:border-white/10 focus:border-primary rounded-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider">GÖREV TANIMI (BİYOGRAFİ)</Label>
                                <textarea
                                    id="bio"
                                    placeholder="Kendinden kısaca bahset..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="flex min-h-[100px] w-full border-2 border-black/10 dark:border-white/10 bg-muted/20 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-none transition-all"
                                    maxLength={160}
                                />
                                <p className="text-[10px] font-mono text-muted-foreground text-right">{formData.bio.length}/160</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-black uppercase tracking-wider rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={loading || uploading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    KAYDI TAMAMLA <Save className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

// Helper function to resize and compress image
async function resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Failed to create blob"));
                            return;
                        }
                        const resizedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    "image/jpeg",
                    quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}
