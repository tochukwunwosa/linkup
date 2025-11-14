import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

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
  eventUrl = "https://techup-linkup.vercel.app",
}: OrganizerApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Great News! Your Event &quot;{eventTitle}&quot; Has Been Approved</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={emoji}>🎉</Text>
            <Heading style={headerTitle}>Event Approved!</Heading>
            <Text style={headerSubtitle}>Your event is now live on Tech Linkup</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hello {organizerName},</Text>
            <Text style={paragraph}>
              Great news! Your event submission has been{" "}
              <strong style={approved}>approved</strong> and is now live on Tech Linkup.
              Your event is now visible to thousands of tech enthusiasts across Nigeria!
            </Text>

            {/* Event Details Card */}
            <Section style={card}>
              <Heading as="h2" style={cardTitle}>
                Your Event
              </Heading>
              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Title:</td>
                    <td style={valueCell}>{eventTitle}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Date:</td>
                    <td style={valueCellNormal}>{eventDate}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Location:</td>
                    <td style={valueCellNormal}>{eventLocation}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Tracking ID:</td>
                    <td style={trackingIdCell}>{trackingId}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={eventUrl}>
                View Your Event
              </Button>
            </Section>

            <Text style={thankYou}>
              Thank you for contributing to the Nigerian tech community! 🚀
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from Tech Linkup
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Tech Linkup. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrganizerApprovedEmail;

// Styles
const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  margin: "40px auto",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const header = {
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  padding: "40px 30px",
  textAlign: "center" as const,
};

const emoji = {
  fontSize: "48px",
  marginBottom: "10px",
};

const headerTitle = {
  margin: "0",
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.2",
};

const headerSubtitle = {
  margin: "10px 0 0 0",
  color: "#d1fae5",
  fontSize: "16px",
};

const content = {
  padding: "40px 30px",
};

const greeting = {
  margin: "0 0 20px 0",
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
};

const paragraph = {
  margin: "0 0 30px 0",
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
};

const approved = {
  color: "#10b981",
};

const card = {
  backgroundColor: "#f0fdf4",
  borderRadius: "6px",
  borderLeft: "4px solid #10b981",
  padding: "20px",
  marginBottom: "30px",
};

const cardTitle = {
  margin: "0 0 15px 0",
  color: "#111827",
  fontSize: "18px",
  fontWeight: "600",
};

const detailsTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  padding: "8px 0",
  color: "#6b7280",
  fontSize: "14px",
  width: "140px",
  verticalAlign: "top" as const,
};

const valueCell = {
  padding: "8px 0",
  color: "#111827",
  fontSize: "14px",
  fontWeight: "600",
};

const valueCellNormal = {
  padding: "8px 0",
  color: "#111827",
  fontSize: "14px",
};

const trackingIdCell = {
  padding: "8px 0",
  color: "#111827",
  fontSize: "14px",
  fontFamily: "monospace",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  display: "inline-block",
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px 40px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  boxShadow: "0 4px 6px rgba(16, 185, 129, 0.25)",
};

const thankYou = {
  margin: "30px 0 0 0",
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "30px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  margin: "0",
  color: "#6b7280",
  fontSize: "14px",
};

const footerCopyright = {
  margin: "10px 0 0 0",
  color: "#9ca3af",
  fontSize: "12px",
};
