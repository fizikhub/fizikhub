"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Camera, Sparkles, Rocket, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        avatarUrl: "",
        bio: ""
    });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

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
            // Resize image before upload
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
            // If success, the server action will redirect automatically
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            ref={containerRef}
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 animate-gradient" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px]" />

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden hidden lg:block">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        x: mousePosition.x * 100,
                        y: mousePosition.y * 100,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                        default: { type: "spring", stiffness: 30, damping: 20 }
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        x: mousePosition.x * -80,
                        y: mousePosition.y * -80,
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                        default: { type: "spring", stiffness: 30, damping: 20 }
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="inline-block cursor-pointer"
                    >
                        <Logo />
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Profilini Oluştur
                    </motion.h1>

                    <motion.div
                        className="flex items-center justify-center text-muted-foreground text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
                        <span>Fizikhub topluluğuna katıl</span>
                    </motion.div>
                </div>

                {/* Glass card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-card/40 backdrop-blur-2xl border border-primary/20 shadow-2xl rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden"
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Avatar className="h-24 w-24 border-4 border-background/50 shadow-xl transition-transform group-hover:scale-105">
                                    <AvatarImage src={formData.avatarUrl} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-2xl">
                                        {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <User className="h-8 w-8 opacity-50" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {uploading ? (
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="h-6 w-6 text-white" />
                                    )}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Kullanıcı Adı</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <Input
                                        id="username"
                                        placeholder="kullaniciadi"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="pl-9 bg-background/50 border-primary/20 focus:border-primary/50 transition-all h-11"
                                        required
                                        minLength={3}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground pl-1">Benzersiz olmalıdır.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName">Ad Soyad</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Adınız Soyadınız"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all h-11"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biyografi (İsteğe Bağlı)</Label>
                                <textarea
                                    id="bio"
                                    placeholder="Kendinden kısaca bahset..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="flex min-h-[80px] w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    maxLength={160}
                                />
                                <p className="text-[10px] text-muted-foreground text-right">{formData.bio.length}/160</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg shadow-primary/25"
                            disabled={loading || uploading}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.6 }}
                            />
                            <span className="relative flex items-center justify-center gap-2">
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Tamamla ve Başla
                                {!loading && <Rocket className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </span>
                        </Button>
                    </form>
                </motion.div>
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

                // Calculate new dimensions
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
