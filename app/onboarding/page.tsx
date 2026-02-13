"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/auth/actions";
import { DankLogo } from "@/components/brand/dank-logo";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { StarBackground } from "@/components/background/star-background";

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

    useEffect(() => {
        // Check if user already completed onboarding
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .maybeSingle();

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
            // Basic resize helper can be added here or imported
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

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
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("avatarUrl", formData.avatarUrl);
            formDataToSend.append("bio", formData.bio);

            const result = await completeOnboarding(formDataToSend);

            if (result?.error) {
                toast.error(result.error);
            } else {
                router.push('/profil');
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-transparent font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Universal Star Background */}
            <StarBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: -40 }}
                transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2
                }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Header Section */}
                <div className="text-center mb-6 relative">
                    <div className="inline-flex justify-center mb-1 transform hover:scale-110 transition-transform duration-500">
                        <DankLogo />
                    </div>
                    <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2" />

                    <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-8">
                        Profilini Oluştur
                    </h1>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                        Topluluğa katılmadan önce kendini tanıt.
                    </p>
                </div>

                {/* The Card Structure */}
                <div className="relative group">
                    {/* Neo-Brutalist Shadow Layer */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500" />

                    {/* The Card Itself */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 ring-1 ring-white/20 p-6 sm:p-10 rounded-[2.5rem] relative overflow-hidden">

                        {/* Internal Liquid Shine */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Upload - Stylized */}
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div
                                    className="relative group cursor-pointer w-24 h-24 bg-white/5 border-2 border-white/10 ring-4 ring-black/20 rounded-[2rem] overflow-hidden hover:border-orange-500/50 transition-all duration-500"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.avatarUrl ? (
                                        <img
                                            src={formData.avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <Camera className="h-6 w-6 text-white/20 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    )}

                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                                        </div>
                                    )}

                                    {/* Camera Overlay */}
                                    <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-white/30 mt-3 uppercase tracking-[0.2em]">Karakter Resmi</span>
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
                                    <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">Kullanıcı Adı</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/40 font-black text-sm">@</span>
                                        <Input
                                            placeholder="username"
                                            value={formData.username}
                                            onChange={(e) => {
                                                let value = e.target.value.toLowerCase();
                                                value = value.replace(/[^a-z0-9_.-]/g, '');
                                                setFormData({ ...formData, username: value });
                                            }}
                                            className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 pl-10 rounded-2xl transition-all font-mono text-sm"
                                            required
                                            minLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">Tam İsim</Label>
                                    <Input
                                        placeholder="Ad Soyad"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 rounded-2xl transition-all font-mono text-sm pl-4"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">Biyografi</Label>
                                    <textarea
                                        placeholder="Kendinden kısaca bahset..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="flex min-h-[100px] w-full bg-white/5 border-2 border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none focus:bg-white/10 focus:border-orange-500/50 rounded-2xl transition-all resize-none font-mono"
                                        maxLength={160}
                                    />
                                    <div className="flex justify-end">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter">{formData.bio.length}/160</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_30px_rgba(234,88,12,0.2)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.3)] active:translate-y-1 transition-all flex items-center justify-center gap-3"
                                disabled={loading || uploading}
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Tamamla
                                        <ArrowRight className="h-4 w-4" />
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
