import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { colors } from "../emailTheme";

interface OrganizerRejectedEmailProps {
  organizerName: string;
  eventTitle: string;
  trackingId: string;
  feedback?: string;
  resubmitUrl: string;
}

export const OrganizerRejectedEmail = ({
  organizerName = "John Doe",
  eventTitle = "Lagos Tech Summit 2025",
  trackingId = "EVT-A1B2C3D4",
  feedback,
  resubmitUrl = "https://techlinkup.xyz/submit-event",
}: OrganizerRejectedEmailProps) => {
  return (
    <EmailLayout
      previewText={`Update on your event submission — ${eventTitle}`}
      accentColor={colors.slate700}
      headerSubtitleColor={colors.graySubtitle}
      headerTitle="Submission Update"
      headerSubtitle={`Regarding: ${eventTitle}`}
    >
      <Text className="m-0 mb-4 text-brand-dark text-[16px] leading-6 font-semibold">
        Hello {organizerName},
      </Text>
      <Text className="m-0 mb-6 text-brand-muted text-[15px] leading-6">
        Thank you for submitting your event to TechLinkUp. Unfortunately,
        we&apos;re unable to publish it at this time.
      </Text>

      {/* Info card */}
      <Section
        style={{
          border: "1px solid #cfd1d4",
          borderLeftWidth: "4px",
          borderLeftColor: colors.muted,
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
          </tbody>
        </table>
        <div style={{ borderTop: "1px solid #cfd1d4", margin: "16px 0" }} />
        <Text className="m-0 mb-1 text-brand-muted text-[12px] uppercase tracking-[0.5px]">
          Tracking ID
        </Text>
        <Text className="m-0 text-brand-dark text-[20px] font-bold font-mono tracking-[1px]">
          {trackingId}
        </Text>
      </Section>

      {/* Conditional feedback block */}
      {feedback && (
        <Section
          style={{
            border: "1px solid #cfd1d4",
            borderLeftWidth: "4px",
            borderLeftColor: colors.muted,
          }}
          className="bg-[#f9fafb] rounded-md px-5 py-4 mb-5"
        >
          <Heading
            as="h2"
            className="m-0 mb-[10px] text-brand-dark text-[14px] font-semibold"
          >
            Feedback from Our Team
          </Heading>
          <Text className="m-0 text-brand-muted text-[14px] leading-[22px]">
            {feedback}
          </Text>
        </Section>
      )}

      <Text className="m-0 mb-6 text-brand-muted text-[14px] leading-[22px]">
        We&apos;d love to have you resubmit once the issues are resolved.
      </Text>

      <Section className="text-center py-1">
        <Button
          href={resubmitUrl}
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
          Submit Again
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default OrganizerRejectedEmail;
