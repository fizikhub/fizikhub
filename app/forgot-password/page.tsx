"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { sendPasswordResetEmail } from "./actions";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    // Stars
    const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; delay: number }[]>([]);

    useEffect(() => {
        const newStars = [];
        for (let i = 0; i < 100; i++) {
            newStars.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                delay: Math.random() * 5,
            });
        }
        setStars(newStars);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await sendPasswordResetEmail(email);

        if (result.success) {
            setSent(true);
            toast.success("Şifre sıfırlama linki gönderildi!");
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Stars */}
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
                        }}
                        animate={{
                            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Back Link */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Giriş Sayfası
                </Link>

                {/* Card */}
                <div className="bg-zinc-950 border-2 border-white/10 p-8 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -translate-x-px -translate-y-px" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary translate-x-px -translate-y-px" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -translate-x-px translate-y-px" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary translate-x-px translate-y-px" />

                    {!sent ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 mx-auto bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                                    Şifreni Sıfırla
                                </h1>
                                <p className="text-white/40 text-sm mt-2">
                                    E-posta adresini gir, link gönderelim.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/50">
                                        E-posta
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 bg-black border-2 border-white/20 text-white placeholder:text-white/20 focus:border-primary rounded-none transition-all"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-wide rounded-none border-2 border-primary hover:border-white transition-all group"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Link Gönder
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase mb-2">
                                E-posta Gönderildi
                            </h2>
                            <p className="text-white/40 text-sm mb-6">
                                <span className="text-primary font-bold">{email}</span> adresine şifre sıfırlama linki gönderdik.
                            </p>

                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase transition-all"
                                >
                                    Giriş Sayfasına Dön
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
