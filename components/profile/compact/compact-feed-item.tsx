import { cn } from "@/lib/utils";

interface CompactFeedItemProps {
    item: any;
    type: "article" | "question" | "draft";
}

export function CompactFeedItem({ item, type }: CompactFeedItemProps) {
    const typeColor = {
        article: "bg-neo-vibrant-pink",
        question: "bg-neo-vibrant-cyan",
        draft: "bg-gray-300"
    }[type];

    return (
        <div className="group relative flex items-start gap-3 p-3 bg-white border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
            {/* Type Indicator */}
            <div className={cn("mt-1 w-2 h-2 rounded-full flex-shrink-0", typeColor)} />

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-black font-heading leading-tight truncate pr-2 group-hover:text-neo-vibrant-cyan transition-colors">
                        {item.title}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}
                    </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                    {item.excerpt || item.content?.substring(0, 80)}
                </p>
            </div>

            {/* Action (Hidden by default, visible on hover/tap) */}
            <div className="hidden group-hover:flex items-center self-center pl-2">
                <button className="text-[10px] font-bold uppercase border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors">
                    Git
                </button>
            </div>
        </div>
    );
}
