"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
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
    Underline as UnderlineIcon, Calculator
} from "lucide-react"
import { useCallback, useRef, useState, useEffect } from "react"
import { uploadArticleImage } from "@/app/yazar/actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { MathExtension } from './extensions/math-extension'

// --- Custom Image Node View ---
const ImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props;
    const [altText, setAltText] = useState(node.attrs.alt || '');

    useEffect(() => {
        // avoid synchronous state update loop
        if (altText !== (node.attrs.alt || '')) {
            setAltText(node.attrs.alt || '');
        }
    }, [node.attrs.alt, altText]); // adding altText dependency

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
    const [mathLatex, setMathLatex] = useState('');
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
    const [isMathDialogOpen, setIsMathDialogOpen] = useState(false);

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
            MathExtension,
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
            // @ts-ignore - tiptap-markdown adds 'markdown' to storage
            const markdown = editor.storage.markdown?.getMarkdown() || editor.getHTML();
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
        if (mathLatex) {
            editor?.chain().focus().insertContent({
                type: 'math',
                attrs: { latex: mathLatex }
            }).run();
            setIsMathDialogOpen(false);
            setMathLatex('');
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden relative">
            {/* Main Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-xl items-center">
                {/* Text Formatting */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} data-state={editor.isActive('bold') ? 'on' : 'off'}><Bold className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} data-state={editor.isActive('italic') ? 'on' : 'off'}><Italic className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} data-state={editor.isActive('underline') ? 'on' : 'off'}><UnderlineIcon className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}><Heading1 className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}><Heading2 className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}><Heading3 className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBulletList().run()} data-state={editor.isActive('bulletList') ? 'on' : 'off'}><List className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleOrderedList().run()} data-state={editor.isActive('orderedList') ? 'on' : 'off'}><ListOrdered className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBlockquote().run()} data-state={editor.isActive('blockquote') ? 'on' : 'off'}><Quote className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Media & Special */}
                <div className="flex items-center gap-0.5">
                    <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" data-state={editor.isActive('link') ? 'on' : 'off'}><LinkIcon className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Bağlantı Ekle</DialogTitle></DialogHeader>
                            <div className="py-4"><Input placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} /></div>
                            <DialogFooter><Button type="button" onClick={setLink}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addImage} disabled={isUploading}>{isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}</Button>

                    <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><YoutubeIcon className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>YouTube Videosu Ekle</DialogTitle></DialogHeader>
                            <div className="py-4"><Input placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} /></div>
                            <DialogFooter><Button type="button" onClick={addYoutubeVideo}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isMathDialogOpen} onOpenChange={setIsMathDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Matematik Formülü (Ekle/Düzenle)"><Calculator className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Matematik Formülü Ekle</DialogTitle></DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">LaTeX Formülü</h4>
                                    <Input
                                        placeholder="E = mc^2"
                                        value={mathLatex}
                                        onChange={(e) => setMathLatex(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                insertMath();
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Önizleme editörde görünecektir.
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                    <p className="font-medium mb-1">Örnekler:</p>
                                    <ul className="grid grid-cols-2 gap-2 text-xs">
                                        <li><code>\frac&#123;a&#125;&#123;b&#125;</code> (Kesir)</li>
                                        <li><code>\sqrt&#123;x&#125;</code> (Kök)</li>
                                        <li><code>\cdot</code> (Çarpma)</li>
                                        <li><code>\sum</code> (Toplam)</li>
                                        <li><code>\int</code> (İntegral)</li>
                                        <li><code>\pi</code> (Pi sayısı)</li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter><Button type="button" onClick={insertMath}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex-1" />

                {/* Undo/Redo */}
                <div className="flex items-center gap-0.5">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo className="w-4 h-4" /></Button>
                </div>
            </div>

            <EditorContent editor={editor} />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
    )
}
