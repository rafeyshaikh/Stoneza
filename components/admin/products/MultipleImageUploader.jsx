"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MultipleImageUploader({
  files = [],
  existingImages = [],
  onFilesChange,
  onExistingImagesChange,
  uploading = false,
  hint = "Images will upload to Cloudinary when you save the product.",
}) {
  const inputRef = useRef(null);

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const existing = existingImages.map((image) => ({
      url: image.url,
      publicId: image.publicId,
      isLocal: false,
    }));

    const local = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isLocal: true,
    }));

    setPreviewImages([...existing, ...local]);

    return () => {
      local.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [files, existingImages]);

  const handlePick = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    onFilesChange([...files, ...selectedFiles]);

    event.target.value = "";
  };

  const removeImage = (index) => {
    const existingCount = existingImages.length;

    if (index < existingCount) {
      const updatedExisting = existingImages.filter((_, i) => i !== index);

      onExistingImagesChange(updatedExisting);

      return;
    }

    const localIndex = index - existingCount;

    const updatedFiles = files.filter((_, i) => i !== localIndex);

    onFilesChange(updatedFiles);
  };

  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 p-5 dark:border-stone-700 dark:bg-stone-900/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-heading text-base font-semibold">
            Product Images
          </h4>

          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{hint}</p>

          <p className="mt-2 text-xs text-stone-400">
            First image becomes the product thumbnail.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
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
          Add Images
        </Button>
      </div>

      {previewImages.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {previewImages.map((image, index) => (
            <div
              key={image.publicId || image.url}
              className="relative aspect-square overflow-hidden rounded-xl border"
            >
              <Image
                src={image.url}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={image.isLocal}
              />

              {index === 0 && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                  <Star className="size-3 fill-white" />
                  Thumbnail
                </div>
              )}

              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2"
                disabled={uploading}
                onClick={() => removeImage(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
