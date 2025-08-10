import { FiSearch, FiPlus, FiMenu, FiTrash2 } from "react-icons/fi";
import { useNotesStore } from "../store";

const Sidebar = () => {
  const {
    notes,
    search,
    selectNote,
    setSearch,
    // setCurrentNoteIndex,
    // setEditorContent,
    // setNoteColor,
    deleteNote,
    clearEditor,
  } = useNotesStore();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  const createNewNote = () => {
    clearEditor();
  };

  const getNotePreview = (htmlContent: string) => {
    // Remove HTML tags and get plain text for preview
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.length > 80
      ? textContent.substring(0, 80) + "..."
      : textContent;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeleteNote = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(index);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
          <button
            onClick={createNewNote}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Create new note"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length > 0 ? (
          <div className="p-2">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className="group p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                onClick={() => selectNote(index)}
              >
                <div className="flex items-start space-x-3">
                  {/* Color Indicator */}
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{
                      backgroundColor: note.color,
                      border:
                        note.color === "#fff" ? "1px solid #e5e7eb" : "none",
                    }}
                  />

                  {/* Note Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 leading-relaxed mb-1">
                      {getNotePreview(note.text) || (
                        <span className="text-gray-400 italic">Empty note</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={(e) => handleDeleteNote(e, index)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete note"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiMenu className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {search ? "No notes found" : "No notes yet"}
            </p>
            {!search && (
              <p className="text-gray-400 text-xs mt-1">
                Create your first note to get started
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
