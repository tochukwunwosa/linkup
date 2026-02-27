import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { colors } from "../emailTheme";

interface AdminNotificationEmailProps {
  eventTitle: string;
  organizerName: string;
  organizerEmail: string;
  eventDate: string;
  eventLocation: string;
  eventWebsite?: string;
  trackingId: string;
  submissionUrl: string;
}

export const AdminNotificationEmail = ({
  eventTitle = "Lagos Tech Summit 2025",
  organizerName = "John Doe",
  organizerEmail = "john@example.com",
  eventDate = "December 15, 2025",
  eventLocation = "Lagos, Nigeria",
  eventWebsite = "https://www.eventtribe.com",
  trackingId = "EVT-A1B2C3D4",
  submissionUrl = "https://techlinkup.xyz/admin/dashboard/submissions",
}: AdminNotificationEmailProps) => {
  return (
    <EmailLayout
      previewText={`New event submission: ${eventTitle}`}
      accentColor={colors.purple}
      headerSubtitleColor={colors.purpleSubtitle}
      headerTitle="New Submission Alert"
      headerSubtitle="TechLinkUp Admin Notification"
    >
      <Text className="m-0 mb-4 text-brand-dark text-[16px] leading-6 font-semibold">
        Hello Admin,
      </Text>
      <Text className="m-0 mb-6 text-brand-muted text-[15px] leading-6">
        A new event has been submitted and is awaiting your review.
      </Text>

      {/* Info card */}
      <Section
        style={{
          border: "1px solid #cfd1d4",
          borderLeftWidth: "4px",
          borderLeftColor: colors.purple,
        }}
        className="bg-brand-card rounded-md px-5 pt-5 pb-4 mb-6"
      >
        <Heading
          as="h2"
          className="m-0 mb-[14px] text-brand-dark text-[15px] font-semibold"
        >
          Submission Details
        </Heading>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                Title:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px] font-semibold">
                {eventTitle}
              </td>
            </tr>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                Date:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px]">
                {eventDate}
              </td>
            </tr>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                Location:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px]">
                {eventLocation}
              </td>
            </tr>
            {eventWebsite && (
              <tr>
                <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                  Website:
                </td>
                <td className="py-[6px] text-brand-dark text-[13px]">
                  <a
                    href={eventWebsite}
                    style={{ color: colors.purple, textDecoration: "none" }}
                  >
                    {eventWebsite}
                  </a>
                </td>
              </tr>
            )}
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                Tracking ID:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px] font-mono">
                {trackingId}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ borderTop: "1px solid #cfd1d4", margin: "16px 0" }} />
        <Heading
          as="h3"
          className="m-0 mb-3 text-brand-dark text-[13px] font-semibold uppercase tracking-[0.5px]"
        >
          Organizer
        </Heading>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                Name:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px]">
                {organizerName}
              </td>
            </tr>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[100px] align-top">
                Email:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px]">
                <a
                  href={`mailto:${organizerEmail}`}
                  style={{ color: colors.purple, textDecoration: "none" }}
                >
                  {organizerEmail}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section className="text-center py-1">
        <Button
          href={submissionUrl}
          style={{
            display: "inline-block",
            backgroundColor: colors.purple,
            color: "#ffffff",
            textDecoration: "none",
            padding: "13px 36px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Review Submission
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default AdminNotificationEmail;
