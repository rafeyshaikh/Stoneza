"use client";

import { useEffect, useState } from "react";

export default function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("About Us");
  const [content, setContent] = useState("");

  const fetchPage = async () => {
    try {
      const res = await fetch("/api/admin/cms/pages/aboutUs");
      const data = await res.json();

      if (data.success) {
        setPageTitle(data.data?.title || "About Us");
        setContent(data.data?.content || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-display text-center uppercase tracking-[6px] text-[28px] text-[#393938]">{pageTitle}</h1>
      <div
        className="prose prose-stone max-w-none dark:prose-invert font-body text-[14px]"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </div>
  );
}