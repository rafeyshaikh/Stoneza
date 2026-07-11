"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUsForm() {
  const [data, setData] = useState({
    address: "",
    phone: "",
    whatsapp: "",
    youtube: "",
    instagram: "",
    facebook: "",
    email: "",
    mapEmbedCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/cms/pages/contactUs");
      const result = await res.json();

      if (result.success && result.data) {
        setData({
          address: result.data.address || "",
          phone: result.data.phone || "",
          whatsapp: result.data.whatsapp || "",
          youtube: result.data.youtube || "",
          instagram: result.data.instagram || "",
          facebook: result.data.facebook || "",
          email: result.data.email || "",
          mapEmbedCode: result.data.mapEmbedCode || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/admin/cms/pages/contactUs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("Contact page updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
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
    <section className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-5 dark:border-stone-800 dark:bg-stone-950/70">
      <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100">
        Contact Us
      </h3>

      <div className="mt-5 grid gap-5">
        <div className="space-y-2">
          <Label>Address</Label>

          <Textarea
            rows={4}
            placeholder="Enter business address..."
            value={data.address}
            onChange={(e) =>
              handleChange("address", e.target.value)
            }
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Phone Number</Label>

            <Input
              placeholder="+91 9876543210"
              value={data.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>

            <Input
              type="email"
              placeholder="info@stoneza.com"
              value={data.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>WhatsApp Number / Link</Label>
            <Input
              placeholder="+91 99500 36866"
              value={data.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              placeholder="https://youtube.com/@..."
              value={data.youtube}
              onChange={(e) => handleChange("youtube", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input
              placeholder="https://instagram.com/..."
              value={data.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input
              placeholder="https://facebook.com/..."
              value={data.facebook}
              onChange={(e) => handleChange("facebook", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Google Maps Embed Code</Label>

          <Textarea
            rows={6}
            placeholder="<iframe ...></iframe>"
            value={data.mapEmbedCode}
            onChange={(e) =>
              handleChange(
                "mapEmbedCode",
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Contact Page"}
        </Button>
      </div>
    </section>
  );
}