"use client";

import imageCompression from 'browser-image-compression';

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
    Underline as UnderlineIcon, Calculator, MonitorPlay
} from "lucide-react"
import { useCallback, useRef, useState, useEffect } from "react"
import { uploadArticleImage } from "@/app/yazar/actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { InlineMath } from 'react-katex'
import { MathExtension } from './extensions/math-extension'
import { IframeExtension } from './extensions/iframe-extension'

// --- Custom Image Node View ---
const ImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props;
    const [altText, setAltText] = useState(node.attrs.alt || '');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (node.attrs.alt !== altText) {
            setAltText(node.attrs.alt || '');
        }
    }, [node.attrs.alt]);

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAlt = e.target.value;
        setAltText(newAlt);
        updateAttributes({ alt: newAlt });
    };

    return (
        <NodeViewWrapper className="my-6 relative group flex flex-col items-center">
            <div className={`relative overflow-hidden rounded-lg transition-all ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
    const [iframeUrl, setIframeUrl] = useState('');
    const [mathLatex, setMathLatex] = useState('');
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
    const [isIframeDialogOpen, setIsIframeDialogOpen] = useState(false);
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
            IframeExtension,
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
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
            },
        },
        onUpdate: ({ editor }) => {
            // Use Markdown output for proper math rendering and compatibility
            const markdown = (editor.storage as any).markdown.getMarkdown();
            onChange(markdown);
        },
    });

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compression options - high quality settings
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp" as const,
            initialQuality: 0.9 // Higher quality to preserve details
        };

        setIsUploading(true);
        try {
            console.log(`[Compression] Original: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            const compressedFile = await imageCompression(file, options);
            console.log(`[Compression] Compressed: Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

            const result = await uploadArticleImage(compressedFile);
            if (result.success && result.url) {
                editor?.chain().focus().setImage({ src: result.url }).run();
                toast.success("Görsel sıkıştırılarak eklendi");
            } else {
                toast.error(result.error || "Yükleme başarısız");
            }
        } catch (error) {
            console.error("Compression/Upload error:", error);
            toast.error("Görsel işlenirken bir hata oluştu");
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

    const addIframe = () => {
        if (iframeUrl) {
            editor?.chain().focus().setIframe({ src: iframeUrl }).run();
            setIsIframeDialogOpen(false);
            setIframeUrl('');
        }
    };

    const insertMath = () => {
        if (mathLatex) {
            const cleanLatex = mathLatex.replace(/^\$+|\$+$/g, '');
            editor?.chain().focus().insertContent({
                type: 'math',
                attrs: { latex: cleanLatex }
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
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} data-state={editor.isActive('bold') ? 'on' : 'off'}><Bold className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} data-state={editor.isActive('italic') ? 'on' : 'off'}><Italic className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} data-state={editor.isActive('underline') ? 'on' : 'off'}><UnderlineIcon className="w-4 h-4" /></Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-0.5 mr-2">
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}><Heading1 className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}><Heading2 className="w-4 h-4" /></Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}><Heading3 className="w-4 h-4" /></Button>
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

                    <Dialog open={isIframeDialogOpen} onOpenChange={setIsIframeDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Simülasyon Ekle (Embed)"><MonitorPlay className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Simülasyon/Embed Ekle</DialogTitle></DialogHeader>
                            <div className="py-4 space-y-2">
                                <Input placeholder="https://phet.colorado.edu/..." value={iframeUrl} onChange={(e) => setIframeUrl(e.target.value)} />
                                <p className="text-xs text-muted-foreground">Desteklenen simülasyon veya embed bağlantısını yapıştırın.</p>
                            </div>
                            <DialogFooter><Button type="button" onClick={addIframe}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isMathDialogOpen} onOpenChange={setIsMathDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Matematik Formülü (Ekle/Düzenle)"><Calculator className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader><DialogTitle>Matematik Formülü Ekle</DialogTitle></DialogHeader>
                            <div className="py-4 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium leading-none">LaTeX Formülü</h4>
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
                                        className="font-mono"
                                    />
                                </div>

                                {/* Live Preview */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Önizleme</h4>
                                    <div className="min-h-[60px] flex items-center justify-center p-4 bg-muted/30 rounded-lg border border-border/50 overflow-x-auto">
                                        {mathLatex ? (
                                            <span className="text-lg">
                                                {/* We need InlineMath here. I'll add the import in a previous step or next step. */}
                                                <InlineMath
                                                    math={mathLatex.replace(/^\$+|\$+$/g, '')}
                                                    renderError={(error) => {
                                                        return <span className="text-red-500 font-mono text-sm">{mathLatex}</span>
                                                    }}
                                                />
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">Formül yazmaya başlayın...</span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">
                                    <p className="font-medium mb-2 text-foreground">Hızlı Ekle (Tıkla)</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {[
                                            { label: "Kesir", code: "\\frac{a}{b}" },
                                            { label: "Kök", code: "\\sqrt{x}" },
                                            { label: "Üslü", code: "x^2" },
                                            { label: "Çarpma", code: "\\cdot" },
                                            { label: "Toplam", code: "\\sum" },
                                            { label: "İntegral", code: "\\int" },
                                            { label: "Pi", code: "\\pi" },
                                            { label: "Sonsuz", code: "\\infty" },
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => setMathLatex(prev => prev + item.code)}
                                                className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-background hover:shadow-sm border border-transparent hover:border-border transition-all text-left group"
                                                type="button"
                                            >
                                                <span>{item.label}</span>
                                                <code className="bg-background/50 px-1 py-0.5 rounded text-[10px] text-muted-foreground group-hover:text-primary transition-colors">{item.code}</code>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter><Button type="button" onClick={() => insertMath()}>Ekle</Button></DialogFooter>
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
