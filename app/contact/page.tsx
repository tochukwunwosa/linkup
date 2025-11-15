import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Get in Touch</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions, feedback, or want to collaborate? We&apos;d love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* General Inquiries */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>General Inquiries</CardTitle>
            </div>
            <CardDescription>
              Questions about LinkUp or how to use the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:tochukwunwosa28@gmail.com"
              className="text-blue-600 hover:underline font-medium"
            >
              tochukwunwosa28@gmail.com
            </a>
          </CardContent>
        </Card>

        {/* Event Submissions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Event Submissions</CardTitle>
            </div>
            <CardDescription>
              Questions about submitting or managing your events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:tochukwunwosa28@gmail.com"
              className="text-blue-600 hover:underline font-medium"
            >
              tochukwunwosa28@gmail.com
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle>Other Ways to Connect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg border">
              <Github className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Report an Issue</h3>
              <p className="text-sm text-gray-600 mb-2">
                Found a bug or have a feature request? Open an issue on GitHub.
              </p>
              <a
                href="https://github.com/tochukwunwosa/tech-linkup/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 pt-4 border-t">
            <div className="p-2 bg-white rounded-lg border">
              <MessageSquare className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Submit an Event</h3>
              <p className="text-sm text-gray-600 mb-2">
                Have a tech event you&apos;d like to share with the community?
              </p>
              <Link
                href="/submit-event"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Submit Event →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Time Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Response time:</span> We typically respond within 24-48 hours during business days.
        </p>
      </div>
    </main>
  );
}
