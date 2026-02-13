"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo"; // Swapped to DankLogo
import { StarBackground } from "@/components/background/star-background"; // Added StarBackground
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";


export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [supabase] = useState(() => createClient());
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        (window as any).onTurnstileSuccess = (token: string) => {
            setTurnstileToken(token);
        };

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
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

                const { data: existingUser, error: checkError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle();

                if (checkError) console.error("Username check error:", checkError);

                if (existingUser) throw new Error("Bu kullanıcı adı zaten alınmış.");

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
                toast.error("Kullanıcı adı veya şifre hatalı.");
            } else {
                toast.error(error.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-transparent font-sans relative overflow-hidden selection:bg-orange-500/30 selection:text-orange-200">
            {/* --- 10,000 STAR BACKGROUND --- */}
            <StarBackground />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2
                }}
                // "Chubby" and "Short" adjustment: max-w increased, vertical padding optimized
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Liquid Glassmorphism Container with Neo-Brutalist Shadow */}
                <div className="relative group">

                    {/* Neo-Brutalist Shadow Layer (Black & Solid) */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500" />

                    {/* The Card Itself - "Chubby" rounded-[2.5rem] */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/20 p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden">

                        {/* Internal Liquid Shine */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

                        {/* Header with DankLogo (Replaced old rocket/text) */}
                        <div className="text-center mb-6 relative">
                            <div className="inline-flex justify-center mb-2 transform hover:scale-110 transition-transform duration-500">
                                <DankLogo />
                            </div>
                            {/* Title removed/simplified as requested to use the logo primarily */}
                            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-4" />
                        </div>

                        {/* Social Login - Optimized height */}
                        <Button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-bold border-2 border-white/10 hover:border-white/30 backdrop-blur-md transition-all rounded-2xl mb-6 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] group/btn"
                        >
                            <svg className="h-5 w-5 opacity-90 group-hover/btn:opacity-100 transition-opacity" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffff" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffff" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#ffff" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffff" />
                            </svg>
                            Google İle Bağlan
                        </Button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                                <span className="bg-transparent px-3 text-white/30 backdrop-blur-sm">veya</span>
                            </div>
                        </div>

                        {/* Form - Optimized spacing for "Shorter" look */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">Kullanıcı Adı</Label>
                                            <Input
                                                placeholder="username"
                                                value={username}
                                                onChange={(e) => {
                                                    let value = e.target.value.toLowerCase();
                                                    value = value.replace(/[^a-z0-9_.-]/g, '');
                                                    setUsername(value);
                                                }}
                                                required
                                                className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 rounded-2xl transition-all font-mono text-sm pl-4"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">İsim</Label>
                                            <Input
                                                placeholder="Ad Soyad"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 rounded-2xl transition-all font-mono text-sm pl-4"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">E-Posta</Label>
                                <Input
                                    type="email"
                                    placeholder="mail@ornek.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 rounded-2xl transition-all font-mono text-sm pl-4"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center pl-2">
                                    <Label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Şifre</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] font-black text-orange-500/60 hover:text-orange-500 transition-colors uppercase"
                                        >
                                            Unuttum?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            </div>

                            {/* Terms Checkbox */}
                            <AnimatePresence>
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-start gap-3 py-1 px-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="appearance-none w-5 h-5 border-2 border-white/20 bg-white/5 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-colors cursor-pointer mt-0.5 shrink-0"
                                            required
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                        <label htmlFor="terms" className="text-[10px] text-white/40 leading-relaxed font-bold cursor-pointer select-none uppercase tracking-tighter">
                                            <span className="text-orange-500 hover:text-orange-400 transition-colors">Kullanım Şartlarını</span> okudum ve kabul ediyorum.
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Turnstile */}
                            <div className="flex justify-center my-4 opacity-80 scale-90 translate-z-0 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                <div className="cf-turnstile"
                                    data-sitekey="0x4AAAAAACI_a8NNCjdtVnjC"
                                    data-callback="onTurnstileSuccess"
                                    data-theme="dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.3em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_30px_rgba(234,88,12,0.4)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.6)] active:translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                ) : (
                                    <>
                                        {isSignUp ? "Terminale Katıl" : "Giriş Yap"}
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
                            >
                                {isSignUp ? "Zaten bir hesabın var mı?" : "Henüz bir üye aramıza katılmadı mı?"}
                            </button>
                        </div>
                    </div>

                    {/* Exterior Glass Highlights */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
}
