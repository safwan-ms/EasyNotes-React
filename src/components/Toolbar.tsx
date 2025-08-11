import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  Quote,
  Code,
  Strikethrough,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
  isBoldMode: boolean;
  setIsBoldMode: (active: boolean) => void;
  isItalicMode: boolean;
  setIsItalicMode: (active: boolean) => void;
  isUnderlineMode: boolean;
  setIsUnderlineMode: (active: boolean) => void;
}

const Toolbar = ({
  editor,
  isBoldMode,
  setIsBoldMode,
  isItalicMode,
  setIsItalicMode,
  isUnderlineMode,
  setIsUnderlineMode,
}: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ElementType;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-all duration-200 ${
        isActive
          ? "bg-blue-100 text-blue-600 shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  const ToolbarDivider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-1 flex-wrap">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => {
            const selection = editor.state.selection;
            if (selection.empty) {
              const next = !isBoldMode;
              setIsBoldMode(next);
              if (next && !editor.isActive("bold")) {
                editor.chain().focus().setMark("bold").run();
              }
              if (!next && editor.isActive("bold")) {
                editor.chain().focus().unsetMark("bold").run();
              }
            } else {
              editor.chain().focus().toggleBold().run();
            }
          }}
          isActive={editor.isActive("bold") || isBoldMode}
          icon={Bold}
          title={isBoldMode ? "Bold (on)" : "Bold (Ctrl+B)"}
        />
        <ToolbarButton
          onClick={() => {
            const selection = editor.state.selection;
            if (selection.empty) {
              // Toggle persistent italic mode and update UI immediately
              const next = !isItalicMode;
              setIsItalicMode(next);
              if (next && !editor.isActive("italic")) {
                editor.chain().focus().setMark("italic").run();
              }
              if (!next && editor.isActive("italic")) {
                editor.chain().focus().unsetMark("italic").run();
              }
            } else {
              editor.chain().focus().toggleItalic().run();
            }
          }}
          isActive={editor.isActive("italic") || isItalicMode}
          icon={Italic}
          title={isItalicMode ? "Italic (on)" : "Italic (Ctrl+I)"}
        />
        <ToolbarButton
          onClick={() => {
            const selection = editor.state.selection;
            if (selection.empty) {
              // Toggle persistent underline mode and update UI immediately
              const next = !isUnderlineMode;
              setIsUnderlineMode(next);
              if (next && !editor.isActive("underline")) {
                editor.chain().focus().setMark("underline").run();
              }
              if (!next && editor.isActive("underline")) {
                editor.chain().focus().unsetMark("underline").run();
              }
            } else {
              editor.chain().focus().toggleUnderline().run();
            }
          }}
          isActive={editor.isActive("underline") || isUnderlineMode}
          icon={Underline}
          title={isUnderlineMode ? "Underline (on)" : "Underline (Ctrl+U)"}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          title="Strikethrough"
        />
      </div>

      <ToolbarDivider />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
      </div>

      <ToolbarDivider />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          title="Numbered List"
        />
      </div>

      <ToolbarDivider />

      {/* Blocks */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          title="Quote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={Code}
          title="Code Block"
        />
      </div>

      <ToolbarDivider />

      {/* Links */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          icon={Link}
          title="Add Link"
        />
      </div>
    </div>
  );
};

export default Toolbar;
