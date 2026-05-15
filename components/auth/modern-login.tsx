"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight, Mail, Lock, User, AtSign, CheckCircle2, AlertCircle } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import dynamic from "next/dynamic";
const StarBackground = dynamic(() => import("@/components/background/star-background").then(mod => mod.StarBackground), { ssr: false });
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signupWithEmailOtp } from "@/app/auth/actions";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACI_a8NNCjdtVnjC";


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
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        window.onTurnstileSuccess = (token: string) => {
            setTurnstileToken(token);
        };
        window.onTurnstileExpired = () => {
            setTurnstileToken(null);
        };
        window.onTurnstileError = () => {
            setTurnstileToken(null);
        };

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            delete window.onTurnstileSuccess;
            delete window.onTurnstileExpired;
            delete window.onTurnstileError;
        };
    }, []);

    const resetTurnstile = () => {
        setTurnstileToken(null);
        window.turnstile?.reset();
    };

    useEffect(() => {
        if (!isSignUp || username.length < 3) {
            setUsernameStatus("idle");
            return;
        }

        let active = true;
        setUsernameStatus("checking");

        const timer = window.setTimeout(async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("id")
                .eq("username", username)
                .maybeSingle();

            if (!active) return;

            if (error) {
                console.error("Username availability error:", error);
                setUsernameStatus("idle");
                return;
            }

            setUsernameStatus(data ? "taken" : "available");
        }, 350);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [isSignUp, supabase, username]);

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
                if (!isPasswordReady) throw new Error("Şifre güvenlik koşullarını karşılamıyor.");
                if (usernameStatus === "checking") throw new Error("Kullanıcı adı kontrol ediliyor.");
                if (usernameStatus === "taken") throw new Error("Bu kullanıcı adı zaten alınmış.");

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

                const result = await signupWithEmailOtp({
                    email,
                    password,
                    username,
                    fullName,
                    captchaToken: turnstileToken,
                    redirectTo: `${location.origin}/auth/callback`,
                });

                if (!result.success) throw new Error(result.error || "Kayıt oluşturulamadı.");

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

                if (error) {
                    if (error.message.toLowerCase().includes("email not confirmed")) {
                        toast.error("E-posta doğrulaması gerekli. Kodu tekrar girebilirsin.", { id: toastId });
                        setTimeout(() => {
                            window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
                        }, 800);
                        return;
                    }

                    throw error;
                }

                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...", { id: toastId });
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            }
        } catch (error: any) {
            console.error("Auth error:", error);

            // Clear loading state immediately on error
            setLoading(false);
            resetTurnstile();

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

    /* Shared input class for consistency */
    const inputCls = "h-11 bg-white/[0.05] border-2 border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-neo-yellow/70 focus:bg-white/[0.07] focus:ring-0 rounded-xl transition-all font-mono font-bold text-sm pl-10";
    const passwordRules = [
        { label: "8+ karakter", valid: password.length >= 8 },
        { label: "Büyük harf", valid: /[A-Z]/.test(password) },
        { label: "Küçük harf", valid: /[a-z]/.test(password) },
        { label: "Rakam", valid: /[0-9]/.test(password) },
        { label: "Özel işaret", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
    const isPasswordReady = passwordRules.every((rule) => rule.valid);
    const isSubmitDisabled = loading || (isSignUp && (usernameStatus === "checking" || usernameStatus === "taken" || !isPasswordReady));

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5 py-8 bg-transparent font-sans relative overflow-hidden selection:bg-neo-yellow/30 selection:text-neo-yellow">
            {/* Star Background */}
            <StarBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -30 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* ──── THE CARD ──── */}
                <div className="bg-[#292929] border-2 border-white/[0.12] shadow-[5px_5px_0px_0px_rgba(255,255,255,0.8)] rounded-2xl relative overflow-hidden">

                    {/* Inner content wrapper */}
                    <div className="px-7 pt-8 pb-7 sm:px-9 sm:pt-10 sm:pb-8">

                        {/* ── Logo + Welcome ── */}
                        <div className="text-center mb-7">
                            <div className="inline-flex justify-center transform hover:-translate-y-0.5 transition-transform duration-200 scale-[1.3] sm:scale-[1.45] origin-center mb-4">
                                <DankLogo />
                            </div>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.25em]">
                                {isSignUp ? "Bilim topluluğuna katıl" : "Hesabına giriş yap"}
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border-2 border-white/[0.08] bg-white/[0.04] p-1">
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(false)}
                                    className={cn(
                                        "h-9 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                                        !isSignUp ? "bg-neo-yellow text-black shadow-[2px_2px_0_rgba(255,255,255,0.55)]" : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    Giriş
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(true)}
                                    className={cn(
                                        "h-9 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                                        isSignUp ? "bg-neo-yellow text-black shadow-[2px_2px_0_rgba(255,255,255,0.55)]" : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    Kayıt
                                </button>
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleEmailAuth} className="space-y-3.5">
                            <AnimatePresence mode="popLayout">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="space-y-3.5 overflow-hidden"
                                    >
                                        {/* Username */}
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest pl-1">Kullanıcı Adı</Label>
                                            <div className="relative">
                                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
	                                                <Input
	                                                    placeholder="username"
	                                                    value={username}
	                                                    onChange={(e) => {
                                                        let value = e.target.value.toLowerCase();
                                                        value = value.replace(/[^a-z0-9_.-]/g, '');
                                                        setUsername(value);
                                                    }}
	                                                    required
	                                                    className={inputCls}
	                                                />
	                                            </div>
                                                {username.length >= 3 && (
                                                    <div className={cn(
                                                        "flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-wider",
                                                        usernameStatus === "available" && "text-emerald-400",
                                                        usernameStatus === "taken" && "text-red-400",
                                                        usernameStatus === "checking" && "text-zinc-500",
                                                        usernameStatus === "idle" && "text-zinc-600"
                                                    )}>
                                                        {usernameStatus === "checking" ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : usernameStatus === "taken" ? (
                                                            <AlertCircle className="h-3 w-3" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        )}
                                                        <span>
                                                            {usernameStatus === "checking"
                                                                ? "Kontrol ediliyor"
                                                                : usernameStatus === "taken"
                                                                    ? "Kullanıcı adı alınmış"
                                                                    : "Kullanıcı adı uygun"}
                                                        </span>
                                                    </div>
                                                )}
	                                        </div>
                                        {/* Full Name */}
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest pl-1">İsim</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                                                <Input
                                                    placeholder="Ad Soyad"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required
                                                    className={inputCls}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* E-Posta */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest pl-1">E-Posta</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                                    <Input
                                        type="email"
                                        placeholder="mail@ornek.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Şifre */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center pl-1">
                                    <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Şifre</Label>
                                    {!isSignUp && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] font-bold text-neo-yellow/70 hover:text-neo-yellow transition-colors uppercase"
                                        >
                                            Unuttum?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={cn(inputCls, "pr-11")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-neo-yellow transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
	                                    </button>
	                                </div>
                                    {isSignUp && (
                                        <div className="grid grid-cols-2 gap-1.5 pl-1 pt-1">
                                            {passwordRules.map((rule) => (
                                                <div
                                                    key={rule.label}
                                                    className={cn(
                                                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                                                        rule.valid ? "text-emerald-400" : "text-zinc-600"
                                                    )}
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>{rule.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
	                            </div>

                            {/* Terms */}
                            <AnimatePresence>
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-start gap-2.5 pt-0.5"
                                    >
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="appearance-none w-4 h-4 border-2 border-white/15 bg-white/[0.05] rounded checked:bg-neo-yellow checked:border-neo-yellow cursor-pointer mt-0.5 shrink-0 transition-colors"
                                            required
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen şartları kabul edin.')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                        />
                                        <label htmlFor="terms" className="text-[10px] text-zinc-500 leading-snug font-bold cursor-pointer select-none uppercase tracking-wider">
                                            <Link href="/kullanim-sartlari" className="text-neo-yellow hover:text-white underline decoration-dashed underline-offset-2 transition-colors">Kullanım Şartlarını</Link> kabul ediyorum.
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Turnstile */}
                            <div className="flex justify-center pt-1 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="cf-turnstile"
                                    data-sitekey={turnstileSiteKey}
                                    data-callback="onTurnstileSuccess"
                                    data-expired-callback="onTurnstileExpired"
                                    data-error-callback="onTurnstileError"
                                    data-theme="dark"
                                />
                            </div>

                            {/* CTA */}
	                            <Button
	                                type="submit"
	                                disabled={isSubmitDisabled}
                                className="w-full h-[50px] bg-neo-yellow hover:bg-yellow-300 text-black font-black uppercase tracking-widest text-[13px] rounded-xl border-2 border-black/80 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center gap-2.5"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-black" />
                                ) : (
                                    <>
                                        {isSignUp ? "Aramıza Katıl" : "Giriş Yap"}
                                        <ArrowRight className="h-4.5 w-4.5" strokeWidth={3} />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* ── Divider ── */}
                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/[0.08]" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-[#292929] px-4 text-zinc-600">veya</span>
                            </div>
                        </div>

                        {/* ── Google ── */}
                        <Button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full h-11 bg-white/[0.06] hover:bg-white/[0.10] text-white font-bold border-2 border-white/[0.10] hover:border-white/20 transition-all rounded-xl flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest"
                        >
                            {/* Colored Google "G" */}
                            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google İle Bağlan
                        </Button>
                    </div>

                    {/* ── Toggle — Full-width bar at card bottom ── */}
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full py-3.5 border-t-2 border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all group/toggle"
                    >
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover/toggle:text-white transition-colors">
                            {isSignUp ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                            <span className="text-neo-yellow">
                                {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                            </span>
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
