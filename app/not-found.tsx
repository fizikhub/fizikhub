import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                {/* Animated 404 */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-black opacity-10 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Physics themed illustration */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            <div className="absolute inset-0 border-4 border-dashed border-primary rounded-full animate-spin-slow" />
                            <div className="absolute inset-4 border-4 border-dashed border-primary/60 rounded-full animate-spin-reverse" />
                            <div className="absolute inset-8 flex items-center justify-center">
                                <span className="text-4xl">🔬</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Sayfa Bulunamadı</h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Aradığınız sayfa başka bir evrende olabilir... veya hiç var olmamış olabilir! 🌌
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/">
                        <Button size="lg" className="gap-2 group">
                            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                    <Link href="/forum">
                        <Button variant="outline" size="lg" className="gap-2 group">
                            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            Forumu Keşfet
                        </Button>
                    </Link>
                </div>

                {/* Quick links */}
                <div className="pt-8 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-4">Popüler Sayfalar:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Link href="/blog">
                            <Button variant="ghost" size="sm">Makaleler</Button>
                        </Link>
                        <Link href="/sozluk">
                            <Button variant="ghost" size="sm">Sözlük</Button>
                        </Link>
                        <Link href="/puanlar-nedir">
                            <Button variant="ghost" size="sm">Hub Puanları</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
