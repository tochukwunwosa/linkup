"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Search, ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getSubmissionsByEmail } from "@/app/actions/submission/getSubmissionsByEmail";
import { getSubmissionByTrackingId } from "@/app/actions/submission/getSubmissionByTracking";
import type { EventSubmission } from "@/lib/validations/event";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MySubmissionsPage() {
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"email" | "tracking">("email");
  const [searchValue, setSearchValue] = useState("");
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [searched, setSearched] = useState(false);

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
        const result = await getSubmissionByTrackingId(searchValue.trim().toUpperCase());
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1a1b25] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#1a1b25] mb-2">Track Your Submissions</h1>
        <p className="text-[#64748b] text-base mb-8">Check the status of your event submissions</p>

        {/* Search card */}
        <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-6">
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
        <div className="mb-6 px-5 py-4 rounded-xl bg-[#0066cc]/[0.05] border border-[#0066cc]/10 text-center text-sm text-[#64748b]">
          Have a new event to share?{" "}
          <Link href="/submit-event" className="text-[#0066cc] hover:underline font-medium">
            Submit your event
          </Link>{" "}
          to the community.
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-12 text-center">
                <p className="text-[#64748b]">No submissions found</p>
                <p className="text-sm text-[#64748b] mt-2">
                  {searchType === "email"
                    ? "No events found for this email address"
                    : "Please check your tracking ID and try again"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#64748b]">
                  Found {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                </p>

                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#1a1b25] mb-2">
                            {submission.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-[#64748b]">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(submission.start_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {submission.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {submission.location}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(submission.submission_status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-[rgba(0,0,0,0.06)]">
                        <div>
                          <p className="font-medium text-[#1a1b25] mb-1">Tracking ID</p>
                          <code className="bg-[#f5f4f2] px-2 py-1 rounded text-xs font-mono text-[#4a4a5a]">
                            {submission.tracking_id}
                          </code>
                        </div>
                        <div>
                          <p className="font-medium text-[#1a1b25] mb-1">Submitted On</p>
                          <p className="text-[#64748b]">
                            {new Date(submission.submitted_at).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {submission.reviewed_at && (
                          <div>
                            <p className="font-medium text-[#1a1b25] mb-1">Reviewed On</p>
                            <p className="text-[#64748b]">
                              {new Date(submission.reviewed_at).toLocaleString("en-US", {
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
                          <p className="font-medium text-[#1a1b25] mb-1">Event Type</p>
                          <p className="text-[#64748b]">{submission.type}</p>
                        </div>
                      </div>

                      {submission.admin_feedback && submission.submission_status === "rejected" && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-medium text-sm text-red-800 mb-1">Feedback from Admin</p>
                          <p className="text-sm text-red-700">{submission.admin_feedback}</p>
                        </div>
                      )}

                      {submission.submission_status === "approved" && submission.published_event_id && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-sm font-medium text-emerald-800 mb-2">
                            Your event has been published!
                          </p>
                          <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
                          >
                            View on Tech Linkup
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}

                      {submission.category.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {submission.category.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#6b46c1]/[0.08] text-[#6b46c1]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
