"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Atom, Sparkles, Rocket, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Mouse parallax effect for the right side
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Error logging in:', error);
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
                // Check if email exists using RPC
                const { data: emailExists } = await supabase.rpc('check_email_exists', {
                    email_to_check: email
                });

                if (emailExists) {
                    toast.error("Bu e-posta ile zaten bir hesap var, şifreni mi unuttun yoksa? 🤨");
                    setLoading(false);
                    return;
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;

                // Redirect to verification page with email
                window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = "/";
            }
        } catch (error: any) {
            console.error('Error:', error);
            if (error.message.includes("User already registered") || error.message.includes("already registered")) {
                toast.error("Bu e-posta zaten kayıtlı. Hafızanı mı tazelesek? 🧠");
            } else if (error.message.includes("Invalid login credentials")) {
                toast.error("Bilgiler yanlış. Paralel evrendeki şifreni giriyor olabilir misin? 🌌");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fun messages based on input
    const getPasswordStrengthMessage = (pass: string) => {
        if (!pass) return "";
        if (pass.length < 6) return "Bu şifre çok kısa, atom altı parçacık kadar... 🔬";
        if (pass === "123456") return "Ciddi misin? 123456 mı? 🤦‍♂️";
        if (pass.length > 12) return "Kara delik kadar güçlü bir şifre! ⚫";
        return "Güzel şifre, Einstein onaylardı. 👍";
    };

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden" onMouseMove={handleMouseMove} ref={containerRef}>
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center space-y-2">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block cursor-pointer"
                        >
                            <Logo />
                        </motion.div>
                        <h1 className="text-3xl font-bold tracking-tighter">
                            {isSignUp ? "Aramıza Katıl 🚀" : "Tekrar Hoş Geldin 👋"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isSignUp
                                ? "Evrenin sırlarını çözmeye hazır mısın?"
                                : "Kaldığımız yerden devam edelim."}
                        </p>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl border shadow-2xl rounded-2xl p-6 space-y-6 relative overflow-hidden">
                        {/* Animated gradient border effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-gradient-x pointer-events-none" />

                        <form onSubmit={handleEmailAuth} className="space-y-4 relative z-10">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="einstein@fizikhub.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-background/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-muted-foreground"
                                    >
                                        {getPasswordStrengthMessage(password)}
                                    </motion.p>
                                )}
                            </div>
                            <Button type="submit" className="w-full h-11 text-base group relative overflow-hidden" disabled={loading}>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
                                    {!loading && <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </Button>
                        </form>

                        <div className="relative z-10">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Veya
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <Button
                                variant="outline"
                                className="w-full gap-2 hover:bg-[#24292e] hover:text-white transition-colors"
                                onClick={() => handleOAuthLogin('github')}
                                disabled={loading}
                            >
                                <Github className="h-4 w-4" />
                                GitHub
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2 hover:bg-white hover:text-black hover:border-gray-300 transition-colors"
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loading}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                        </div>

                        <div className="text-center text-sm relative z-10">
                            <span className="text-muted-foreground">
                                {isSignUp ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                            </span>
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Animated Visuals */}
            <div className="hidden lg:flex w-1/2 bg-black relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black" />

                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        x: mousePosition.x * -50,
                        y: mousePosition.y * -50,
                        rotate: [0, 360],
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        default: { type: "spring", stiffness: 50, damping: 20 }
                    }}
                    className="absolute"
                >
                    <div className="relative w-96 h-96">
                        {/* Atom Core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-primary rounded-full blur-xl opacity-50 animate-pulse" />
                            <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)]" />
                        </div>

                        {/* Electron Orbits */}
                        {[0, 60, 120].map((rotation, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border border-primary/30 rounded-full"
                                style={{ rotate: rotation }}
                                animate={{ rotate: [rotation, rotation + 360] }}
                                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                        initial={{
                            x: Math.random() * 1000 - 500,
                            y: Math.random() * 1000 - 500,
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}

                {/* Text Content */}
                <div className="relative z-10 text-center space-y-4 max-w-lg p-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold text-white tracking-tight"
                    >
                        Bilimin Sınırlarını Zorla
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 text-lg"
                    >
                        "Hayal gücü bilgiden daha önemlidir. Çünkü bilgi sınırlıdır, ancak hayal gücü tüm dünyayı kapsar."
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-primary font-medium"
                    >
                        - Albert Einstein
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
