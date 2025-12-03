import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background -z-10" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000 -z-10" />

            <div className="space-y-6 max-w-md mx-auto relative z-10">
                <div className="relative">
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 select-none">
                        404
                    </h1>
                    <div className="absolute -top-8 -right-8 text-6xl animate-bounce delay-700">
                        🛸
                    </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Uzay Boşluğunda Kayboldun!
                </h2>

                <p className="text-muted-foreground text-lg">
                    Aradığın sayfa bir kara deliğe düşmüş olabilir veya hiç var olmamış olabilir.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild size="lg" className="gap-2 rounded-full">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Ana Sayfaya Dön
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2 rounded-full">
                        <Link href="/kesfet">
                            <ArrowLeft className="h-4 w-4" />
                            Geri Git
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
