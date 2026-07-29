"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
  Sparkles
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BulkImportModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultStats, setResultStats] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async (useDefault = false) => {
    try {
      setLoading(true);
      setResultStats(null);

      let res;
      if (useDefault) {
        res = await fetch("/api/admin/products/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ defaultCatalog: true }),
        });
      } else {
        if (!selectedFile) {
          toast.error("Please select an Excel file to upload");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        res = await fetch("/api/admin/products/import", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to process import");
      }

      setResultStats(data.data);
      toast.success("Bulk import completed successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#c9a877]">
            <FileSpreadsheet className="size-6" />
            <DialogTitle className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Bulk Product Data Import
            </DialogTitle>
          </div>
          <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm">
            Import products and automatic 3-level categories directly from Excel spreadsheets.
          </DialogDescription>
        </DialogHeader>

        {resultStats ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
              <CheckCircle2 className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold text-sm">Import Completed Successfully</p>
                <p className="text-xs opacity-90">
                  Processed {resultStats.productsProcessed} total catalog products.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-center">
                <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {resultStats.inserted}
                </p>
                <p className="text-[11px] font-medium text-stone-500">New Products</p>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-center">
                <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {resultStats.updated}
                </p>
                <p className="text-[11px] font-medium text-stone-500">Updated</p>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-center">
                <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {resultStats.categoriesCreated}
                </p>
                <p className="text-[11px] font-medium text-stone-500">Categories Created</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => {
                  setResultStats(null);
                  onClose();
                }}
                className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 cursor-pointer"
              >
                Close & Refresh List
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Quick Import Option */}
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
                  <Sparkles className="size-4 text-[#c9a877]" />
                  Default Catalog Preset
                </div>
                <span className="text-[11px] bg-amber-200/60 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-medium">
                  137 Products
                </span>
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                One-click import the official Stoneza Master Architectural Catalog (`Stoneza_Product_ Data- (My version).xlsx`).
              </p>
              <Button
                onClick={() => handleImport(true)}
                disabled={loading}
                className="w-full bg-[#c9a877] text-stone-950 hover:bg-[#b89766] font-semibold text-xs h-9 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing Master Catalog...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 size-4" />
                    Import Master Product Catalog
                  </>
                )}
              </Button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <span className="relative bg-white dark:bg-stone-900 px-3 text-[11px] uppercase font-bold tracking-wider text-stone-400">
                Or upload custom file
              </span>
            </div>

            {/* Drag & Drop File Upload */}
            <div className="space-y-3">
              <label
                htmlFor="excel-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 hover:bg-stone-100/50 dark:hover:bg-stone-900/50 transition cursor-pointer"
              >
                <Upload className="size-6 text-stone-400 mb-2" />
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {selectedFile ? selectedFile.name : "Click to browse or drag & drop .xlsx file"}
                </p>
                <p className="text-[10px] text-stone-400 mt-1">
                  Supports standard Stoneza Product Data Sheet template
                </p>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <Button
                onClick={() => handleImport(false)}
                disabled={loading || !selectedFile}
                variant="outline"
                className="w-full font-semibold text-xs h-9 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading & Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 size-4" />
                    Upload & Import Selected File
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
