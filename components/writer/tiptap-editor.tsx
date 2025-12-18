"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { Button } from "@/components/ui/button"
import {
    Bold, Italic, List, ListOrdered, Quote,
    Heading1, Heading2, Heading3, Undo, Redo,
    ImagePlus, Loader2
} from "lucide-react"
import { useCallback, useRef, useState, useEffect } from "react"
import { uploadArticleImage } from "@/app/yazar/actions"
import { toast } from "sonner"
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import NextImage from 'next/image'
import { Input } from "@/components/ui/input"

// --- Custom Image Node View ---
const ImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props;
    const [altText, setAltText] = useState(node.attrs.alt || '');

    // Update alt text when node attrs change externally
    useEffect(() => {
        setAltText(node.attrs.alt || '');
    }, [node.attrs.alt]);

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAlt = e.target.value;
        setAltText(newAlt);
        updateAttributes({ alt: newAlt });
    };

    return (
        <NodeViewWrapper className="my-6 relative group flex flex-col items-center">
            <div className={`relative overflow-hidden rounded-lg transition-all ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                <img
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    className="max-w-full h-auto rounded-lg shadow-sm" // Use standard img for editor to avoid NextImage layout complexity in editor
                    style={{ maxHeight: '500px' }}
                />
            </div>

            {/* Caption Input - Always visible or on hover/select? Let's make it intuitive. */}
            <div className="mt-2 w-full max-w-md">
                <Input
                    value={altText}
                    onChange={handleAltChange}
                    placeholder="Görsel açıklaması ekle..."
                    className="text-center text-sm text-muted-foreground border-transparent hover:border-border focus:border-primary bg-transparent h-8"
                />
            </div>
        </NodeViewWrapper>
    )
}

// --- Main Editor Component ---
interface TiptapEditorProps {
    content: string;
    onChange: (markdown: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Image.configure({
                inline: false,
                allowBase64: true,
            }).extend({
                addNodeView() {
                    return ReactNodeViewRenderer(ImageNodeView)
                },
            }),
            Placeholder.configure({
                placeholder: 'Hikayenizi anlatmaya başlayın...',
            }),
        ],
        content: content, // Initial markdown content
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px]',
            },
        },
        onUpdate: ({ editor }) => {
            // Get content as Markdown
            const markdown = editor.storage.markdown.getMarkdown();
            onChange(markdown);
        },
    });

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'den küçük olmalı");
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadArticleImage(file);
            if (result.success && result.url) {
                editor?.chain().focus().setImage({ src: result.url }).run();
                toast.success("Görsel eklendi");
            } else {
                toast.error(result.error || "Yükleme başarısız");
            }
        } catch {
            toast.error("Bir hata oluştu");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-xl">
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                >
                    <Heading3 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                >
                    <Quote className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    variant="ghost" size="sm"
                    onClick={addImage}
                    disabled={isUploading}
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                </Button>
                <div className="flex-1" />
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <Undo className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    <Redo className="w-4 h-4" />
                </Button>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {/* Editor Content */}
            <div className="p-4 bg-background">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
