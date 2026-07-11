"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Star, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TestimonialsManager({ testimonials = [], onChange }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const addTestimonial = () => {
    const item = {
      name: "",
      review: "",
      stars: 5,
      sortOrder: testimonials.length + 1,
    };
    onChange([...testimonials, item]);
    setActiveIdx(testimonials.length);
    toast.success("Added new testimonial slot");
  };

  const deleteTestimonial = (index) => {
    const updated = testimonials.filter((_, idx) => idx !== index);
    onChange(updated);
    if (activeIdx === index) {
      setActiveIdx(null);
    } else if (activeIdx > index) {
      setActiveIdx(activeIdx - 1);
    }
    toast.success("Testimonial slot removed");
  };

  const updateField = (index, field, value) => {
    const updated = testimonials.map((t, idx) => {
      if (idx === index) {
        return { ...t, [field]: value };
      }
      return t;
    });
    onChange(updated);
  };

  const moveTestimonial = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === testimonials.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...testimonials];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    const sorted = updated.map((t, idx) => ({
      ...t,
      sortOrder: idx + 1,
    }));

    onChange(sorted);
    setActiveIdx(newIndex);
  };

  return (
    <section className="space-y-5 rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
            Customer Testimonials CMS
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Manage testimonials, star ratings, review statements, and display sequences.
          </p>
        </div>
        <Button onClick={addTestimonial} size="sm" type="button">
          <Plus className="mr-2 size-4" /> Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white/60 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-400">
          <MessageSquareQuote className="mb-2 size-6 opacity-40" />
          No testimonials added yet. Click "Add Testimonial" to begin.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* LIST SIDEBAR */}
          <div className="space-y-2 rounded-xl border border-stone-300 bg-white/60 p-2 dark:border-stone-700 dark:bg-stone-900/60 max-h-[400px] overflow-y-auto">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`group flex items-center justify-between gap-2 rounded-lg p-2.5 text-sm cursor-pointer transition ${
                  activeIdx === idx
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "hover:bg-stone-200/50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] opacity-60">#{idx + 1}</span>
                  <div className="flex shrink-0 items-center justify-center text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-0.5 text-xs text-stone-600 dark:text-stone-400 font-semibold">
                      {item.stars || 5}
                    </span>
                  </div>
                  <span className="truncate font-medium">
                    {item.name || `Reviewer #${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTestimonial(idx, "up");
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
                      moveTestimonial(idx, "down");
                    }}
                    disabled={idx === testimonials.length - 1}
                    className="p-1 hover:text-stone-500 disabled:opacity-30"
                    type="button"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTestimonial(idx);
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

          {/* EDITOR CARD */}
          <div className="rounded-xl border border-stone-300 bg-white p-5 dark:border-stone-700 dark:bg-stone-900">
            {activeIdx === null || !testimonials[activeIdx] ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                Select a reviewer card from the list to edit details.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-heading font-medium text-stone-900 dark:text-stone-100">
                    Edit Testimonial #{activeIdx + 1}
                  </h4>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="review-name">Customer Name</Label>
                    <Input
                      id="review-name"
                      placeholder="e.g. John Doe"
                      value={testimonials[activeIdx].name || ""}
                      onChange={(e) =>
                        updateField(activeIdx, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="review-stars">Rating / Stars</Label>
                    <select
                      id="review-stars"
                      value={testimonials[activeIdx].stars || 5}
                      onChange={(e) =>
                        updateField(activeIdx, "stars", Number(e.target.value))
                      }
                      className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                    >
                      <option value={5}>5 Stars (Excellent)</option>
                      <option value={4}>4 Stars (Good)</option>
                      <option value={3}>3 Stars (Average)</option>
                      <option value={2}>2 Stars (Poor)</option>
                      <option value={1}>1 Star (Terrible)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="review-text">Review / Feedback Statement</Label>
                  <Textarea
                    id="review-text"
                    rows={4}
                    placeholder="Enter review statement details here..."
                    value={testimonials[activeIdx].review || ""}
                    onChange={(e) =>
                      updateField(activeIdx, "review", e.target.value)
                    }
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
