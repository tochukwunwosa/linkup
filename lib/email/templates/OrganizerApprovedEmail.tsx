import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { colors } from "../emailTheme";

interface OrganizerApprovedEmailProps {
  organizerName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  trackingId: string;
  eventUrl: string;
}

export const OrganizerApprovedEmail = ({
  organizerName = "John Doe",
  eventTitle = "Lagos Tech Summit 2025",
  eventDate = "March 15, 2025",
  eventLocation = "Lagos, Nigeria",
  trackingId = "EVT-A1B2C3D4",
  eventUrl = "https://techlinkup.xyz",
}: OrganizerApprovedEmailProps) => {
  return (
    <EmailLayout
      previewText={`Your event "${eventTitle}" is now live on TechLinkUp`}
      accentColor={colors.green}
      headerSubtitleColor={colors.greenSubtitle}
      headerTitle="Event Approved!"
      headerSubtitle="Your event is now live on TechLinkUp"
    >
      <Text className="m-0 mb-4 text-brand-dark text-[16px] leading-6 font-semibold">
        Hello {organizerName},
      </Text>
      <Text className="m-0 mb-6 text-brand-muted text-[15px] leading-6">
        Your event submission has been{" "}
        <strong style={{ color: colors.green }}>approved</strong> and is now
        publicly visible on TechLinkUp.
      </Text>

      {/* Info card */}
      <Section
        style={{
          border: "1px solid #cfd1d4",
          borderLeftWidth: "4px",
          borderLeftColor: colors.green,
        }}
        className="bg-brand-card rounded-md px-5 pt-5 pb-4 mb-6"
      >
        <Heading
          as="h2"
          className="m-0 mb-[14px] text-brand-dark text-[15px] font-semibold"
        >
          Your Event
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
          style={{ color: colors.green }}
        >
          {trackingId}
        </Text>
      </Section>

      <Section className="text-center pb-4 pt-1">
        <Button
          href={eventUrl}
          style={{
            display: "inline-block",
            backgroundColor: colors.green,
            color: "#ffffff",
            textDecoration: "none",
            padding: "13px 36px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          View Your Event
        </Button>
      </Section>

      <Text className="m-0 text-brand-muted text-[14px] leading-[22px] text-center">
        Thank you for contributing to the tech community!
      </Text>
    </EmailLayout>
  );
};

export default OrganizerApprovedEmail;
