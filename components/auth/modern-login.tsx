"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import Link from "next/link";

export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [supabase] = useState(() => createClient());

    // Turnstile Token
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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

    // Initialize Turnstile
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Listen for token success via global callback
        // Note: The widget requires a global function name string
        (window as any).onTurnstileSuccess = (token: string) => {
            setTurnstileToken(token);
        };

        return () => {
            document.body.removeChild(script);
            delete (window as any).onTurnstileSuccess;
        };
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

        if (!turnstileToken) {
            toast.error("Lütfen robot olmadığınızı doğrulayın.");
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                if (username.length < 3) throw new Error("Kullanıcı adı en az 3 karakter olmalı.");

                const { data: existingUser } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .single();

                if (existingUser) {
                    throw new Error("Bu kullanıcı adı zaten alınmış.");
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        captchaToken: turnstileToken,
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: {
                            username,
                            full_name: fullName,
                            onboarding_completed: true
                        }
                    },
                });
                if (error) throw error;
                window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                    options: { captchaToken: turnstileToken }
                });
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
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black/90">
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

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />

            {/* Glassmorphism Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[400px] relative z-10"
            >
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                    {/* Header Section */}
                    <div className="pt-8 pb-6 px-6 text-center bg-white/5 border-b border-white/5">
                        <div className="flex justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
                            <Logo />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            {isSignUp ? "Aramıza Katıl" : "Tekrar Hoşgeldin"}
                        </h1>
                        <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Bilim dolu güvenli bölge</span>
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Google Button - Full Width */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white rounded-xl transition-all font-medium text-sm flex items-center justify-center"
                        >
                            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google ile Devam Et
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-white/40 backdrop-blur-sm">veya e-posta ile</span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            {isSignUp && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-white/70 ml-1">Kullanıcı Adı</Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="kullaniciadi"
                                                value={username}
                                                onChange={(e) => {
                                                    let value = e.target.value.toLowerCase();
                                                    value = value.replace(/[^a-z0-9_.-]/g, '');
                                                    setUsername(value);
                                                }}
                                                required
                                                className="h-11 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/40 focus:ring-1 focus:ring-emerald-400/50 rounded-xl transition-all pl-10"
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">@</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-white/70 ml-1">Ad Soyad</Label>
                                        <Input
                                            placeholder="Adınız Soyadınız"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="h-11 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/40 focus:ring-1 focus:ring-emerald-400/50 rounded-xl transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-white/70 ml-1">E-posta</Label>
                                <Input
                                    type="email"
                                    placeholder="ornek@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/40 focus:ring-1 focus:ring-emerald-400/50 rounded-xl transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-xs font-semibold text-white/70">Şifre</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] text-white/40 hover:text-emerald-400 transition-colors"
                                        >
                                            Şifremi unuttum?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/40 focus:ring-1 focus:ring-emerald-400/50 pr-10 rounded-xl transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Turnstile Widget */}
                            <div className="flex justify-center my-4">
                                <div className="cf-turnstile text-center flex justify-center w-full"
                                    data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                                    data-callback="onTurnstileSuccess"
                                    data-theme="dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-[#86efac] hover:bg-[#4ade80] text-black font-black uppercase tracking-wide rounded-xl shadow-[0_0_15px_rgba(134,239,172,0.3)] hover:shadow-[0_0_25px_rgba(134,239,172,0.5)] transition-all active:scale-[0.98] mt-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {isSignUp ? "Aramıza Katıl" : "Giriş Yap"}
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Footer / Toggle */}
                    <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                        <p className="text-sm text-white/60">
                            {isSignUp ? "Zaten hesabın var mı?" : "Fizikhub'da yeni misin?"}
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                            >
                                {isSignUp ? "Giriş Yap" : "Hemen Katıl"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        Bot koruması aktif
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
