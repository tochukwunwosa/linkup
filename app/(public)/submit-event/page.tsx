"use client";

import { useState } from "react";
import { EventSubmissionForm } from "@/components/event/event-submission-form";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { CheckCircle2, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function SubmitEventPage() {
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSuccess = (id: string) => {
    setTrackingId(id);
  };

  const copyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (trackingId) {
    return (
      <div className="min-h-screen bg-[#f5f4f2] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {/* Lime checkmark */}
          <div className="w-14 h-14 rounded-full bg-[#c9f72f]/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#6b7c00]" />
          </div>

          <h2 className="text-2xl font-bold text-[#1a1b25] text-center mb-2">
            Event Submitted Successfully!
          </h2>
          <p className="text-[#64748b] text-center mb-8">
            Your event has been received and is under review by our team
          </p>

          {/* Tracking ID */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-[#64748b]">Your Tracking ID:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-2xl font-mono font-bold bg-[#f5f4f2] px-4 py-3 rounded-lg border border-[rgba(0,0,0,0.08)] text-[#1a1b25]">
                {trackingId}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyTrackingId}
                className="h-[52px] w-[52px] shrink-0 border-[rgba(0,0,0,0.12)]"
              >
                {copied ? <Check className="h-5 w-5 text-[#0066cc]" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-sm text-[#64748b]">Save this ID to track your submission status</p>
          </div>

          {/* What happens next */}
          <div className="space-y-3 text-sm mb-8 p-4 rounded-lg bg-[#f5f4f2] border border-[rgba(0,0,0,0.06)]">
            <h4 className="font-semibold text-[#1a1b25]">What happens next?</h4>
            <ul className="space-y-2 list-disc list-inside text-[#64748b]">
              <li>Our team will review your event within 1-2 business days</li>
              <li>You&apos;ll receive an email notification once your event is reviewed</li>
              <li>If approved, your event will be published on Tech Linkup</li>
              <li>If changes are needed, we&apos;ll provide feedback via email</li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/my-submissions"
              className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold text-sm transition-colors"
            >
              Track My Submissions
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white hover:bg-[#f5f4f2] text-[#4a4a5a] font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="Home"
        eyebrow="Community Submissions"
        title="Submit Your Event"
        subtitle="Share your tech event with Nigeria's tech community."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* LEFT — form card */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#1a1b25] mb-1">Event Information</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Fill out the form below to submit your event for review. All fields marked with{" "}
              <span className="text-red-500">*</span> are required.
            </p>
            <EventSubmissionForm onSuccess={handleSuccess} />
          </div>

          {/* RIGHT — sticky info sidebar */}
          <aside className="sticky top-24 space-y-5">
            {/* Guidelines card */}
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-5">
              <h3 className="font-semibold text-[#1a1b25] mb-3">Submission Guidelines</h3>
              <ul className="space-y-2.5 text-sm text-[#64748b]">
                <li>• Events must be tech-related and relevant to the Nigerian tech community</li>
                <li>• Provide accurate and complete information about your event</li>
                <li>• Events will be reviewed within 1–2 business days</li>
                <li>• You&apos;ll receive email notifications about your submission status</li>
                <li>• Keep your tracking ID to check submission status anytime</li>
              </ul>
            </div>

            {/* Accepted event types card */}
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-5">
              <h3 className="font-semibold text-[#1a1b25] mb-3">Accepted Event Types</h3>
              <div className="flex flex-wrap gap-2">
                {["Conferences", "Meetups", "Workshops", "Hackathons", "Bootcamps", "Webinars"].map(
                  (type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0066cc]/[0.07] text-[#0066cc]"
                    >
                      {type}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Review timeline card */}
            <div className="rounded-xl bg-[#0066cc]/[0.05] border border-[#0066cc]/10 p-5">
              <p className="text-sm font-semibold text-[#0066cc] mb-1">Review Timeline</p>
              <p className="text-sm text-[#64748b] mb-3">
                Our team reviews submissions within 1–2 business days. You&apos;ll receive an email
                once your event is approved or if changes are needed.
              </p>
              <Link
                href="/my-submissions"
                className="text-sm font-medium text-[#0066cc] hover:underline"
              >
                Track your submission →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
