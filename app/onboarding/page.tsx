"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Camera, Upload, Fingerprint, Save, Scan } from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";

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
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Black Hole Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-transparent via-primary/5 to-transparent blur-3xl opacity-40"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-transparent via-orange-600/10 to-transparent blur-2xl opacity-30"
                />
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            opacity: Math.random()
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

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
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                            PERSONEL KAYDI
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-primary/80">
                            <Fingerprint className="h-3 w-3" />
                            <span>KİMLİK OLUŞTURMA PROTOKOLÜ</span>
                        </div>
                    </div>
                </div>

                {/* Industrial Glass Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-2xl shadow-2xl relative overflow-hidden group">
                    {/* Industrial Hazard Stripes */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary z-30" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary z-30" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary z-30" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary z-30" />

                    <div className="bg-black/60 p-6 md:p-8 rounded-xl relative z-10">
                        <form onSubmit={handleSubmit} className="space-y-8 mt-4">

                            {/* Avatar Upload - Biometric Scanner Style */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="relative">
                                    {/* Rotating Scanner Ring */}
                                    <motion.div
                                        className="absolute -inset-2 border border-dashed border-primary/50 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    />

                                    <div
                                        className="relative group cursor-pointer w-32 h-32 bg-black/50 border border-white/10 rounded-full overflow-hidden hover:border-primary transition-all flex items-center justify-center"
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
                                                <Scan className="h-8 w-8 mx-auto text-white/40 mb-2 group-hover:text-primary transition-colors" />
                                                <span className="text-[10px] font-mono uppercase text-white/40 group-hover:text-primary transition-colors">TARAMA BAŞLAT</span>
                                            </div>
                                        )}

                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>
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
                                    <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" />
                                        KOD ADI (KULLANICI ADI)
                                    </Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="username"
                                            placeholder="kullaniciadi"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="pl-9 h-12 bg-white/5 border-white/10 focus:border-primary rounded-none transition-all font-mono text-white placeholder:text-white/20 border-l-2 border-l-primary/50"
                                            required
                                            minLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" />
                                        TAM İSİM
                                    </Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Adınız Soyadınız"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="h-12 bg-white/5 border-white/10 focus:border-primary rounded-none transition-all text-white placeholder:text-white/20 border-l-2 border-l-primary/50"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" />
                                        GÖREV TANIMI (BİYOGRAFİ)
                                    </Label>
                                    <textarea
                                        id="bio"
                                        placeholder="Kendinden kısaca bahset..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="flex min-h-[100px] w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-none transition-all border-l-2 border-l-primary/50"
                                        maxLength={160}
                                    />
                                    <p className="text-[10px] font-mono text-white/40 text-right">{formData.bio.length}/160</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-black uppercase tracking-wider rounded-none border border-white/20 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary text-white hover:bg-primary/90"
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
