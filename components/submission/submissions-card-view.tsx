"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, User, Mail, Phone, Building2, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import type { EventSubmission } from "@/lib/validations/event"

interface SubmissionsCardViewProps {
  submissions: EventSubmission[]
  onApprove: (submission: EventSubmission) => void
  onReject: (submission: EventSubmission) => void
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

export function SubmissionsCardView({ submissions, onApprove, onReject }: SubmissionsCardViewProps) {
  return (
    <div className="grid gap-4">
      {submissions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No submissions found</div>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{submission.title}</h3>
                    {getStatusBadge(submission.submission_status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{submission.description}</p>

              {/* Organizer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Organizer Details</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{submission.organizer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{submission.organizer_email}</span>
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

                <div className="space-y-2 text-sm">
                  <p className="font-medium">Submission Details</p>
                  <div>
                    <span className="text-muted-foreground">Tracking ID: </span>
                    <code className="bg-background px-2 py-0.5 rounded text-xs font-mono">
                      {submission.tracking_id}
                    </code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted: </span>
                    <span>
                      {new Date(submission.submitted_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span>{submission.type}</span>
                  </div>
                  {submission.link && (
                    <a
                      href={submission.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      Event Link <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {submission.category.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Admin Feedback */}
              {submission.admin_feedback && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded mb-4">
                  <p className="text-sm font-medium mb-1">Rejection Feedback</p>
                  <p className="text-sm text-muted-foreground">{submission.admin_feedback}</p>
                </div>
              )}

              {/* Actions */}
              {submission.submission_status === "pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => onApprove(submission)}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve & Publish
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onReject(submission)}
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
