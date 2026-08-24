"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";


export default function ImageUploader({
  file = null,
  existingImage = null,
  onFileSelect,
  onRemove,
  uploading = false,
  hint = "Image uploads to Cloudinary when you save.",
}) {
  const inputRef = useRef(null);

  // Build/revoke a local object URL whenever a new file is picked
  const objectUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const displayUrl = file ? objectUrl : existingImage?.url || "";

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
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
          className="hidden"
          onChange={handlePick}
        />

        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="cursor-pointer bg-white hover:bg-gray-100 w-full sm:w-auto shrink-0"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-1.5 size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-1.5 size-4" />
              {displayUrl ? "Replace" : "Choose image"}
            </>
          )}
        </Button>
      </div>

      {uploading && !displayUrl && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-stone-300 bg-stone-100 p-4 text-xs font-medium text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
          <Loader2 className="size-4 animate-spin text-stone-900 dark:text-stone-100" />
          <span>Uploading image to Cloudinary... Please wait.</span>
        </div>
      )}

      {displayUrl && (
        <div className="relative mt-5 h-48 w-48 overflow-hidden rounded-xl border">
          <Image
            src={displayUrl}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={Boolean(file || (displayUrl && (displayUrl.startsWith("blob:") || displayUrl.startsWith("http"))))}
          />

          {!uploading && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute right-2 top-2 z-10"
              disabled={uploading}
              onClick={handleRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          )}

          {file && !uploading && (
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
              Not saved yet
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs p-2 text-center text-xs font-medium text-white transition animate-in fade-in">
              <Loader2 className="mb-2 size-6 animate-spin text-stone-200" />
              <span>Uploading to Cloudinary...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}