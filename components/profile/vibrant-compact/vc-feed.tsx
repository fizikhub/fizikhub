import { cn } from "@/lib/utils";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";

interface VCFeedProps {
    items: any[];
}

export function VCFeed({ items }: VCFeedProps) {
    if (!items || items.length === 0) return (
        <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌱</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Henüz içerik yok.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-3 px-4 pb-20">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group"
                >
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        {/* Cover Image Area */}
                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                            {item.cover_url ? (
                                <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className={cn(
                                    "w-full h-full flex items-center justify-center bg-gradient-to-br",
                                    item.type === 'question' ? "from-blue-50 to-cyan-50" : "from-pink-50 to-orange-50"
                                )}>
                                    <span className="text-2xl opacity-50">
                                        {item.type === 'question' ? '❓' : '📝'}
                                    </span>
                                </div>
                            )}

                            {/* Type Badge */}
                            <div className="absolute top-2 left-2">
                                <span className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm",
                                    item.type === 'question' ? "bg-cyan-100 text-cyan-800" : "bg-pink-100 text-pink-800"
                                )}>
                                    {item.type === 'article' ? 'YAZI' : item.type === 'question' ? 'SORU' : 'TASLAK'}
                                </span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-3">
                            <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>

                            {/* Meta Metrics */}
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                <div className="flex items-center gap-0.5">
                                    <Eye className="w-3 h-3" />
                                    {item.views || 0}
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Heart className="w-3 h-3" />
                                    {item.likes_count || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
