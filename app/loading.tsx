export default function Loading() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
            <div className="relative flex flex-col items-center gap-4">
                {/* Atom Animation */}
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-primary/30 border-t-primary" />
                    <div className="absolute inset-2 animate-spin-reverse-slower rounded-full border-2 border-primary/30 border-b-primary" />
                    <div className="absolute inset-[35%] rounded-full bg-primary animate-pulse" />
                </div>

                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    Veriler ışık hızında yükleniyor...
                </p>
            </div>
        </div>
    );
}
