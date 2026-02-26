"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader,
  Search,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getSubmissionsByEmail } from "@/app/actions/submission/getSubmissionsByEmail";
import { getSubmissionByTrackingId } from "@/app/actions/submission/getSubmissionByTracking";
import type { EventSubmission } from "@/lib/validations/event";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/page-hero";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MySubmissionsPage() {
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"email" | "tracking">("email");
  const [searchValue, setSearchValue] = useState("");
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<EventSubmission | null>(null);

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter your email or tracking ID");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      if (searchType === "email") {
        const result = await getSubmissionsByEmail(searchValue.trim());
        if (result.success) {
          setSubmissions(result.submissions || []);
          if (result.submissions && result.submissions.length === 0) {
            toast.info("No submissions found for this email");
          }
        } else {
          toast.error(result.error || "Failed to fetch submissions");
          setSubmissions([]);
        }
      } else {
        const result = await getSubmissionByTrackingId(
          searchValue.trim().toUpperCase()
        );
        if (result.success && result.submission) {
          setSubmissions([result.submission]);
        } else {
          toast.error(result.error || "Submission not found");
          setSubmissions([]);
        }
      }
    } catch (error) {
      console.error("Error searching submissions:", error);
      toast.error("An error occurred while searching");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f5f4f2] text-[#64748b] border border-[rgba(0,0,0,0.1)]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="Home"
        eyebrow="Community Platform"
        title="Track Your Submissions"
        subtitle="Check the review status of your submitted events."
      />
      <div className="mx-auto px-4 sm:px-6 py-10">

        {/* Search card */}
        <div className="max-w-3xl mx-auto rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-6">
          <h2 className="font-semibold text-[#1a1b25] mb-1">Find Your Submissions</h2>
          <p className="text-sm text-[#64748b] mb-4">
            Search by email to see all your submissions, or use a tracking ID for a specific event
          </p>

          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "email" | "tracking")} className="mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="email">Search by Email</TabsTrigger>
              <TabsTrigger value="tracking">Search by ID</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="md:flex gap-2">
            <Input
              type={searchType === "email" ? "email" : "text"}
              placeholder={
                searchType === "email"
                  ? "Enter your email address"
                  : "Enter your tracking ID (e.g., EVT-A1B2C3D4)"
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="min-w-32 bg-[#0066cc] hover:bg-[#0052a3] text-white mt-2 md:mt-0"
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {/* CTA banner */}
        <div className="mb-6 px-5 max-w-3xl mx-auto py-4 rounded-xl bg-[#0066cc]/5 border border-[#0066cc]/10 text-center text-sm text-[#64748b]">
          Have a new event to share?{" "}
          <Link href="/submit-event" className="text-[#0066cc] hover:underline font-medium">
            Submit your event
          </Link>{" "}
          to the community.
        </div>

        {/* Results */}
        {searched && (
          <div className="max-w-5xl mx-auto space-y-3">
            {submissions.length === 0 ? (
              <div className="max-w-3xl mx-auto rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-12 text-center">
                <Search className="h-8 w-8 text-[#cbd5e1] mx-auto mb-3" />
                <p className="font-medium text-[#1a1b25]">No submissions found</p>
                <p className="text-sm text-[#64748b] mt-2">
                  {searchType === "email"
                    ? "No events submitted from this email address yet."
                    : "Double-check your tracking ID — it looks like EVT-XXXXXXXX"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#64748b]">
                  Found {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submissions.map((submission) => (
                    <button
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`w-full text-left rounded-xl border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden border-l-4 cursor-pointer hover:shadow-md transition-shadow duration-150 ${
                        submission.submission_status === "approved"
                          ? "border-l-emerald-500"
                          : submission.submission_status === "rejected"
                          ? "border-l-red-400"
                          : "border-l-amber-400"
                      }`}
                    >
                      <div className="p-4 sm:p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base font-semibold text-[#1a1b25] leading-snug line-clamp-2 min-w-0">
                            {submission.title}
                          </h3>
                          <div className="shrink-0">{getStatusBadge(submission.submission_status)}</div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-[#64748b] mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {new Date(submission.start_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{submission.location}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(0,0,0,0.05)]">
                          <code className="text-xs font-mono text-[#94a3b8] bg-[#f5f4f2] px-2 py-0.5 rounded">
                            {submission.tracking_id}
                          </code>
                          <span className="flex items-center gap-0.5 text-xs text-[#0066cc] font-medium shrink-0">
                            View details
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog
        open={selectedSubmission !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSubmission(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pr-6 leading-snug">
              {selectedSubmission?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              {/* Status */}
              <div>{getStatusBadge(selectedSubmission.submission_status)}</div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                  {new Date(selectedSubmission.start_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                  {selectedSubmission.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                  {selectedSubmission.location}
                </span>
              </div>

              {/* Tracking ID */}
              <div className="pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">
                  Tracking ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-[#f5f4f2] px-2.5 py-1 rounded text-sm font-mono text-[#4a4a5a]">
                    {selectedSubmission.tracking_id}
                  </code>
                  <button
                    onClick={() => copyTrackingId(selectedSubmission.tracking_id)}
                    className="p-1.5 rounded hover:bg-[#f5f4f2] text-[#64748b] hover:text-[#0066cc] transition-colors"
                    title="Copy tracking ID"
                  >
                    {copiedId === selectedSubmission.tracking_id ? (
                      <Check className="h-4 w-4 text-[#0066cc]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submission details grid */}
              <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <div>
                  <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-1">
                    Submitted On
                  </p>
                  <p className="text-[#1a1b25]">
                    {new Date(selectedSubmission.submitted_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {selectedSubmission.reviewed_at && (
                  <div>
                    <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-1">
                      Reviewed On
                    </p>
                    <p className="text-[#1a1b25]">
                      {new Date(selectedSubmission.reviewed_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-1">
                    Event Type
                  </p>
                  <p className="text-[#1a1b25]">{selectedSubmission.type}</p>
                </div>
              </div>

              {/* Admin feedback */}
              {selectedSubmission.admin_feedback &&
                selectedSubmission.submission_status === "rejected" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-sm text-red-800 mb-1">
                      Feedback from Admin
                    </p>
                    <p className="text-sm text-red-700">
                      {selectedSubmission.admin_feedback}
                    </p>
                  </div>
                )}

              {/* Published event link */}
              {selectedSubmission.submission_status === "approved" &&
                selectedSubmission.published_event_id && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm font-medium text-emerald-800 mb-2">
                      Your event has been published!
                    </p>
                    <Link
                      href={`/my-submissions/${selectedSubmission.tracking_id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
                    >
                      View event details
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

              {/* Category tags */}
              {selectedSubmission.category.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedSubmission.category.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#6b46c1]/8 text-[#6b46c1]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
