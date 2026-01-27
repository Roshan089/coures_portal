"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextEditorMenuBar from "./TextEditorMenuBar";
import Underline from "@tiptap/extension-underline";
import "./styles.scss"; // Import the CSS file
import { FC } from "react";

type TiptapProps = {
  onChange: (content: string) => void;
  initialContent?: string; // Add this line
};

const Tiptap: FC<TiptapProps> = ({ onChange, initialContent }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {},
    },
    immediatelyRender: false,
    content: initialContent,
  });

  return (
    <div className="tiptap-container">
      <div className="tiptap-toolbar">
        <TextEditorMenuBar editor={editor} />
      </div>
      <div className="tiptap-editor">
        <EditorContent editor={editor} style={{ flexGrow: 1 }} />
      </div>
    </div>
  );
};

export default Tiptap;
