import Link from "next/link";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "İçerik Oluştur | Fizikhub",
    description: "Bilim dünyasına katkıda bulun. Makale yaz, soru sor veya deney paylaş.",
};

const creationOptions = [
    {
        title: "Makale Yaz",
        description: "Bilimsel bir konuyu derinlemesine ele al.",
        href: "/makale/yeni",
        icon: FileText,
        color: "bg-pink-500",
        delay: "delay-0",
    },
    {
        title: "Soru Sor",
        description: "Aklına takılanları topluluğa sor.",
        href: "/forum", // Redirects to forum where they can ask
        icon: MessageCircle,
        color: "bg-yellow-400",
        delay: "delay-75",
    },
    {
        title: "Deney Paylaş",
        description: "Yaptığın deneyleri ve sonuçları paylaş.",
        href: "/deney/yeni", // Assuming this route or similar exists, fallback to writer guide if not
        icon: FlaskConical,
        color: "bg-green-500",
        delay: "delay-150",
    },
    {
        title: "Kitap İncele",
        description: "Okuduğun bilim kitaplarını değerlendir.",
        href: "/kitap-inceleme/yeni",
        icon: Library,
        color: "bg-blue-500",
        delay: "delay-200",
    },
    {
        title: "Terim Ekle",
        description: "Bilim sözlüğüne yeni bir terim kazandır.",
        href: "/sozluk", // Usually directs to dict page where 'add' might be
        icon: BookOpen,
        color: "bg-orange-500",
        delay: "delay-300",
    }
];

export default function ContentHubPage() {
    return (
        <div className="min-h-screen bg-[#050505] pb-24 pt-24 px-4 md:px-8 relative overflow-hidden">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-2xl mx-auto relative z-10">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-white border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                        <Sparkles className="w-8 h-8 text-black fill-yellow-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                        NE PAYLAŞMAK İSTERSİN?
                    </h1>
                    <p className="text-neutral-400 text-lg font-medium">
                        Bilim dünyasına katkıda bulunmak için bir kategori seç.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creationOptions.map((option) => (
                        <Link
                            key={option.title}
                            href={option.href}
                            className="group relative"
                        >
                            <div className={cn(
                                "flex items-center gap-4 p-5 rounded-2xl border-2 border-white/20 bg-[#111] hover:bg-[#161616] transition-all duration-300",
                                "hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#ffffff]",
                                "group-active:translate-y-0 group-active:shadow-none"
                            )}>
                                <div className={cn(
                                    "w-14 h-14 flex items-center justify-center rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                    option.color
                                )}>
                                    <option.icon className="w-7 h-7 text-black stroke-[2.5px]" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                                        {option.title}
                                    </h3>
                                    <p className="text-xs text-neutral-400 font-medium leading-tight">
                                        {option.description}
                                    </p>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2">
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
