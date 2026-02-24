import React from "react";
import Link from "next/link";
import { Mail, MessageSquare, Github } from "lucide-react";
import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Contact Us - TechLinkUp",
  description: "Get in touch with the TechLinkUp team. Have questions, feedback, or want to collaborate? We'd love to hear from you.",
  alternates: {
    canonical: "https://techlinkup.xyz/contact",
  },
  openGraph: {
    title: "Contact Us - TechLinkUp",
    description: "Get in touch with the TechLinkUp team. Have questions, feedback, or want to collaborate? We'd love to hear from you.",
    url: "https://techlinkup.xyz/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="Home"
        title="Get in Touch"
        subtitle="Have questions or feedback? We'd love to hear from you."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {/* General Inquiries */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="inline-flex p-2.5 rounded-lg bg-[#0066cc]/[0.08] mb-4">
              <Mail className="h-5 w-5 text-[#0066cc]" />
            </div>
            <h2 className="font-semibold text-[#1a1b25] mb-1">General Inquiries</h2>
            <p className="text-sm text-[#64748b] mb-3">
              Questions about TechLinkUp or how to use the platform
            </p>
            <a
              href="mailto:tochukwunwosa28@gmail.com"
              className="text-sm font-medium text-[#0066cc] hover:underline"
            >
              tochukwunwosa28@gmail.com
            </a>
          </div>

          {/* Event Submissions */}
          <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="inline-flex p-2.5 rounded-lg bg-[#6b46c1]/[0.08] mb-4">
              <MessageSquare className="h-5 w-5 text-[#6b46c1]" />
            </div>
            <h2 className="font-semibold text-[#1a1b25] mb-1">Event Submissions</h2>
            <p className="text-sm text-[#64748b] mb-3">
              Questions about submitting or managing your events
            </p>
            <a
              href="mailto:tochukwunwosa28@gmail.com"
              className="text-sm font-medium text-[#0066cc] hover:underline"
            >
              tochukwunwosa28@gmail.com
            </a>
          </div>
        </div>

        {/* Other connections */}
        <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 space-y-5">
          <h2 className="font-semibold text-[#1a1b25]">Other Ways to Connect</h2>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f5f4f2]">
              <Github className="h-5 w-5 text-[#1a1b25]" />
            </div>
            <div>
              <h3 className="font-medium text-[#1a1b25] mb-1">Report an Issue</h3>
              <p className="text-sm text-[#64748b] mb-2">
                Found a bug or have a feature request? Open an issue on GitHub.
              </p>
              <a
                href="https://github.com/tochukwunwosa/tech-linkup/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#0066cc] hover:underline"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 pt-4 border-t border-[rgba(0,0,0,0.06)]">
            <div className="p-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f5f4f2]">
              <MessageSquare className="h-5 w-5 text-[#1a1b25]" />
            </div>
            <div>
              <h3 className="font-medium text-[#1a1b25] mb-1">Submit an Event</h3>
              <p className="text-sm text-[#64748b] mb-2">
                Have a tech event you&apos;d like to share with the community?
              </p>
              <Link
                href="/submit-event"
                className="text-sm font-medium text-[#0066cc] hover:underline"
              >
                Submit Event →
              </Link>
            </div>
          </div>
        </div>

        {/* Response time banner */}
        <div className="mt-6 px-5 py-4 rounded-xl bg-[#0066cc]/[0.06] border border-[#0066cc]/10">
          <p className="text-sm text-[#64748b]">
            <span className="font-semibold text-[#1a1b25]">Response time:</span>{" "}
            We typically respond within 24–48 hours during business days.
          </p>
        </div>

        {/* Additional links */}
        <div className="mt-8 text-center text-sm text-[#64748b]">
          <p>
            Want to learn more about us?{" "}
            <Link href="/about" className="text-[#0066cc] hover:underline">
              Visit our About page
            </Link>
            .
          </p>
          <p className="mt-2">
            Already submitted an event?{" "}
            <Link href="/my-submissions" className="text-[#0066cc] hover:underline">
              Track your submissions
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
