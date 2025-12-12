"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Eye, EyeOff, Zap, AlertTriangle, Atom, Radio } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ModernLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [supabase] = useState(() => createClient());

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
                toast.error("Valla bu e-postayı bulamadık. Yüksek ihtimalle yanlış girdin. Ya da paralel evrende kaldı.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthMessage = (pass: string) => {
        if (!pass) return "";
        if (pass.length < 6) return "Şifren çok kısa hocam..";
        if (pass === "123456" || pass === "password") return "Ciddi misin? Bu şifreyi havada kırıyorlar! 🤦‍♂️";
        if (pass.length > 12) return "Kara delik kadar güçlü bir şifre! ⚫";
        if (pass.includes("einstein")) return "Einstein şifreni mi kıracak sanıyorsun? 😄";
        return "Uzun şifre afferin";
    };

    // Space Background Logic
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number }[]>([]);
    const [shootingStar, setShootingStar] = useState<{ x: number; y: number; delay: number; angle: number } | null>(null);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            const count = 200;

            for (let i = 0; i < count; i++) {
                newStars.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.8 + 0.2,
                    duration: Math.random() * 3 + 2,
                });
            }
            setStars(newStars);
        };
        generateStars();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setShootingStar({
                x: Math.random() * 100,
                y: Math.random() * 50,
                delay: 0,
                angle: 45
            });
            setTimeout(() => setShootingStar(null), 1500);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Space Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                        }}
                        animate={{
                            opacity: [star.opacity, star.opacity * 1.5, star.opacity],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
                {shootingStar && (
                    <motion.div
                        initial={{ top: `${shootingStar.y}%`, left: `${shootingStar.x}%`, opacity: 0, transform: `rotate(${shootingStar.angle}deg) scale(0.5) translateX(0)` }}
                        animate={{ opacity: [0, 1, 1, 0], transform: `rotate(${shootingStar.angle}deg) scale(1) translateX(300px)` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute z-0 pointer-events-none w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                    />
                )}
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Slogan Header */}
                <div className="text-center mb-8 space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-block cursor-pointer bg-black p-4 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    >
                        <Logo />
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] stroke-black">
                            {isSignUp ? "ARAMIZA KATIL" : "GÖREVE DÖN"}
                        </h1>
                    </div>
                </div>

                {/* Brutalist Card */}
                <div className="bg-black border-4 border-white p-6 md:p-10 shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden group">

                    <form onSubmit={handleEmailAuth} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-black uppercase text-white tracking-wider">
                                E-posta
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ORNEK@FIZIKHUB.COM"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-14 border-2 border-white rounded-none bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:bg-white focus-visible:text-black focus-visible:placeholder:text-gray-400 transition-all font-bold text-lg p-4"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-base font-black uppercase text-white tracking-wider">
                                Şifre
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-14 border-2 border-white rounded-none bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:bg-white focus-visible:text-black transition-all font-bold text-lg p-4 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-xs font-bold text-primary pt-2 uppercase tracking-wide"
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        {getPasswordStrengthMessage(password)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 text-xl font-black uppercase rounded-none bg-white text-black hover:bg-primary hover:text-white hover:border-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-2 border-transparent shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-3">
                                    {isSignUp ? "KAYIT OL" : "GİRİŞ YAP"}
                                    <Rocket className="h-6 w-6" />
                                </span>
                            )}
                        </Button>

                        {/* Forgot Password Link */}
                        {!isSignUp && (
                            <div className="text-center mt-4">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gray-400 hover:text-primary transition-colors uppercase tracking-wider font-bold underline decoration-2 underline-offset-4"
                                >
                                    Şifremi Unuttum
                                </Link>
                            </div>
                        )}
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-2 border-white/20" />
                        </div>
                        <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
                            <span className="bg-black px-4 text-white">VEYA</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <Button
                            variant="outline"
                            className="w-full gap-2 h-14 border-2 border-white rounded-none bg-transparent text-white hover:bg-white hover:text-black transition-all font-black uppercase"
                            onClick={() => handleOAuthLogin('github')}
                            disabled={loading}
                        >
                            <Github className="h-6 w-6" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full gap-2 h-14 border-2 border-white rounded-none bg-transparent text-white hover:bg-white hover:text-black transition-all font-black uppercase"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="text-center text-sm font-bold mt-8 relative z-10">
                        <span className="text-gray-400">
                            {isSignUp ? "Zaten bir hesabın var mı?" : "Henüz hesabın yok mu?"}
                        </span>
                        <button
                            className="font-black text-white hover:text-primary underline decoration-2 underline-offset-4 uppercase ml-2 transition-colors"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
