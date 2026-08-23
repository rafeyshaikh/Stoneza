"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Mail, MapPin, Calendar, Layers, FileText, CheckCircle, Trash2 } from "lucide-react";
import EnquiryTimeline from "@/components/admin/enquiries/EnquiryTimeline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EnquiryDetailsClient({ enquiry }) {
  const router = useRouter();
  const [status, setStatus] = useState(enquiry.status);
  const [notes, setNotes] = useState(enquiry.notes || "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  async function updateStatus(newStatus) {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }
      setStatus(newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save notes");
      }
      toast.success("Notes saved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function deleteEnquiry() {
    const confirmed = window.confirm("Are you sure you want to delete this enquiry?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete enquiry");
      }
      toast.success("Enquiry deleted successfully");
      router.push("/admin/enquiries");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete enquiry");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs dark:bg-stone-900/50 dark:border-stone-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Enquiry ID
          </span>
          <h2 className="text-xl font-heading font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            #{enquiry._id}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50 cursor-pointer"
            onClick={deleteEnquiry}
          >
            <Trash2 className="size-4 mr-1.5" />
            Delete Enquiry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Primary Details Card */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-300/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/40">
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-6 pb-4 border-b border-stone-200/70 dark:border-stone-800/80 flex items-center gap-2">
            <FileText className="size-5 text-stone-500" />
            Customer & Project Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Customer Name</p>
              <p className="text-base font-semibold text-stone-900 dark:text-stone-100">{enquiry.name}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Contact Number</p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-base font-semibold text-stone-900 dark:text-stone-100">{enquiry.phone}</p>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="inline-flex size-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
                    title="Call Customer"
                  >
                    <Phone className="size-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/91${enquiry.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Email Address</p>
              {enquiry.email ? (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-base font-medium text-stone-800 dark:text-stone-200">{enquiry.email}</p>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="inline-flex size-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400"
                    title="Email Customer"
                  >
                    <Mail className="size-3.5" />
                  </a>
                </div>
              ) : (
                <p className="text-base font-normal text-stone-400">Not provided</p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Enquirer Role</p>
              <p className="text-base font-medium text-stone-800 dark:text-stone-200">{enquiry.role || "Not specified"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Project Type</p>
              <p className="text-base font-medium text-stone-800 dark:text-stone-200">{enquiry.projectType}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Approx. Area</p>
              <p className="text-base font-medium text-stone-800 dark:text-stone-200">
                {enquiry.area ? `${Number(enquiry.area).toLocaleString("en-IN")} sq m` : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">City / Site Location</p>
              <p className="text-base font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <MapPin className="size-4 text-stone-400" />
                {enquiry.city}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Stone of Interest</p>
              <p className="text-base font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Layers className="size-4 text-stone-400" />
                {enquiry.stoneType}
              </p>
            </div>

            {enquiry.message && (
              <div className="md:col-span-2 pt-4 border-t border-stone-200/50 dark:border-stone-800/50">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Message / Inquiry Details</p>
                <div className="rounded-lg bg-stone-100 dark:bg-stone-900/80 p-4 text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed border border-stone-200/60 dark:border-stone-800">
                  {enquiry.message}
                </div>
              </div>
            )}

            <div className="md:col-span-2 pt-4 border-t border-stone-200/50 dark:border-stone-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">Enquiry Created At</p>
              <p className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Calendar className="size-4" />
                {new Date(enquiry.createdAt).toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Requirements Notes Card */}
        <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
            <MessageSquare className="size-5 text-indigo-500" />
            Requirement Notes & Management
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
            Keep track of specific customer requirements, thickness preferences, sample shipments, quotes shared, or communication follow-ups.
          </p>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write customer notes here..."
            className="min-h-[160px] bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100"
          />

          <div className="mt-4 flex justify-end">
            <Button
              onClick={saveNotes}
              disabled={savingNotes}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6"
            >
              {savingNotes ? "Saving Notes..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Status & Timeline Panel */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-stone-300/70 bg-stone-50/80 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
          <h3 className="font-heading text-lg font-semibold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
            <CheckCircle className="size-5 text-indigo-500" />
            Enquiry Status Control
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-2">Change Status</p>
              <Select
                value={status}
                onValueChange={updateStatus}
                disabled={savingStatus}
              >
                <SelectTrigger className="w-full bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dynamic Timeline Progression Panel */}
        <EnquiryTimeline status={status} />
      </div>
    </div>
  );
}
