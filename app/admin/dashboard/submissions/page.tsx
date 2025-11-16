"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAllSubmissions } from "@/app/actions/submission/getAllSubmissions";
import { approveSubmissionAction } from "@/app/actions/submission/approveSubmission";
import { rejectSubmissionAction } from "@/app/actions/submission/rejectSubmission";
import type { EventSubmission, SubmissionStatus } from "@/lib/validations/event";
import { Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SubmissionsTable } from "@/components/submission/submissions-table";
import { SubmissionsCardView } from "@/components/submission/submissions-card-view";

export default function SubmissionsPage() {
  const isMobile = useIsMobile();

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

  const handleApprove = async (submission: EventSubmission) => {
    setActionLoading(true);
    try {
      const result = await approveSubmissionAction(submission.id);
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

  const handleReject = (submission: EventSubmission) => {
    setSelectedSubmission(submission);
    setRejectDialogOpen(true);
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

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading submissions...</p>
              </CardContent>
            </Card>
          ) : isMobile ? (
            <SubmissionsCardView
              submissions={filteredSubmissions}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <SubmissionsTable
              submissions={filteredSubmissions}
              onApprove={handleApprove}
              onReject={handleReject}
            />
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
