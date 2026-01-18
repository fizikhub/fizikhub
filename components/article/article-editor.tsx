"use client";

import imageCompression from 'browser-image-compression';
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Markdown } from 'tiptap-markdown';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Bold, Italic, List, ListOrdered, Quote,
    Heading1, Heading2, Heading3, Undo, Redo,
    ImagePlus, Loader2, Link as LinkIcon, Youtube as YoutubeIcon,
    Underline as UnderlineIcon, Calculator
} from "lucide-react";
import { useCallback, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { InlineMath } from 'react-katex';
import { MathExtension } from '@/components/writer/extensions/math-extension';

// --- Custom Image Node View ---
const ImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props;
    const [altText, setAltText] = useState(node.attrs.alt || '');

    useEffect(() => {
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

interface ArticleEditorProps {
    content: string;
    onChange: (content: string) => void;
    onUploadImage: (file: File) => Promise<string>;
    className?: string;
    placeholder?: string;
}

export function ArticleEditor({ content, onChange, onUploadImage, className, placeholder }: ArticleEditorProps) {
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
                placeholder: placeholder || 'Bilimsel hikayeni anlatmaya başla...',
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
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compression options
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp"
        };

        setIsUploading(true);
        try {
            const compressedFile = await imageCompression(file, options);
            const url = await onUploadImage(compressedFile);

            if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
                toast.success("Görsel eklendi");
            }
        } catch (error: any) {
            console.error("Compression/Upload error:", error);
            toast.error(error.message || "Görsel yüklenirken hata oluştu");
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

    const ToolbarButton = ({ onClick, isActive, children, title, disabled }: any) => (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isActive ? 'bg-muted text-foreground' : ''}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </Button>
    );

    return (
        <div className={cn("border-2 border-dashed border-muted-foreground/20 rounded-xl bg-card shadow-sm overflow-hidden relative", className)}>
            {/* Main Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-xl items-center">
                {/* Text Formatting */}
                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Kalın"><Bold className="w-4 h-4" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="İtalik"><Italic className="w-4 h-4" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Altı Çizili"><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Ana Başlık"><Heading1 className="w-4 h-4" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Alt Başlık"><Heading2 className="w-4 h-4" /></ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <div className="flex items-center gap-0.5 mr-2">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Madde Listesi"><List className="w-4 h-4" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Sıralı Liste"><ListOrdered className="w-4 h-4" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Alıntı Yap"><Quote className="w-4 h-4" /></ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Media & Special */}
                <div className="flex items-center gap-0.5">
                    <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Link Ekle"><LinkIcon className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Bağlantı Ekle</DialogTitle></DialogHeader>
                            <div className="py-4"><Input placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} /></div>
                            <DialogFooter><Button type="button" onClick={setLink}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addImage} disabled={isUploading} title="Resim Ekle">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                    </Button>

                    <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Youtube Videosu"><YoutubeIcon className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>YouTube Videosu Ekle</DialogTitle></DialogHeader>
                            <div className="py-4"><Input placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} /></div>
                            <DialogFooter><Button type="button" onClick={addYoutubeVideo}>Ekle</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isMathDialogOpen} onOpenChange={setIsMathDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Matematik Formülü"><Calculator className="w-4 h-4" /></Button>
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
                                        className="font-mono bg-muted/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Önizleme</h4>
                                    <div className="min-h-[60px] flex items-center justify-center p-4 bg-muted/30 rounded-lg border border-border/50 overflow-x-auto">
                                        {mathLatex ? (
                                            <span className="text-lg">
                                                <InlineMath math={mathLatex} />
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">Formül yazmaya başlayın...</span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">
                                    <p className="font-medium mb-2 text-foreground">Hızlı Ekle</p>
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
                                                className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-background border border-transparent hover:border-border transition-all text-left"
                                                type="button"
                                            >
                                                <span>{item.label}</span>
                                                <code className="bg-background/50 px-1 py-0.5 rounded text-[10px]">{item.code}</code>
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

                <div className="flex items-center gap-0.5">
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri Al"><Undo className="w-4 h-4" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Yinele"><Redo className="w-4 h-4" /></ToolbarButton>
                </div>
            </div>

            <EditorContent editor={editor} />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
    );
}
