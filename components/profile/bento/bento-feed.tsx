import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, MessageSquare, BookOpen, AlertCircle } from "lucide-react";

interface BentoFeedProps {
    items: any[];
}

export function BentoFeed({ items }: BentoFeedProps) {
    if (!items || items.length === 0) return (
        <div className="col-span-full border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-400">
            <BookOpen className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">Buralar hep dutluk.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group"
                >
                    <div className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">

                        {/* Status/Type Badge */}
                        <div className="px-4 pt-4 pb-2 flex justify-between items-start">
                            <div className={cn(
                                "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border border-black/5",
                                item.type === 'question' ? "bg-cyan-100 text-cyan-800" :
                                    item.type === 'draft' ? "bg-yellow-100 text-yellow-800" :
                                        "bg-pink-100 text-pink-800"
                            )}>
                                {item.type}
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                        </div>

                        {/* Title & Excerpt */}
                        <div className="px-4 pb-4 flex-1">
                            <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            {item.excerpt && (
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                                    {item.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Footer Meta */}
                        <div className="px-4 py-3 bg-gray-50 border-t-2 border-black/5 flex items-center justify-between mt-auto">
                            <span className="text-[10px] font-mono text-gray-400 font-medium">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>

                            {/* Interaction Hint */}
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 group-hover:text-black transition-colors">
                                <span>VIEW</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
