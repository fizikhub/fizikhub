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
import { BlackHole } from "@/components/ui/black-hole"; // Custom Black Hole Component

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
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-transparent font-sans relative overflow-hidden selection:bg-violet-500/30 selection:text-violet-200">
            {/* --- REALISTIC BLACK HOLE BACKGROUND --- */}
            <BlackHole />

            {/* Vignette Overlay to focus on center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none opacity-80 z-0" />

            {/* Main Card - Floating in front of the Event Horizon */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full max-w-[360px] relative z-10"
            >
                {/* Glassmorphism Container blending with Black Hole Light */}
                <div className="relative group perspective-1000">

                    {/* Dynamic Glow behind the card */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-orange-600/30 rounded-xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 animate-pulse" />

                    {/* The Card Itself */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl relative overflow-hidden">

                        {/* Inner shiny border */}
                        <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none" />

                        {/* Header */}
                        <div className="text-center mb-6 relative">
                            <div className="inline-flex justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
                                <Logo className="text-white h-9 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                            </div>
                            <h1 className="text-xl font-black text-white uppercase tracking-wider leading-none drop-shadow-md">
                                {isSignUp ? "Katılım Ufku" : "Olay Ufku"}
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-bold">
                                {isSignUp ? "Etkinlik Başlangıcı" : "Sisteme Erişim"}
                            </p>
                        </div>

                        {/* Social Login */}
                        <Button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-10 bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all rounded-lg mb-5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider group/btn"
                        >
                            <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" viewBox="0 0 24 24">
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
                                <span className="bg-transparent px-2 text-white/30 backdrop-blur-md">veya</span>
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
                                            <Label className="text-[10px] font-bold uppercase text-white/60 pl-1">Kod Adın</Label>
                                            <Input
                                                placeholder="username"
                                                value={username}
                                                onChange={(e) => {
                                                    let value = e.target.value.toLowerCase();
                                                    value = value.replace(/[^a-z0-9_.-]/g, '');
                                                    setUsername(value);
                                                }}
                                                required
                                                className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 focus:ring-0 rounded-lg transition-all font-mono text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-white/60 pl-1">Kimlik Adı</Label>
                                            <Input
                                                placeholder="Ad Soyad"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 focus:ring-0 rounded-lg transition-all font-mono text-xs"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-white/60 pl-1">E-Posta Frekansı</Label>
                                <Input
                                    type="email"
                                    placeholder="mail@ornek.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 focus:ring-0 rounded-lg transition-all font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center pl-1">
                                    <Label className="text-[10px] font-bold uppercase text-white/60">Şifre Protokolü</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] font-bold text-violet-300 hover:text-white transition-colors"
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
                                        className="h-10 bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 focus:ring-0 pr-9 rounded-lg transition-all font-mono text-xs"
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
                                            className="appearance-none w-4 h-4 border border-white/30 bg-white/5 rounded-sm checked:bg-violet-500 checked:border-violet-500 transition-colors cursor-pointer mt-0.5 shrink-0"
                                            required
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                        <label htmlFor="terms" className="text-[10px] text-white/50 leading-tight font-medium cursor-pointer select-none">
                                            <span className="text-violet-300 font-bold hover:text-white transition-colors">Kuralları</span> onaylıyorum.
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
                                className="w-full h-10 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs rounded-lg border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                                ) : (
                                    <>
                                        {isSignUp ? "Görevi Başlat" : "Işınla"}
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
