import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NBFeedProps {
    items: any[];
}

export function NBFeed({ items }: NBFeedProps) {
    if (!items || items.length === 0) return (
        <div className="border-4 border-dashed border-black p-8 text-center bg-gray-50">
            <p className="font-bold text-gray-500 uppercase">Henüz içerik yok</p>
        </div>
    );

    const colors = [
        "bg-neo-vibrant-pink",
        "bg-neo-vibrant-cyan",
        "bg-neo-vibrant-lime",
        "bg-neo-vibrant-yellow"
    ];

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group block"
                >
                    <div className="bg-white border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex">
                            {/* Color Accent Bar */}
                            <div className={cn("w-3 shrink-0", colors[index % colors.length])} />

                            {/* Content */}
                            <div className="flex-1 p-4">
                                {/* Category Chip */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-2 py-1 border-2 border-black",
                                        item.type === 'question' ? "bg-neo-vibrant-cyan" :
                                            item.type === 'draft' ? "bg-gray-200" : "bg-neo-vibrant-pink"
                                    )}>
                                        {item.type === 'article' ? 'YAZI' : item.type === 'question' ? 'SORU' : 'TASLAK'}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400">
                                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-black text-black leading-tight group-hover:underline decoration-4 underline-offset-2">
                                    {item.title}
                                </h3>

                                {item.excerpt && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-1 font-medium">
                                        {item.excerpt}
                                    </p>
                                )}
                            </div>

                            {/* Arrow */}
                            <div className="flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
