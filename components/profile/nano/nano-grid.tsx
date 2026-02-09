import { cn } from "@/lib/utils";

interface NanoGridProps {
    items: any[];
}

export function NanoGrid({ items }: NanoGridProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-[1px] bg-black border-b border-black">
            {items.map((item) => (
                <div key={item.id} className="relative aspect-square bg-white group cursor-pointer hover:opacity-90">
                    {/* Image or Text Placeholder */}
                    {item.cover_url ? (
                        <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className={cn(
                            "w-full h-full p-2 flex items-center justify-center text-center bg-gray-50",
                            item.type === 'question' && "bg-cyan-50"
                        )}>
                            <p className="text-[8px] font-bold leading-tight line-clamp-4 text-gray-800 break-words">
                                {item.title}
                            </p>
                        </div>
                    )}

                    {/* Type Indicator (Tiny corner triangle) */}
                    <div className={cn(
                        "absolute top-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px]",
                        item.type === 'question' ? "border-t-neo-vibrant-cyan" : "border-t-neo-vibrant-pink"
                    )} />

                    {/* Stats Overlay (On Hover only) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-bold text-white">
                            {item.views || 0} 👀
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
