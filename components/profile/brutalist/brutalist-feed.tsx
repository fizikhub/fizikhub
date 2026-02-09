import { cn } from "@/lib/utils";
import Link from "next/link";
import { Heart, Eye, MessageCircle } from "lucide-react";
import Image from "next/image";

interface BrutalistFeedProps {
    items: any[];
}

export function BrutalistFeed({ items }: BrutalistFeedProps) {
    if (!items || items.length === 0) {
        return (
            <div className="bg-white border-[3px] border-dashed border-gray-300 rounded-xl p-8 text-center">
                <span className="text-4xl mb-3 block">📭</span>
                <p className="text-gray-500 font-bold">Henüz içerik yok</p>
            </div>
        );
    }

    // Gradient colors for cards - matching reference
    const gradients = [
        "from-[#1a1a2e] to-[#16213e]",  // Dark blue
        "from-[#0f0f1a] to-[#1a1a2e]",  // Almost black
        "from-[#2d1b4e] to-[#1a1a2e]",  // Purple dark
        "from-[#1a2e1a] to-[#0f1a0f]",  // Dark green
        "from-[#2e1a1a] to-[#1a0f0f]",  // Dark red
        "from-[#1a2e2e] to-[#0f1a1a]",  // Dark cyan
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {items.map((item, index) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group"
                >
                    <div className="bg-white border-[3px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
                        {/* Card Image/Gradient Area */}
                        <div className={cn(
                            "h-28 relative overflow-hidden bg-gradient-to-br",
                            gradients[index % gradients.length]
                        )}>
                            {item.cover_url ? (
                                <Image
                                    src={item.cover_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                // Decorative placeholder
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white/10 text-6xl font-black">
                                        {item.type === 'question' ? '?' : '📝'}
                                    </div>
                                </div>
                            )}

                            {/* Emoji reactions - like reference */}
                            <div className="absolute bottom-2 left-2 flex gap-1">
                                <span className="w-6 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center text-xs">
                                    {item.type === 'question' ? '❓' : '📖'}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3">
                            <h3 className="text-xs font-bold text-black leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {item.title}
                            </h3>

                            {/* Meta */}
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-medium">
                                <span className="flex items-center gap-0.5">
                                    <Heart className="w-3 h-3" />
                                    {item.likes_count || 0}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <Eye className="w-3 h-3" />
                                    {item.views || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
