"use client";

import { useRef, useState, useEffect } from "react";
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
  Link2,
  Unlink,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { uploadAdminImage } from "@/lib/uploadAdminImage";

function ToolbarButton({ active, onClick, title, children }) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`
        h-9 w-9 transition-colors cursor-pointer
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

async function uploadEditorImage(file) {
  const data = await uploadAdminImage(file, "blogs/content");
  return data?.url || "";
}

export default function EditorToolbar({ editor }) {
  const fileInputRef = useRef(null);

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);

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
      link: editor.isActive("link"),
    }),
  });

  const handleOpenLinkModal = () => {
    if (!editor) return;

    const isLinkActive = editor.isActive("link");
    const existingUrl = isLinkActive ? editor.getAttributes("link").href || "" : "";
    const existingTarget = isLinkActive ? editor.getAttributes("link").target === "_blank" : true;

    const { from, to } = editor.state.selection;
    const selectedText = from !== to ? editor.state.doc.textBetween(from, to, " ") : "";

    setLinkUrl(existingUrl);
    setLinkText(selectedText);
    setOpenInNewTab(existingTarget);
    setIsLinkDialogOpen(true);
  };

  const handleApplyLink = (e) => {
    if (e) e.preventDefault();
    if (!editor) return;

    let url = linkUrl.trim();

    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsLinkDialogOpen(false);
      return;
    }

    if (url.startsWith("www.")) {
      url = `https://${url}`;
    }

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    const linkAttrs = {
      href: url,
      target: openInNewTab ? "_blank" : null,
      rel: openInNewTab ? "noopener noreferrer" : null,
    };

    if (!hasSelection && linkText.trim()) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: linkText.trim(),
          marks: [
            {
              type: "link",
              attrs: linkAttrs,
            },
          ],
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink(linkAttrs)
        .run();
    }

    setIsLinkDialogOpen(false);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkDialogOpen(false);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        if (editor?.isFocused) {
          e.preventDefault();
          handleOpenLinkModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

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
    <>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 p-2.5 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />

        {/* Text formatting */}
        <ToolbarButton
          active={editorState.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <div className="h-5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

        {/* Hyperlink controls */}
        <ToolbarButton
          active={editorState.link}
          onClick={handleOpenLinkModal}
          title={editorState.link ? "Edit Hyperlink (Ctrl+K)" : "Insert Hyperlink (Ctrl+K)"}
        >
          <Link2 size={16} />
        </ToolbarButton>

        {editorState.link && (
          <ToolbarButton
            active={false}
            onClick={handleRemoveLink}
            title="Remove Hyperlink"
          >
            <Unlink size={16} className="text-red-500" />
          </ToolbarButton>
        )}

        <div className="h-5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

        {/* Headings */}
        <ToolbarButton
          active={editorState.h1}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <div className="h-5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

        {/* Lists & Quotes */}
        <ToolbarButton
          active={editorState.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editorState.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="h-5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

        {/* Media Upload */}
        <ToolbarButton
          active={false}
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </ToolbarButton>
      </div>

      {/* Hyperlink Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="size-5 text-[#9A4A2E]" />
              {editorState.link ? "Edit Hyperlink" : "Insert Hyperlink"}
            </DialogTitle>
            <DialogDescription>
              Enter the target destination URL and link behavior.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyLink} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="link-url">URL / Destination</Label>
              <div className="relative">
                <Input
                  id="link-url"
                  type="text"
                  placeholder="https://stoneza.in/product/kota-blue or /contact"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link-text">Display Text (Optional)</Label>
              <Input
                id="link-text"
                type="text"
                placeholder="Custom anchor text..."
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-950/50">
              <div className="space-y-0.5">
                <Label htmlFor="new-tab-switch" className="text-sm font-medium cursor-pointer">
                  Open link in new tab
                </Label>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Adds <code className="text-[11px] font-mono bg-stone-200/60 dark:bg-stone-800 px-1 py-0.5 rounded">target=&quot;_blank&quot;</code> and security attributes.
                </p>
              </div>
              <Switch
                id="new-tab-switch"
                checked={openInNewTab}
                onCheckedChange={setOpenInNewTab}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              {editorState.link && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemoveLink}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 mr-auto"
                >
                  <Unlink className="size-4 mr-1.5" />
                  Remove Link
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
              >
                {editorState.link ? "Save Changes" : "Apply Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
