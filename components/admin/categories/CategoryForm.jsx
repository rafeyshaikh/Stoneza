"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Layers, Sparkles, LayoutGrid, Link as LinkIcon } from "lucide-react";

import ImageUploader from "@/components/admin/products/ImageUploader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { uploadAdminImage } from "@/lib/uploadAdminImage";

const uploadImage = (file, folder = "categories") => uploadAdminImage(file, folder);

const EMPTY_MEGAMENU = {
  enabled: true,
  columns: [],
  actionLinks: [],
  featuredCard: {
    eyebrow: "Featured Product",
    title: "",
    description: "",
    image: { url: "", publicId: "" },
    badge: "",
    href: "",
  },
};

const EMPTY_FORM = {
  name: "",
  description: "",
  parentCategory: "none",
  sortOrder: 0,
  isActive: true,

  bannerImage: {
    square: {
      url: "",
      publicId: "",
    },
    wide: {
      url: "",
      publicId: "",
    },
  },

  megamenu: EMPTY_MEGAMENU,

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    ogImage: "",
  },
};

export default function CategoryForm({
  parentCategories = [],
  initialData = null,
  isEdit = false,
}) {
  const router = useRouter();

  const [formData, setFormData] = useState(() => {
    if (!initialData) return EMPTY_FORM;

    const parentVal =
      typeof initialData.parentCategory === "object" && initialData.parentCategory?._id
        ? initialData.parentCategory._id
        : initialData.parentCategory || "none";

    const initialMegamenu = initialData.megamenu || {};

    return {
      name: initialData.name || "",
      description: initialData.description || "",
      parentCategory: parentVal,
      sortOrder: initialData.sortOrder || 0,
      isActive:
        initialData.isActive === undefined ? true : initialData.isActive,

      bannerImage: {
        square: initialData.bannerImage?.square || {
          url: "",
          publicId: "",
        },
        wide: initialData.bannerImage?.wide?.url
          ? initialData.bannerImage.wide
          : Array.isArray(initialData.bannerImage?.wide) && initialData.bannerImage.wide[0]
          ? initialData.bannerImage.wide[0]
          : {
              url: "",
              publicId: "",
            },
      },

      megamenu: {
        enabled: initialMegamenu.enabled ?? true,
        columns: Array.isArray(initialMegamenu.columns) ? initialMegamenu.columns : [],
        actionLinks: Array.isArray(initialMegamenu.actionLinks)
          ? initialMegamenu.actionLinks
          : [],
        featuredCard: {
          eyebrow: initialMegamenu.featuredCard?.eyebrow || "Featured Product",
          title: initialMegamenu.featuredCard?.title || "",
          description: initialMegamenu.featuredCard?.description || "",
          image: initialMegamenu.featuredCard?.image || { url: "", publicId: "" },
          badge: initialMegamenu.featuredCard?.badge || "",
          href: initialMegamenu.featuredCard?.href || "",
        },
      },

      seo: {
        metaTitle: initialData.seo?.metaTitle || "",
        metaDescription: initialData.seo?.metaDescription || "",
        keywords: Array.isArray(initialData.seo?.keywords)
          ? initialData.seo.keywords.join(", ")
          : initialData.seo?.keywords || "",
        canonicalUrl: initialData.seo?.canonicalUrl || "",
        ogImage: initialData.seo?.ogImage || "",
      },
    };
  });

  const [squareBannerFile, setSquareBannerFile] = useState(null);
  const [wideBannerFile, setWideBannerFile] = useState(null);
  const [featuredCardImageFile, setFeaturedCardImageFile] = useState(null);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isLevel1 =
    formData.parentCategory === "none" ||
    !formData.parentCategory ||
    formData.parentCategory === null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
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

  // Megamenu Column Helpers
  const handleAddColumn = () => {
    setFormData((prev) => ({
      ...prev,
      megamenu: {
        ...prev.megamenu,
        columns: [
          ...(prev.megamenu?.columns || []),
          {
            title: "New Column",
            subtitle: "",
            links: [{ name: "Sample Link", href: "/product-category/sample", count: "", badge: "" }],
          },
        ],
      },
    }));
  };

  const handleRemoveColumn = (colIndex) => {
    setFormData((prev) => ({
      ...prev,
      megamenu: {
        ...prev.megamenu,
        columns: (prev.megamenu?.columns || []).filter((_, idx) => idx !== colIndex),
      },
    }));
  };

  const handleColumnChange = (colIndex, field, value) => {
    setFormData((prev) => {
      const updatedCols = [...(prev.megamenu?.columns || [])];
      updatedCols[colIndex] = {
        ...updatedCols[colIndex],
        [field]: value,
      };
      return {
        ...prev,
        megamenu: {
          ...prev.megamenu,
          columns: updatedCols,
        },
      };
    });
  };

  // Megamenu Link Helpers
  const handleAddLink = (colIndex) => {
    setFormData((prev) => {
      const updatedCols = [...(prev.megamenu?.columns || [])];
      const targetCol = updatedCols[colIndex];
      targetCol.links = [
        ...(targetCol.links || []),
        { name: "New Link", href: "", count: "", badge: "" },
      ];
      return {
        ...prev,
        megamenu: {
          ...prev.megamenu,
          columns: updatedCols,
        },
      };
    });
  };

  const handleRemoveLink = (colIndex, linkIndex) => {
    setFormData((prev) => {
      const updatedCols = [...(prev.megamenu?.columns || [])];
      const targetCol = updatedCols[colIndex];
      targetCol.links = (targetCol.links || []).filter((_, idx) => idx !== linkIndex);
      return {
        ...prev,
        megamenu: {
          ...prev.megamenu,
          columns: updatedCols,
        },
      };
    });
  };

  const handleLinkChange = (colIndex, linkIndex, field, value) => {
    setFormData((prev) => {
      const updatedCols = [...(prev.megamenu?.columns || [])];
      const targetCol = updatedCols[colIndex];
      const updatedLinks = [...(targetCol.links || [])];
      updatedLinks[linkIndex] = {
        ...updatedLinks[linkIndex],
        [field]: value,
      };
      targetCol.links = updatedLinks;
      return {
        ...prev,
        megamenu: {
          ...prev.megamenu,
          columns: updatedCols,
        },
      };
    });
  };

  // Quick Action Link Helpers
  const handleAddActionLink = () => {
    setFormData((prev) => ({
      ...prev,
      megamenu: {
        ...prev.megamenu,
        actionLinks: [
          ...(prev.megamenu?.actionLinks || []),
          { label: "Help me choose", href: "#spec" },
        ],
      },
    }));
  };

  const handleRemoveActionLink = (idx) => {
    setFormData((prev) => ({
      ...prev,
      megamenu: {
        ...prev.megamenu,
        actionLinks: (prev.megamenu?.actionLinks || []).filter((_, i) => i !== idx),
      },
    }));
  };

  const handleActionLinkChange = (idx, field, value) => {
    setFormData((prev) => {
      const currentActionLinks = prev.megamenu?.actionLinks || [];
      const updated = currentActionLinks.map((al, i) => {
        if (i === idx) {
          return { ...al, [field]: value };
        }
        return al;
      });
      return {
        ...prev,
        megamenu: {
          ...prev.megamenu,
          actionLinks: updated,
        },
      };
    });
  };

  // Featured Card Helpers
  const handleFeaturedCardChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      megamenu: {
        ...prev.megamenu,
        featuredCard: {
          ...(prev.megamenu?.featuredCard || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      setSubmitting(true);
      setUploadingImages(true);

      let squareBanner = formData.bannerImage.square;
      if (squareBannerFile) {
        squareBanner = await uploadImage(squareBannerFile, "categories/square");
      }

      let wideBanner = formData.bannerImage.wide;
      if (wideBannerFile) {
        wideBanner = await uploadImage(wideBannerFile, "categories/wide");
      }

      let featuredCardImage = formData.megamenu?.featuredCard?.image || { url: "", publicId: "" };
      if (featuredCardImageFile) {
        featuredCardImage = await uploadImage(featuredCardImageFile, "categories/megamenu");
      }

      setUploadingImages(false);

      const payload = {
        ...formData,

        bannerImage: {
          square: squareBanner,
          wide: wideBanner,
        },

        megamenu: {
          enabled: formData.megamenu?.enabled ?? true,
          columns: formData.megamenu?.columns || [],
          actionLinks: formData.megamenu?.actionLinks || [],
          featuredCard: {
            ...(formData.megamenu?.featuredCard || {}),
            image: featuredCardImage,
          },
        },

        parentCategory:
          formData.parentCategory === "none" ? null : formData.parentCategory,

        seo: {
          ...formData.seo,
          keywords:
            typeof formData.seo.keywords === "string"
              ? formData.seo.keywords
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : formData.seo.keywords || [],
        },
      };

      const response = await fetch(
        isEdit
          ? `/api/admin/categories/${initialData._id}`
          : "/api/admin/categories",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (err) {
        if (response.status === 413) {
          throw new Error("Category data or images are too large for the server.");
        }
        throw new Error(`Server error (${response.status}: ${response.statusText || "Invalid response"})`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to save category");
      }

      toast.success(
        isEdit
          ? "Category updated successfully"
          : "Category created successfully"
      );

      router.push("/admin/categories");
      router.refresh();

      if (!isEdit) {
        setFormData(EMPTY_FORM);
        setSquareBannerFile(null);
        setWideBannerFile(null);
        setFeaturedCardImageFile(null);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Something went wrong");
      toast.error(error.message || "Failed to save category");
    } finally {
      setUploadingImages(false);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
          Basic Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Category name" htmlFor="category-name">
            <Input
              id="category-name"
              placeholder="e.g. Paving & Flooring"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Field>

          <Field label="Parent category" htmlFor="parent-category">
            <ParentCategorySelect
              categories={parentCategories}
              value={formData.parentCategory}
              onChange={(value) => handleChange("parentCategory", value)}
            />
          </Field>

          <Field label="Sort order" htmlFor="sort-order">
            <Input
              id="sort-order"
              type="number"
              placeholder="0"
              value={formData.sortOrder}
              onChange={(e) =>
                handleChange("sortOrder", Number(e.target.value))
              }
            />
          </Field>

          <Field label="Status">
            <div className="flex h-10 items-center gap-3">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <span className="text-sm text-stone-600 dark:text-stone-300">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </Field>

          <Field
            label="Description"
            htmlFor="category-description"
            className="md:col-span-2"
          >
            <Textarea
              id="category-description"
              placeholder="Short description of this category"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* LEVEL 1 MEGAMENU CMS SECTION */}
      {isLevel1 && (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-50/30 p-6 dark:border-amber-500/20 dark:bg-stone-900/60">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  Megamenu Configuration
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                    Level 1 Only
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Configure megamenu columns, links, badges, action links, and featured spotlight card. Existing Level 2 (sub) &amp; Level 3 (final) child categories in the database will automatically be combined together with your CMS configuration.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.megamenu?.enabled ?? true}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    megamenu: { ...(prev.megamenu || {}), enabled: checked },
                  }))
                }
              />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {formData.megamenu?.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {formData.megamenu?.enabled !== false && (
            <div className="mt-6 space-y-8">
              {/* Columns Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-stone-500" />
                    Megamenu Columns ({formData.megamenu?.columns?.length || 0})
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddColumn}
                    className="gap-1.5 border-stone-300 dark:border-stone-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Column
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {(formData.megamenu?.columns || []).map((col, colIdx) => (
                    <div
                      key={colIdx}
                      className="relative rounded-xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          Column #{colIdx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveColumn(colIdx)}
                          className="h-7 w-7 text-stone-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-stone-600 dark:text-stone-400">
                            Column Title (e.g. Paving)
                          </Label>
                          <Input
                            placeholder="Title"
                            value={col.title || ""}
                            onChange={(e) =>
                              handleColumnChange(colIdx, "title", e.target.value)
                            }
                            className="mt-1 h-9 text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-stone-600 dark:text-stone-400">
                            Column Subtitle (e.g. CobbleCraft · Nature Mosaic)
                          </Label>
                          <Input
                            placeholder="Subtitle"
                            value={col.subtitle || ""}
                            onChange={(e) =>
                              handleColumnChange(colIdx, "subtitle", e.target.value)
                            }
                            className="mt-1 h-9 text-sm"
                          />
                        </div>

                        {/* Column Links */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                              Links ({col.links?.length || 0})
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() => handleAddLink(colIdx)}
                              className="h-6 text-xs gap-1 text-amber-600 dark:text-amber-400"
                            >
                              <Plus className="h-3 w-3" /> Add Link
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {(col.links || []).map((link, linkIdx) => (
                              <div
                                key={linkIdx}
                                className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50/60 p-2 dark:border-stone-800 dark:bg-stone-950/40"
                              >
                                <div className="grid flex-1 grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Name (e.g. Cobblestone)"
                                    value={link.name || ""}
                                    onChange={(e) =>
                                      handleLinkChange(colIdx, linkIdx, "name", e.target.value)
                                    }
                                    className="h-8 text-xs"
                                  />
                                  <Input
                                    placeholder="URL/Slug (e.g. /product-category/cobblestone)"
                                    value={link.href || link.slug || ""}
                                    onChange={(e) =>
                                      handleLinkChange(colIdx, linkIdx, "href", e.target.value)
                                    }
                                    className="h-8 text-xs"
                                  />
                                  <Input
                                    placeholder="Count (e.g. 15)"
                                    value={link.count || ""}
                                    onChange={(e) =>
                                      handleLinkChange(colIdx, linkIdx, "count", e.target.value)
                                    }
                                    className="h-8 text-xs"
                                  />
                                  <Input
                                    placeholder="Badge (e.g. NEW, SOON)"
                                    value={link.badge || ""}
                                    onChange={(e) =>
                                      handleLinkChange(colIdx, linkIdx, "badge", e.target.value)
                                    }
                                    className="h-8 text-xs"
                                  />
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveLink(colIdx, linkIdx)}
                                  className="h-7 w-7 text-stone-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Links Section (e.g. Help me choose, Request samples) */}
              <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <LinkIcon className="h-4 w-4 text-amber-500" />
                      Quick Action Links (e.g. Help me choose, Request samples)
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Appears at the bottom of the 4th column in the megamenu overlay.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddActionLink}
                    className="gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Action Link
                  </Button>
                </div>

                <div className="space-y-2">
                  {(formData.megamenu?.actionLinks || []).map((actionLink, aIdx) => (
                    <div
                      key={aIdx}
                      className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50/60 p-2 dark:border-stone-800 dark:bg-stone-950/40"
                    >
                      <Input
                        placeholder="Label (e.g. Help me choose a thickness)"
                        value={actionLink.label || ""}
                        onChange={(e) =>
                          handleActionLinkChange(aIdx, "label", e.target.value)
                        }
                        className="h-9 text-xs flex-1"
                      />
                      <Input
                        placeholder="Target Link / Email (e.g. #spec or mailto:sales@stoneza.in)"
                        value={actionLink.href || ""}
                        onChange={(e) =>
                          handleActionLinkChange(aIdx, "href", e.target.value)
                        }
                        className="h-9 text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveActionLink(aIdx)}
                        className="h-8 w-8 text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured / Spotlight Card Section */}
              <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Featured / Spotlight Card
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Eyebrow Tag (e.g. Featured Product)">
                    <Input
                      placeholder="Featured Product"
                      value={formData.megamenu?.featuredCard?.eyebrow || ""}
                      onChange={(e) =>
                        handleFeaturedCardChange("eyebrow", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Card Title (e.g. Castle Grey Crazy Paving)">
                    <Input
                      placeholder="Title"
                      value={formData.megamenu?.featuredCard?.title || ""}
                      onChange={(e) =>
                        handleFeaturedCardChange("title", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Target Link URL (e.g. /product-category/crazy-paving)">
                    <Input
                      placeholder="/product-category/crazy-paving"
                      value={formData.megamenu?.featuredCard?.href || ""}
                      onChange={(e) =>
                        handleFeaturedCardChange("href", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="File Tag / Sub-badge (e.g. castle-grey.webp)">
                    <Input
                      placeholder="castle-grey-crazy-paving.webp"
                      value={formData.megamenu?.featuredCard?.badge || ""}
                      onChange={(e) =>
                        handleFeaturedCardChange("badge", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Description / Tagline" className="md:col-span-2">
                    <Textarea
                      placeholder="Short spotlight description"
                      rows={2}
                      value={formData.megamenu?.featuredCard?.description || ""}
                      onChange={(e) =>
                        handleFeaturedCardChange("description", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Featured Spotlight Image (16:11 Aspect)" className="md:col-span-2">
                    <ImageUploader
                      file={featuredCardImageFile}
                      existingImage={formData.megamenu?.featuredCard?.image}
                      onFileSelect={setFeaturedCardImageFile}
                      onRemove={() => {
                        setFeaturedCardImageFile(null);
                        handleFeaturedCardChange("image", { url: "", publicId: "" });
                      }}
                      uploading={uploadingImages}
                      hint="Image shown in the 5th column spotlight card of this category megamenu."
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Category Banners */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
          Category Banners
        </h3>

        <div className="space-y-6">
          <Field label="Square Banner (1000 × 1000)">
            <ImageUploader
              file={squareBannerFile}
              existingImage={formData.bannerImage.square}
              onFileSelect={setSquareBannerFile}
              onRemove={() => {
                setSquareBannerFile(null);
                setFormData((prev) => ({
                  ...prev,
                  bannerImage: {
                    ...prev.bannerImage,
                    square: {
                      url: "",
                      publicId: "",
                    },
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Used in category cards and category sections."
            />
          </Field>

          <Field label="Wide Banner (2200 × 640)">
            <ImageUploader
              file={wideBannerFile}
              existingImage={formData.bannerImage.wide}
              onFileSelect={setWideBannerFile}
              onRemove={() => {
                setWideBannerFile(null);
                setFormData((prev) => ({
                  ...prev,
                  bannerImage: {
                    ...prev.bannerImage,
                    wide: {
                      url: "",
                      publicId: "",
                    },
                  },
                }));
              }}
              uploading={uploadingImages}
              hint="Desktop category hero banner."
            />
          </Field>
        </div>
      </section>

      {/* SEO Settings */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="mb-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
          SEO Settings
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Meta title">
            <Input
              placeholder="e.g. Natural Stone Paving | Stoneza"
              value={formData.seo.metaTitle}
              onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
            />
          </Field>

          <Field label="Canonical URL">
            <Input
              placeholder="https://stoneza.in/product-category/..."
              value={formData.seo.canonicalUrl}
              onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
            />
          </Field>

          <Field label="Meta description" className="md:col-span-2">
            <Textarea
              placeholder="Meta description for search engines"
              rows={3}
              value={formData.seo.metaDescription}
              onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
            />
          </Field>

          <Field label="Keywords (comma separated)" className="md:col-span-2">
            <Input
              placeholder="paving, cobblestone, sandstone"
              value={formData.seo.keywords}
              onChange={(e) => handleSeoChange("keywords", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? uploadingImages
              ? "Uploading images..."
              : "Saving category..."
            : isEdit
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={htmlFor} className="text-stone-700 dark:text-stone-300">
          {label}
        </Label>
      )}
      {children}
    </div>
  );
}

function ParentCategorySelect({ categories = [], value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select parent category" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="none">None (Level 1 Root Category)</SelectItem>

        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {category.name} (Level {category.categoryLevel || 1})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
