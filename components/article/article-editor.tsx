"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
    List, ListOrdered, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
    Undo2, Redo2, Trash2
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArticleEditorProps {
    content: string;
    onChange: (content: string) => void;
    onUploadImage: (file: File) => Promise<string>;
}

export function ArticleEditor({ content, onChange, onUploadImage }: ArticleEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto my-4 border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer",
                },
                allowBase64: true,
            }),
            Placeholder.configure({
                placeholder: "Makalenizi yazmaya başlayın...",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
        ],
        content,
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await onUploadImage(file);
            if (url) {
                editor
                    .chain()
                    .focus()
                    .setImage({ src: url })
                    .enter()
                    .run();
            }
        } catch (error) {
            console.error("Editor upload error:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        title,
        disabled = false
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
        disabled?: boolean;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={cn(
                "p-2 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                isActive && "bg-muted text-foreground"
            )}
        >
            {children}
        </button>
    );

    return (
        <div className="border-2 border-foreground/10 rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] bg-background relative">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 border-b-2 border-foreground/10 sticky top-0 z-20 backdrop-blur-sm">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Kalın (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="İtalik (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Altı çizili (Ctrl+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-foreground/10 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Büyük Başlık"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Orta Başlık"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-foreground/10 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Madde İşaretli Liste"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Numaralı Liste"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-foreground/10 mx-1" />

                <ToolbarButton
                    onClick={handleImageClick}
                    title="Fotoğraf Ekle"
                    disabled={isUploading}
                    isActive={isUploading}
                >
                    <ImageIcon className={cn("w-4 h-4", isUploading && "animate-pulse text-primary")} />
                </ToolbarButton>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="w-px h-6 bg-foreground/10 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="Sola Hizala"
                >
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="Ortala"
                >
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="Sağa Hizala"
                >
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>

                <div className="flex-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Geri Al (Ctrl+Z)"
                >
                    <Undo2 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Yinele (Ctrl+Y)"
                >
                    <Redo2 className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <div className="relative min-h-[400px]">
                <EditorContent editor={editor} />
                {editor.isEmpty && (
                    <div className="absolute top-4 left-6 text-muted-foreground pointer-events-none">
                        {/* Placeholder handled by extension */}
                    </div>
                )}
            </div>
        </div>
    );
}
