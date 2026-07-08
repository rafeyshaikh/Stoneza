"use client";

import { useMemo, useState } from "react";

import ImageUploader from "@/components/admin/products/ImageUploader";
import ProductSeoForm from "@/components/admin/products/ProductSeoForm";
import TipTapEditor from "@/components/admin/editor/TipTapEditor";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleImageUploader from "./MultipleImageUploader";

const getEmptyForm = () => ({
  name: "",
  description: "",
  shortDescription: "",

  categoryLevel1: "",
  categoryLevel2: "",
  categoryLevel3: "",

  price: "",
  stock: 0,
  weight: 0,

  dimensions: {
    length: "",
    width: "",
    height: "",
  },

  images: [],

  hoverImage: {
    url: "",
    publicId: "",
  },

  tags: "",

  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,

  status: "published",

  stoneDetails: {
    stoneType: "",
    productForm: "",
    calibratedThickness: "",
    faceTexture: "",
    cornerPieces: "",
    coveragePerUnit: "",
    waterAbsorption: "",
    density: "",
    weatherResistance: "",
    application: "",
    installationMethod: "",
    moq: "Project-based — ask us",
    weightPerSqM: "",
    groutRecommendation: "",
    sealerRequirement: "",
    leadTime: "",
    sampleAvailable: true,
  },

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    ogImage: "",
  },
});

function parentIdOf(category) {
  if (!category?.parentCategory) return null;
  return typeof category.parentCategory === "object"
    ? category.parentCategory._id
    : category.parentCategory;
}

