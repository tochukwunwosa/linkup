import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { colors } from "../emailTheme";

interface OrganizerConfirmationEmailProps {
  organizerName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventWebsite?: string;
  trackingId: string;
  trackingUrl: string;
}

export const OrganizerConfirmationEmail = ({
  organizerName = "John Doe",
  eventTitle = "Lagos Tech Summit 2025",
  eventDate = "December 15, 2025",
  eventLocation = "Lagos, Nigeria",
  trackingId = "EVT-A1B2C3D4",
  trackingUrl = "https://techlinkup.xyz/my-submissions",
}: OrganizerConfirmationEmailProps) => {
  return (
    <EmailLayout
      previewText={`Your event submission has been received - ${eventTitle}`}
      accentColor={colors.blue}
      headerSubtitleColor={colors.blueSubtitle}
      headerTitle="Submission Received"
      headerSubtitle="Thank you for submitting to TechLinkUp"
    >
      <Text className="m-0 mb-4 text-brand-dark text-[16px] leading-6 font-semibold">
        Hi {organizerName},
      </Text>
      <Text className="m-0 mb-6 text-brand-muted text-[15px] leading-6">
        We&apos;ve received your event submission and it&apos;s now under review
        by our team.
      </Text>

      {/* Info card */}
      <Section
        style={{
          border: "1px solid #cfd1d4",
          borderLeftWidth: "4px",
          borderLeftColor: colors.blue,
        }}
        className="bg-brand-card rounded-md px-5 pt-5 pb-4 mb-5"
      >
        <Heading
          as="h2"
          className="m-0 mb-[14px] text-brand-dark text-[15px] font-semibold"
        >
          Event Details
        </Heading>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[90px] align-top">
                Title:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px] font-semibold">
                {eventTitle}
              </td>
            </tr>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[90px] align-top">
                Date:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px]">
                {eventDate}
              </td>
            </tr>
            <tr>
              <td className="py-[6px] text-brand-muted text-[13px] w-[90px] align-top">
                Location:
              </td>
              <td className="py-[6px] text-brand-dark text-[13px]">
                {eventLocation}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ borderTop: "1px solid #cfd1d4", margin: "16px 0" }} />
        <Text className="m-0 mb-1 text-brand-muted text-[12px] uppercase tracking-[0.5px]">
          Tracking ID
        </Text>
        <Text
          className="m-0 text-[20px] font-bold font-mono tracking-[1px]"
          style={{ color: colors.blue }}
        >
          {trackingId}
        </Text>
      </Section>

      <Text className="m-0 mb-6 text-brand-muted text-[14px] leading-[22px]">
        We review submissions within 1–2 business days. You&apos;ll hear from
        us soon.
      </Text>

      <Section className="text-center py-1">
        <Button
          href={trackingUrl}
          style={{
            display: "inline-block",
            backgroundColor: colors.blue,
            color: "#ffffff",
            textDecoration: "none",
            padding: "13px 36px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          View My Submissions
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default OrganizerConfirmationEmail;
