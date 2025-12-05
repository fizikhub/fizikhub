"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Rocket, Eye, EyeOff, Zap, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

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
                        className="inline-block cursor-pointer"
                    >
                        <Logo />
                    </motion.div>

                    <div className="space-y-2">
                        <p className="text-muted-foreground font-medium">
                            {isSignUp ? "Laboratuvara hoş geldin çaylak." : "Tekrar hoş geldin şef."}
                        </p>
                    </div>
                </div>

                {/* Auth Card */}
                <div className="bg-card border-2 border-black dark:border-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 left-0 w-3 h-3 bg-black dark:bg-white" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-black dark:bg-white" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-black dark:bg-white" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-black dark:bg-white" />

                    <form onSubmit={handleEmailAuth} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold uppercase">E-posta</Label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="einstein@fizikhub.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 border-2 border-black dark:border-white rounded-none bg-background focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium"
                                />
                                <Zap className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-bold uppercase">Şifre</Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 border-2 border-black dark:border-white rounded-none bg-background focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-xs font-bold text-muted-foreground pt-1"
                                    >
                                        <AlertTriangle className="h-3 w-3" />
                                        {getPasswordStrengthMessage(password)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-black uppercase rounded-none bg-black dark:bg-white text-white dark:text-black hover:bg-primary hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? "KAYIT OL" : "GİRİŞ YAP"}
                                    <Rocket className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-2 border-dashed border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs font-bold uppercase">
                            <span className="bg-card px-4 text-muted-foreground">VEYA BUNLARLA GEL</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full gap-2 h-12 border-2 border-black dark:border-white rounded-none font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            onClick={() => handleOAuthLogin('github')}
                            disabled={loading}
                        >
                            <Github className="h-5 w-5" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full gap-2 h-12 border-2 border-black dark:border-white rounded-none font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="text-center text-sm font-medium mt-6">
                        <span className="text-muted-foreground">
                            {isSignUp ? "Zaten içeride misin? " : "Hala dışarıda mısın? "}
                        </span>
                        <button
                            className="font-bold text-primary hover:underline decoration-2 underline-offset-4 uppercase ml-1"
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
