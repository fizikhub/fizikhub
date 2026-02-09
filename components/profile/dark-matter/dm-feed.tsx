import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface DMFeedProps {
    items: any[];
}

export function DMFeed({ items }: DMFeedProps) {
    if (!items || items.length === 0) return (
        <div className="py-20 text-center border border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-gray-500 font-light">Void detected. No data found.</p>
        </div>
    );

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group block"
                >
                    <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:bg-[#141414]">
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

                        <div className="flex p-4">
                            {/* Accent Bar */}
                            <div className={cn(
                                "w-1 h-12 rounded-full mr-4 self-center shrink-0",
                                item.type === 'question' ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                            )} />

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
                                        {item.type}
                                    </span>
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate pr-4">
                                    {item.title}
                                </h3>
                                {item.excerpt && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 font-light opacity-60">
                                        {item.excerpt}
                                    </p>
                                )}
                            </div>

                            <div className="ml-2 self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                <ArrowUpRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
