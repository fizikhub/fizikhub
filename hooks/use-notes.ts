"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt?: number;
}

export type NoteColor = "default" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; label: string }> = {
  default: { bg: "bg-white", border: "border-black", label: "Varsayılan" },
  red: { bg: "bg-red-50", border: "border-red-400", label: "Kırmızı" },
  orange: { bg: "bg-orange-50", border: "border-orange-400", label: "Turuncu" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-400", label: "Sarı" },
  green: { bg: "bg-green-50", border: "border-green-400", label: "Yeşil" },
  blue: { bg: "bg-blue-50", border: "border-blue-400", label: "Mavi" },
  purple: { bg: "bg-purple-50", border: "border-purple-400", label: "Mor" },
};

const STORAGE_KEY = "fizikhub_notes";
const TRASH_RETENTION_DAYS = 30;

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getNotesFromStorage(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveNotesToStorage(notes: Note[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const loadedNotes = getNotesFromStorage();
    // Clean up old deleted notes
    const now = Date.now();
    const cleanedNotes = loadedNotes.filter((note) => {
      if (!note.isDeleted) return true;
      if (!note.deletedAt) return false;
      const daysSinceDeleted = (now - note.deletedAt) / (1000 * 60 * 60 * 24);
      return daysSinceDeleted < TRASH_RETENTION_DAYS;
    });
    setNotes(cleanedNotes);
    saveNotesToStorage(cleanedNotes);
    setIsLoading(false);
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useDebouncedCallback((updatedNotes: Note[]) => {
    saveNotesToStorage(updatedNotes);
  }, 500);

  // Get active notes (not deleted)
  const activeNotes = notes
    .filter((note) => !note.isDeleted)
    .filter((note) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by updated time
      return b.updatedAt - a.updatedAt;
    });

  // Get deleted notes
  const deletedNotes = notes
    .filter((note) => note.isDeleted)
    .sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

  // Get active note
  const activeNote = notes.find((note) => note.id === activeNoteId) || null;

  // Create a new note
  const createNote = useCallback((): Note => {
    const newNote: Note = {
      id: generateId(),
      title: "",
      content: "",
      color: "default",
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      debouncedSave(updated);
      return updated;
    });
    setActiveNoteId(newNote.id);
    return newNote;
  }, [debouncedSave]);

  // Update a note
  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "content" | "color" | "isPinned">>) => {
      setNotes((prev) => {
        const updated = prev.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: Date.now() }
            : note
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // Delete a note (move to trash)
  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const updated = prev.map((note) =>
          note.id === id
            ? { ...note, isDeleted: true, deletedAt: Date.now() }
            : note
        );
        debouncedSave(updated);
        return updated;
      });
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    },
    [debouncedSave, activeNoteId]
  );

  // Restore a note from trash
  const restoreNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const updated = prev.map((note) =>
          note.id === id
            ? { ...note, isDeleted: false, deletedAt: undefined }
            : note
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // Permanently delete a note
  const permanentlyDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const updated = prev.filter((note) => note.id !== id);
        debouncedSave(updated);
        return updated;
      });
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    },
    [debouncedSave, activeNoteId]
  );

  // Empty trash
  const emptyTrash = useCallback(() => {
    setNotes((prev) => {
      const updated = prev.filter((note) => !note.isDeleted);
      debouncedSave(updated);
      return updated;
    });
    setActiveNoteId(null);
  }, [debouncedSave]);

  // Toggle pin
  const togglePin = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const updated = prev.map((note) =>
          note.id === id
            ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
            : note
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  // Set color
  const setNoteColor = useCallback(
    (id: string, color: NoteColor) => {
      updateNote(id, { color });
    },
    [updateNote]
  );

  // Duplicate note
  const duplicateNote = useCallback(
    (id: string) => {
      const original = notes.find((n) => n.id === id);
      if (!original) return;
      const newNote: Note = {
        ...original,
        id: generateId(),
        title: `${original.title} (kopya)`,
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => {
        const updated = [newNote, ...prev];
        debouncedSave(updated);
        return updated;
      });
      setActiveNoteId(newNote.id);
    },
    [notes, debouncedSave]
  );

  return {
    notes: activeNotes,
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
  };
}
