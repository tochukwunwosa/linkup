import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Submissions - TechLinkUp",
  description: "Track the status of your event submissions to Tech Linkup. Check if your event has been approved, pending, or needs revisions.",
  alternates: {
    canonical: "https://techlinkup.xyz/my-submissions",
  },
  openGraph: {
    title: "Track Your Submissions - TechLinkUp",
    description: "Track the status of your event submissions to Tech Linkup. Check if your event has been approved, pending, or needs revisions.",
    url: "https://techlinkup.xyz/my-submissions",
    images: [
      {
        url: "/linkup-og-image-1200x600.webp",
        width: 1200,
        height: 630,
        alt: "Track Your Event Submissions on TechLinkUp",
      },
    ],
  },
};

export default function MySubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
