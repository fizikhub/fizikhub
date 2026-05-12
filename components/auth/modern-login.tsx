"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowRight, AtSign, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";

import { DankLogo } from "@/components/brand/dank-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const StarBackground = dynamic(
    () => import("@/components/background/star-background").then((mod) => mod.StarBackground),
    { ssr: false }
);

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
        const script = document.createElement("script");
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

    const handleOAuthLogin = async (provider: "github" | "google") => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${location.origin}/auth/callback` },
            });
            if (error) throw error;
        } catch (error: unknown) {
            console.error("OAuth Error:", error);
            toast.error("Giriş bağlantısı başlatılamadı.");
        } finally {
            setTimeout(() => setLoading(false), 2000);
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

                const { data: existingUser, error: checkError } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("username", username)
                    .maybeSingle();

                if (checkError) {
                    console.error("Username check error:", checkError);
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
                            onboarding_completed: true,
                        },
                    },
                });

                if (error) throw error;
                if (!data.user) throw new Error("Kayıt oluşturulamadı.");
                if (data.user.identities && data.user.identities.length === 0) {
                    throw new Error("Bu e-posta zaten kayıtlı.");
                }

                toast.success("Kayıt başarılı! Yönlendiriliyorsunuz...", { id: toastId });
                setTimeout(() => {
                    window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
                }, 1000);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                    options: { captchaToken: turnstileToken },
                });

                if (error) throw error;

                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...", { id: toastId });
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            }
        } catch (error: unknown) {
            console.error("Auth error:", error);
            setLoading(false);
            const message = getErrorMessage(error);

            if (message.includes("already registered")) {
                toast.error("Bu e-posta zaten kayıtlı.", { id: toastId });
            } else if (message.includes("Invalid login")) {
                toast.error("Kullanıcı adı veya şifre hatalı.", { id: toastId });
            } else if (message.includes("Database error")) {
                toast.error("Sunucu hatası, lütfen tekrar deneyin.", { id: toastId });
            } else if (message.includes("rate limit")) {
                toast.error("Çok fazla deneme yaptınız. Lütfen biraz bekleyin.", { id: toastId });
            } else {
                toast.error("Bir hata oluştu. Lütfen bilgilerinizi kontrol edin.", { id: toastId });
            }
        }
    };

    const authModeLabel = isSignUp ? "Kayıt Ol" : "Giriş Yap";

    return (
        <main className="relative isolate min-h-[calc(100dvh-109px)] w-screen max-w-[100vw] overflow-hidden bg-[#020205] px-4 pb-[calc(84px+env(safe-area-inset-bottom))] pt-5 text-white selection:bg-[#ffcc18] selection:text-black sm:px-6 md:min-h-screen md:py-10">
            <StarBackground />

            <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,204,24,0.13),transparent_34%),linear-gradient(180deg,rgba(2,2,5,0.05),rgba(2,2,5,0.78))]" />

            <motion.section
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mx-0 flex w-full max-w-[350px] flex-col gap-4 min-[390px]:max-w-[366px] sm:mx-auto sm:max-w-[430px]"
                aria-labelledby="login-heading"
            >
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href="/"
                        aria-label="FizikHub ana sayfa"
                        className="rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60"
                    >
                        <DankLogo />
                    </Link>

                    <div className="rotate-[-2deg] border-[3px] border-black bg-[#ffcc18] px-3 py-2 text-[11px] font-black uppercase leading-none tracking-[0.12em] text-black shadow-[4px_4px_0_#000]">
                        Üye Girişi
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[26px] bg-black sm:translate-x-2 sm:translate-y-2" />
                    <div className="relative overflow-hidden rounded-[26px] border-[4px] border-black bg-[#17171a] shadow-[0_0_0_2px_rgba(255,255,255,0.18)]">
                        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(135deg,rgba(255,204,24,0.22),transparent_45%,rgba(35,169,250,0.12))]" />
                        <div className="absolute -right-12 top-24 h-32 w-32 rounded-full bg-[#23a9fa]/10 blur-2xl" />
                        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#ff6a00]/12 blur-2xl" />

                        <div className="relative border-b-[3px] border-black bg-[#0b0b0d] px-5 py-5">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300">
                                <Sparkles className="h-3.5 w-3.5 text-[#ffcc18]" aria-hidden="true" />
                                FizikHub hesabı
                            </div>

                            <h1 id="login-heading" className="text-[32px] font-black uppercase leading-[0.92] tracking-normal text-white sm:text-[42px]">
                                Bilime
                                <span className="block text-[#ffcc18] [text-shadow:3px_3px_0_#000]">
                                    Bağlan
                                </span>
                            </h1>

                            <p className="mt-3 max-w-[28rem] text-sm font-bold leading-6 text-zinc-300">
                                Makaleler, forum ve sözlük aynı hesabın altında. Hızlıca gir, evren yine karışık.
                            </p>
                        </div>

                        <div className="relative p-4 sm:p-5">
                            <div className="mb-4 grid grid-cols-2 gap-2 rounded-[18px] border-[3px] border-black bg-black p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" role="tablist" aria-label="Kimlik doğrulama modu">
                                {[
                                    { active: !isSignUp, label: "Giriş", onClick: () => setIsSignUp(false) },
                                    { active: isSignUp, label: "Kayıt", onClick: () => setIsSignUp(true) },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        role="tab"
                                        aria-selected={item.active}
                                        onClick={item.onClick}
                                        className={cn(
                                            "h-12 rounded-[13px] border-2 border-transparent text-sm font-black uppercase tracking-[0.08em] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60",
                                            item.active
                                                ? "border-black bg-[#ffcc18] text-black shadow-[3px_3px_0_rgba(255,255,255,0.18)]"
                                                : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={() => handleOAuthLogin("google")}
                                disabled={loading}
                                className="mb-4 h-14 w-full rounded-[18px] border-[3px] border-black bg-white text-sm font-black uppercase tracking-[0.14em] text-black shadow-[5px_5px_0_#000] transition-all hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-[6px_6px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-70"
                            >
                                <GoogleMark className="h-5 w-5" />
                                Google ile bağlan
                            </Button>

                            <div className="relative mb-4 flex items-center justify-center" aria-hidden="true">
                                <div className="h-[3px] flex-1 bg-zinc-700" />
                                <span className="mx-3 -rotate-1 border-2 border-black bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-black shadow-[3px_3px_0_#000]">
                                    veya
                                </span>
                                <div className="h-[3px] flex-1 bg-zinc-700" />
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-3.5">
                                <AnimatePresence mode="popLayout">
                                    {isSignUp && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-3.5 overflow-hidden"
                                        >
                                            <NeoField
                                                id="username"
                                                label="Kullanıcı adı"
                                                icon={AtSign}
                                                placeholder="silginim"
                                                value={username}
                                                autoComplete="username"
                                                onChange={(value) => {
                                                    const nextValue = value.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
                                                    setUsername(nextValue);
                                                }}
                                            />

                                            <NeoField
                                                id="full-name"
                                                label="İsim"
                                                icon={User}
                                                placeholder="Ad Soyad"
                                                value={fullName}
                                                autoComplete="name"
                                                onChange={setFullName}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <NeoField
                                    id="email"
                                    label="E-posta"
                                    icon={Mail}
                                    type="email"
                                    placeholder="mail@ornek.com"
                                    value={email}
                                    autoComplete="email"
                                    onChange={setEmail}
                                />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3 px-1">
                                        <Label htmlFor="password" className="text-[12px] font-black uppercase tracking-[0.12em] text-zinc-200">
                                            Şifre
                                        </Label>
                                        {!isSignUp && (
                                            <Link
                                                href="/forgot-password"
                                                className="rounded-md text-[12px] font-black uppercase tracking-[0.08em] text-[#ffcc18] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60"
                                            >
                                                Unuttum?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" aria-hidden="true" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete={isSignUp ? "new-password" : "current-password"}
                                            className="h-14 rounded-[16px] border-[3px] border-black bg-white pl-12 pr-14 text-base font-black text-black shadow-[4px_4px_0_#000] placeholder:text-zinc-400 focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                                            className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-black bg-[#f4f4f5] text-black shadow-[2px_2px_0_#000] transition-all hover:bg-[#ffcc18] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isSignUp && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            className="rounded-[16px] border-2 border-zinc-700 bg-black/35 p-3"
                                        >
                                            <label htmlFor="terms" className="flex cursor-pointer items-start gap-3 text-xs font-bold leading-5 text-zinc-300">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    required
                                                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Lütfen şartları kabul edin.")}
                                                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#ffcc18]"
                                                />
                                                <span>
                                                    <span className="font-black text-[#ffcc18]">Kullanım şartlarını</span> okudum ve kabul ediyorum.
                                                </span>
                                            </label>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="rounded-[18px] border-[3px] border-black bg-[#252529] p-3 shadow-[4px_4px_0_#000]">
                                    <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-300">
                                        <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                                        Güvenlik kontrolü
                                    </div>
                                    <div className="flex min-h-[58px] origin-top justify-center overflow-hidden rounded-xl bg-[#101012] py-2 scale-[0.86] min-[380px]:scale-[0.92] sm:scale-100">
                                        <div
                                            className="cf-turnstile"
                                            data-sitekey="0x4AAAAAACI_a8NNCjdtVnjC"
                                            data-callback="onTurnstileSuccess"
                                            data-theme="dark"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-14 w-full rounded-[18px] border-[4px] border-black bg-[#ffcc18] text-base font-black uppercase tracking-[0.16em] text-black shadow-[6px_6px_0_#000] transition-all hover:-translate-y-0.5 hover:bg-[#ffd84d] hover:shadow-[7px_7px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-70"
                                >
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                                    ) : (
                                        <>
                                            {authModeLabel}
                                            <ArrowRight className="h-5 w-5 stroke-[3px]" aria-hidden="true" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="mx-auto rounded-full px-3 py-2 text-center text-[12px] font-black uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60"
                >
                    {isSignUp ? "Zaten hesabın var mı? Giriş yap" : "Henüz üye değil misin? Katıl"}
                </button>
            </motion.section>
        </main>
    );
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "";
}

type NeoFieldProps = {
    id: string;
    label: string;
    icon: typeof Mail;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
};

function NeoField({ id, label, icon: Icon, value, onChange, type = "text", placeholder, autoComplete }: NeoFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="px-1 text-[12px] font-black uppercase tracking-[0.12em] text-zinc-200">
                {label}
            </Label>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" aria-hidden="true" />
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="h-14 rounded-[16px] border-[3px] border-black bg-white pl-12 pr-4 text-base font-black text-black shadow-[4px_4px_0_#000] placeholder:text-zinc-400 focus-visible:ring-4 focus-visible:ring-[#ffcc18]/60"
                />
            </div>
        </div>
    );
}

function GoogleMark({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}
