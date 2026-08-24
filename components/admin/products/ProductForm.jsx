"use client";

import { useMemo, useState } from "react";

import ImageUploader from "@/components/admin/products/ImageUploader";
import MultipleImageUploader from "@/components/admin/products/MultipleImageUploader";
import ProductSeoForm from "@/components/admin/products/ProductSeoForm";
import VariantManager from "@/components/admin/products/VariantManager";
import { uploadAdminImage } from "@/lib/uploadAdminImage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FaqManager from "@/components/admin/products/FaqManager";

import { generateSlug } from "@/lib/generateSlug";

const getEmptyForm = () => ({
  name: "",
  slug: "",
  isSlugManual: false,
  description: "",
  shortDescription: "",

  categoryLevel1: "",
  categoryLevel2: "",
  categoryLevel3: "",

  collectionLevel1: "",
  collectionLevel2: "",

  sku: "",
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
    tradeName: "",
    productForm: "",
    pieceSize: "",
    calibratedThickness: "",
    faceTexture: "",
    edges: "",
    cornerPieces: "",
    blend: "",
    joint: "",
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

  overview: {
    specifyFor: "",
    steerElsewhereFor: "",
    howItReads: {
      atDistance: "",
      closeUp: "",
      throughDay: "",
      whenWet: "",
    },
  },

  faqs: [],

  variants: [],

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
  collections = [],
  initialData = null,
  isEdit = false,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    if (!initialData) return getEmptyForm();

    return {
      name: initialData.name || "",
      slug: initialData.slug || "",
      isSlugManual: Boolean(isEdit && initialData.slug),

      description: initialData.description || "",

      shortDescription: initialData.shortDescription || "",

      categoryLevel1: initialData.categoryLevel1 || "",
      categoryLevel2: initialData.categoryLevel2 || "",
      categoryLevel3: initialData.categoryLevel3 || "",

      collectionLevel1: initialData.collectionLevel1 || "",
      collectionLevel2: initialData.collectionLevel2 || "",

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
        tradeName: initialData.stoneDetails?.tradeName || "",
        productForm: initialData.stoneDetails?.productForm || "",
        pieceSize: initialData.stoneDetails?.pieceSize || "",
        calibratedThickness: initialData.stoneDetails?.calibratedThickness || "",
        faceTexture: initialData.stoneDetails?.faceTexture || "",
        edges: initialData.stoneDetails?.edges || "",
        cornerPieces: initialData.stoneDetails?.cornerPieces || "",
        blend: initialData.stoneDetails?.blend || "",
        joint: initialData.stoneDetails?.joint || "",
        coveragePerUnit: initialData.stoneDetails?.coveragePerUnit || "",
        waterAbsorption: initialData.stoneDetails?.waterAbsorption || "",
        density: initialData.stoneDetails?.density || "",
        weatherResistance: initialData.stoneDetails?.weatherResistance || "",
        application: Array.isArray(initialData.stoneDetails?.application)
          ? initialData.stoneDetails.application.join(", ")
          : initialData.stoneDetails?.application || "",
        installationMethod: initialData.stoneDetails?.installationMethod || "",
        moq: initialData.stoneDetails?.moq || "Project-based — ask us",
        weightPerSqM: initialData.stoneDetails?.weightPerSqM || "",
        groutRecommendation: initialData.stoneDetails?.groutRecommendation || "",
        sealerRequirement: initialData.stoneDetails?.sealerRequirement || "",
        leadTime: initialData.stoneDetails?.leadTime || "",
        sampleAvailable: initialData.stoneDetails?.sampleAvailable !== undefined ? initialData.stoneDetails?.sampleAvailable : true,
      },

      overview: {
        specifyFor: initialData.overview?.specifyFor || "",
        steerElsewhereFor: initialData.overview?.steerElsewhereFor || "",
        howItReads: {
          atDistance: initialData.overview?.howItReads?.atDistance || "",
          closeUp: initialData.overview?.howItReads?.closeUp || "",
          throughDay: initialData.overview?.howItReads?.throughDay || "",
          whenWet: initialData.overview?.howItReads?.whenWet || "",
        },
      },

      faqs: initialData.faqs || [],

      variants: initialData.variants || [],

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

      variants: (initialData.variants || []).map((v) => ({
        name: v.name,
        options: Array.isArray(v.options) ? v.options.join(", ") : v.options || "",
      })),
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

  const level1Collections = useMemo(() => {
    return collections.filter((col) => !col.parentCollection || col.collectionLevel === 1);
  }, [collections]);

  const level2Collections = useMemo(() => {
    if (!formData.collectionLevel1) return [];
    return collections.filter((col) => {
      const parentId = typeof col.parentCollection === "object" ? col.parentCollection?._id : col.parentCollection;
      return parentId === formData.collectionLevel1;
    });
  }, [collections, formData.collectionLevel1]);

  const handleChange = (key, value) => {
    if (key === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: prev.isSlugManual ? prev.slug : generateSlug(value),
      }));
      return;
    }
    if (key === "slug") {
      const formatted = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        slug: formatted,
        isSlugManual: true,
      }));
      return;
    }
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

  const handleOverviewChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        [key]: value,
      },
    }));
  };

  const handleHowItReadsChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        howItReads: {
          ...prev.overview?.howItReads,
          [key]: value,
        },
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

  const handleColLevel1Change = (value) => {
    setFormData((prev) => ({
      ...prev,
      collectionLevel1: value,
      collectionLevel2: "",
    }));
  };

  const uploadImage = (file, folder = "products") => uploadAdminImage(file, folder);

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

      if (!formData.categoryLevel3 && !formData.categoryLevel2 && !formData.categoryLevel1) {
        toast.error("Category is required");
        return;
      }

      if (!formData.collectionLevel2) {
        toast.error("Level 2 Collection is required for every product");
        return;
      }

      const finalCategory =
        formData.categoryLevel3 ||
        formData.categoryLevel2 ||
        formData.categoryLevel1;

      const payload = {
        ...formData,

        category: finalCategory,
        collection: formData.collectionLevel2,

        images: uploadedImages,

        hoverImage: uploadedHoverImage,

        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        stoneDetails: {
          ...formData.stoneDetails,
          application: formData.stoneDetails.application
            ? formData.stoneDetails.application
                .split(",")
                .map((app) => app.trim())
                .filter(Boolean)
            : [],
        },

        variants: (formData.variants || []).map((v) => ({
          name: v.name?.trim() || "",
          options: typeof v.options === "string"
            ? v.options.split(",").map((o) => o.trim()).filter(Boolean)
            : v.options || [],
        })).filter((v) => v.name),

        seo: {
          ...formData.seo,

          keywords: formData.seo.keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      };

      delete payload.isSlugManual;
      delete payload.categoryLevel1;
      delete payload.categoryLevel2;
      delete payload.categoryLevel3;
      delete payload.collectionLevel1;
      delete payload.collectionLevel2;

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

      let data;
      try {
        data = await response.json();
      } catch (err) {
        if (response.status === 413) {
          throw new Error("Product data or images are too large for the server.");
        }
        throw new Error(`Server error (${response.status}: ${response.statusText || "Invalid response"})`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to save product");
      }

      console.log("Product saved:", data);

      toast.success(
        isEdit
          ? "Product updated successfully"
          : "Product created successfully",
      );

      router.push("/admin/products");
      router.refresh();

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
              placeholder="e.g. Cosmic Black"
            />
          </Field>

          <Field label="Slug (URL Path) *">
            <div className="relative flex items-center">
              <span className="inline-flex h-9 items-center px-3 rounded-l-md border border-r-0 border-stone-300 bg-stone-100 text-xs text-stone-500 font-mono select-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                /product/
              </span>
              <Input
                value={formData.slug || ""}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="e.g. cosmic-black"
                className="rounded-l-none font-mono text-sm pr-14"
                required
              />
              {formData.isSlugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(prev.name),
                      isSlugManual: false,
                    }));
                  }}
                  className="absolute right-2 text-[10px] text-amber-600 hover:text-amber-700 underline font-sans cursor-pointer"
                  title="Sync slug with product name"
                >
                  Reset
                </button>
              )}
            </div>
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

          <Field label="Top Collection *">
            <CategorySelect
              value={formData.collectionLevel1}
              categories={level1Collections}
              onChange={handleColLevel1Change}
              placeholder="Select Top Collection"
            />
          </Field>

          <Field label="Sub Collection (Level 2) *">
            <CategorySelect
              value={formData.collectionLevel2}
              categories={level2Collections}
              onChange={(value) => handleChange("collectionLevel2", value)}
              disabled={!formData.collectionLevel1}
              placeholder="Select Sub Collection"
            />
          </Field>

          <Field label="Description *" className="md:col-span-2">
            <Textarea
              rows={5}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Write product description here..."
              required
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
        <h3 className="mb-5 text-lg font-semibold">Weight</h3>

        <div className="grid gap-5 md:grid-cols-1">
          <Field label="Weight (kg)">
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

          <Field label="Trade Name">
            <Input
              placeholder="e.g. Monsoon Black"
              value={formData.stoneDetails.tradeName}
              onChange={(e) => handleStoneChange("tradeName", e.target.value)}
            />
          </Field>

          <Field label="Product Form">
            <Input
              placeholder="e.g. Loose rubble panels, crated"
              value={formData.stoneDetails.productForm}
              onChange={(e) => handleStoneChange("productForm", e.target.value)}
            />
          </Field>

          <Field label="Piece Size">
            <Input
              placeholder="e.g. 4″ – 18″ random"
              value={formData.stoneDetails.pieceSize}
              onChange={(e) => handleStoneChange("pieceSize", e.target.value)}
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

          <Field label="Edges">
            <Input
              placeholder="e.g. Sawn / tumbled / natural"
              value={formData.stoneDetails.edges}
              onChange={(e) => handleStoneChange("edges", e.target.value)}
            />
          </Field>

          <Field label="Corner Pieces">
            <Input
              placeholder="e.g. L-shaped, pre-fabricated"
              value={formData.stoneDetails.cornerPieces}
              onChange={(e) => handleStoneChange("cornerPieces", e.target.value)}
            />
          </Field>

          <Field label="Blend">
            <Input
              placeholder="e.g. Pre-blended, fixed ratio"
              value={formData.stoneDetails.blend}
              onChange={(e) => handleStoneChange("blend", e.target.value)}
            />
          </Field>

          <Field label="Joint">
            <Input
              placeholder="e.g. 2–4 mm recessed joint"
              value={formData.stoneDetails.joint}
              onChange={(e) => handleStoneChange("joint", e.target.value)}
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

          <Field label="Applications (comma-separated)">
            <Input
              placeholder="e.g. Interior walls, Exterior walls, Pool decks"
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

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70 space-y-5">
        <h3 className="text-lg font-semibold">Product Overview &amp; Visual Characteristics</h3>
        
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Specify It For">
            <Textarea
              rows={3}
              placeholder="e.g. Feature walls, boundary walls, large elevations..."
              value={formData.overview.specifyFor}
              onChange={(e) => handleOverviewChange("specifyFor", e.target.value)}
            />
          </Field>

          <Field label="Steer Elsewhere For">
            <Textarea
              rows={3}
              placeholder="e.g. Small tight panels below 40 sq ft..."
              value={formData.overview.steerElsewhereFor}
              onChange={(e) => handleOverviewChange("steerElsewhereFor", e.target.value)}
            />
          </Field>
        </div>

        <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
          <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-4">
            How It Reads (Visual Experience)
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="At a Distance">
              <Input
                placeholder="e.g. Monolithic warm brown anchoring the building to ground"
                value={formData.overview.howItReads?.atDistance || ""}
                onChange={(e) => handleHowItReadsChange("atDistance", e.target.value)}
              />
            </Field>

            <Field label="Close Up">
              <Input
                placeholder="e.g. Mineral movement: iron streaks, tan patches, rust veining"
                value={formData.overview.howItReads?.closeUp || ""}
                onChange={(e) => handleHowItReadsChange("closeUp", e.target.value)}
              />
            </Field>

            <Field label="Through the Day">
              <Input
                placeholder="e.g. Holds colour steadily and comes forward at sunset"
                value={formData.overview.howItReads?.throughDay || ""}
                onChange={(e) => handleHowItReadsChange("throughDay", e.target.value)}
              />
            </Field>

            <Field label="When Wet">
              <Input
                placeholder="e.g. Deepens to a rich chocolate undertone"
                value={formData.overview.howItReads?.whenWet || ""}
                onChange={(e) => handleHowItReadsChange("whenWet", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <FaqManager
          faqs={formData.faqs}
          onChange={(faqs) => handleChange("faqs", faqs)}
        />
      </section>

      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold">Customizations & Variants</h3>
        <VariantManager
          variants={formData.variants}
          onChange={(newVariants) => handleChange("variants", newVariants)}
        />
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

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-lg border border-stone-900 bg-stone-900 px-6 py-2 text-white transition-colors hover:bg-stone-800 disabled:opacity-60 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 cursor-pointer"
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

function CategorySelect({ categories, value, onChange, disabled = false, placeholder = "Select Category" }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
