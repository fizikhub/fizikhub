"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Stars Component ---
const Stars = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full opacity-70"
                    style={{
                        width: Math.random() * 2 + 1 + "px",
                        height: Math.random() * 2 + 1 + "px",
                        top: Math.random() * 100 + "%",
                        left: Math.random() * 100 + "%",
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                    }}
                />
            ))}
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
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050505] font-sans relative overflow-hidden selection:bg-violet-500/30 selection:text-violet-200">
            {/* --- COSMIC BACKGROUND --- */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-[#050505] to-[#050505]" />
            <Stars />

            {/* Subtle Grid */}
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[350px] relative z-10"
            >
                {/* Dark Brutalist Shadow Box */}
                <div className="bg-black border-[2px] border-white/20 shadow-[0px_0px_40px_-10px_rgba(139,92,246,0.3)] relative backdrop-blur-sm">
                    {/* Hard Neon Shadow Effect (CSS Border trick or box-shadow) */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg opacity-0 lg:opacity-0 -z-10 blur-none" />
                    {/* Using simple hard shadow via standard class */}
                    <div className="absolute inset-0 border-[2px] border-white shadow-[6px_6px_0px_#8b5cf6] pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative bg-[#0a0a0a] border border-white/10 p-6 overflow-hidden">

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex justify-center mb-4 transform hover:scale-105 transition-transform duration-200">
                                <Logo className="text-white h-8 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            </div>
                            <h1 className="text-lg font-black text-white uppercase tracking-wider leading-none">
                                {isSignUp ? <span className="text-violet-400">Kayıt Terminali</span> : <span className="text-white">Sisteme Giriş</span>}
                            </h1>
                        </div>

                        {/* Social Login */}
                        <Button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-10 bg-white text-black font-bold border-2 border-transparent hover:border-violet-500 hover:text-violet-600 transition-all rounded-none mb-5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google İle Bağlan
                        </Button>

                        <div className="relative mb-5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-[#0a0a0a] px-2 text-white/30">veya</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-white/50 pl-1">Kod Adın</Label>
                                            <Input
                                                placeholder="username"
                                                value={username}
                                                onChange={(e) => {
                                                    let value = e.target.value.toLowerCase();
                                                    value = value.replace(/[^a-z0-9_.-]/g, '');
                                                    setUsername(value);
                                                }}
                                                required
                                                className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 rounded-none transition-all font-mono text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-white/50 pl-1">Kimlik Adı</Label>
                                            <Input
                                                placeholder="Ad Soyad"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 rounded-none transition-all font-mono text-xs"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-white/50 pl-1">E-Posta Frekansı</Label>
                                <Input
                                    type="email"
                                    placeholder="mail@ornek.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 rounded-none transition-all font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center pl-1">
                                    <Label className="text-[10px] font-bold uppercase text-white/50">Şifre Protokolü</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
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
                                        className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 pr-9 rounded-none transition-all font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
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
                                        className="flex items-start gap-2 py-1"
                                    >
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="appearance-none w-4 h-4 border border-white/30 bg-white/5 checked:bg-violet-500 checked:border-violet-500 transition-colors cursor-pointer mt-0.5 shrink-0"
                                            required
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                        <label htmlFor="terms" className="text-[10px] text-white/50 leading-tight font-medium cursor-pointer select-none">
                                            <span className="text-violet-400 font-bold hover:text-violet-300 transition-colors">Kuralları</span> onaylıyorum.
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Turnstile */}
                            <div className="flex justify-center my-2 opacity-80 scale-90 origin-center">
                                <div className="cf-turnstile"
                                    data-sitekey="0x4AAAAAACI_a8NNCjdtVnjC"
                                    data-callback="onTurnstileSuccess"
                                    data-theme="dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-10 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-xs rounded-none border border-transparent hover:border-white/50 shadow-[0px_0px_20px_rgba(139,92,246,0.3)] hover:shadow-[0px_0px_30px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                ) : (
                                    <>
                                        {isSignUp ? "Görevi Başlat" : "Sisteme Gir"}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-5 text-center">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs font-bold uppercase tracking-wide text-white/30 hover:text-white transition-colors"
                            >
                                {isSignUp ? "Zaten üye misin?" : "Hesabın yok mu?"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
