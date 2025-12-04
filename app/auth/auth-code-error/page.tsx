import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">Oturum Açma Hatası</h1>
            <p className="mb-8 text-muted-foreground max-w-[400px]">
                Oturum açma işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.
            </p>
            <Button asChild>
                <Link href="/login">Giriş Sayfasına Dön</Link>
            </Button>
        </div>
    );
}
