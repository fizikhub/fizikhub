"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Markdown } from 'tiptap-markdown'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Bold, Italic, List, ListOrdered, Quote,
    Heading1, Heading2, Heading3, Undo, Redo,
    ImagePlus, Loader2, Link as LinkIcon, Youtube as YoutubeIcon,
    Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
    Calculator, Divide, X
} from "lucide-react"
import { useCallback, useRef, useState, useEffect } from "react"
import { uploadArticleImage } from "@/app/yazar/actions"
import { toast } from "sonner"
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
                    className="max-w-full h-auto rounded-lg shadow-sm"
                    style={{ maxHeight: '500px' }}
                />
            </div>
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
    const [linkUrl, setLinkUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);

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
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
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

    const setLink = () => {
        if (linkUrl) {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setIsLinkDialogOpen(false);
            setLinkUrl('');
        }
    };

    const addYoutubeVideo = () => {
        if (youtubeUrl) {
            editor?.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
            setIsYoutubeDialogOpen(false);
            setYoutubeUrl('');
        }
    };

    const insertMath = () => {
        // Insert a math block placeholder
        editor?.chain().focus().insertContent('$$Formül$$').run();
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden relative">
            {/* Bubble Menu */}
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex items-center gap-1 p-1 bg-popover border rounded-lg shadow-lg">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBold().run()} data-active={editor.isActive('bold')}>
                            <Bold className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleItalic().run()} data-active={editor.isActive('italic')}>
                            <Italic className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleUnderline().run()} data-active={editor.isActive('underline')}>
                            <UnderlineIcon className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} data-active={editor.isActive('heading', { level: 2 })}>
                            <Heading2 className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsLinkDialogOpen(true)} data-active={editor.isActive('link')}>
                            <LinkIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </BubbleMenu>
            )}

            {/* Main Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-xl items-center">
                {/* Text Formatting */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} data-state={editor.isActive('bold') ? 'on' : 'off'}><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} data-state={editor.isActive('italic') ? 'on' : 'off'}><Italic className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} data-state={editor.isActive('underline') ? 'on' : 'off'}><UnderlineIcon className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}><Heading1 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}><Heading2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}><Heading3 className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists & Alignment */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBulletList().run()} data-state={editor.isActive('bulletList') ? 'on' : 'off'}><List className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleOrderedList().run()} data-state={editor.isActive('orderedList') ? 'on' : 'off'}><ListOrdered className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBlockquote().run()} data-state={editor.isActive('blockquote') ? 'on' : 'off'}><Quote className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Media & Special */}
                <div className="flex items-center gap-0.5">
                    <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" data-state={editor.isActive('link') ? 'on' : 'off'}><LinkIcon className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Bağlantı Ekle</DialogTitle></DialogHeader>
                            <div className="py-4"><Input placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} /></div>
                            <DialogFooter><Button onClick={setLink}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addImage} disabled={isUploading}>{isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}</Button>

                    <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" data-state={editor.isActive('youtube') ? 'on' : 'off'}><YoutubeIcon className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>YouTube Videosu Ekle</DialogTitle></DialogHeader>
                            <div className="py-4"><Input placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} /></div>
                            <DialogFooter><Button onClick={addYoutubeVideo}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={insertMath} title="Matematik Formülü ($$)"><Divide className="w-4 h-4" /></Button>
                </div>
            </div>

            <EditorContent editor={editor} />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
    )
}
