"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Rocket, Eye, EyeOff, Sparkles, Zap, Star } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";

export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [displayText, setDisplayText] = useState("");
    const [kursorBlink, setKursorBlink] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const quotes = [
        "Evrenin sırlarını keşfet",
        "Bilim yolculuğuna başla",
        "Kuantum dünyasına dalış",
        "Fizik keyifle öğrenilir",
    ];

    // Typewriter effect
    useEffect(() => {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        let index = 0;
        const timer = setInterval(() => {
            if (index <= quote.length) {
                setDisplayText(quote.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);

        const blinkTimer = setInterval(() => {
            setKursorBlink(prev => !prev);
        }, 500);

        return () => {
            clearInterval(timer);
            clearInterval(blinkTimer);
        };
    }, [isSignUp]);

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

    const getPasswordStrengthMessage = (pass: string) => {
        if (!pass) return "";
        if (pass.length < 6) return "Bu şifre çok kısa, atom altı parçacık kadar... 🔬 Şifren çok kısa hocam..";
        if (pass === "123456" || pass === "password") return "Ciddi misin? Bu şifreyi havada kırıyorlar! 🤦‍♂️";
        if (pass.length > 12) return "Kara delik kadar güçlü bir şifre! ⚫";
        if (pass.includes("einstein")) return "Einstein şifreni mi kıracak sanıyorsun? 😄";
        return "Uzun şifre afferin";
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            ref={containerRef}
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 animate-gradient" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px]" />

            {/* Floating orbs - desktop only for performance */}
            <div className="absolute inset-0 overflow-hidden hidden lg:block">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        x: mousePosition.x * 100,
                        y: mousePosition.y * 100,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                        default: { type: "spring", stiffness: 30, damping: 20 }
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        x: mousePosition.x * -80,
                        y: mousePosition.y * -80,
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                        default: { type: "spring", stiffness: 30, damping: 20 }
                    }}
                />
            </div>

            {/* Floating particles - reduced on mobile */}
            {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    }}
                    animate={{
                        y: [null, -100, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                        x: [null, Math.random() * 100 - 50, null],
                        opacity: [0, 1, 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header with typewriter */}
                <div className="text-center mb-8 space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="inline-block cursor-pointer"
                    >
                        <Logo />
                    </motion.div>

                    <motion.h1
                        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {isSignUp ? "Aramıza Katıl 🚀" : "Hoş Geldin 👋"}
                    </motion.h1>

                    <motion.div
                        className="h-8 flex items-center justify-center text-muted-foreground text-sm md:text-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
                        <span>{displayText}</span>
                        <span className={`ml-1 ${kursorBlink ? 'opacity-100' : 'opacity-0'}`}>|</span>
                    </motion.div>
                </div>

                {/* Glass card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-card/40 backdrop-blur-2xl border border-primary/20 shadow-2xl rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden"
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />

                    {/* Corner decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-full blur-2xl" />

                    <form onSubmit={handleEmailAuth} className="space-y-4 relative z-10">
                        <motion.div
                            className="space-y-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Label htmlFor="email" className="text-sm font-medium">E-posta</Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="einstein@fizikhub.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all h-11 group-hover:border-primary/30"
                                />
                                <Zap className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Label htmlFor="password" className="text-sm font-medium">Şifre</Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all h-11 pr-10"
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-xs text-muted-foreground pl-1"
                                    >
                                        {getPasswordStrengthMessage(password)}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-medium group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg shadow-primary/25"
                                disabled={loading}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
                                    {!loading && <Rocket className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </span>
                            </Button>
                        </motion.div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-primary/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-3 text-muted-foreground">veya</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outline"
                                className="w-full gap-2 h-11 border-primary/20 hover:bg-[#24292e] hover:text-white hover:border-[#24292e] transition-all"
                                onClick={() => handleOAuthLogin('github')}
                                disabled={loading}
                            >
                                <Github className="h-4 w-4" />
                                <span className="hidden sm:inline">GitHub</span>
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outline"
                                className="w-full gap-2 h-11 border-primary/20 hover:bg-white hover:text-black hover:border-gray-300 transition-all"
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loading}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="hidden sm:inline">Google</span>
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-center text-sm pt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <span className="text-muted-foreground">
                            {isSignUp ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                        </span>
                        <Button
                            variant="link"
                            className="p-0 h-auto font-semibold text-primary hover:text-primary/80 transition-colors"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Footer easter egg */}
                <motion.p
                    className="text-center text-xs text-muted-foreground mt-6 opacity-50 hover:opacity-100 transition-opacity cursor-default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Star className="inline h-3 w-3 mr-1" />
                    Made with quantum entanglement ✨
                </motion.p>
            </motion.div>
        </div>
    );
}
