"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border-4 border-black p-8 rounded-xl shadow-[8px_8px_0_0_#000] text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-rose-500 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] mb-6">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
              Sistem Çöktü
            </h1>
            
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Uzay-zaman sürekliliğinde bir anomali tespit edildi. Beklenmedik bir hata oluştu.
            </p>

            <div className="bg-zinc-100 dark:bg-zinc-900 border-2 border-black rounded p-4 text-left overflow-x-auto text-sm font-mono text-rose-600 dark:text-rose-400">
              <p className="font-bold border-b border-rose-500/20 pb-1 mb-2">Hata Detayı:</p>
              <p>{process.env.NODE_ENV === 'development' ? (error.message || "Bilinmeyen kritik hata") : "Beklenmeyen bir sistem hatası oluştu."}</p>
              {error.digest && <p className="mt-1 text-rose-400/70 text-xs">Digest: {error.digest}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={() => reset()} 
                variant="default"
                size="lg"
                className="gap-2 font-bold"
              >
                <RefreshCcw className="w-5 h-5" />
                Tekrar Dene
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="gap-2 font-bold"
              >
                <Link href="/">
                  <Home className="w-5 h-5" />
                  Ana Sayfa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
