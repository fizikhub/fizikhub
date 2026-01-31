"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Note, NOTE_COLORS, NoteColor } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

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
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        onClick={onClick}
        title={title}
        className={cn(
            "p-1.5 sm:p-2 transition-colors rounded",
            isActive ? "bg-blue-500 text-white" : "hover:bg-neutral-100 text-neutral-700"
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

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Notunuzu buraya yazın...",
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
                    "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] sm:min-h-[400px] px-1",
            },
        },
    });

    // Update editor content when note changes
    useEffect(() => {
        if (editor && note.content !== editor.getHTML()) {
            editor.commands.setContent(note.content);
        }
    }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!editor) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 20 : 0 }}
            className={cn("flex flex-col h-full", colorConfig.bg)}
        >
            {/* Header */}
            <div
                className={cn(
                    "flex items-center justify-between p-2 sm:p-3 border-b-[2px] border-black bg-white/80 backdrop-blur-sm"
                )}
            >
                <div className="flex items-center gap-2">
                    {isMobile && (
                        <button
                            onClick={onBack}
                            className={cn(
                                "p-2 bg-white border-[2px] border-black",
                                "shadow-[2px_2px_0px_0px_#000]",
                                "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                "transition-all"
                            )}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Save className="w-3 h-3" />
                        <span className="hidden sm:inline">Otomatik kayıt</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Pin button */}
                    <button
                        onClick={onTogglePin}
                        className={cn(
                            "p-2 bg-white border-[2px] border-black",
                            "shadow-[2px_2px_0px_0px_#000]",
                            "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                            "transition-all",
                            note.isPinned && "bg-yellow-400"
                        )}
                        title={note.isPinned ? "Sabitlemeyi kaldır" : "Sabitle"}
                    >
                        <Pin className={cn("w-4 h-4", note.isPinned && "fill-black")} />
                    </button>

                    {/* Color picker */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                "p-2 bg-white border-[2px] border-black",
                                "shadow-[2px_2px_0px_0px_#000]",
                                "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                "transition-all"
                            )}
                        >
                            <Palette className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.entries(NOTE_COLORS).map(([color, config]) => (
                                <DropdownMenuItem
                                    key={color}
                                    onClick={() => onColorChange(color as NoteColor)}
                                >
                                    <div
                                        className={cn(
                                            "w-4 h-4 rounded-full border-2 border-black mr-2",
                                            config.bg
                                        )}
                                    />
                                    {config.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Duplicate */}
                    <button
                        onClick={onDuplicateNote}
                        className={cn(
                            "p-2 bg-white border-[2px] border-black",
                            "shadow-[2px_2px_0px_0px_#000]",
                            "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                            "transition-all hidden sm:block"
                        )}
                        title="Kopyala"
                    >
                        <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={onDeleteNote}
                        className={cn(
                            "p-2 bg-red-500 text-white border-[2px] border-black",
                            "shadow-[2px_2px_0px_0px_#000]",
                            "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                            "transition-all"
                        )}
                        title="Sil"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Title input */}
            <div className="px-3 sm:px-4 pt-3 sm:pt-4 bg-transparent">
                <input
                    type="text"
                    value={note.title}
                    onChange={(e) => onUpdateNote({ title: e.target.value })}
                    placeholder="Başlık"
                    className={cn(
                        "w-full text-xl sm:text-2xl font-black bg-transparent border-none outline-none",
                        "placeholder:text-neutral-400"
                    )}
                />
            </div>

            {/* Toolbar */}
            <div className="px-3 sm:px-4 py-2 flex flex-wrap gap-1 border-b border-black/10">
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

                <div className="w-px h-6 bg-neutral-200 mx-1" />

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

                <div className="w-px h-6 bg-neutral-200 mx-1" />

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
                    title="Yapılacaklar listesi"
                >
                    <CheckSquare className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-neutral-200 mx-1 hidden sm:block" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="Kod bloğu"
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
                <EditorContent editor={editor} />
            </div>
        </motion.div>
    );
}
