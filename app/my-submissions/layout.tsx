import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Submissions - LinkUp",
  description: "Track the status of your event submissions to Tech Linkup. Check if your event has been approved, pending, or needs revisions.",
  alternates: {
    canonical: "/my-submissions",
  },
  openGraph: {
    title: "Track Your Submissions - LinkUp",
    description: "Track the status of your event submissions to Tech Linkup. Check if your event has been approved, pending, or needs revisions.",
    url: "/my-submissions",
  },
};

export default function MySubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
