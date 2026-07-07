"use client";

import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

import EditorToolbar from "./EditorToolbar";
import "./editor.css";

export default function TipTapEditor({
  value,
  onChange,
  placeholder,
}) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
  StarterKit,

  Underline,

  Image.configure({
    inline: false,
    allowBase64: false,
  }),

  Link.configure({
    openOnClick: false,
  }),

  Placeholder.configure({
    placeholder,
  }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
],

    content: value,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900"
    onClick={() => editor?.commands.focus()}>

      <div className="sticky top-0 z-10 bg-white dark:bg-stone-900">
        <EditorToolbar editor={editor} />
      </div>

      <div className="h-[500px] overflow-y-auto">
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-6"
      />
      </div>
    </div>
  );
}