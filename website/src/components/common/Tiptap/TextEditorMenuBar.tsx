import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
} from "@mui/icons-material";
import { Editor } from "@tiptap/react";

// Button component with enhanced accessibility
const Button = ({
  onClick,
  isActive,
  disabled,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`editor-button ${isActive ? "active" : ""} ${
      disabled ? "disabled" : ""
    }`}
  >
    {children}
  </button>
);

export default function TextEditorMenuBar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;

  const buttons = [
    {
      icon: <FormatBold className="size-5" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      ariaLabel: "Bold",
    },
    {
      icon: <FormatItalic className="size-5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      ariaLabel: "Italic",
    },
    {
      icon: <FormatStrikethrough className="size-5" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      ariaLabel: "Strikethrough",
    },
    {
      icon: <Code className="size-5" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      disabled: !editor.can().chain().focus().toggleCode().run(),
      ariaLabel: "Code",
    },
    {
      icon: <FormatListBulleted className="size-5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      ariaLabel: "Bullet List",
    },
    {
      icon: <FormatListNumbered className="size-5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      disabled: !editor.can().chain().focus().toggleOrderedList().run(),
      ariaLabel: "Numbered List",
    },
    {
      icon: <Undo className="size-5" />,
      onClick: () => editor.chain().focus().undo().run(),
      isActive: editor.isActive("undo"),
      disabled: !editor.can().chain().focus().undo().run(),
      ariaLabel: "Undo",
    },
    {
      icon: <Redo className="size-5" />,
      onClick: () => editor.chain().focus().redo().run(),
      isActive: editor.isActive("redo"),
      disabled: !editor.can().chain().focus().redo().run(),
      ariaLabel: "Redo",
    },
  ];

  return (
    <div className="editor-toolbar">
      {buttons.map(
        ({ icon, onClick, isActive, disabled, ariaLabel }, index) => (
          <Button
            key={index}
            onClick={onClick}
            isActive={isActive}
            disabled={disabled}
            ariaLabel={ariaLabel}
          >
            {icon}
          </Button>
        )
      )}
    </div>
  );
}
