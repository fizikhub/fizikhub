"use client";

import { useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Rocket, ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("E-posta adresi bulunamadı.");
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtp(email, code);

            if (result.success) {
                toast.success("E-posta doğrulandı! Hoş geldin.");
                router.push("/onboarding");
            } else {
                toast.error(result.error || "Doğrulama başarısız. Kod yanlış veya süresi dolmuş.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;

        setResending(true);
        try {
            const result = await resendOtp(email);
            if (result.success) {
                toast.success("Yeni kod gönderildi.");
            } else {
                toast.error(result.error || "Kod gönderilemedi.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Geçersiz istek. Lütfen giriş sayfasına dönün.</p>
                    <Button variant="link" onClick={() => router.push("/login")}>Giriş Yap</Button>
                </div>
            </div>
        );
    }

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

            {/* Floating orbs */}
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="inline-block cursor-pointer"
                    >
                        <Logo />
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        E-posta Doğrulama
                    </motion.h1>

                    <motion.div
                        className="flex items-center justify-center text-muted-foreground text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <span>{email}</span>
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

                    <div className="text-center space-y-2 relative z-10">
                        <p className="text-sm text-muted-foreground">
                            E-posta adresine gönderdiğimiz doğrulama kodunu gir.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <Label htmlFor="code" className="sr-only">Doğrulama Kodu</Label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="KODU GİR"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-background/50 border-primary/20 focus:border-primary/50 transition-all uppercase"
                                maxLength={6}
                                required
                            />
                        </div>

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
                                Doğrula
                                {!loading && <Rocket className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </span>
                        </Button>
                    </form>

                    <div className="text-center space-y-4 relative z-10">
                        <div className="text-sm text-muted-foreground">
                            Kod gelmedi mi?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                                onClick={handleResend}
                                disabled={resending}
                            >
                                {resending ? "Gönderiliyor..." : "Tekrar Gönder"}
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => router.push("/login")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Giriş'e Dön
                        </Button>
                    </div>
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
                    Bilim doğruluk ister ✨
                </motion.p>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
