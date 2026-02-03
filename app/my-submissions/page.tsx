"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-xl flex flex-col justify-center mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Your Submissions</h1>
        <p className="text-muted-foreground text-lg">
          Check the status of your event submissions
        </p>
      </div>

      <Card className="mb-8 w-full">
        <CardHeader>
          <CardTitle>Find Your Submissions</CardTitle>
          <CardDescription>
            Search by email to see all your submissions, or use a tracking ID for a specific event
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading} className="min-w-32">
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
        </CardContent>
      </Card>

      {/* CTA for new submissions */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Have a new event to share? <Link href="/submit-event" className="text-blue-600 hover:underline font-medium">Submit your event</Link> to the community.
        </p>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No submissions found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchType === "email"
                    ? "No events found for this email address"
                    : "Please check your tracking ID and try again"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Found {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                </p>
              </div>

              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{submission.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Tracking ID</p>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                          {submission.tracking_id}
                        </code>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Submitted On</p>
                        <p className="text-muted-foreground">
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
                          <p className="font-medium mb-1">Reviewed On</p>
                          <p className="text-muted-foreground">
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
                        <p className="font-medium mb-1">Event Type</p>
                        <p className="text-muted-foreground">{submission.type}</p>
                      </div>
                    </div>

                    {submission.admin_feedback && submission.submission_status === "rejected" && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                        <p className="font-medium text-sm mb-1">Feedback from Admin</p>
                        <p className="text-sm text-muted-foreground">{submission.admin_feedback}</p>
                      </div>
                    )}

                    {submission.submission_status === "approved" && submission.published_event_id && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                          Your event has been published!
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/" className="text-green-700 dark:text-green-300">
                            View on Tech Linkup
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {submission.category.map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
