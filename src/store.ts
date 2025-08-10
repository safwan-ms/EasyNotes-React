import { create } from "zustand";

interface Note {
  id: string;
  text: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteStore {
  notes: Note[];
  search: string;
  editorContent: string;
  noteColor: string;
  currentNoteIndex: null | number;
  setNotes: (updatedNotes: Note[]) => void;
  setSearch: (searchValue: string) => void;
  setEditorContent: (content: string) => void;
  setNoteColor: (color: string) => void;
  setCurrentNoteIndex: (index: number | null) => void;
  addOrUpdateNote: () => void;
  selectNote: (index: number) => void;
  deleteNote: (index: number) => void;
  clearEditor: () => void;
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useNotesStore = create<NoteStore>((set) => ({
  notes: [],
  search: "",
  editorContent: "",
  noteColor: "#fff",
  currentNoteIndex: null,

  setNotes: (updatedNotes) => set(() => ({ notes: updatedNotes })),
  setSearch: (searchValue) => set(() => ({ search: searchValue })),
  setEditorContent: (content) => set(() => ({ editorContent: content })),
  setNoteColor: (color) => set(() => ({ noteColor: color })),
  setCurrentNoteIndex: (index) => set(() => ({ currentNoteIndex: index })),

  clearEditor: () =>
    set(() => ({
      editorContent: "",
      noteColor: "#fff",
      currentNoteIndex: null,
    })),

  addOrUpdateNote: () =>
    set((state) => {
      const { editorContent, noteColor, currentNoteIndex, notes } = state;

      if (editorContent.trim() === "") return {};

      const now = new Date();

      if (currentNoteIndex !== null) {
        // Update existing note
        const updatedNotes = [...notes];
        updatedNotes[currentNoteIndex] = {
          ...updatedNotes[currentNoteIndex],
          text: editorContent,
          color: noteColor,
          updatedAt: now,
        };
        return {
          notes: updatedNotes,
          editorContent: "",
          noteColor: "#fff",
          currentNoteIndex: null,
        };
      } else {
        // Create new note
        const newNote: Note = {
          id: generateId(),
          text: editorContent,
          color: noteColor,
          createdAt: now,
          updatedAt: now,
        };
        return {
          notes: [...notes, newNote],
          editorContent: "",
          noteColor: "#fff",
          currentNoteIndex: null,
        };
      }
    }),

  selectNote: (index) =>
    set((state) => ({
      currentNoteIndex: index,
      editorContent: state.notes[index].text,
      noteColor: state.notes[index].color,
    })),

  deleteNote: (index) =>
    set((state) => {
      const updatedNotes = state.notes.filter((_, i) => i !== index);
      const newCurrentIndex =
        state.currentNoteIndex === index
          ? null
          : state.currentNoteIndex !== null && state.currentNoteIndex > index
          ? state.currentNoteIndex - 1
          : state.currentNoteIndex;

      return {
        notes: updatedNotes,
        currentNoteIndex: newCurrentIndex,
        editorContent:
          newCurrentIndex !== null
            ? updatedNotes[newCurrentIndex]?.text || ""
            : "",
        noteColor:
          newCurrentIndex !== null
            ? updatedNotes[newCurrentIndex]?.color || "#fff"
            : "#fff",
      };
    }),
}));
