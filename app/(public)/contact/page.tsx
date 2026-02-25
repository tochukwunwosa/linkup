import React from "react";
import Link from "next/link";
import { Mail, MessageSquare, Github } from "lucide-react";
import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us - TechLinkUp",
  description:
    "Get in touch with the TechLinkUp team. Have questions, feedback, or want to collaborate? We'd love to hear from you.",
  alternates: {
    canonical: "https://techlinkup.xyz/contact",
  },
  openGraph: {
    title: "Contact Us - TechLinkUp",
    description:
      "Get in touch with the TechLinkUp team. Have questions, feedback, or want to collaborate? We'd love to hear from you.",
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* LEFT — Contact form */}
          <div className="lg:col-span-3 h-full">
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-6 sm:p-8">
              <h2 className="font-semibold text-[#1a1b25] mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                Fill out the form below and we&apos;ll respond as soon as
                possible.
              </p>
              <ContactForm />
            </div>
          </div>

          {/* RIGHT — Contact channels */}
          <div className="lg:col-span-2 space-y-4">
            {/* General Inquiries */}
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="inline-flex p-2.5 rounded-lg bg-[#0066cc]/8 mb-3">
                <Mail className="h-5 w-5 text-[#0066cc]" />
              </div>
              <h3 className="font-semibold text-[#1a1b25] mb-1">
                General Inquiries
              </h3>
              <p className="text-sm text-[#64748b] mb-2">
                Questions about the platform
              </p>
              <a
                href="mailto:tochukwunwosa28@gmail.com"
                className="text-sm font-medium text-[#0066cc] hover:underline break-all"
              >
                tochukwunwosa28@gmail.com
              </a>
            </div>

            {/* Other connections */}
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-white p-5 space-y-4">
              <h3 className="font-semibold text-[#1a1b25]">
                Other ways to connect
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f5f4f2] shrink-0">
                  <Github className="h-4 w-4 text-[#1a1b25]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1b25] mb-0.5">
                    Report an Issue
                  </p>
                  <p className="text-xs text-[#64748b] mb-1.5">
                    Bug or feature request? Open an issue on GitHub.
                  </p>
                  <a
                    href="https://github.com/tochukwunwosa/tech-linkup/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#0066cc] hover:underline"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[rgba(0,0,0,0.06)]">
                <div className="p-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f5f4f2] flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-[#1a1b25]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1b25] mb-0.5">
                    Submit an Event
                  </p>
                  <p className="text-xs text-[#64748b] mb-1.5">
                    Share a tech event with the community.
                  </p>
                  <Link
                    href="/submit-event"
                    className="text-xs font-medium text-[#0066cc] hover:underline"
                  >
                    Submit Event →
                  </Link>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="px-5 py-4 rounded-xl bg-[#0066cc]/[0.06] border border-[#0066cc]/10">
              <p className="text-sm text-[#64748b]">
                <span className="font-semibold text-[#1a1b25]">
                  Response time:
                </span>{" "}
                We typically respond within 24–48 hours during business days.
              </p>
            </div>
          </div>
        </div>

        {/* Footer links */}
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
            <Link
              href="/my-submissions"
              className="text-[#0066cc] hover:underline"
            >
              Track your submissions
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
