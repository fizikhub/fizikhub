"use client";

import { Note, NoteColor } from "@/hooks/use-notes";
import { NoteCard } from "./note-card";
import { cn } from "@/lib/utils";
import { Search, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotesListProps {
    notes: Note[];
    deletedNotes: Note[];
    activeNoteId: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onNoteClick: (id: string) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
    onTogglePin: (id: string) => void;
    onDuplicateNote: (id: string) => void;
    onColorChange: (id: string, color: NoteColor) => void;
    onRestoreNote: (id: string) => void;
    onPermanentlyDelete: (id: string) => void;
    onEmptyTrash: () => void;
    showTrash: boolean;
    onToggleTrash: () => void;
}

export function NotesList({
    notes,
    deletedNotes,
    activeNoteId,
    searchQuery,
    onSearchChange,
    onNoteClick,
    onCreateNote,
    onDeleteNote,
    onTogglePin,
    onDuplicateNote,
    onColorChange,
    onRestoreNote,
    onPermanentlyDelete,
    onEmptyTrash,
    showTrash,
    onToggleTrash,
}: NotesListProps) {
    const pinnedNotes = notes.filter((n) => n.isPinned);
    const unpinnedNotes = notes.filter((n) => !n.isPinned);

    return (
        <div className="flex flex-col h-full bg-[#F3F4F6]">
            {/* Header */}
            <div className="p-3 border-b-[2px] border-black bg-white">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-black text-lg uppercase tracking-tight">
                        {showTrash ? "Çöp Kutusu" : "Notlarım"}
                    </h2>
                    <div className="flex items-center gap-2">
                        {showTrash ? (
                            <>
                                {deletedNotes.length > 0 && (
                                    <button
                                        onClick={onEmptyTrash}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-bold uppercase",
                                            "bg-red-500 text-white border-[2px] border-black",
                                            "shadow-[2px_2px_0px_0px_#000]",
                                            "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                            "transition-all"
                                        )}
                                    >
                                        Boşalt
                                    </button>
                                )}
                                <button
                                    onClick={onToggleTrash}
                                    className={cn(
                                        "p-2 bg-white border-[2px] border-black",
                                        "shadow-[2px_2px_0px_0px_#000]",
                                        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                        "transition-all"
                                    )}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onToggleTrash}
                                    className={cn(
                                        "p-2 bg-white border-[2px] border-black",
                                        "shadow-[2px_2px_0px_0px_#000]",
                                        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                        "transition-all",
                                        deletedNotes.length > 0 && "relative"
                                    )}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {deletedNotes.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {deletedNotes.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={onCreateNote}
                                    className={cn(
                                        "p-2 bg-[#3B82F6] text-white border-[2px] border-black",
                                        "shadow-[2px_2px_0px_0px_#000]",
                                        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                        "transition-all"
                                    )}
                                >
                                    <Plus className="w-4 h-4 stroke-[3px]" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Search */}
                {!showTrash && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Notlarda ara..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={cn(
                                "w-full pl-9 pr-3 py-2 text-sm",
                                "border-[2px] border-black bg-white",
                                "placeholder:text-neutral-400",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500"
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto p-3">
                <AnimatePresence mode="popLayout">
                    {showTrash ? (
                        // Trash view
                        deletedNotes.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center p-6"
                            >
                                <Trash2 className="w-12 h-12 text-neutral-300 mb-3" />
                                <p className="text-neutral-500 font-medium">Çöp kutusu boş</p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Silinen notlar 30 gün saklanır
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-2">
                                {deletedNotes.map((note) => (
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={cn(
                                            "p-3 bg-white border-[2px] border-black",
                                            "shadow-[2px_2px_0px_0px_#000]"
                                        )}
                                    >
                                        <h3 className="font-bold text-sm truncate">
                                            {note.title || "Başlıksız Not"}
                                        </h3>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => onRestoreNote(note.id)}
                                                className={cn(
                                                    "flex-1 py-1.5 text-xs font-bold",
                                                    "bg-green-500 text-white border-[2px] border-black",
                                                    "active:translate-x-[1px] active:translate-y-[1px]",
                                                    "transition-all"
                                                )}
                                            >
                                                Geri Yükle
                                            </button>
                                            <button
                                                onClick={() => onPermanentlyDelete(note.id)}
                                                className={cn(
                                                    "flex-1 py-1.5 text-xs font-bold",
                                                    "bg-red-500 text-white border-[2px] border-black",
                                                    "active:translate-x-[1px] active:translate-y-[1px]",
                                                    "transition-all"
                                                )}
                                            >
                                                Kalıcı Sil
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    ) : notes.length === 0 ? (
                        // Empty state
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center p-6"
                        >
                            <div className="w-16 h-16 bg-blue-100 border-[2px] border-black rounded-lg flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-neutral-600 font-medium">Henüz not yok</p>
                            <p className="text-xs text-neutral-400 mt-1">
                                Yeni bir not oluşturmak için + butonuna tıkla
                            </p>
                        </motion.div>
                    ) : (
                        // Notes grid
                        <div className="space-y-4">
                            {/* Pinned section */}
                            {pinnedNotes.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider mb-2 px-1">
                                        Sabitlenmiş
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {pinnedNotes.map((note) => (
                                            <NoteCard
                                                key={note.id}
                                                note={note}
                                                isActive={activeNoteId === note.id}
                                                onClick={() => onNoteClick(note.id)}
                                                onDelete={() => onDeleteNote(note.id)}
                                                onTogglePin={() => onTogglePin(note.id)}
                                                onDuplicate={() => onDuplicateNote(note.id)}
                                                onColorChange={(color) => onColorChange(note.id, color)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other notes */}
                            {unpinnedNotes.length > 0 && (
                                <div>
                                    {pinnedNotes.length > 0 && (
                                        <h3 className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider mb-2 px-1">
                                            Diğer Notlar
                                        </h3>
                                    )}
                                    <div className="grid grid-cols-1 gap-2">
                                        {unpinnedNotes.map((note) => (
                                            <NoteCard
                                                key={note.id}
                                                note={note}
                                                isActive={activeNoteId === note.id}
                                                onClick={() => onNoteClick(note.id)}
                                                onDelete={() => onDeleteNote(note.id)}
                                                onTogglePin={() => onTogglePin(note.id)}
                                                onDuplicate={() => onDuplicateNote(note.id)}
                                                onColorChange={(color) => onColorChange(note.id, color)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
