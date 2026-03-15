"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check } from "lucide-react";

// Lazy-load mermaid only client-side
let mermaidInstance: any = null;
let mermaidInitialized = false;

async function getMermaid() {
    if (mermaidInstance) return mermaidInstance;
    const mod = await import("mermaid");
    mermaidInstance = mod.default;
    if (!mermaidInitialized) {
        mermaidInstance.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "inherit",
        });
        mermaidInitialized = true;
    }
    return mermaidInstance;
}

// --- Mermaid Node View ---
function MermaidNodeView(props: NodeViewProps) {
    const { node, updateAttributes, selected } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [code, setCode] = useState(node.attrs.code || "");
    const [error, setError] = useState<string | null>(null);
    const [svgHtml, setSvgHtml] = useState<string>("");

    useEffect(() => {
        if (isEditing) return;
        let cancel = false;

        const render = async () => {
            try {
                const mermaid = await getMermaid();
                const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
                const { svg } = await mermaid.render(id, node.attrs.code || "graph LR\n  A --> B");
                if (!cancel) {
                    setSvgHtml(svg);
                    setError(null);
                }
            } catch (e: any) {
                if (!cancel) {
                    setError(e?.message || "Geçersiz Mermaid sözdizimi");
                    setSvgHtml("");
                }
            }
        };

        render();
        return () => { cancel = true; };
    }, [node.attrs.code, isEditing]);

    const handleSave = () => {
        updateAttributes({ code: code.trim() });
        setIsEditing(false);
    };

    return (
        <NodeViewWrapper className="my-6 relative group" data-drag-handle>
            <div
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                    selected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-zinc-300 dark:border-zinc-700"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                            <path d="M2 2h6v6H2V2zm7 0h6v6H9V2zm7 0h6v6h-6V2zM2 9h6v6H2V9zm7 0h6v6H9V9zm7 0h6v6h-6V9zM2 16h6v6H2v-6zm7 0h6v6H9v-6zm7 0h6v6h-6v-6z" />
                        </svg>
                        Mermaid Şema
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setCode(node.attrs.code || "");
                                setIsEditing(true);
                            }
                        }}
                    >
                        {isEditing ? (
                            <><Check className="w-3 h-3 mr-1" /> Kaydet</>
                        ) : (
                            <><Pencil className="w-3 h-3 mr-1" /> Düzenle</>
                        )}
                    </Button>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="p-3 bg-zinc-950">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full min-h-[120px] bg-transparent text-emerald-400 font-mono text-sm resize-y outline-none"
                            placeholder="graph LR&#10;  A[Başlangıç] --> B[Fizik]&#10;  B --> C[Matematik]"
                            spellCheck={false}
                        />
                    </div>
                ) : (
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-center overflow-x-auto">
                        {error ? (
                            <div className="text-red-400 text-xs text-center py-4 font-mono">
                                ⚠ {error}
                            </div>
                        ) : svgHtml ? (
                            <div
                                className="mermaid-svg max-w-full [&_svg]:max-w-full [&_svg]:h-auto"
                                dangerouslySetInnerHTML={{ __html: svgHtml }}
                            />
                        ) : (
                            <div className="text-muted-foreground text-sm py-6 animate-pulse">
                                Şema yükleniyor...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}

// --- Tiptap Extension ---
export const MermaidExtension = Node.create({
    name: "mermaid",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            code: {
                default: "graph LR\n  A[Başlangıç] --> B[Bitiş]",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="mermaid"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-type": "mermaid" })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidNodeView);
    },
});
