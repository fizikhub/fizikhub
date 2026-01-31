"use client";

import { Note, NOTE_COLORS } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import { Pin, Trash2, MoreHorizontal, Copy, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
    note: Note;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
    onTogglePin: () => void;
    onDuplicate: () => void;
    onColorChange: (color: Note["color"]) => void;
}

export function NoteCard({
    note,
    isActive,
    onClick,
    onDelete,
    onTogglePin,
    onDuplicate,
    onColorChange,
}: NoteCardProps) {
    const colorConfig = NOTE_COLORS[note.color];

    // Get plain text preview from content (strip HTML)
    const getPreview = (content: string) => {
        const stripped = content.replace(/<[^>]*>/g, "").trim();
        return stripped.slice(0, 100) + (stripped.length > 100 ? "..." : "");
    };

    const timeAgo = formatDistanceToNow(new Date(note.updatedAt), {
        addSuffix: true,
        locale: tr,
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className={cn(
                "relative p-3 cursor-pointer transition-all duration-200",
                "border-[2px] shadow-[3px_3px_0px_0px_#000]",
                colorConfig.bg,
                colorConfig.border,
                isActive && "ring-2 ring-blue-500 ring-offset-1",
                "hover:shadow-[4px_4px_0px_0px_#000]",
                "active:shadow-[1px_1px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]"
            )}
        >
            {/* Pin indicator */}
            {note.isPinned && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 border-[2px] border-black rounded-full flex items-center justify-center">
                    <Pin className="w-2.5 h-2.5 fill-black" />
                </div>
            )}

            {/* Title */}
            <h3 className="font-bold text-sm text-black truncate pr-6">
                {note.title || "Başlıksız Not"}
            </h3>

            {/* Preview */}
            <p className="text-xs text-neutral-600 mt-1 line-clamp-2 min-h-[32px]">
                {getPreview(note.content) || "Boş not..."}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wide">
                    {timeAgo}
                </span>

                {/* Actions menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:bg-black/5 rounded transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[160px]">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTogglePin(); }}>
                            <Pin className={cn("w-4 h-4 mr-2", note.isPinned && "fill-current")} />
                            {note.isPinned ? "Sabitlemeyi Kaldır" : "Sabitle"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                            <Copy className="w-4 h-4 mr-2" />
                            Kopyala
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                                <Palette className="w-4 h-4 mr-2" />
                                Renk
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                {Object.entries(NOTE_COLORS).map(([color, config]) => (
                                    <DropdownMenuItem
                                        key={color}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onColorChange(color as Note["color"]);
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2 border-black mr-2",
                                                config.bg
                                            )}
                                        />
                                        {config.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    );
}
