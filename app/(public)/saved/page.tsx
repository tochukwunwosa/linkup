import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SavedEventsList } from "@/components/event/saved-events-list";

export const metadata: Metadata = {
  title: "Saved Events",
  robots: { index: false, follow: false },
};

export default function SavedEventsPage() {
  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <PageHero
        backHref="/"
        backLabel="All events"
        eyebrow="Saved"
        title="Your saved events"
        subtitle="Saved on this device only, and available offline."
      >
        <Heart className="w-3.5 h-3.5" />
      </PageHero>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <SavedEventsList />
      </div>
    </main>
  );
}
