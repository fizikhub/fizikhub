"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import Link from "next/link";

export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [supabase] = useState(() => createClient());

    // Stars Background
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; delay: number }[]>([]);

    useEffect(() => {
        const newStars = [];
        for (let i = 0; i < 150; i++) {
            newStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.6 + 0.2,
                delay: Math.random() * 5,
            });
        }
        setStars(newStars);
    }, []);

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${location.origin}/auth/callback` },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message);
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
                    options: { emailRedirectTo: `${location.origin}/auth/callback` },
                });
                if (error) throw error;
                window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                window.location.href = "/";
            }
        } catch (error: any) {
            if (error.message.includes("already registered")) {
                toast.error("Bu e-posta zaten kayıtlı.");
            } else if (error.message.includes("Invalid login")) {
                toast.error("E-posta veya şifre hatalı.");
            } else {
                toast.error(error.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Stars Background */}
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

            {/* Subtle Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="inline-block mb-6"
                    >
                        <Logo />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
                    </h1>
                    <p className="text-white/40 text-sm mt-2 font-medium">
                        {isSignUp ? "Bilim topluluğuna katıl" : "Hesabına giriş yap"}
                    </p>
                </div>

                {/* Toggle - Moved higher */}
                <div className="text-center mb-4 text-sm">
                    <span className="text-white/40">
                        {isSignUp ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 text-primary hover:text-white font-bold transition-colors uppercase text-xs tracking-wide"
                    >
                        {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                    </button>
                </div>

                {/* Card */}
                <div className="bg-zinc-950 border-2 border-white/10 p-8 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -translate-x-px -translate-y-px" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary translate-x-px -translate-y-px" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -translate-x-px translate-y-px" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary translate-x-px translate-y-px" />

                    <form onSubmit={handleEmailAuth} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                E-posta
                            </Label>
                            <Input
                                type="email"
                                placeholder="ornek@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-black border-2 border-white/20 text-white placeholder:text-white/20 focus:border-primary focus:bg-black rounded-none transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                Şifre
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 bg-black border-2 border-white/20 text-white placeholder:text-white/20 focus:border-primary focus:bg-black pr-12 rounded-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-wide rounded-none border-2 border-primary hover:border-white transition-all group"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? "Hesap Oluştur" : "Devam Et"}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>

                        {/* Forgot Password */}
                        {!isSignUp && (
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-white/40 hover:text-primary transition-colors uppercase tracking-wide"
                                >
                                    Şifremi Unuttum
                                </Link>
                            </div>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-zinc-950 px-4 text-[10px] text-white/30 uppercase tracking-widest">
                                veya
                            </span>
                        </div>
                    </div>

                    {/* OAuth */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOAuthLogin('github')}
                            disabled={loading}
                            className="h-11 bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-white rounded-none transition-all font-bold"
                        >
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="h-11 bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-white rounded-none transition-all font-bold"
                        >
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
