import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, FileText, HelpCircle, File } from "lucide-react";

interface BlueprintFeedProps {
    items: any[];
}

export function BlueprintFeed({ items }: BlueprintFeedProps) {
    if (!items || items.length === 0) return (
        <div className="p-8 border-2 border-dashed border-gray-300 m-4 flex items-center justify-center font-mono text-xs text-gray-400">
            [NULL_DATA SET]
        </div>
    );

    return (
        <div className="flex flex-col border-b-2 border-black">
            {items.map((item, index) => (
                <Link
                    key={item.id}
                    href={item.type === 'question' ? `/forum/${item.slug}` : `/makale/${item.slug}`}
                    className="group"
                >
                    <div className="border-b border-black last:border-b-0 flex min-h-[80px] hover:bg-neo-vibrant-lime/10 transition-colors">
                        {/* Index Column */}
                        <div className="w-12 border-r border-black flex items-center justify-center bg-gray-50 font-mono text-[10px] text-gray-400 group-hover:text-black group-hover:font-bold">
                            {String(index + 1).padStart(3, '0')}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 p-3 flex flex-col justify-center relative overflow-hidden">
                            {/* Type Icon (Watermark style) */}
                            <div className="absolute right-2 bottom-2 text-gray-100 group-hover:text-black/5 transition-colors pointer-events-none">
                                {item.type === 'article' ? <FileText size={48} /> : item.type === 'question' ? <HelpCircle size={48} /> : <File size={48} />}
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                    "text-[9px] font-mono px-1 border border-black uppercase",
                                    item.type === 'question' ? "bg-neo-vibrant-cyan/20" : "bg-neo-vibrant-pink/20"
                                )}>
                                    {item.type}
                                </span>
                                <span className="text-[9px] font-mono text-gray-400">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-sm font-bold font-mono leading-tight group-hover:translate-x-1 transition-transform">
                                {item.title}
                            </h3>
                        </div>

                        {/* Arrow Column */}
                        <div className="w-10 border-l border-black flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
