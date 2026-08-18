"use client";

import Breadcrumbs from "@/components/admin/layout/Breadcrumbs";
import PageHeader from "@/components/admin/shared/PageHeader";
import PageEditor from "@/components/admin/pages/PageEditor";
import ContactUsForm from "@/components/admin/pages/ContactUsForm";
import CollectionsOverviewForm from "@/components/admin/pages/CollectionsOverviewForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PhoneCall,
  Layers,
  ShieldCheck,
  FileText,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export default function StaticPagesCmsPage() {
  return (
    <div className="space-y-6 w-full min-w-0">
      <Breadcrumbs />

      <PageHeader
        title="CMS Pages Manager"
        description="Manage page contents, contact details, collections banner overview, and legal policy pages"
      />

      <Tabs defaultValue="contactUs" className="w-full min-w-0">
        <div className="w-full min-w-0 overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="inline-flex h-auto w-max min-w-full lg:w-full lg:min-w-0 sm:min-w-0 items-center justify-start gap-1 rounded-xl border border-stone-300/10 bg-stone-100/90 px-2 py-6 shadow-xs backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
            <TabsTrigger
              value="contactUs"
              className="flex items-center gap-2 rounded-xl px-3.5 py-4 select-none text-xs font-medium transition-all cursor-pointer data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-950"
            >
              <PhoneCall className="size-3.5" />
              <span>Contact Us Page</span>
            </TabsTrigger>

            <TabsTrigger
              value="collectionsOverview"
              className="flex items-center gap-2 rounded-xl px-3.5 py-4 select-none text-xs font-medium transition-all cursor-pointer data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-950"
            >
              <Layers className="size-3.5" />
              <span>Collections Overview</span>
            </TabsTrigger>

            <TabsTrigger
              value="privacyPolicy"
              className="flex items-center gap-2 rounded-xl px-3.5 py-4 select-none text-xs font-medium transition-all cursor-pointer data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-950"
            >
              <ShieldCheck className="size-3.5" />
              <span>Privacy Policy</span>
            </TabsTrigger>

            <TabsTrigger
              value="termsAndConditions"
              className="flex items-center gap-2 rounded-xl px-3.5 py-4 select-none text-xs font-medium transition-all cursor-pointer data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-950"
            >
              <FileText className="size-3.5" />
              <span>Terms &amp; Conditions</span>
            </TabsTrigger>

            <TabsTrigger
              value="disclaimer"
              className="flex items-center gap-2 rounded-xl px-3.5 py-4 select-none text-xs font-medium transition-all cursor-pointer data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-950"
            >
              <AlertCircle className="size-3.5" />
              <span>Disclaimer</span>
            </TabsTrigger>

            <TabsTrigger
              value="returnPolicy"
              className="flex items-center gap-2 rounded-xl px-3.5 py-4 select-none text-xs font-medium transition-all cursor-pointer data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-950"
            >
              <RotateCcw className="size-3.5" />
              <span>Return Policy</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="contactUs" className="mt-0 focus-visible:outline-none">
            <ContactUsForm />
          </TabsContent>

          <TabsContent value="collectionsOverview" className="mt-0 focus-visible:outline-none">
            <CollectionsOverviewForm />
          </TabsContent>

          <TabsContent value="privacyPolicy" className="mt-0 focus-visible:outline-none">
            <PageEditor pageKey="privacyPolicy" title="Privacy Policy" />
          </TabsContent>

          <TabsContent value="termsAndConditions" className="mt-0 focus-visible:outline-none">
            <PageEditor pageKey="termsAndConditions" title="Terms & Conditions" />
          </TabsContent>

          <TabsContent value="disclaimer" className="mt-0 focus-visible:outline-none">
            <PageEditor pageKey="disclaimer" title="Disclaimer" />
          </TabsContent>

          <TabsContent value="returnPolicy" className="mt-0 focus-visible:outline-none">
            <PageEditor pageKey="returnPolicy" title="Return Policy" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}