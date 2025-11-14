"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAllSubmissions } from "@/app/actions/submission/getAllSubmissions";
import { approveSubmissionAction } from "@/app/actions/submission/approveSubmission";
import { rejectSubmissionAction } from "@/app/actions/submission/rejectSubmission";
import type { EventSubmission, SubmissionStatus } from "@/lib/validations/event";
import { Calendar, MapPin, Clock, User, Mail, Phone, Building2, ExternalLink, CheckCircle, XCircle, Loader } from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SubmissionStatus | "all">("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<EventSubmission | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const result = await getAllSubmissions();
      if (result.success) {
        setSubmissions(result.submissions || []);
      } else {
        toast.error(result.error || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("An error occurred while fetching submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (submissionId: string) => {
    setActionLoading(true);
    try {
      const result = await approveSubmissionAction(submissionId);
      if (result.success) {
        toast.success(result.message || "Event approved successfully");
        fetchSubmissions();
      } else {
        toast.error(result.error || "Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedSubmission) return;

    setActionLoading(true);
    try {
      const result = await rejectSubmissionAction(selectedSubmission.id, feedback.trim() || undefined);
      if (result.success) {
        toast.success(result.message || "Event rejected successfully");
        setRejectDialogOpen(false);
        setSelectedSubmission(null);
        setFeedback("");
        fetchSubmissions();
      } else {
        toast.error(result.error || "Failed to reject event");
      }
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) =>
    activeTab === "all" ? true : sub.submission_status === activeTab
  );

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

  const stats = {
    pending: submissions.filter((s) => s.submission_status === "pending").length,
    approved: submissions.filter((s) => s.submission_status === "approved").length,
    rejected: submissions.filter((s) => s.submission_status === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Event Submissions"
        description="Review and manage event submissions from the community"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Submissions */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SubmissionStatus | "all")}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading submissions...</p>
              </CardContent>
            </Card>
          ) : filteredSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No submissions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
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
                        onClick={() => handleApprove(submission.id)}
                        disabled={actionLoading}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve & Publish
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setRejectDialogOpen(true);
                        }}
                        disabled={actionLoading}
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
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Event Submission</DialogTitle>
            <DialogDescription>
              Provide feedback to the organizer about why their event was rejected (optional).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., Event doesn't meet our guidelines, missing required information, etc."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Submission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
