"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/products/ImageUploader";
import SeoManager from "@/components/admin/seo/SeoManager";
import { uploadAdminImage } from "@/lib/uploadAdminImage";
import { COMPANY_INFO } from "@/lib/constants";

const DEFAULT_CONTACT_DATA = {
  hero: {
    bgImage:
      "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
  },
  legal: {
    legalEntity: COMPANY_INFO.legalEntity,
    tradeName: COMPANY_INFO.tradeName,
    cin: COMPANY_INFO.cin,
    gstin: COMPANY_INFO.gstin,
    registeredAddress: COMPANY_INFO.registeredAddress,
    displayAddress: COMPANY_INFO.displayAddress,
  },
  socials: {
    instagram: COMPANY_INFO.socials.instagram,
    facebook: COMPANY_INFO.socials.facebook,
    youtube: COMPANY_INFO.socials.youtube,
    linkedin: COMPANY_INFO.socials.linkedin,
  },
  cards: {
    whatsappPhone: COMPANY_INFO.phone,
    whatsappHref: COMPANY_INFO.whatsappUrl,
    emailAddress: COMPANY_INFO.email,
    officeLocation: COMPANY_INFO.registeredAddress,
    workingHours: COMPANY_INFO.workingHours,
    gstin: COMPANY_INFO.gstin,
    cin: COMPANY_INFO.cin,
  },
  peopleSection: {
    people: [
      {
        name: "Saniya",
        phone: "+91 78771 08154",
        whatsapp: "+91 78771 08154",
        email: "saniya@stoneza.in",
        linkedIn: "",
      },
      {
        name: "Kanishk Ostwal",
        phone: "+91 99500 36866",
        whatsapp: "+91 99500 36866",
        email: "kanishk.ostwal@stoneza.in",
        linkedIn: "https://www.linkedin.com/company/thestoneza",
      },
    ],
  },
  location: {
    mapEmbedUrl: COMPANY_INFO.mapEmbedUrl,
  },
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  gstin: "",
  cin: "",
  registeredAddress: "",
  mapEmbedCode: "",
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    ogImage: "",
  },
};

