import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Event - TechLinkUp",
  description: "Share your tech event with the Nigerian tech community. Submit conferences, meetups, workshops, and hackathons to Tech Linkup.",
  alternates: {
    canonical: "https://techlinkup.xyz/submit-event",
  },
  openGraph: {
    title: "Submit Your Event - TechLinkUp",
    description: "Share your tech event with the Nigerian tech community. Submit conferences, meetups, workshops, and hackathons to Tech Linkup.",
    url: "https://techlinkup.xyz/submit-event",
    images: [
      {
        url: "/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "Submit Your Event to TechLinkUp",
      },
    ],
  },
};

export default function SubmitEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
