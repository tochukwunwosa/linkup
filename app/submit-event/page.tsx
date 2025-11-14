"use client";

import { useState } from "react";
import { EventSubmissionForm } from "@/components/event/event-submission-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Event Submitted Successfully!</CardTitle>
            <CardDescription className="text-base">
              Your event has been received and is under review by our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg p-6 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Your Tracking ID:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-2xl font-mono font-bold bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded border">
                  {trackingId}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyTrackingId}
                  className="h-[52px] w-[52px] shrink-0"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Save this ID to track your submission status
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">What happens next?</h4>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Our team will review your event within 1-2 business days</li>
                <li>You&apos;ll receive an email notification once your event is reviewed</li>
                <li>If approved, your event will be published on Tech Linkup</li>
                <li>If changes are needed, we&apos;ll provide feedback via email</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/my-submissions">Track My Submissions</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Submit Your Event</h1>
        <p className="text-muted-foreground text-lg">
          Share your tech event with the Nigerian tech community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>
            Fill out the form below to submit your event for review. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventSubmissionForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Submission Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Events must be tech-related and relevant to the Nigerian tech community</li>
          <li>• Provide accurate and complete information about your event</li>
          <li>• Events will be reviewed within 1-2 business days</li>
          <li>• You&apos;ll receive email notifications about your submission status</li>
          <li>• Keep your tracking ID to check submission status anytime</li>
        </ul>
      </div>
    </div>
  );
}
