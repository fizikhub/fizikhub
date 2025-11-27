import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
                <AlertTriangle className="h-24 w-24 text-red-500 relative z-10" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                FUCK GALILEO
            </h1>

            <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
                Sıçtık sanırım. Ya da bu sayfayı yapmayı unuttum. Bana ulaş yavrum ve sorunu bildir.



            </p>

            <div className="flex gap-4">
                <Link href="/">
                    <Button size="lg" variant="default">
                        Anana Geri Dön Yani Ana Sayfa
                    </Button>
                </Link>
                <Link href="/forum">
                    <Button size="lg" variant="outline">
                        Bunu Forumda Şikayet Et
                    </Button>
                </Link>
            </div>
        </div>
    );
}
