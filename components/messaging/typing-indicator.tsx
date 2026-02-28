"use client";

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-2.5 px-4 py-2">
            <div className="flex items-center gap-1 bg-zinc-800/80 rounded-2xl rounded-tl-md px-5 py-3.5 border border-white/5">
                <div className="flex gap-1">
                    <span
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms", animationDuration: "1s" }}
                    />
                    <span
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms", animationDuration: "1s" }}
                    />
                    <span
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms", animationDuration: "1s" }}
                    />
                </div>
            </div>
        </div>
    );
}
