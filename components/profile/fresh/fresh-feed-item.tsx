import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface FreshFeedItemProps {
    item: any;
    type: "article" | "question" | "draft";
}

export function FreshFeedItem({ item, type }: FreshFeedItemProps) {
    const typeConfigs = {
        article: { label: "Makale", color: "bg-neo-vibrant-pink", text: "text-neo-vibrant-pink" },
        question: { label: "Soru", color: "bg-neo-vibrant-cyan", text: "text-neo-vibrant-cyan" },
        draft: { label: "Taslak", color: "bg-gray-400", text: "text-gray-500" }
    };

    const config = typeConfigs[type];

    return (
        <div className="group relative bg-white p-4 rounded-xl border border-gray-100 hover:border-black/10 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
            {/* Color Accent Pill */}
            <div className={cn("absolute top-4 right-4 w-2 h-2 rounded-full", config.color)} />

            <div className="mb-2">
                <span className={cn("text-[10px] font-black uppercase tracking-widest", config.text)}>
                    {config.label}
                </span>
                <span className="text-[10px] text-gray-300 ml-2">• {new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
            </div>

            <h3 className="text-base font-black font-heading leading-tight mb-2 pr-4 group-hover:text-black transition-colors line-clamp-2">
                {item.title}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                {item.excerpt || item.content?.substring(0, 80) + "..."}
            </p>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-gray-400">Daha fazlası</span>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
}
