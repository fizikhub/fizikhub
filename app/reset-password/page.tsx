"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { updatePassword } from "./actions";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Stars
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; delay: number }[]>([]);

    useEffect(() => {
        const newStars = [];
        for (let i = 0; i < 100; i++) {
            newStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                delay: Math.random() * 5,
            });
        }
        setStars(newStars);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Şifreler eşleşmiyor!");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Şifre en az 6 karakter olmalı!");
            return;
        }

        setLoading(true);

        const result = await updatePassword(newPassword);

        if (result.success) {
            toast.success("Şifren güncellendi!");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setLoading(false);
    };

    const passwordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 6) return { strength: 1, label: "Zayıf", color: "bg-red-500" };
        if (password.length < 10) return { strength: 2, label: "Orta", color: "bg-yellow-500" };
        if (password.length < 14) return { strength: 3, label: "İyi", color: "bg-green-500" };
        return { strength: 4, label: "Güçlü", color: "bg-primary" };
    };

    const strength = passwordStrength(newPassword);

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
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Card */}
                <div className="bg-zinc-950 border-2 border-white/10 p-8 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -translate-x-px -translate-y-px" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary translate-x-px -translate-y-px" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -translate-x-px translate-y-px" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary translate-x-px translate-y-px" />

                    <div className="text-center mb-8">
                        <div className="w-14 h-14 mx-auto bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            Yeni Şifre Belirle
                        </h1>
                        <p className="text-white/40 text-sm mt-2">
                            Güçlü bir şifre seç.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                Yeni Şifre
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="h-12 bg-black border-2 border-white/20 text-white focus:border-primary pl-10 pr-12 rounded-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Strength Indicator */}
                            {newPassword.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 transition-all ${level <= strength.strength ? strength.color : "bg-white/10"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-bold uppercase ${strength.color.replace('bg-', 'text-')}`}>
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                Şifreyi Onayla
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-12 bg-black border-2 border-white/20 text-white focus:border-primary pl-10 pr-12 rounded-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-wide rounded-none border-2 border-primary hover:border-white transition-all group disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Şifreyi Güncelle
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