export default function ContactUsForm() {
  const [data, setData] = useState(DEFAULT_CONTACT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const uploadImage = async (file, folder = "pages/contact") => {
    try {
      return await uploadAdminImage(file, folder);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to upload image");
      return null;
    }
  };

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms/pages/contactUs");
      const result = await res.json();

      if (result.success && result.data) {
        setData({
          hero: {
            bgImage:
              result.data.hero?.bgImage ||
              DEFAULT_CONTACT_DATA.hero.bgImage,
          },
          legal: {
            legalEntity:
              result.data.legal?.legalEntity ||
              DEFAULT_CONTACT_DATA.legal.legalEntity,
            tradeName:
              result.data.legal?.tradeName ||
              DEFAULT_CONTACT_DATA.legal.tradeName,
            cin:
              result.data.legal?.cin ||
              result.data.cin ||
              DEFAULT_CONTACT_DATA.legal.cin,
            gstin:
              result.data.legal?.gstin ||
              result.data.gstin ||
              DEFAULT_CONTACT_DATA.legal.gstin,
            registeredAddress:
              result.data.legal?.registeredAddress ||
              result.data.registeredAddress ||
              result.data.cards?.officeLocation ||
              DEFAULT_CONTACT_DATA.legal.registeredAddress,
            displayAddress:
              result.data.legal?.displayAddress ||
              DEFAULT_CONTACT_DATA.legal.displayAddress,
          },
          socials: {
            instagram:
              result.data.socials?.instagram ||
              result.data.instagram ||
              DEFAULT_CONTACT_DATA.socials.instagram,
            facebook:
              result.data.socials?.facebook ||
              result.data.facebook ||
              DEFAULT_CONTACT_DATA.socials.facebook,
            youtube:
              result.data.socials?.youtube ||
              result.data.youtube ||
              DEFAULT_CONTACT_DATA.socials.youtube,
            linkedin:
              result.data.socials?.linkedin ||
              result.data.socials?.linkedIn ||
              result.data.linkedIn ||
              DEFAULT_CONTACT_DATA.socials.linkedin,
          },
          cards: {
            whatsappPhone:
              result.data.cards?.whatsappPhone ||
              DEFAULT_CONTACT_DATA.cards.whatsappPhone,
            whatsappHref:
              result.data.cards?.whatsappHref ||
              DEFAULT_CONTACT_DATA.cards.whatsappHref,
            emailAddress:
              result.data.cards?.emailAddress ||
              DEFAULT_CONTACT_DATA.cards.emailAddress,
            officeLocation:
              result.data.cards?.officeLocation ||
              DEFAULT_CONTACT_DATA.cards.officeLocation,
            workingHours:
              result.data.cards?.workingHours ||
              DEFAULT_CONTACT_DATA.cards.workingHours,
            gstin:
              result.data.cards?.gstin ||
              result.data.gstin ||
              DEFAULT_CONTACT_DATA.cards.gstin,
            cin:
              result.data.cards?.cin ||
              result.data.cin ||
              DEFAULT_CONTACT_DATA.cards.cin,
          },
          peopleSection: {
            people:
              result.data.peopleSection?.people &&
              result.data.peopleSection.people.length > 0
                ? result.data.peopleSection.people
                : DEFAULT_CONTACT_DATA.peopleSection.people,
          },
          location: {
            mapEmbedUrl:
              result.data.location?.mapEmbedUrl ||
              DEFAULT_CONTACT_DATA.location.mapEmbedUrl,
          },
          address: result.data.address || "",
          phone: result.data.phone || "",
          whatsapp: result.data.whatsapp || "",
          email: result.data.email || "",
          gstin: result.data.gstin || "",
          cin: result.data.cin || "",
          registeredAddress: result.data.registeredAddress || "",
          mapEmbedCode: result.data.mapEmbedCode || "",
          seo: {
            metaTitle: result.data.seo?.metaTitle || "",
            metaDescription: result.data.seo?.metaDescription || "",
            keywords: Array.isArray(result.data.seo?.keywords)
              ? result.data.seo.keywords.join(", ")
              : result.data.seo?.keywords || "",
            canonicalUrl: result.data.seo?.canonicalUrl || "",
            ogImage: result.data.seo?.ogImage || "",
            ogTitle: result.data.seo?.ogTitle || "",
            ogDescription: result.data.seo?.ogDescription || "",
            ogUrl: result.data.seo?.ogUrl || "",
            ogType: result.data.seo?.ogType || "website",
            twitterCard: result.data.seo?.twitterCard || "summary_large_image",
            twitterTitle: result.data.seo?.twitterTitle || "",
            twitterDescription: result.data.seo?.twitterDescription || "",
            twitterImage: result.data.seo?.twitterImage || "",
            robotsIndex: result.data.seo?.robotsIndex !== false,
            robotsFollow: result.data.seo?.robotsFollow !== false,
            enableCustomJsonLd: Boolean(result.data.seo?.enableCustomJsonLd),
            customJsonLd: result.data.seo?.customJsonLd || "",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: { ...(prev.hero || {}), [field]: value },
    }));
  };

  const handleLegalChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      legal: { ...(prev.legal || {}), [field]: value },
    }));
  };

  const handleSocialChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      socials: { ...(prev.socials || {}), [field]: value },
    }));
  };

  const handleCardChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      cards: { ...(prev.cards || {}), [field]: value },
    }));
  };

  const handlePersonChange = (index, field, value) => {
    setData((prev) => {
      const currentPeople = [...(prev.peopleSection?.people || [])];
      currentPeople[index] = {
        ...currentPeople[index],
        [field]: value,
      };
      return {
        ...prev,
        peopleSection: {
          ...(prev.peopleSection || {}),
          people: currentPeople,
        },
      };
    });
  };

  const addPerson = () => {
    setData((prev) => ({
      ...prev,
      peopleSection: {
        ...(prev.peopleSection || {}),
        people: [
          ...(prev.peopleSection?.people || []),
          { name: "", phone: "", whatsapp: "", email: "", linkedIn: "" },
        ],
      },
    }));
  };

  const removePerson = (index) => {
    setData((prev) => ({
      ...prev,
      peopleSection: {
        ...(prev.peopleSection || {}),
        people: (prev.peopleSection?.people || []).filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleLocationChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      location: { ...(prev.location || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = JSON.parse(JSON.stringify(data));

      if (data.hero?.pendingFile) {
        toast.loading("Uploading background image...", { id: "contact-save" });
        const uploaded = await uploadImage(data.hero.pendingFile, "pages/contact");
        if (uploaded?.url) {
          payload.hero.bgImage = uploaded.url;
        }
      }
      delete payload.hero?.pendingFile;

      // Sync legacy and cross-component fields so DB remains consistent across both schemas
      payload.phone = payload.cards?.whatsappPhone || payload.phone || "";
      payload.whatsapp = payload.cards?.whatsappHref || payload.cards?.whatsappPhone || payload.whatsapp || "";
      payload.email = payload.cards?.emailAddress || payload.email || "";
      payload.address = payload.legal?.registeredAddress || payload.cards?.officeLocation || payload.address || "";
      payload.registeredAddress = payload.legal?.registeredAddress || "";
      payload.gstin = payload.legal?.gstin || payload.cards?.gstin || "";
      payload.cin = payload.legal?.cin || payload.cards?.cin || "";
      payload.instagram = payload.socials?.instagram || "";
      payload.facebook = payload.socials?.facebook || "";
      payload.youtube = payload.socials?.youtube || "";
      payload.linkedIn = payload.socials?.linkedin || "";
      payload.mapEmbedCode = payload.location?.mapEmbedUrl || payload.mapEmbedCode || "";

      // Ensure card mirror has GSTIN / CIN / Address
      if (payload.cards) {
        payload.cards.gstin = payload.gstin;
        payload.cards.cin = payload.cin;
        if (!payload.cards.officeLocation) {
          payload.cards.officeLocation = payload.address;
        }
      }

      toast.loading("Saving contact page...", { id: "contact-save" });
      const res = await fetch("/api/admin/cms/pages/contactUs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      setData(payload);
      toast.success("Contact page updated successfully", { id: "contact-save" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong", { id: "contact-save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <div className="flex h-48 items-center justify-center text-stone-500 dark:text-stone-400">
          Loading contact information...
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* STICKY SAVE BAR */}
      <div className="sticky top-14 z-30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-stone-300/80 bg-white/95 p-4 shadow-md backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
        <div>
          <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
            Contact Us Page Controls
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Manage background hero image, cards, direct contacts, and map embed.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm" className="w-full sm:w-auto py-4 sm:py-0">
          {saving ? "Saving..." : "Save Contact Page"}
        </Button>
      </div>

      {/* 1. HERO SECTION */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          1. Hero Background Image
        </h3>
        <ImageUploader
          file={data.hero?.pendingFile}
          existingImage={data.hero?.bgImage ? { url: data.hero.bgImage } : null}
          onFileSelect={(file) =>
            setData((prev) => ({
              ...prev,
              hero: { ...(prev.hero || {}), pendingFile: file },
            }))
          }
          onRemove={() =>
            setData((prev) => ({
              ...prev,
              hero: { ...(prev.hero || {}), bgImage: "", pendingFile: null },
            }))
          }
          hint="Upload high-resolution header image for the Contact Us page (landscape ~1920x600)."
        />
      </section>

      {/* 2. LEGAL ENTITY & TAX IDENTIFICATION */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          2. Legal Entity &amp; Statutory Registration
        </h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Legal Entity Name</Label>
            <Input
              placeholder="Anantay Exports Pvt. Ltd."
              value={data.legal?.legalEntity || ""}
              onChange={(e) => handleLegalChange("legalEntity", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Trade / Brand Name</Label>
            <Input
              placeholder="trading as Stoneza"
              value={data.legal?.tradeName || ""}
              onChange={(e) => handleLegalChange("tradeName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>GSTIN</Label>
            <Input
              placeholder="08AAWCA2095G1Z9"
              value={data.legal?.gstin || ""}
              onChange={(e) => handleLegalChange("gstin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>CIN (Corporate Identity Number)</Label>
            <Input
              placeholder="U14100RJ2021PTC076892"
              value={data.legal?.cin || ""}
              onChange={(e) => handleLegalChange("cin", e.target.value)}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Registered Works &amp; Headquarters Address</Label>
            <Input
              placeholder="F-124, RIICO Growth Centre, Hamirgarh, Bhilwara, Rajasthan — 311025, India"
              value={data.legal?.registeredAddress || ""}
              onChange={(e) => handleLegalChange("registeredAddress", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 3. CONTACT CARDS & WORKING HOURS */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          3. Contact Information Cards
        </h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>WhatsApp Phone Display</Label>
            <Input
              placeholder="+91 78771 08154"
              value={data.cards?.whatsappPhone || ""}
              onChange={(e) =>
                handleCardChange("whatsappPhone", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Target URL</Label>
            <Input
              placeholder="https://wa.me/917877108154"
              value={data.cards?.whatsappHref || ""}
              onChange={(e) => handleCardChange("whatsappHref", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              placeholder="sales@stoneza.in"
              value={data.cards?.emailAddress || ""}
              onChange={(e) => handleCardChange("emailAddress", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Office / Works Location (Display)</Label>
            <Input
              placeholder="Bhilwara, Rajasthan"
              value={data.cards?.officeLocation || ""}
              onChange={(e) =>
                handleCardChange("officeLocation", e.target.value)
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Working Hours</Label>
            <Input
              placeholder="Mon–Sat, 9:30–18:30 IST"
              value={data.cards?.workingHours || ""}
              onChange={(e) => handleCardChange("workingHours", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 4. COMPANY SOCIAL PROFILES */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          4. Company Social Media Profiles
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>LinkedIn Company Page</Label>
            <Input
              placeholder="https://www.linkedin.com/company/thestoneza"
              value={data.socials?.linkedin || ""}
              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input
              placeholder="https://www.instagram.com/thestoneza"
              value={data.socials?.instagram || ""}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input
              placeholder="https://www.facebook.com/thestoneza"
              value={data.socials?.facebook || ""}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              placeholder="https://www.youtube.com/@thestoneza"
              value={data.socials?.youtube || ""}
              onChange={(e) => handleSocialChange("youtube", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 5. DIRECT CONTACT PERSONS */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
            5. Direct Contact People
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPerson}
          >
            + Add Person
          </Button>
        </div>

        <div className="space-y-4">
          {(data.peopleSection?.people || []).map((person, pIdx) => (
            <div
              key={pIdx}
              className="p-4 border border-stone-300/80 rounded-xl bg-white dark:bg-stone-900 dark:border-stone-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase text-stone-500">
                  Person #{pIdx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 h-7 text-xs"
                  onClick={() => removePerson(pIdx)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    placeholder="Full Name (e.g. Saniya)"
                    value={person.name || ""}
                    onChange={(e) =>
                      handlePersonChange(pIdx, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    placeholder="+91 78771 08154"
                    value={person.phone || ""}
                    onChange={(e) =>
                      handlePersonChange(pIdx, "phone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">WhatsApp Number / Link</Label>
                  <Input
                    placeholder="+91 78771 08154"
                    value={person.whatsapp || ""}
                    onChange={(e) =>
                      handlePersonChange(pIdx, "whatsapp", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input
                    placeholder="saniya@stoneza.in"
                    value={person.email || ""}
                    onChange={(e) =>
                      handlePersonChange(pIdx, "email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1 lg:col-span-2">
                  <Label className="text-xs">LinkedIn URL (Optional)</Label>
                  <Input
                    placeholder="https://www.linkedin.com/..."
                    value={person.linkedIn || ""}
                    onChange={(e) =>
                      handlePersonChange(pIdx, "linkedIn", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOCATION & MAP */}
      <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
        <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          4. Google Maps Location Embed
        </h3>
        <div className="space-y-2">
          <Label>Google Maps Embed URL</Label>
          <Textarea
            rows={3}
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={data.location?.mapEmbedUrl || ""}
            onChange={(e) => handleLocationChange("mapEmbedUrl", e.target.value)}
          />
        </div>
      </section>

      {/* 5. SEO & METADATA */}
      <SeoManager
        seo={data.seo}
        onChange={(field, value) =>
          setData((prev) => ({
            ...prev,
            seo: { ...(prev.seo || {}), [field]: value },
          }))
        }
        entityContext={{
          type: "contact",
          name: "Contact Stoneza",
          description: "Quotation for quarry-direct natural stone, sandstone sample boxes, and technical consultation.",
          path: "/contact",
          image: data.hero?.bgImage || "",
        }}
      />

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Saving..." : "Save Contact Page"}
        </Button>
      </div>
    </div>
  );
}