export default function ProductForm({
  categories = [],
  initialData = null,
  isEdit = false,
}) {
  const [formData, setFormData] = useState(() => {
    if (!initialData) return getEmptyForm();

    return {
      name: initialData.name || "",

      description: initialData.description || "",

      shortDescription: initialData.shortDescription || "",

      categoryLevel1: initialData.categoryLevel1 || "",
      categoryLevel2: initialData.categoryLevel2 || "",
      categoryLevel3: initialData.categoryLevel3 || "",

      price: initialData.price || "",

      stock: initialData.stock || 0,

      sku: initialData.sku || "",

      images: initialData.images || [],

      hoverImage: initialData.hoverImage || {
        url: "",
        publicId: "",
      },

      tags: initialData.tags?.join(", ") || "",

      isFeatured: initialData.isFeatured || false,

      isBestSeller: initialData.isBestSeller || false,

      isNewArrival: initialData.isNewArrival || false,

      status: initialData.status || "published",

      stoneDetails: {
        stoneType: initialData.stoneDetails?.stoneType || "",
        productForm: initialData.stoneDetails?.productForm || "",
        calibratedThickness: initialData.stoneDetails?.calibratedThickness || "",
        faceTexture: initialData.stoneDetails?.faceTexture || "",
        cornerPieces: initialData.stoneDetails?.cornerPieces || "",
        coveragePerUnit: initialData.stoneDetails?.coveragePerUnit || "",
        waterAbsorption: initialData.stoneDetails?.waterAbsorption || "",
        density: initialData.stoneDetails?.density || "",
        weatherResistance: initialData.stoneDetails?.weatherResistance || "",
        application: initialData.stoneDetails?.application || "",
        installationMethod: initialData.stoneDetails?.installationMethod || "",
        moq: initialData.stoneDetails?.moq || "Project-based — ask us",
        weightPerSqM: initialData.stoneDetails?.weightPerSqM || "",
        groutRecommendation: initialData.stoneDetails?.groutRecommendation || "",
        sealerRequirement: initialData.stoneDetails?.sealerRequirement || "",
        leadTime: initialData.stoneDetails?.leadTime || "",
        sampleAvailable: initialData.stoneDetails?.sampleAvailable !== undefined ? initialData.stoneDetails?.sampleAvailable : true,
      },

      dimensions: {
        length: initialData.dimensions?.length || "",

        width: initialData.dimensions?.width || "",

        height: initialData.dimensions?.height || "",
      },

      weight: initialData.weight || 0,

      seo: {
        metaTitle: initialData.seo?.metaTitle || "",

        metaDescription: initialData.seo?.metaDescription || "",

        keywords: initialData.seo?.keywords?.join(", ") || "",

        canonicalUrl: initialData.seo?.canonicalUrl || "",

        ogImage: initialData.seo?.ogImage || "",
      },
    };
  });
  const [productImages, setProductImages] = useState([]);
  const [hoverImage, setHoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const level1Categories = useMemo(() => {
    return categories.filter((category) => !parentIdOf(category));
  }, [categories]);

  const level2Categories = useMemo(() => {
    if (!formData.categoryLevel1) return [];
    return categories.filter(
      (category) => parentIdOf(category) === formData.categoryLevel1,
    );
  }, [categories, formData.categoryLevel1]);

  const level3Categories = useMemo(() => {
    if (!formData.categoryLevel2) return [];
    return categories.filter(
      (category) => parentIdOf(category) === formData.categoryLevel2,
    );
  }, [categories, formData.categoryLevel2]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStoneChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      stoneDetails: {
        ...prev.stoneDetails,
        [key]: value,
      },
    }));
  };

  const handleDimensionChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [key]: value,
      },
    }));
  };

  const handleSeoChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value,
      },
    }));
  };

  const handleLevel1Change = (value) => {
    setFormData((prev) => ({
      ...prev,
      categoryLevel1: value,
      categoryLevel2: "",
      categoryLevel3: "",
    }));
  };

  const handleLevel2Change = (value) => {
    setFormData((prev) => ({
      ...prev,
      categoryLevel2: value,
      categoryLevel3: "",
    }));
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);

      reader.onerror = () => reject(new Error("Could not read selected file"));

      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(file, folder = "products") {
    const base64 = await fileToBase64(file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        image: base64,
        folder,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let uploadedImages = [...(formData.images || [])];

      if (productImages.length) {
        const newImages = await Promise.all(
          productImages.map((file) => uploadImage(file, "products")),
        );

        uploadedImages = [...uploadedImages, ...newImages];
      }

      let uploadedHoverImage = formData.hoverImage || {
        url: "",
        publicId: "",
      };

      if (hoverImage) {
        uploadedHoverImage = await uploadImage(hoverImage, "products/hover");
      }

      const finalCategory =
        formData.categoryLevel3 ||
        formData.categoryLevel2 ||
        formData.categoryLevel1;

      const payload = {
        ...formData,

        category: finalCategory,

        images: uploadedImages,

        hoverImage: uploadedHoverImage,

        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        seo: {
          ...formData.seo,

          keywords: formData.seo.keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      };

      delete payload.categoryLevel1;
      delete payload.categoryLevel2;
      delete payload.categoryLevel3;

      const response = await fetch(
        isEdit
          ? `/api/admin/products/${initialData._id}`
          : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      console.log("Product saved:", data);

      toast.success(
        isEdit
          ? "Product updated successfully"
          : "Product created successfully",
      );
      if (!isEdit) {
        setFormData(getEmptyForm());
        setProductImages([]);
        setHoverImage(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Basic Information</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Product Name *">
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Field>

          <Field label="Top Category *">
            <CategorySelect
              value={formData.categoryLevel1}
              categories={level1Categories}
              onChange={handleLevel1Change}
            />
          </Field>

          <Field label="Second Category">
            <CategorySelect
              value={formData.categoryLevel2}
              categories={level2Categories}
              onChange={handleLevel2Change}
              disabled={!formData.categoryLevel1}
            />
          </Field>

          <Field label="Final Category *">
            <CategorySelect
              value={formData.categoryLevel3}
              categories={level3Categories}
              onChange={(value) => handleChange("categoryLevel3", value)}
              disabled={!formData.categoryLevel2}
            />
          </Field>

          <Field label="Description *" className="md:col-span-2">
            <TipTapEditor
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
              placeholder="Write product description here..."
            />
          </Field>

          <Field label="Short Description" className="md:col-span-2">
            <Textarea
              rows={3}
              value={formData.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
          </Field>
          <Field label="Tags (comma-separated)" className="md:col-span-2">
            <Input
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Pricing & Inventory</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Price">
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value === "" ? "" : Number(e.target.value))}
            />
          </Field>

          <Field label="Stock">
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
            />
          </Field>

          <Field label="Weight">
            <Input
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange("weight", Number(e.target.value))}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Dimensions</h3>

        <div className="grid gap-5 md:grid-cols-3">
          <Input
            placeholder="Length"
            value={formData.dimensions.length}
            onChange={(e) => handleDimensionChange("length", e.target.value)}
          />

          <Input
            placeholder="Width"
            value={formData.dimensions.width}
            onChange={(e) => handleDimensionChange("width", e.target.value)}
          />

          <Input
            placeholder="Height"
            value={formData.dimensions.height}
            onChange={(e) => handleDimensionChange("height", e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Stone & Tiles Specifications</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Stone Type *">
            <Input
              placeholder="e.g. Natural quartzitic sandstone"
              value={formData.stoneDetails.stoneType}
              onChange={(e) => handleStoneChange("stoneType", e.target.value)}
            />
          </Field>

          <Field label="Product Form">
            <Input
              placeholder="e.g. Loose rubble panels, crated"
              value={formData.stoneDetails.productForm}
              onChange={(e) => handleStoneChange("productForm", e.target.value)}
            />
          </Field>

          <Field label="Calibrated Thickness">
            <Input
              placeholder="e.g. 20–30 mm (calibrated back)"
              value={formData.stoneDetails.calibratedThickness}
              onChange={(e) => handleStoneChange("calibratedThickness", e.target.value)}
            />
          </Field>

          <Field label="Face Texture">
            <Input
              placeholder="e.g. Natural split / antique"
              value={formData.stoneDetails.faceTexture}
              onChange={(e) => handleStoneChange("faceTexture", e.target.value)}
            />
          </Field>

          <Field label="Corner Pieces">
            <Input
              placeholder="e.g. L-shaped, pre-fabricated"
              value={formData.stoneDetails.cornerPieces}
              onChange={(e) => handleStoneChange("cornerPieces", e.target.value)}
            />
          </Field>

          <Field label="Coverage Per Unit">
            <Input
              placeholder="e.g. ~0.5 sq m per box (indicative)"
              value={formData.stoneDetails.coveragePerUnit}
              onChange={(e) => handleStoneChange("coveragePerUnit", e.target.value)}
            />
          </Field>

          <Field label="Water Absorption">
            <Input
              placeholder="e.g. < 1% (low porosity)"
              value={formData.stoneDetails.waterAbsorption}
              onChange={(e) => handleStoneChange("waterAbsorption", e.target.value)}
            />
          </Field>

          <Field label="Density (kg/m³)">
            <Input
              type="number"
              placeholder="e.g. 2400"
              value={formData.stoneDetails.density}
              onChange={(e) => handleStoneChange("density", e.target.value ? Number(e.target.value) : "")}
            />
          </Field>

          <Field label="Weather Resistance">
            <Input
              placeholder="e.g. Yes — exterior grade"
              value={formData.stoneDetails.weatherResistance}
              onChange={(e) => handleStoneChange("weatherResistance", e.target.value)}
            />
          </Field>

          <Field label="Application">
            <Input
              placeholder="e.g. Interior & exterior walls"
              value={formData.stoneDetails.application}
              onChange={(e) => handleStoneChange("application", e.target.value)}
            />
          </Field>

          <Field label="Installation Method">
            <Input
              placeholder="e.g. Adhesive on prepared substrate"
              value={formData.stoneDetails.installationMethod}
              onChange={(e) => handleStoneChange("installationMethod", e.target.value)}
            />
          </Field>

          <Field label="Minimum Order Quantity (MOQ)">
            <Input
              placeholder="e.g. Project-based — ask us"
              value={formData.stoneDetails.moq}
              onChange={(e) => handleStoneChange("moq", e.target.value)}
            />
          </Field>

          <Field label="Weight per sq m">
            <Input
              placeholder="e.g. ~75 kg/sq m"
              value={formData.stoneDetails.weightPerSqM}
              onChange={(e) => handleStoneChange("weightPerSqM", e.target.value)}
            />
          </Field>

          <Field label="Grout Recommendation">
            <Input
              placeholder="e.g. Dry-stacked or 10-15mm joint"
              value={formData.stoneDetails.groutRecommendation}
              onChange={(e) => handleStoneChange("groutRecommendation", e.target.value)}
            />
          </Field>

          <Field label="Sealing Requirements">
            <Input
              placeholder="e.g. Impregnating penetrating sealer recommended"
              value={formData.stoneDetails.sealerRequirement}
              onChange={(e) => handleStoneChange("sealerRequirement", e.target.value)}
            />
          </Field>

          <Field label="Lead Time">
            <Input
              placeholder="e.g. In stock or 6-8 weeks custom"
              value={formData.stoneDetails.leadTime}
              onChange={(e) => handleStoneChange("leadTime", e.target.value)}
            />
          </Field>

          <div className="flex items-center gap-3 mt-4 md:col-span-2">
            <Switch
              checked={formData.stoneDetails.sampleAvailable}
              onCheckedChange={(checked) => handleStoneChange("sampleAvailable", checked)}
            />
            <span className="text-sm text-stone-600 dark:text-stone-300">
              Physical Sample Available
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Product Images</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Main Image">
            <MultipleImageUploader
              files={productImages}
              existingImages={formData.images}
              onFilesChange={setProductImages}
              onExistingImagesChange={(images) =>
                setFormData((prev) => ({
                  ...prev,
                  images,
                }))
              }
            />
          </Field>

          <Field label="Hover Image">
            <ImageUploader
              file={hoverImage}
              existingImage={formData.hoverImage}
              onFileSelect={setHoverImage}
              onRemove={() => {
                setHoverImage(null);

                setFormData((prev) => ({
                  ...prev,
                  hoverImage: {
                    url: "",
                    publicId: "",
                  },
                }));
              }}
              hint="Shown on card hover. Uploads on save."
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">SEO Settings</h3>
        <ProductSeoForm seo={formData.seo} onChange={handleSeoChange} />
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Product Settings</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <SwitchField
            label="Featured Product"
            checked={formData.isFeatured}
            onChange={(value) => handleChange("isFeatured", value)}
          />

          <SwitchField
            label="Best Seller"
            checked={formData.isBestSeller}
            onChange={(value) => handleChange("isBestSeller", value)}
          />

          <SwitchField
            label="New Arrival"
            checked={formData.isNewArrival}
            onChange={(value) => handleChange("isNewArrival", value)}
          />

          <SwitchField
            label="Published"
            checked={formData.status === "published"}
            onChange={(value) =>
              handleChange("status", value ? "published" : "draft")
            }
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-lg border border-stone-900 bg-stone-900 px-5 py-2 text-white transition-colors hover:bg-stone-800 disabled:opacity-60 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {submitting
            ? isEdit
              ? "Updating..."
              : "Saving..."
            : isEdit
              ? "Update Product"
              : "Save Product"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children, className = "" }) {
  const isRequired = label.endsWith("*");
  const cleanLabel = isRequired ? label.slice(0, -1).trim() : label;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label>
        {cleanLabel}
        {isRequired && <span className="text-red-500 ml-1 font-semibold">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SwitchField({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-stone-600 dark:text-stone-300">
        {label}
      </span>
    </div>
  );
}

function CategorySelect({ categories, value, onChange, disabled = false }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="min-w-[220px] w-full">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>

      <SelectContent
        className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900"
        position="popper"
        side="bottom"
        align="start"
        avoidCollisions={false}
        sideOffset={4}
      >
        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
