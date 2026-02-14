"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updatePassword } from "./actions";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const StarBackground = dynamic(() => import("@/components/background/star-background").then(mod => mod.StarBackground), { ssr: false });
import { DankLogo } from "@/components/brand/dank-logo";

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
        if (password.length === 0) return { strength: 0, label: "", color: "bg-white/10" };
        if (password.length < 6) return { strength: 1, label: "Zayıf", color: "bg-red-500" };
        if (password.length < 10) return { strength: 2, label: "Orta", color: "bg-yellow-500" };
        if (password.length < 14) return { strength: 3, label: "İyi", color: "bg-green-500" };
        return { strength: 4, label: "Güçlü", color: "bg-orange-500" };
    };

    const strength = passwordStrength(newPassword);

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
                className="w-full max-w-[420px] relative z-10"
            >
                {/* The Card Structure */}
                <div className="relative group">
                    {/* Neo-Brutalist Shadow Layer */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500" />

                    {/* The Card Itself */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 ring-1 ring-white/20 p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden">

                        {/* Internal Liquid Shine */}
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="text-center mb-6 relative">
                            <div className="inline-flex justify-center mb-1 transform hover:scale-110 transition-transform duration-500">
                                <DankLogo />
                            </div>
                            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2" />
                            <h1 className="text-lg font-black text-white uppercase tracking-[0.1em] mt-6">
                                Yeni Şifre
                            </h1>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">
                                Hesabın için güçlü bir şifre belirle.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">Yeni Şifre</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 pr-12 rounded-2xl transition-all font-mono text-sm pl-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Strength Indicator */}
                                {newPassword.length > 0 && (
                                    <div className="space-y-1 px-1">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${level <= strength.strength ? strength.color : "bg-white/5"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-[9px] font-black uppercase tracking-tighter ${strength.color.replace('bg-', 'text-')}`}>
                                                Güvenlik: {strength.label}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">Şifre Onay</Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 pr-12 rounded-2xl transition-all font-mono text-sm pl-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                                className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_30px_rgba(234,88,12,0.2)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.3)] active:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                ) : (
                                    <>
                                        Şifreyi Güncelle
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
