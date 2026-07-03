"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Local-only image picker. Does NOT upload to Cloudinary.
 *
 * - `file`         currently selected File object (if the user just picked one)
 * - `existingImage` { url, publicId } already saved on the record (edit mode)
 * - `onFileSelect`  called with the raw File when the user picks something
 * - `onRemove`      called when the user clears the selection/existing image
 * - `uploading`     true while the PARENT form is uploading on submit
 *
 * The actual Cloudinary upload happens in the parent's handleSubmit, so the
 * image is only ever persisted if the whole form is actually saved.
 */
export default function ImageUploader({
  file = null,
  existingImage = null,
  onFileSelect,
  onRemove,
  uploading = false,
  hint = "Image uploads to Cloudinary when you save.",
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(existingImage?.url || "");

  // Build/revoke a local object URL whenever a new file is picked, so we
  // never touch the network just to show a preview.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(existingImage?.url || "");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, existingImage?.url]);

  const handlePick = (event) => {
    const picked = event.target.files?.[0];
    if (!picked) return;
    onFileSelect(picked);
    // allow picking the same file again later if removed
    event.target.value = "";
  };

  const handleRemove = () => {
    onRemove();
  };

  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 p-5 dark:border-stone-700 dark:bg-stone-900/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-heading text-base font-semibold text-stone-900 dark:text-stone-100">
            Image
          </h4>

          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {hint}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePick}
        />

        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="size-4" />
          {previewUrl ? "Replace" : "Choose image"}
        </Button>
      </div>

      {previewUrl && (
        <div className="relative mt-5 h-48 w-48 overflow-hidden rounded-xl border">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={Boolean(file)} // object URLs aren't optimizable by next/image
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2"
            disabled={uploading}
            onClick={handleRemove}
          >
            <Trash2 className="size-4" />
          </Button>

          {file && !uploading && (
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
              Not saved yet
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white">
              Uploading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}