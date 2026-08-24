"use client";
import { useRef } from "react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function ToolbarButton({ active, onClick, children }) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`
        h-9 w-9 transition-colors
        ${
          active
            ? "bg-black text-white border-black hover:bg-black hover:text-white dark:bg-white dark:text-black dark:border-white dark:hover:bg-white dark:hover:text-black"
            : ""
        }
      `}
    >
      {children}
    </Button>
  );
}

import { uploadAdminImage } from "@/lib/uploadAdminImage";

async function uploadEditorImage(file) {
  const data = await uploadAdminImage(file, "blogs/content");
  return data?.url || "";
}

export default function EditorToolbar({ editor }) {

  const fileInputRef = useRef(null);
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
    }),
  });

  if (!editor) return null;

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const imageUrl = await uploadEditorImage(file);

      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
        })
        .run();
    } catch (error) {
      console.error(error);

      alert("Image upload failed");
    }

    event.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-stone-200 p-3 dark:border-stone-700">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageUpload}
      />

      <ToolbarButton
        active={editorState.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.h1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={editorState.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <ToolbarButton
        active={false}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={16} />
      </ToolbarButton>
    </div>
  );
}
