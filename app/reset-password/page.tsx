"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
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
            toast.success("Şifren güncellendi! Giriş yapabilirsin.");
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
            {/* Simple Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black" />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-black border border-white/10 p-1 rounded-2xl shadow-2xl relative overflow-hidden">
                    {/* Industrial Hazard Stripes */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary z-30" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary z-30" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary z-30" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary z-30" />

                    <div className="bg-black/60 p-6 md:p-8 rounded-xl relative z-10">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                                Yeni Şifre Belirle
                            </h1>
                            <p className="text-white/60 text-sm font-medium">
                                Güçlü bir şifre seç ve tekrar unutma! 🔐
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-1 bg-primary rounded-full" />
                                    Yeni Şifre
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="h-12 border-white/10 rounded-none bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-primary transition-all font-medium pl-10 pr-10 border-l-2 border-l-primary/50"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${level <= strength.strength ? strength.color : "bg-white/10"
                                                        }`}
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
                                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-1 bg-primary rounded-full" />
                                    Şifreyi Onayla
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-12 border-white/10 rounded-none bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-primary transition-all font-medium pl-10 pr-10 border-l-2 border-l-primary/50"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold uppercase rounded-none bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/20"
                                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Güncelleniyor...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Şifreyi Güncelle
                                        <Rocket className="h-5 w-5" />
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
