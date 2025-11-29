"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

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
                toast.success("E-posta doğrulandı!");
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
            <div className="text-center">
                <p>Geçersiz istek. Lütfen giriş sayfasına dönün.</p>
                <Button variant="link" onClick={() => router.push("/login")}>Giriş Yap</Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md border-primary/20 shadow-2xl">
            <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <CardTitle className="text-2xl font-bold">E-posta Doğrulama</CardTitle>
                <CardDescription>
                    {email} adresine gönderilen doğrulama kodunu girin.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4">
                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Doğrulama Kodu</Label>
                        <Input
                            id="code"
                            type="text"
                            placeholder="12345678"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="text-center text-2xl tracking-widest"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Doğrula
                    </Button>
                </form>
                <div className="text-center text-sm text-muted-foreground">
                    Kod gelmedi mi?{" "}
                    <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={handleResend}
                        disabled={resending}
                    >
                        {resending ? "Gönderiliyor..." : "Tekrar Gönder"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
