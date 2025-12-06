

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2, Rocket, Eye, EyeOff, Zap, AlertTriangle, Atom, Radio, ScanLine, Fingerprint, ArrowRight } from "lucide-react";
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

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

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
        if (pass.length < 6) return "Çok kısa (Atom altı parçacık kadar)..";
        if (pass === "123456" || pass === "password") return "Bu şifreyi uzaylılar bile çözer! 👽";
        if (pass.length > 12) return "Kara delik kadar güçlü! ⚫";
        if (pass.includes("einstein")) return "Görecelik teorisi kadar karmaşık değil ama iyi! 🧠";
        return "İdare eder (Standart Model)";
    };

    // Particles
    const [particles, setParticles] = useState<{ x: number; y: number; duration: number; delay: number }[]>([]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setParticles([...Array(30)].map(() => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                duration: 3 + Math.random() * 5,
                delay: Math.random() * 5
            })));
        }
    }, []);

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black perspective-[2000px]"
            onMouseMove={onMouseMove}
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none transform perspective-[500px] rotate-x-[20deg]" />

            {/* Glowing Orbs */}
            {/* <motion.div
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"
            /> */}

            {/* Star Field */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{ x: p.x, y: p.y, opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
                    />
                ))}
            </div>

            {/* Main 3D Card Container */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Holographic Logo Header */}
                <div className="text-center mb-10 space-y-4 transform translate-z-[50px]">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex p-4 bg-black/50 backdrop-blur-md rounded-full border-2 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4"
                    >
                        <Atom className="h-10 w-10 text-primary animate-spin-slow" />
                    </motion.div>

                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase glitch-text" data-text="Fizikhub">
                            Fizikhub
                        </h1>
                        <p className="text-white/60 font-medium tracking-widest text-xs uppercase flex items-center justify-center gap-2">
                            <ScanLine className="h-3 w-3 text-primary animate-pulse" />
                            {isSignUp ? "SİSTEME KAYIT PROTOKOLÜ" : "KİMLİK DOĞRULAMA"}
                        </p>
                    </div>
                </div>

                {/* The Card */}
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group relative">
                    {/* Scanner Line Animation */}
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50 blur-sm pointer-events-none"
                    />

                    {/* Top Status Bar */}
                    <div className="bg-white/5 border-b border-white/5 p-3 flex justify-between items-center px-6">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                            SECURE_CONNECTION_V2.0
                        </div>
                    </div>

                    <div className="p-8 relative z-20">
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isSignUp ? "signup" : "signin"}
                                initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleEmailAuth}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2 group">
                                        <Label htmlFor="email" className="text-xs font-bold uppercase text-white/50 tracking-wider group-focus-within:text-primary transition-colors">
                                            E-posta Adresi
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="ornek@fizikhub.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-14 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all font-medium pl-12"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-focus-within:text-primary group-focus-within:bg-primary/10 transition-colors">
                                                <Fingerprint className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="password" className="text-xs font-bold uppercase text-white/50 tracking-wider group-focus-within:text-primary transition-colors">
                                                Şifre
                                            </Label>
                                            {!isSignUp && (
                                                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-white/40 hover:text-white">
                                                    Unuttun mu?
                                                </Button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-14 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all font-medium pl-12 pr-12"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-focus-within:text-primary group-focus-within:bg-primary/10 transition-colors">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {isSignUp && password && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="flex items-center gap-2 text-xs font-medium text-primary/80 pt-1 px-1"
                                            >
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex-1">
                                                    <div
                                                        className={cn("h-full transition-all duration-300",
                                                            password.length > 8 ? "bg-green-500 w-full" :
                                                                password.length > 5 ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"
                                                        )}
                                                    />
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wider">{getPasswordStrengthMessage(password)}</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-base font-bold uppercase rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/20 relative overflow-hidden group/btn"
                                    disabled={loading}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isSignUp ? "Hesap Oluştur" : "Sisteme Gir"}
                                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                </Button>
                            </motion.form>
                        </AnimatePresence>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="bg-black px-4 text-white/30">VEYA</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="w-full gap-2 h-12 border-white/10 rounded-xl bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all font-bold group"
                                onClick={() => handleOAuthLogin('github')}
                                disabled={loading}
                            >
                                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                GitHub
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2 h-12 border-white/10 rounded-xl bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all font-bold group"
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </Button>
                        </div>

                        {/* Toggle */}
                        <motion.div
                            layout
                            className="mt-8 pt-6 border-t border-white/10 text-center"
                        >
                            <p className="text-sm text-white/40 mb-3">
                                {isSignUp ? "Zaten bir hesabın var mı?" : "Henüz aramızda değil misin?"}
                            </p>
                            <Button
                                variant="ghost"
                                className="w-full border border-white/10 hover:bg-white/5 hover:text-primary transition-all text-white/70"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? "Giriş Ekranına Dön" : "Yeni Hesap Oluştur"}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
