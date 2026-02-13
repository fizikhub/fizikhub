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

    // Initialize Turnstile
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
                toast.error("Kullanıcı adı veya şifre hatalı.");
            } else {
                toast.error(error.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f7f4] font-sans relative overflow-hidden">
            {/* Background Texture - Minimal Dot Pattern */}
            <div className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[340px] relative z-10"
            >
                {/* Brutalist Shadow Box */}
                <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] relative">

                    {/* Header Strip */}
                    <div className="bg-black text-white px-4 py-3 border-b-[3px] border-black flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-[#10b981] animate-pulse" />
                            <span className="font-bold text-xs tracking-wider uppercase">FizikHub v2.0</span>
                        </div>
                        {/* Tiny decorative grid */}
                        <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-white/30" />
                            <div className="w-1 h-1 bg-white/30" />
                        </div>
                    </div>

                    <div className="p-5">
                        {/* Logo & Title */}
                        <div className="text-center mb-5">
                            <div className="inline-block mb-2 transform hover:scale-105 transition-transform duration-200 cursor-pointer">
                                <Logo className="text-black h-7 w-auto" />
                            </div>
                            <h1 className="text-lg font-black text-black uppercase tracking-tight leading-none">
                                {isSignUp ? "Giriş Kartı Oluştur" : "Sisteme Erişim"}
                            </h1>
                        </div>

                        {/* Social Login */}
                        <Button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-10 bg-white text-black font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all rounded-none mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-wide hover:bg-gray-50"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google ile
                        </Button>

                        <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-black/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                                <span className="bg-white px-2 text-black/40">veya</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-black uppercase text-black/60 pl-1">Kullanıcı Adı</Label>
                                            <Input
                                                placeholder="username"
                                                value={username}
                                                onChange={(e) => {
                                                    let value = e.target.value.toLowerCase();
                                                    value = value.replace(/[^a-z0-9_.-]/g, '');
                                                    setUsername(value);
                                                }}
                                                required
                                                className="h-9 bg-white border-2 border-black text-black placeholder:text-black/20 focus:ring-0 focus:shadow-[3px_3px_0px_#10b981] rounded-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-black uppercase text-black/60 pl-1">İsim Soyisim</Label>
                                            <Input
                                                placeholder="Ad Soyad"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="h-9 bg-white border-2 border-black text-black placeholder:text-black/20 focus:ring-0 focus:shadow-[3px_3px_0px_#10b981] rounded-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-black/60 pl-1">E-posta</Label>
                                <Input
                                    type="email"
                                    placeholder="mail@ornek.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-9 bg-white border-2 border-black text-black placeholder:text-black/20 focus:ring-0 focus:shadow-[3px_3px_0px_#10b981] rounded-none transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center pl-1">
                                    <Label className="text-[10px] font-black uppercase text-black/60">Şifre</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] font-bold text-black/40 hover:text-black transition-colors"
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
                                        className="h-9 bg-white border-2 border-black text-black placeholder:text-black/20 focus:ring-0 focus:shadow-[3px_3px_0px_#10b981] pr-9 rounded-none transition-all font-mono text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
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
                                            className="appearance-none w-4 h-4 border-2 border-black bg-white checked:bg-[#10b981] transition-colors cursor-pointer mt-0.5 shrink-0"
                                            required
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                        <label htmlFor="terms" className="text-[10px] text-black/60 leading-tight font-medium cursor-pointer select-none">
                                            <span className="text-black font-bold border-b border-black/20 hover:border-black transition-colors">Şartları</span> kabul ediyorum.
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Turnstile */}
                            <div className="flex justify-center my-2 opacity-90 scale-90 origin-center">
                                <div className="cf-turnstile"
                                    data-sitekey="0x4AAAAAACI_a8NNCjdtVnjC"
                                    data-callback="onTurnstileSuccess"
                                    data-theme="light"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-10 bg-[#10b981] hover:bg-[#059669] text-white font-black uppercase tracking-widest text-xs rounded-none border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                                ) : (
                                    <>
                                        {isSignUp ? "Hesap Oluştur" : "Giriş Yap"}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs font-bold uppercase tracking-wide text-black/50 hover:text-black transition-colors"
                            >
                                {isSignUp ? "Giriş yapmam lazım" : "Hesabın yok mu?"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sticker/Badge Element */}
                <div className="absolute -top-3 -right-3 rotate-12 bg-yellow-400 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_#000] z-20 pointer-events-none">
                    <span className="text-[10px] font-black uppercase text-black">Beta</span>
                </div>

            </motion.div>
        </div>
    );
}
