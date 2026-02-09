import { cn } from "@/lib/utils";
import Link from "next/link";
import { Heart, Eye, MessageCircle, Bookmark } from "lucide-react";

interface NIFeedProps {
    items: any[];
}

export function NIFeed({ items }: NIFeedProps) {
    if (!items || items.length === 0) return (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white/50">
            <p className="text-gray-500 font-medium">Henüz içerik yok 📭</p>
        </div>
    );

    const colors = [
        "from-purple-600 to-indigo-800",
        "from-pink-500 to-rose-600",
        "from-cyan-500 to-blue-600",
        "from-lime-500 to-green-600",
        "from-orange-500 to-red-500",
        "from-yellow-400 to-orange-500"
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {items.map((item, index) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group"
                >
                    <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
                        {/* Cover/Gradient Area */}
                        <div className={cn(
                            "h-24 bg-gradient-to-br relative overflow-hidden",
                            colors[index % colors.length]
                        )}>
                            {/* Decorative elements */}
                            <div className="absolute inset-0 opacity-60">
                                <div className="absolute top-2 right-2 text-white/50 text-xs">✦</div>
                                <div className="absolute bottom-3 left-3 text-white/50 text-sm">✧</div>
                            </div>

                            {/* Type Badge */}
                            <div className="absolute top-2 left-2">
                                <span className={cn(
                                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-black/20",
                                    item.type === 'question' ? "bg-yellow-400 text-black" :
                                        item.type === 'draft' ? "bg-gray-200 text-gray-600" : "bg-white text-black"
                                )}>
                                    {item.type === 'article' ? '📝' : item.type === 'question' ? '❓' : '📋'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                            <h3 className="text-xs font-bold text-black leading-tight line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
                                {item.title}
                            </h3>

                            {/* Meta Row */}
                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                <div className="flex items-center gap-0.5">
                                    <Heart className="w-3 h-3" />
                                    <span>{item.likes_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Eye className="w-3 h-3" />
                                    <span>{item.views || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
