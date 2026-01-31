"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/hooks/use-notes";
import { NotesList } from "./notes-list";
import { NoteEditor } from "./note-editor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function NotesPage() {
    const {
        notes,
        deletedNotes,
        activeNote,
        activeNoteId,
        setActiveNoteId,
        searchQuery,
        setSearchQuery,
        isLoading,
        createNote,
        updateNote,
        deleteNote,
        restoreNote,
        permanentlyDeleteNote,
        emptyTrash,
        togglePin,
        setNoteColor,
        duplicateNote,
    } = useNotes();

    const [showTrash, setShowTrash] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle back on mobile
    const handleBack = () => setActiveNoteId(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-[#FDF6E3] border-[3px] border-amber-400 shadow-[6px_6px_0px_0px_rgba(217,119,6,0.5)] rounded-2xl",
                "h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]",
                "overflow-hidden"
            )}
        >
            {/* Desktop: Split view */}
            {!isMobile && (
                <div className="flex h-full">
                    {/* Left panel: Notes list */}
                    <div className="w-[320px] border-r-[3px] border-black h-full">
                        <NotesList
                            notes={notes}
                            deletedNotes={deletedNotes}
                            activeNoteId={activeNoteId}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onNoteClick={setActiveNoteId}
                            onCreateNote={createNote}
                            onDeleteNote={deleteNote}
                            onTogglePin={togglePin}
                            onDuplicateNote={duplicateNote}
                            onColorChange={setNoteColor}
                            onRestoreNote={restoreNote}
                            onPermanentlyDelete={permanentlyDeleteNote}
                            onEmptyTrash={emptyTrash}
                            showTrash={showTrash}
                            onToggleTrash={() => setShowTrash(!showTrash)}
                        />
                    </div>

                    {/* Right panel: Editor */}
                    <div className="flex-1 h-full">
                        <AnimatePresence mode="wait">
                            {activeNote && !activeNote.isDeleted ? (
                                <NoteEditor
                                    key={activeNote.id}
                                    note={activeNote}
                                    onUpdateNote={(updates) => updateNote(activeNote.id, updates)}
                                    onDeleteNote={() => deleteNote(activeNote.id)}
                                    onTogglePin={() => togglePin(activeNote.id)}
                                    onDuplicateNote={() => duplicateNote(activeNote.id)}
                                    onColorChange={(color) => setNoteColor(activeNote.id, color)}
                                    onBack={handleBack}
                                    isMobile={false}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center p-8 bg-[#F3F4F6]"
                                >
                                    <div className="w-20 h-20 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-4xl">📝</span>
                                    </div>
                                    <h3 className="font-black text-lg mb-2">Not Seçin</h3>
                                    <p className="text-neutral-500 text-sm max-w-[250px]">
                                        Düzenlemek için soldaki listeden bir not seçin veya yeni bir not oluşturun
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Mobile: Full screen views */}
            {isMobile && (
                <AnimatePresence mode="wait">
                    {activeNote && !activeNote.isDeleted ? (
                        <NoteEditor
                            key={activeNote.id}
                            note={activeNote}
                            onUpdateNote={(updates) => updateNote(activeNote.id, updates)}
                            onDeleteNote={() => {
                                deleteNote(activeNote.id);
                                handleBack();
                            }}
                            onTogglePin={() => togglePin(activeNote.id)}
                            onDuplicateNote={() => duplicateNote(activeNote.id)}
                            onColorChange={(color) => setNoteColor(activeNote.id, color)}
                            onBack={handleBack}
                            isMobile={true}
                        />
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full"
                        >
                            <NotesList
                                notes={notes}
                                deletedNotes={deletedNotes}
                                activeNoteId={activeNoteId}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onNoteClick={setActiveNoteId}
                                onCreateNote={createNote}
                                onDeleteNote={deleteNote}
                                onTogglePin={togglePin}
                                onDuplicateNote={duplicateNote}
                                onColorChange={setNoteColor}
                                onRestoreNote={restoreNote}
                                onPermanentlyDelete={permanentlyDeleteNote}
                                onEmptyTrash={emptyTrash}
                                showTrash={showTrash}
                                onToggleTrash={() => setShowTrash(!showTrash)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
