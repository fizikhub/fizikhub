"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo"; // Swapped to DankLogo
import dynamic from "next/dynamic";
const StarBackground = dynamic(() => import("@/components/background/star-background").then(mod => mod.StarBackground), { ssr: false });
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

        window.onTurnstileSuccess = (token: string) => {
            setTurnstileToken(token);
        };

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            delete window.onTurnstileSuccess;
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
            // Only show error if it's NOT a user cancellation (which often happens silently or with specific strings)
            // But usually unexpected errors.
            console.error("OAuth Error:", error);
            toast.error("Giriş bağlantısı başlatılamadı.");
        } finally {
            // We keep loading true because we are redirecting away. 
            // If we set it false, user sees the form again before redirect.
            // BUT if it failed synchronously, we must reset.
            // The catch block catches synchronous failures.
            setTimeout(() => setLoading(false), 2000); // Reset after delay just in case user comes back via history
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!turnstileToken) {
            toast.error("Lütfen robot olmadığınızı doğrulayın.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("İşlem yapılıyor...");

        try {
            if (isSignUp) {
                if (username.length < 3) throw new Error("Kullanıcı adı en az 3 karakter olmalı.");

                // Validate username uniqueness
                const { data: existingUser, error: checkError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle();

                if (checkError) {
                    console.error("Username check error:", checkError);
                    // We don't block registration on this error, let the server handle unique constraint if needed
                    // or throw if critical. For now, let's proceed but log it.
                }

                if (existingUser) throw new Error("Bu kullanıcı adı zaten alınmış.");

                const { data, error } = await supabase.auth.signUp({
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
                if (!data.user) throw new Error("Kayıt oluşturulamadı.");
                if (data.user.identities && data.user.identities.length === 0) {
                    throw new Error("Bu e-posta zaten kayıtlı.");
                }

                toast.success("Kayıt başarılı! Yönlendiriliyorsunuz...", { id: toastId });
                // Short delay to let user see the success message
                setTimeout(() => {
                    window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
                }, 1000);

            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                    options: { captchaToken: turnstileToken }
                });

                if (error) throw error;

                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...", { id: toastId });
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            }
        } catch (error: any) {
            console.error("Auth error:", error);

            // Clear loading state immediately on error
            setLoading(false);

            if (error.message.includes("already registered")) {
                toast.error("Bu e-posta zaten kayıtlı.", { id: toastId });
            } else if (error.message.includes("Invalid login")) {
                toast.error("Kullanıcı adı veya şifre hatalı.", { id: toastId });
            } else if (error.message.includes("Database error")) {
                toast.error("Sunucu hatası, lütfen tekrar deneyin.", { id: toastId });
            } else {
                // Fallback for other errors
                if (error.message.includes("rate limit")) {
                    toast.error("Çok fazla deneme yaptınız. Lütfen biraz bekleyin.", { id: toastId });
                } else {
                    toast.error("Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.", { id: toastId });
                }
            }
        }
        // Note: We don't set loading(false) in success case to prevent interaction during redirect
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5 py-8 bg-transparent font-sans relative overflow-hidden selection:bg-neo-yellow/30 selection:text-neo-yellow">
            {/* --- STAR BACKGROUND --- */}
            <StarBackground />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: -30 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* Neo-Brutalist Card — White shadow, site bg, soft rounding */}
                <div className="bg-[#292929] border-[3px] border-white/20 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] p-7 sm:p-9 rounded-2xl relative overflow-hidden">

                    {/* Subtle top accent */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    
                    {/* Header — Bigger Logo */}
                    <div className="text-center mb-8 relative">
                        <div className="inline-flex justify-center transform hover:-translate-y-1 transition-transform duration-200 scale-[1.35] sm:scale-[1.5] origin-center">
                            <DankLogo />
                        </div>
                    </div>

                    {/* Form — E-posta and Şifre FIRST */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest pl-1">Kullanıcı Adı</Label>
                                        <Input
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => {
                                                let value = e.target.value.toLowerCase();
                                                value = value.replace(/[^a-z0-9_.-]/g, '');
                                                setUsername(value);
                                            }}
                                            required
                                            className="h-11 bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-zinc-600 focus:border-neo-yellow focus:ring-0 rounded-lg transition-colors font-mono font-bold text-sm pl-4"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest pl-1">İsim</Label>
                                        <Input
                                            placeholder="Ad Soyad"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="h-11 bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-zinc-600 focus:border-neo-yellow focus:ring-0 rounded-lg transition-colors font-mono font-bold text-sm pl-4"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest pl-1">E-Posta</Label>
                            <Input
                                type="email"
                                placeholder="mail@ornek.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-zinc-600 focus:border-neo-yellow focus:ring-0 rounded-lg transition-colors font-mono font-bold text-sm pl-4"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center pl-1">
                                <Label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Şifre</Label>
                                {!isSignUp && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-[10px] font-bold text-neo-yellow/80 hover:text-neo-yellow transition-colors uppercase"
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
                                    className="h-11 bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-zinc-600 focus:border-neo-yellow focus:ring-0 pr-12 rounded-lg transition-colors font-mono font-bold text-sm pl-4"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-neo-yellow transition-colors p-1"
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
                                    className="flex items-start gap-3 pt-1"
                                >
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="appearance-none w-[18px] h-[18px] border-2 border-white/15 bg-white/[0.06] rounded checked:bg-neo-yellow checked:border-neo-yellow checked:after:content-['✓'] checked:after:text-black checked:after:font-black checked:after:flex checked:after:justify-center checked:after:items-center checked:after:text-[10px] cursor-pointer mt-0.5 shrink-0 transition-colors"
                                        required
                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                    />
                                    <label htmlFor="terms" className="text-[10px] text-zinc-500 leading-tight font-bold cursor-pointer select-none uppercase tracking-widest mt-0.5">
                                        <Link href="/kullanim-sartlari" className="text-neo-yellow hover:text-white underline decoration-dashed underline-offset-2 transition-colors mr-1">Şartları</Link>
                                        kabul ediyorum.
                                    </label>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Turnstile */}
                        <div className="flex justify-center pt-2 pb-1 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="cf-turnstile"
                                data-sitekey="0x4AAAAAACI_a8NNCjdtVnjC"
                                data-callback="onTurnstileSuccess"
                                data-theme="dark"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[52px] bg-neo-yellow hover:bg-yellow-300 text-black font-black uppercase tracking-widest text-[13px] rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-black" />
                            ) : (
                                <>
                                    {isSignUp ? "Aramıza Katıl" : "Giriş Yap"}
                                    <ArrowRight className="h-5 w-5" strokeWidth={3} />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider — "veya" */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-[#292929] px-4 text-zinc-500">veya</span>
                        </div>
                    </div>

                    {/* Google Login — Moved BELOW form */}
                    <Button
                        type="button"
                        onClick={() => handleOAuthLogin('google')}
                        disabled={loading}
                        className="w-full h-11 bg-white/[0.07] hover:bg-white/[0.12] text-white font-bold border-2 border-white/15 hover:border-white/30 transition-all rounded-xl flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest"
                    >
                        <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                        </svg>
                        Google İle Bağlan
                    </Button>

                    {/* Sign Up / Sign In Toggle — Prominent */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="w-full py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-neo-yellow/50 hover:bg-white/[0.03] transition-all group/toggle"
                        >
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-hover/toggle:text-white transition-colors">
                                {isSignUp ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                                <span className="text-neo-yellow group-hover/toggle:text-neo-yellow">
                                    {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
