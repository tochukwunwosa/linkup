"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import type { EventSubmission } from "@/lib/validations/event";
import { formatCurrency } from "@/lib/format-currency";
import { formatTo12Hour } from "@/lib/utils";

interface SubmissionDetailsDialogProps {
  submission: EventSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (submission: EventSubmission) => void;
  onReject: (submission: EventSubmission) => void;
  actionLoading?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getConfidenceBadge = (score: number | null | undefined) => {
  if (score == null) return null;
  const className =
    score >= 90
      ? "bg-green-50 text-green-700 border-green-300"
      : score >= 70
      ? "bg-yellow-50 text-yellow-700 border-yellow-300"
      : "bg-red-50 text-red-700 border-red-300";
  return (
    <Badge variant="outline" className={className}>
      {Math.round(score)}% confidence
    </Badge>
  );
};

export function SubmissionDetailsDialog({
  submission,
  open,
  onOpenChange,
  onApprove,
  onReject,
  actionLoading,
}: SubmissionDetailsDialogProps) {
  if (!submission) return null;

  const isScraped = submission.source_type === "scraped";
  const isPending = submission.submission_status === "pending";

  const formattedStartDate = new Date(submission.start_date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = submission.end_date
    ? new Date(submission.end_date).toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const priceDisplay =
    submission.price?.toLowerCase() === "free"
      ? "Free"
      : submission.price_amount
      ? formatCurrency(Number(submission.price_amount), submission.currency || "NGN")
      : submission.price || "Not specified";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-2xl max-h-[85vh] overflow-y-auto min-w-0">
        <DialogHeader className="min-w-0 pr-6">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {getStatusBadge(submission.submission_status)}
            {isScraped ? (
              <>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {submission.source_connector || "Scraped"}
                </Badge>
                {getConfidenceBadge(submission.confidence_score)}
              </>
            ) : (
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">User submitted</Badge>
            )}
          </div>
          <DialogTitle className="text-lg sm:text-xl leading-snug break-words">{submission.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{formattedStartDate}</p>
                {formattedEndDate && <p className="text-xs text-muted-foreground">to {formattedEndDate}</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p>{formatTo12Hour(submission.time)}</p>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p>{submission.location}</p>
                {submission.city && (
                  <p className="text-xs text-muted-foreground">
                    {submission.city}
                    {submission.country ? `, ${submission.country}` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {submission.category && submission.category.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {submission.category.map((cat) => (
                <Badge key={cat} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {cat}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{submission.type}</span>
            <span className="text-muted-foreground ml-4">Price:</span>
            <span className="font-medium">{priceDisplay}</span>
          </div>

          {submission.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Description
              </p>
              <p className="whitespace-pre-wrap text-sm">{submission.description}</p>
            </div>
          )}

          <Separator />

          {/* Links — the part that matters most for verifying before approving */}
          <div className="space-y-2">
            {submission.link && (
              <a
                href={submission.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Visit event / registration page
              </a>
            )}
            {isScraped && submission.source_url && submission.source_url !== submission.link && (
              <div>
                <a
                  href={submission.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View original scraped source page
                </a>
              </div>
            )}
            {!submission.link && !submission.source_url && (
              <p className="text-xs text-muted-foreground">No external link provided for this submission.</p>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Organizer
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{submission.organizer_name || "Unknown (scraped)"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{submission.organizer_email || "—"}</span>
              </div>
              {submission.organizer_phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{submission.organizer_phone}</span>
                </div>
              )}
              {submission.organizer_organization && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{submission.organizer_organization}</span>
                </div>
              )}
            </div>
          </div>

          {submission.admin_feedback && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Admin Feedback
                </p>
                <p className="text-sm">{submission.admin_feedback}</p>
              </div>
            </>
          )}
        </div>

        {isPending && (
          <DialogFooter>
            <Button variant="destructive" onClick={() => onReject(submission)} disabled={actionLoading}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={() => onApprove(submission)} disabled={actionLoading}>
              {actionLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
