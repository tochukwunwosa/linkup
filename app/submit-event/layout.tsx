import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Event - LinkUp",
  description: "Share your tech event with the Nigerian tech community. Submit conferences, meetups, workshops, and hackathons to Tech Linkup.",
  alternates: {
    canonical: "/submit-event",
  },
  openGraph: {
    title: "Submit Your Event - LinkUp",
    description: "Share your tech event with the Nigerian tech community. Submit conferences, meetups, workshops, and hackathons to Tech Linkup.",
    url: "/submit-event",
  },
};

export default function SubmitEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
