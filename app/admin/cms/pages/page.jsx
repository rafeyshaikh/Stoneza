"use client";

import { useState } from "react";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import PageEditor from "@/components/admin/pages/PageEditor";
import ContactUsForm from "@/components/admin/pages/ContactUsForm";

export default function StaticPagesCmsPage() {

  return (
    <>
      <Breadcrumbs />

      <PageHeader
        title="Static Pages CMS"
        description="Manage Policies, Terms, and Contact details"
      />

      <div className="space-y-5">
        <PageEditor
          pageKey="privacyPolicy"
          title="Privacy Policy"
        />

        <PageEditor
          pageKey="termsAndConditions"
          title="Terms & Conditions"
        />

        <PageEditor
          pageKey="disclaimer"
          title="Disclaimer"
        />

        <PageEditor
          pageKey="returnPolicy"
          title="Return Policy"
        />

        <ContactUsForm
        />
      </div>
    </>
  );
}