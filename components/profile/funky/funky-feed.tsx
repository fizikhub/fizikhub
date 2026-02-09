import { cn } from "@/lib/utils";

interface FunkyFeedProps {
    items: any[];
}

export function FunkyFeed({ items }: FunkyFeedProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-4 px-4 w-full max-w-md mx-auto pb-24">
            {items.map((item, i) => (
                <div key={item.id} className="aspect-square bg-gray-100 rounded-2xl border-2 border-black overflow-hidden relative group cursor-pointer shadow-[3px_3px_0_black] hover:shadow-[5px_5px_0_#C6F956] transition-all">
                    {/* Placeholder for content/image if cover_url exists, else abstract pattern */}
                    {item.cover_url ? (
                        <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className={cn("w-full h-full p-4 flex flex-col justify-end",
                            i % 3 === 0 ? "bg-purple-100" : i % 3 === 1 ? "bg-yellow-100" : "bg-pink-100"
                        )}>
                            <h3 className="text-xs font-black line-clamp-3 text-black">{item.title}</h3>
                        </div>
                    )}

                    {/* Like/Save overlay */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded-lg backdrop-blur-sm border border-black/10">
                        <span className="text-[10px] font-bold">❤️ {item.likes_count || 0}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
