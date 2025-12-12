"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
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

    // Enhanced Space Background
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            for (let i = 0; i < 250; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2.5 + 0.5,
                    opacity: Math.random() * 0.7 + 0.3,
                    duration: Math.random() * 4 + 2,
                });
            }
            setStars(newStars);
        };
        generateStars();

        const interval = setInterval(() => {
            setShootingStar({ x: Math.random() * 100, y: Math.random() * 30 });
            setTimeout(() => setShootingStar(null), 1500);
        }, 3500);
        return () => clearInterval(interval);
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
                toast.error("Bu e-posta zaten kayıtlı. Giriş yapmayı dene.");
            } else if (error.message.includes("Invalid login")) {
                toast.error("E-posta veya şifre hatalı.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (pass: string) => {
        if (!pass) return "";
        if (pass.length < 6) return "Şifren çok kısa";
        if (pass === "123456" || pass === "password") return "Çok basit!";
        if (pass.length > 12) return "Güçlü şifre ✓";
        return "Kabul edilebilir";
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
            {/* Enhanced Space Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

                {/* Stars */}
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                            boxShadow: star.size > 1.5 ? '0 0 4px rgba(255,255,255,0.8)' : 'none',
                        }}
                        animate={{
                            opacity: [star.opacity, star.opacity * 1.5, star.opacity],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Shooting Star */}
                {shootingStar && (
                    <motion.div
                        initial={{ top: `${shootingStar.y}%`, left: `${shootingStar.x}%`, opacity: 0 }}
                        animate={{
                            x: [0, 400],
                            y: [0, 200],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-[120px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{ transform: 'rotate(45deg)' }}
                    />
                )}
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                        <Logo />
                    </motion.div>
                    <h1 className="mt-6 text-2xl font-bold text-white/90">
                        {isSignUp ? "Aramıza Hoş Geldin" : "Tekrar Hoş Geldin"}
                    </h1>
                    <p className="text-sm text-gray-400 mt-2">
                        {isSignUp ? "Bilim topluluğuna katıl" : "Bilim yolculuğuna devam et"}
                    </p>
                </div>

                {/* Card - Glassmorphism + Brutalist Hybrid */}
                <div className="bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-lg p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.15)] transition-all duration-300">
                    <form onSubmit={handleEmailAuth} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-white/80">
                                E-posta
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-white/10 border-2 border-white/30 text-white placeholder:text-gray-500 focus:bg-white/15 focus:border-primary focus:shadow-[4px_4px_0px_0px_rgba(var(--primary),0.3)] transition-all rounded-md"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-white/80">
                                Şifre
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 bg-white/10 border-2 border-white/30 text-white placeholder:text-gray-500 focus:bg-white/15 focus:border-primary focus:shadow-[4px_4px_0px_0px_rgba(var(--primary),0.3)] transition-all pr-12 rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-primary/80 flex items-center gap-1.5"
                                >
                                    <AlertTriangle className="h-3 w-3" />
                                    {getPasswordStrength(password)}
                                </motion.p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none border-2 border-white/10 rounded-md"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
                                    <Rocket className="h-5 w-5" />
                                </span>
                            )}
                        </Button>

                        {/* Forgot Password */}
                        {!isSignUp && (
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gray-400 hover:text-primary transition-colors"
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
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-transparent px-3 text-gray-500 uppercase tracking-wide">
                                veya
                            </span>
                        </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthLogin('github')}
                            disabled={loading}
                            className="h-12 bg-white/5 border-2 border-white/30 text-white hover:bg-white/10 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 rounded-md"
                        >
                            <Github className="h-5 w-5 mr-2" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="h-12 bg-white/5 border-2 border-white/30 text-white hover:bg-white/10 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 rounded-md"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </Button>
                    </div>

                    {/* Toggle */}
                    <div className="text-center mt-6 text-sm">
                        <span className="text-gray-400">
                            {isSignUp ? "Zaten hesabın var mı?" : "Henüz hesabın yok mu?"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                            {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
