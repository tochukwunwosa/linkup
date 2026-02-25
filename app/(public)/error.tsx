"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#f5f4f2]">
      <div className="max-w-md w-full rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(249,115,22,0.12) 100%)",
            }}
          >
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-[#1a1b25] mb-3">
          Something went wrong
        </h1>
        <p className="text-[#64748b] text-sm leading-relaxed mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>

        {/* Dev error detail */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 bg-[#f5f4f2] rounded-lg p-4 text-left border border-[rgba(0,0,0,0.06)]">
            <p className="text-xs font-mono text-red-600 break-all">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-[#64748b] mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white hover:bg-[#f5f4f2] text-[#4a4a5a] font-semibold text-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
