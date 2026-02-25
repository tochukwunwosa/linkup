import { WifiOff } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#f5f4f2]">
      <div className="max-w-sm w-full rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(0, 102, 204, 0.08)" }}
        >
          <WifiOff className="h-8 w-8 text-[#0066cc]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-[#1a1b25] mb-3">
          You&apos;re offline
        </h1>
        <p className="text-[#64748b] text-sm leading-relaxed mb-6">
          It looks like you&apos;ve lost your internet connection. Some features
          may not be available right now.
        </p>

        {/* Tips */}
        <div className="bg-[#f5f4f2] rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-[#1a1b25] uppercase tracking-wide mb-2">
            What you can do
          </p>
          <ul className="space-y-1.5 text-sm text-[#64748b]">
            <li>• Check your internet connection</li>
            <li>• Try refreshing the page</li>
            <li>• View previously loaded content</li>
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold text-sm transition-colors"
        >
          Try Again
        </Link>
      </div>

      <p className="text-xs text-[#64748b] mt-8">
        TechLinkUp works best with an active internet connection.
      </p>
    </div>
  );
}
