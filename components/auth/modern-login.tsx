"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Rocket, Eye, EyeOff, Zap, AlertTriangle, Atom } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [supabase] = useState(() => createClient());

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Error logging in:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,

                });
                if (error) throw error;
                window.location.href = "/";
            }
        } catch (error: any) {
            console.error('Error:', error);
            if (error.message.includes("User already registered") || error.message.includes("already registered")) {
                toast.error("Bu e-posta zaten kayıtlı. Hafızanı mı tazelesek? 🧠");
            } else if (error.message.includes("Invalid login credentials")) {
                toast.error("Valla bu e-postayı bulamadık. Yüksek ihtimalle yanlış girdin. Ya da paralel evrende kaldı.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthMessage = (pass: string) => {
        if (!pass) return "";
        if (pass.length < 6) return "Şifren çok kısa hocam..";
        if (pass === "123456" || pass === "password") return "Ciddi misin? Bu şifreyi havada kırıyorlar! 🤦‍♂️";
        if (pass.length > 12) return "Kara delik kadar güçlü bir şifre! ⚫";
        if (pass.includes("einstein")) return "Einstein şifreni mi kıracak sanıyorsun? 😄";
        return "Uzun şifre afferin";
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Black Hole Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Accretion Disk */}
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

                {/* Stars/Particles */}
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

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Slogan Header */}
                <div className="text-center mb-8 space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-block cursor-pointer"
                    >
                        <Logo />
                    </motion.div>

                    <div className="space-y-2">
                        <p className="text-white/80 font-medium tracking-wide">
                            {isSignUp ? "OLAY UFKUNA KAYIT OL" : "TEKİLLİĞE GİRİŞ YAP"}
                        </p>
                    </div>
                </div>

                {/* Auth Card - Glassmorphism */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Top Border Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                    <form onSubmit={handleEmailAuth} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase text-white/60 tracking-wider">E-posta</Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="einstein@fizikhub.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 border-white/10 rounded-lg bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-primary/50 transition-all font-medium pl-4"
                                />
                                <Zap className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase text-white/60 tracking-wider">Şifre</Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 border-white/10 rounded-lg bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-primary/50 transition-all font-medium pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-xs font-bold text-primary/80 pt-1"
                                    >
                                        <AlertTriangle className="h-3 w-3" />
                                        {getPasswordStrengthMessage(password)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold uppercase rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? "KAYIT OL" : "GİRİŞ YAP"}
                                    <Rocket className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="bg-black/40 backdrop-blur-xl px-4 text-white/40">VEYA BUNLARLA GEL</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <Button
                            variant="outline"
                            className="w-full gap-2 h-12 border-white/10 rounded-lg bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all font-bold uppercase"
                            onClick={() => handleOAuthLogin('github')}
                            disabled={loading}
                        >
                            <Github className="h-5 w-5" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full gap-2 h-12 border-white/10 rounded-lg bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all font-bold uppercase"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="text-center text-sm font-medium mt-6 relative z-10">
                        <span className="text-white/40">
                            {isSignUp ? "Zaten içeride misin? " : "Hala dışarıda mısın? "}
                        </span>
                        <button
                            className="font-bold text-primary hover:text-primary/80 hover:underline decoration-2 underline-offset-4 uppercase ml-1 transition-colors"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
