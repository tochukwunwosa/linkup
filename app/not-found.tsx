"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#f5f4f2]">
      <div className="max-w-lg w-full text-center">
        {/* Large 404 */}
        <p
          className="text-[10rem] sm:text-[12rem] font-bold leading-none select-none"
          style={{ color: "rgba(0, 102, 204, 0.12)" }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Heading + message */}
        <div className="-mt-6 mb-8 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1b25]">
            Page not found
          </h1>
          <p className="text-[#64748b] text-base max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white hover:border-[#0066cc]/30 hover:text-[#0066cc] text-[#4a4a5a] font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c9f72f] hover:bg-[#b8e020] text-[#1a1b25] font-semibold text-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            Browse Events
          </Link>
        </div>

        {/* Helpful category links */}
        <div className="border-t border-[rgba(0,0,0,0.07)] pt-6">
          <p className="text-xs text-[#64748b] uppercase tracking-wider mb-3">
            Explore categories
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            <Link
              href="/category/web-development"
              className="text-sm text-[#0066cc] hover:underline"
            >
              Web Development
            </Link>
            <span className="text-[#64748b]">·</span>
            <Link
              href="/category/ai-ml"
              className="text-sm text-[#0066cc] hover:underline"
            >
              AI / ML
            </Link>
            <span className="text-[#64748b]">·</span>
            <Link
              href="/category/cloud-devops"
              className="text-sm text-[#0066cc] hover:underline"
            >
              Cloud & DevOps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
