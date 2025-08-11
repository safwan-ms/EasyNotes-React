import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect, useState } from "react";
import "./editor.css";

import { useNotesStore } from "./store";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";

const App = () => {
  const {
    editorContent,
    noteColor,
    currentNoteIndex,
    setEditorContent,
    setNoteColor,
    addOrUpdateNote,
    clearEditor,
  } = useNotesStore();

  const [isBoldMode, setIsBoldMode] = useState(false);
  const [isItalicMode, setIsItalicMode] = useState(false);
  const [isUnderlineMode, setIsUnderlineMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your note here...",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    onTransaction: ({ transaction, editor }) => {
      // If persistent mark modes are active and user types, ensure marks are set
      if (transaction.docChanged && transaction.selection.empty) {
        if (isBoldMode && !editor.isActive("bold")) {
          editor.chain().focus().setMark("bold").run();
        }
        if (isItalicMode && !editor.isActive("italic")) {
          editor.chain().focus().setMark("italic").run();
        }
        if (isUnderlineMode && !editor.isActive("underline")) {
          editor.chain().focus().setMark("underline").run();
        }
      }
    },
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        addOrUpdateNote();
      }

      // Cmd/Ctrl + N for new note
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        clearEditor();
        editor?.commands.focus();
      }

      // Escape to clear selection
      if (e.key === "Escape" && currentNoteIndex !== null) {
        clearEditor();
        editor?.commands.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [addOrUpdateNote, clearEditor, editor, currentNoteIndex]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                EasyNotes
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentNoteIndex !== null
                  ? "Editing note"
                  : "Create a new note"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-4 text-xs text-gray-500">
                <span>⌘S Save</span>
                <span>⌘N New</span>
                <span>Esc Clear</span>
              </div>
              <button className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Editor Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Toolbar */}
              <div className="overflow-x-auto">
                <Toolbar
                  editor={editor}
                  isBoldMode={isBoldMode}
                  setIsBoldMode={setIsBoldMode}
                  isItalicMode={isItalicMode}
                  setIsItalicMode={setIsItalicMode}
                  isUnderlineMode={isUnderlineMode}
                  setIsUnderlineMode={setIsUnderlineMode}
                />
              </div>

              {/* Editor Content */}
              <div className="min-h-[300px] sm:min-h-[400px] p-4 sm:p-6">
                <EditorContent
                  editor={editor}
                  className="h-full focus:outline-none prose prose-sm max-w-none"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Color Selector */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: noteColor }}
                  />
                  <span className="text-sm text-gray-600">Note color</span>
                </div>
                <input
                  type="color"
                  value={noteColor}
                  onChange={(e) => setNoteColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  title="Choose note color"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {currentNoteIndex !== null && (
                  <button
                    onClick={clearEditor}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  className="bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                  onClick={addOrUpdateNote}
                >
                  <AiOutlinePlus className="w-4 h-4" />
                  <span>
                    {currentNoteIndex !== null ? "Update Note" : "Save Note"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
