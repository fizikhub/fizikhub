import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Çevrimdışı | Fizikhub',
    description: 'Şu anda internet bağlantınız yok. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
};

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="space-y-6 max-w-md">
                <h1 className="text-6xl font-black text-primary animate-pulse">
                    BAĞLANTI KOPTU
                </h1>
                <p className="text-xl text-muted-foreground font-medium">
                    Görünüşe göre internet bağlantınız kesilmiş. Fizikhub'a erişmek için bağlantınızı kontrol edin.
                </p>
                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-primary text-black font-bold text-lg rounded-none border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        YENİDEN DENE
                    </Link>
                </div>
            </div>
        </div>
    );
}
