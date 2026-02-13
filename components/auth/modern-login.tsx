"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Check } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Cosmic Assets ---
const Stars = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Layer 1: Small/Slow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={`s1-${i}`}
                        className="absolute bg-white rounded-full opacity-40"
                        style={{
                            width: Math.random() * 2 + 1 + "px",
                            height: Math.random() * 2 + 1 + "px",
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </motion.div>

            {/* Layer 2: Medium/Faster */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0"
            >
                {Array.from({ length: 25 }).map((_, i) => (
                    <motion.div
                        key={`s2-${i}`}
                        className="absolute bg-emerald-400 rounded-full opacity-60 mix-blend-screen"
                        style={{
                            width: Math.random() * 3 + 2 + "px",
                            height: Math.random() * 3 + 2 + "px",
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            boxShadow: "0 0 4px #34d399",
                        }}
                        animate={{
                            y: [0, -150],
                            opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

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

    // Initialize Turnstile - keeping existing logic
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

                // Check username uniqueness
                const { data: existingUser, error: checkError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle();

                if (checkError) console.error("Username check error:", checkError);

                if (existingUser) {
                    throw new Error("Bu kullanıcı adı zaten alınmış. Lütfen başka bir tane dene.");
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
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-[#050505] selection:bg-emerald-400/30 selection:text-emerald-200 overflow-hidden font-sans">
            {/* --- COSMIC BACKGROUND --- */}

            {/* Grid Floor - Perspective */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(16,185,129,0.05)_100%)] pointer-events-none" />
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            <Stars />

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />


            {/* --- MAIN CARD --- */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10 w-full max-w-[420px]"
            >
                {/* Brutalist Container */}
                <div className="bg-[#0a0a0a] border-2 border-white/20 shadow-[8px_8px_0px_#10b981] sm:shadow-[12px_12px_0px_#10b981] p-1 relative group transition-all duration-300 hover:shadow-[10px_10px_0px_#10b981]">

                    {/* Corner Accents */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-black z-20" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-black z-20" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-black z-20" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black z-20" />

                    <div className="bg-[#050505] p-6 sm:p-8 border border-white/5 relative overflow-hidden">

                        {/* Header */}
                        <div className="text-center mb-8 relative">
                            <motion.div
                                className="inline-flex justify-center mb-4 relative"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                <div className="relative z-10 transform scale-125">
                                    <Logo />
                                </div>
                            </motion.div>

                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                                {isSignUp ? "GÖREV BAŞLIYOR" : "GERİ DÖNÜŞ"}
                            </h1>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Güvenli Frekans
                            </p>
                        </div>

                        {/* Social Login */}
                        <Button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-12 bg-white text-black font-extrabold uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-emerald-400 hover:scale-[1.02] shadow-[4px_4px_0px_#222] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mb-6 group/google"
                        >
                            <svg className="h-5 w-5 mr-3 group-hover/google:animate-bounce" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" className="text-blue-500 group-hover/google:text-black" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" className="text-green-500 group-hover/google:text-black" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" className="text-yellow-500 group-hover/google:text-black" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" className="text-red-500 group-hover/google:text-black" />
                            </svg>
                            Google İle Bağlan
                        </Button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t-2 border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                                <span className="bg-[#050505] px-4 text-white/40">veya</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-5">
                            <AnimatePresence mode="popLayout">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div className="space-y-1 group">
                                            <Label className="text-[10px] font-black uppercase text-white/60 ml-1 group-focus-within:text-emerald-400 transition-colors">Kullanıcı Adı</Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="KOD ADIN"
                                                    value={username}
                                                    onChange={(e) => {
                                                        let value = e.target.value.toLowerCase();
                                                        value = value.replace(/[^a-z0-9_.-]/g, '');
                                                        setUsername(value);
                                                    }}
                                                    required
                                                    className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400 focus:bg-white/10 focus:ring-0 focus:shadow-[4px_4px_0px_#10b981] rounded-none transition-all font-mono text-sm pl-10"
                                                />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-mono">@</div>
                                            </div>
                                        </div>
                                        <div className="space-y-1 group">
                                            <Label className="text-[10px] font-black uppercase text-white/60 ml-1 group-focus-within:text-emerald-400 transition-colors">Ad Soyad</Label>
                                            <Input
                                                placeholder="GERÇEK İSMİN"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400 focus:bg-white/10 focus:ring-0 focus:shadow-[4px_4px_0px_#10b981] rounded-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1 group">
                                <Label className="text-[10px] font-black uppercase text-white/60 ml-1 group-focus-within:text-emerald-400 transition-colors">E-posta</Label>
                                <Input
                                    type="email"
                                    placeholder="ORNEK@MAIL.COM"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400 focus:bg-white/10 focus:ring-0 focus:shadow-[4px_4px_0px_#10b981] rounded-none transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-1 group">
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-[10px] font-black uppercase text-white/60 group-focus-within:text-emerald-400 transition-colors">Şifre</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] uppercase font-bold text-white/40 hover:text-emerald-400 transition-colors"
                                        >
                                            Şifreni mi unuttun?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-400 focus:bg-white/10 focus:ring-0 focus:shadow-[4px_4px_0px_#10b981] rounded-none transition-all font-mono text-sm pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-emerald-400 transition-colors"
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
                                        className="flex items-start gap-3 py-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="appearance-none w-5 h-5 border-2 border-white/20 bg-transparent checked:bg-emerald-500 checked:border-emerald-500 transition-colors cursor-pointer mt-0.5"
                                            required
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                        <label htmlFor="terms" className="text-[10px] text-white/50 leading-tight font-medium cursor-pointer select-none">
                                            <span className="text-emerald-400 font-bold">Kullanım Şartları</span>'nı okudum ve kabul ediyorum. Verilerimin güvende olduğunu biliyorum.
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Turnstile */}
                            <div className="flex justify-center my-2 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="cf-turnstile"
                                    data-sitekey="0x4AAAAAACI_a8NNCjdtVnjC"
                                    data-callback="onTurnstileSuccess"
                                    data-theme="dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm rounded-none border-2 border-transparent hover:border-white shadow-[4px_4px_0px_#fff] hover:shadow-[6px_6px_0px_#fff] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            {isSignUp ? "GÖREVİ BAŞLAT (KAYIT OL)" : "SİSTEME GİRİŞ YAP"}
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                            </Button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors group"
                            >
                                {isSignUp ? "Zaten bir hesabın var mı?" : "Henüz bir hesabın yok mu?"}
                                <span className="block mt-1 text-emerald-400 group-hover:underline decoration-2 underline-offset-4">
                                    {isSignUp ? "Giriş Yap >" : "Hemen Kaydol >"}
                                </span>
                            </button>
                        </div>

                    </div>

                    {/* Bottom Decorative Strip */}
                    <div className="h-1.5 w-full bg-stripes-white/10 mt-1" />
                </div>
            </motion.div>

            {/* Background Noise Texture (Subtle) */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        </div>
    );
}

