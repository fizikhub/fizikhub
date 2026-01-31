"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Note, NOTE_COLORS, NoteColor } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    CheckSquare,
    Heading1,
    Heading2,
    Heading3,
    Code,
    ArrowLeft,
    Pin,
    Palette,
    Trash2,
    Copy,
    Save,
    Clock,
    Type,
    Share2,
    Download,
    Sparkles,
    Quote,
    Minus,
    RotateCcw,
    RotateCw,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { VoiceAIAssistant } from "./voice-ai-assistant";

interface NoteEditorProps {
    note: Note;
    onUpdateNote: (updates: Partial<Pick<Note, "title" | "content" | "color" | "isPinned">>) => void;
    onDeleteNote: () => void;
    onTogglePin: () => void;
    onDuplicateNote: () => void;
    onColorChange: (color: NoteColor) => void;
    onBack: () => void;
    isMobile: boolean;
}

const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-2 transition-all duration-150 rounded-lg",
            isActive
                ? "bg-amber-600 text-white shadow-inner"
                : "hover:bg-amber-200/50 text-amber-900",
            disabled && "opacity-40 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);

export function NoteEditor({
    note,
    onUpdateNote,
    onDeleteNote,
    onTogglePin,
    onDuplicateNote,
    onColorChange,
    onBack,
    isMobile,
}: NoteEditorProps) {
    const colorConfig = NOTE_COLORS[note.color];
    const [showStats, setShowStats] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Notunuzu buraya yazın...",
                emptyEditorClass: "is-editor-empty",
            }),
            Underline,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: note.content,
        onUpdate: ({ editor }) => {
            onUpdateNote({ content: editor.getHTML() });
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-amber prose-sm sm:prose max-w-none focus:outline-none min-h-[300px] sm:min-h-[400px] text-gray-900",
            },
        },
    });

    // Update editor content when note changes
    useEffect(() => {
        if (editor && note.content !== editor.getHTML()) {
            editor.commands.setContent(note.content);
        }
    }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Calculate stats
    const stats = useMemo(() => {
        if (!editor) return { words: 0, chars: 0, readingTime: 0 };
        const text = editor.getText();
        const words = text.split(/\s+/).filter((w) => w.length > 0).length;
        const chars = text.length;
        const readingTime = Math.ceil(words / 200); // Average reading speed
        return { words, chars, readingTime };
    }, [editor?.getText()]);

    // Export as text
    const handleExport = () => {
        if (!editor) return;
        const text = `# ${note.title || "Başlıksız Not"}\n\n${editor.getText()}`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${note.title || "not"}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Share note
    const handleShare = async () => {
        if (!editor) return;
        const text = `${note.title || "Başlıksız Not"}\n\n${editor.getText()}`;
        if (navigator.share) {
            await navigator.share({
                title: note.title || "Not",
                text: text,
            });
        } else {
            await navigator.clipboard.writeText(text);
            alert("Not panoya kopyalandı!");
        }
    };

    const timeAgo = formatDistanceToNow(new Date(note.updatedAt), {
        addSuffix: true,
        locale: tr,
    });

    if (!editor) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 20 : 0 }}
            className={cn("flex flex-col h-full", colorConfig.bg)}
        >
            {/* Header - Now with visible icons */}
            <div className="flex items-center justify-between p-2 sm:p-3 border-b-[2px] border-amber-400 bg-amber-100">
                <div className="flex items-center gap-2">
                    {isMobile && (
                        <button
                            onClick={onBack}
                            className={cn(
                                "p-2.5 bg-amber-800 text-white rounded-xl",
                                "shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]",
                                "active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
                                "transition-all"
                            )}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-200/50 px-2 py-1 rounded-lg">
                        <Save className="w-3 h-3" />
                        <span className="hidden sm:inline font-medium">Otomatik kayıt</span>
                        <span className="text-amber-600">• {timeAgo}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Stats toggle */}
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className={cn(
                            "p-2.5 rounded-xl border-2 transition-all",
                            showStats
                                ? "bg-amber-600 text-white border-amber-700"
                                : "bg-amber-200 text-amber-800 border-amber-400 hover:bg-amber-300"
                        )}
                        title="İstatistikler"
                    >
                        <Type className="w-4 h-4" />
                    </button>

                    {/* Pin button */}
                    <button
                        onClick={onTogglePin}
                        className={cn(
                            "p-2.5 rounded-xl border-2 transition-all",
                            note.isPinned
                                ? "bg-yellow-400 text-amber-900 border-yellow-500"
                                : "bg-amber-200 text-amber-800 border-amber-400 hover:bg-amber-300"
                        )}
                        title={note.isPinned ? "Sabitlemeyi kaldır" : "Sabitle"}
                    >
                        <Pin className={cn("w-4 h-4", note.isPinned && "fill-amber-900")} />
                    </button>

                    {/* Color picker */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                "p-2.5 bg-amber-200 text-amber-800 rounded-xl border-2 border-amber-400",
                                "hover:bg-amber-300 transition-all"
                            )}
                        >
                            <Palette className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[140px]">
                            {Object.entries(NOTE_COLORS).map(([color, config]) => (
                                <DropdownMenuItem
                                    key={color}
                                    onClick={() => onColorChange(color as NoteColor)}
                                    className="cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "w-5 h-5 rounded-full border-2 border-gray-400 mr-2",
                                            config.bg
                                        )}
                                    />
                                    {config.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* More actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                "p-2.5 bg-amber-200 text-amber-800 rounded-xl border-2 border-amber-400",
                                "hover:bg-amber-300 transition-all"
                            )}
                        >
                            <Sparkles className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                            <DropdownMenuItem onClick={onDuplicateNote} className="cursor-pointer">
                                <Copy className="w-4 h-4 mr-2" />
                                Kopyala
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                                <Share2 className="w-4 h-4 mr-2" />
                                Paylaş
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                İndir (.txt)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onDeleteNote}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stats bar */}
            {showStats && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex items-center justify-center gap-4 py-2 px-3 bg-amber-200/50 border-b border-amber-300 text-xs"
                >
                    <div className="flex items-center gap-1 text-amber-800">
                        <Type className="w-3 h-3" />
                        <span className="font-bold">{stats.words}</span>
                        <span>kelime</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-amber-400" />
                    <div className="flex items-center gap-1 text-amber-800">
                        <span className="font-bold">{stats.chars}</span>
                        <span>karakter</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-amber-400" />
                    <div className="flex items-center gap-1 text-amber-800">
                        <Clock className="w-3 h-3" />
                        <span className="font-bold">{stats.readingTime}</span>
                        <span>dk okuma</span>
                    </div>
                </motion.div>
            )}

            {/* Title input */}
            <div className="px-4 pt-4 bg-transparent">
                <input
                    type="text"
                    value={note.title}
                    onChange={(e) => onUpdateNote({ title: e.target.value })}
                    placeholder="Başlık"
                    className={cn(
                        "w-full text-xl sm:text-2xl font-black bg-transparent border-none outline-none text-gray-900",
                        "placeholder:text-amber-400"
                    )}
                />
            </div>

            {/* Toolbar */}
            <div className="px-3 py-2 flex flex-wrap items-center gap-0.5 border-b border-amber-300/50">
                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Geri Al"
                >
                    <RotateCcw className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="İleri Al"
                >
                    <RotateCw className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-amber-300 mx-1" />

                {/* Text formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Kalın"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="İtalik"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="Altı çizili"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Üstü çizili"
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-amber-300 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Başlık 1"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Başlık 2"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Başlık 3"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-amber-300 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Madde listesi"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Numaralı liste"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive("taskList")}
                    title="Yapılacaklar"
                >
                    <CheckSquare className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-5 bg-amber-300 mx-1 hidden sm:block" />

                {/* Extras */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Alıntı"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="Kod bloğu"
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Yatay çizgi"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                <style jsx global>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            color: #d97706;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
          .ProseMirror {
            color: #111827 !important;
          }
          .ProseMirror p {
            color: #111827;
          }
          .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
            color: #78350f;
          }
          .ProseMirror ul[data-type="taskList"] li {
            display: flex;
            align-items: flex-start;
          }
          .ProseMirror ul[data-type="taskList"] li > label {
            margin-right: 0.5rem;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #d97706;
            padding-left: 1rem;
            color: #78350f;
          }
          .ProseMirror code {
            background: #fef3c7;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
          }
          .ProseMirror pre {
            background: #1f2937;
            color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
          }
        `}</style>
                <EditorContent editor={editor} />
            </div>

            {/* Voice AI Assistant */}
            <VoiceAIAssistant
                noteTitle={note.title}
                noteContent={note.content}
                onInsertText={(text) => {
                    if (editor) {
                        editor.chain().focus().insertContent(text).run();
                    }
                }}
                onInsertTitle={(title) => {
                    onUpdateNote({ title });
                }}
            />
        </motion.div>
    );
}
