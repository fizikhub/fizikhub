"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Camera, ArrowRight } from "lucide-react";
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

    // Stars
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; delay: number }[]>([]);

    useEffect(() => {
        // Initialize stars
        const newStars = [];
        for (let i = 0; i < 120; i++) {
            newStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                delay: Math.random() * 5,
            });
        }
        setStars(newStars);

        // Check if user already completed onboarding
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                if (profile?.onboarding_completed) {
                    router.push('/profil');
                }
            }
        };
        checkStatus();
    }, [router, supabase]);

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
            {/* Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={{
                            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div whileHover={{ scale: 1.02 }} className="inline-block mb-6">
                        <Logo />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        Profilini Oluştur
                    </h1>
                    <p className="text-white/40 text-sm mt-2">
                        Topluluğa katılmadan önce kendini tanıt
                    </p>
                </div>

                {/* Card */}
                <div className="bg-zinc-950 border-2 border-white/10 p-8 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -translate-x-px -translate-y-px" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary translate-x-px -translate-y-px" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -translate-x-px translate-y-px" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary translate-x-px translate-y-px" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center justify-center mb-2">
                            <div
                                className="relative group cursor-pointer w-24 h-24 bg-black border-2 border-white/20 overflow-hidden hover:border-primary transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {formData.avatarUrl ? (
                                    <img
                                        src={formData.avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <Camera className="h-6 w-6 text-white/30 group-hover:text-primary transition-colors" />
                                    </div>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">Fotoğraf Ekle</span>
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
                                <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                    Kullanıcı Adı
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-bold">@</span>
                                    <Input
                                        placeholder="kullaniciadi"
                                        value={formData.username}
                                        onChange={(e) => {
                                            let value = e.target.value.toLowerCase();

                                            // Replace Turkish chars
                                            const trMap: { [key: string]: string } = {
                                                'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c'
                                            };
                                            value = value.replace(/[ğüşıöç]/g, char => trMap[char] || char);

                                            // Remove spaces
                                            value = value.replace(/\s+/g, '');

                                            // Remove invalid characters (only allow a-z, 0-9, ., _, -)
                                            value = value.replace(/[^a-z0-9_.-]/g, '');

                                            setFormData({ ...formData, username: value });
                                        }}
                                        className="h-12 bg-black border-2 border-white/20 text-white placeholder:text-white/20 focus:border-primary pl-8 rounded-none transition-all font-medium"
                                        required
                                        minLength={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                    Tam İsim
                                </Label>
                                <Input
                                    placeholder="Adınız Soyadınız"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="h-12 bg-black border-2 border-white/20 text-white placeholder:text-white/20 focus:border-primary rounded-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                    Biyografi <span className="text-white/20">(opsiyonel)</span>
                                </Label>
                                <textarea
                                    placeholder="Kendinden kısaca bahset..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="flex min-h-[100px] w-full bg-black border-2 border-white/20 px-3 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all resize-none"
                                    maxLength={160}
                                />
                                <p className="text-[10px] text-white/30 text-right">{formData.bio.length}/160</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-wide rounded-none border-2 border-primary hover:border-white transition-all group"
                            disabled={loading || uploading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Tamamla
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
