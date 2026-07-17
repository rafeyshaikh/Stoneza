"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VariantManager({ variants = [], onChange }) {
  const handleAddVariant = () => {
    onChange([...variants, { name: "", options: "" }]);
  };

  const handleRemoveVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {variants.map((variant, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-4 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-900 md:flex-row md:items-end"
        >
          <div className="flex-1 space-y-2">
            <Label className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Dropdown Label Name (e.g. SURFACE FINISH)
            </Label>
            <Input
              placeholder="e.g. SURFACE FINISH"
              value={variant.name}
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
            />
          </div>

          <div className="flex-[2] space-y-2">
            <Label className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Dropdown Choices (comma-separated list)
            </Label>
            <Input
              placeholder="e.g. Natural Split, Honed, Polished, Sandblasted"
              value={variant.options}
              onChange={(e) => handleFieldChange(index, "options", e.target.value)}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer self-end md:mb-0.5"
            onClick={() => handleRemoveVariant(index)}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      ))}

      {variants.length === 0 && (
        <p className="text-sm text-stone-500 italic py-2">
          No custom variant dropdowns added yet. Click below to add one.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddVariant}
        className="flex items-center gap-2 border-stone-300 dark:border-stone-700 cursor-pointer text-stone-700 dark:text-stone-300"
      >
        <Plus className="size-4" /> Add Dropdown
      </Button>
    </div>
  );
}
