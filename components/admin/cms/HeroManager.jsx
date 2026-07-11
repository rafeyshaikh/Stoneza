"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { toast } from "sonner";

export default function HeroManager({ slides = [], onChange, uploadImage }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);

  const addSlide = () => {
    const newSlide = {
      title: "",
      eyebrow: "",
      paragraph: "",
      buttonText: "",
      buttonLink: "",
      image: { url: "", publicId: "" },
      isActive: true,
      sortOrder: slides.length + 1,
    };
    onChange([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    toast.success("New slide added");
  };

  const deleteSlide = (index) => {
    const updated = slides.filter((_, idx) => idx !== index);
    onChange(updated);
    if (activeSlideIndex === index) {
      setActiveSlideIndex(null);
    } else if (activeSlideIndex > index) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
    toast.success("Slide deleted");
  };

  const updateSlideField = (index, field, value) => {
    const updated = slides.map((s, idx) => {
      if (idx === index) {
        return { ...s, [field]: value };
      }
      return s;
    });
    onChange(updated);
  };

  const moveSlide = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === slides.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Recalculate sort orders based on list position
    const sorted = updated.map((slide, idx) => ({
      ...slide,
      sortOrder: idx + 1,
    }));

    onChange(sorted);
    setActiveSlideIndex(newIndex);
  };

  const handleImageSelect = async (index, file) => {
    try {
      const uploaded = await uploadImage(file, "homepage/hero");
      if (uploaded) {
        updateSlideField(index, "image", uploaded);
        toast.success("Image uploaded successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload slide image");
    }
  };

  const handleImageRemove = (index) => {
    updateSlideField(index, "image", { url: "", publicId: "" });
    toast.success("Image removed");
  };

  return (
    <section className="space-y-5 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
            Hero Slider CMS
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Manage main slider slides, banners, actions, and display ordering.
          </p>
        </div>
        <Button onClick={addSlide} size="sm" type="button" className="cursor-pointer border border-black bg-white hover:bg-gray-100">
          <Plus className="mr-2 size-4" /> Add Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white/60 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
          <ImageIcon className="mb-2 size-6 opacity-40" />
          No slides added yet. Click "Add Slide" to begin.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* SLIDES LIST SIDEBAR */}
          <div className="space-y-2 rounded-xl border border-stone-300 bg-white/60 p-2 dark:border-stone-700 dark:bg-stone-900/60 max-h-[450px] overflow-y-auto">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => setActiveSlideIndex(idx)}
                className={`group flex items-center justify-between gap-2 rounded-lg p-2.5 text-sm cursor-pointer transition ${
                  activeSlideIndex === idx
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] opacity-60">#{idx + 1}</span>
                  <div className="relative size-8 shrink-0 overflow-hidden rounded bg-stone-300">
                    {slide.image?.url ? (
                      <img
                        src={slide.image.url}
                        alt="Hero preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-stone-400">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </div>
                  <span className="truncate font-medium">
                    {slide.title || `Slide #${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSlide(idx, "up");
                    }}
                    disabled={idx === 0}
                    className="p-1 hover:text-stone-500 disabled:opacity-30"
                    type="button"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSlide(idx, "down");
                    }}
                    disabled={idx === slides.length - 1}
                    className="p-1 hover:text-stone-500 disabled:opacity-30"
                    type="button"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(idx);
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIVE SLIDE EDITOR */}
          <div className="rounded-xl border border-stone-300 bg-white p-5 dark:border-stone-700 dark:bg-stone-900">
            {activeSlideIndex === null || !slides[activeSlideIndex] ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                Select a slide from the sidebar to edit its content.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-heading font-medium text-stone-900 dark:text-stone-100">
                    Edit Slide #{activeSlideIndex + 1}
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={slides[activeSlideIndex].isActive}
                      onChange={(e) =>
                        updateSlideField(activeSlideIndex, "isActive", e.target.checked)
                      }
                      className="rounded border-stone-300 text-stone-950 focus:ring-stone-950"
                    />
                    Is Active
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-eyebrow">Eyebrow (Small Top Text)</Label>
                    <Input
                      id="hero-eyebrow"
                      placeholder="e.g. Natural Stone Collection"
                      value={slides[activeSlideIndex].eyebrow || ""}
                      onChange={(e) =>
                        updateSlideField(activeSlideIndex, "eyebrow", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hero-title">Title / Heading</Label>
                    <Input
                      id="hero-title"
                      placeholder="e.g. Timeless Elegance"
                      value={slides[activeSlideIndex].title || ""}
                      onChange={(e) =>
                        updateSlideField(activeSlideIndex, "title", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hero-paragraph">Description / Paragraph</Label>
                  <Textarea
                    id="hero-paragraph"
                    rows={3}
                    placeholder="Enter hero paragraph details..."
                    value={slides[activeSlideIndex].paragraph || ""}
                    onChange={(e) =>
                      updateSlideField(activeSlideIndex, "paragraph", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-btn-text">Button Text</Label>
                    <Input
                      id="hero-btn-text"
                      placeholder="e.g. Explore Collection"
                      value={slides[activeSlideIndex].buttonText || ""}
                      onChange={(e) =>
                        updateSlideField(activeSlideIndex, "buttonText", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hero-btn-link">Button Action Link</Label>
                    <Input
                      id="hero-btn-link"
                      placeholder="e.g. /collections/flooring"
                      value={slides[activeSlideIndex].buttonLink || ""}
                      onChange={(e) =>
                        updateSlideField(activeSlideIndex, "buttonLink", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <ImageUploader
                    existingImage={slides[activeSlideIndex].image?.url ? slides[activeSlideIndex].image : null}
                    onFileSelect={(file) => handleImageSelect(activeSlideIndex, file)}
                    onRemove={() => handleImageRemove(activeSlideIndex)}
                    hint="Upload high-resolution landscape images (1920x1080 recommendations)."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
