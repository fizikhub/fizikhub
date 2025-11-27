"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search, FileText, MessageCircle, User, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchGlobal, type SearchResult } from "@/app/search/actions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming this exists or I'll implement simple debounce

export function CommandPalette({
    isOpen: externalIsOpen,
    onClose: externalOnClose
}: {
    isOpen?: boolean;
    onClose?: () => void;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    // Toggle with Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Handle external control
    React.useEffect(() => {
        if (externalIsOpen !== undefined) {
            setIsOpen(externalIsOpen);
        }
    }, [externalIsOpen]);

    const handleClose = () => {
        setIsOpen(false);
        externalOnClose?.();
    };

    // Search logic
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchGlobal(query);
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (url: string) => {
        router.push(url);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 overflow-hidden shadow-2xl max-w-2xl">
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            placeholder="Evrende ne arıyorsun? (örn: Karadelik, Newton...)"
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            value={query}
                            onValueChange={setQuery}
                        />
                    </div>
                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <Command.Empty className="py-6 text-center text-sm">
                            {loading ? (
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Aranıyor...
                                </div>
                            ) : (
                                query.length < 2 ? "Aramaya başlamak için yaz..." : "Sonuç bulunamadı."
                            )}
                        </Command.Empty>

                        {results.length > 0 && (
                            <>
                                <Command.Group heading="Sonuçlar">
                                    {results.map((result) => (
                                        <Command.Item
                                            key={`${result.type}-${result.id}`}
                                            value={`${result.title} ${result.description}`}
                                            onSelect={() => handleSelect(result.url)}
                                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        >
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full mr-3",
                                                result.type === 'question' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20",
                                                result.type === 'article' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                                                result.type === 'user' && "bg-green-100 text-green-600 dark:bg-green-900/20",
                                            )}>
                                                {result.type === 'question' && <MessageCircle className="h-4 w-4" />}
                                                {result.type === 'article' && <FileText className="h-4 w-4" />}
                                                {result.type === 'user' && <User className="h-4 w-4" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{result.title}</span>
                                                {result.description && (
                                                    <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                        {result.description}
                                                    </span>
                                                )}
                                            </div>
                                            <ArrowRight className="ml-auto h-4 w-4 opacity-0 aria-selected:opacity-100" />
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            </>
                        )}
                    </Command.List>
                    <div className="border-t px-4 py-2 text-xs text-muted-foreground flex justify-between items-center bg-muted/20">
                        <span><strong>Cmd+K</strong> ile aç</span>
                        <span>Fizikhub Global Search</span>
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
