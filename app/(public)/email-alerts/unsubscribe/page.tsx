import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Unsubscribe | TechLinkUp",
  robots: { index: false, follow: false },
};

// A button rather than unsubscribing on page load: email security scanners
// open links automatically and would otherwise unsubscribe people.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f5f4f2] flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <h1 className="text-xl font-bold text-[#1a1b25] mb-2">Unsubscribe from weekly emails?</h1>
        {token ? (
          <>
            <p className="text-sm text-[#4a4a5a] mb-6">
              We&apos;ll stop the Monday event emails and delete your email address.
            </p>
            <form method="post" action={`/api/digest/unsubscribe?token=${encodeURIComponent(token)}`}>
              <Button type="submit" className="w-full">
                Yes, unsubscribe me
              </Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-[#4a4a5a] mb-6">
            This link is missing its code. Please use the unsubscribe link in your email.
          </p>
        )}
        <Link href="/" className="mt-4 inline-block text-sm text-[#64748b] hover:text-[#1a1b25]">
          Back to events
        </Link>
      </div>
    </main>
  );
}
