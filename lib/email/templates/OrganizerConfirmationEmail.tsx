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
    <Html>
      <Head />
      <Preview>
        Your event submission has been received - {eventTitle}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Submission Received! ✓</Heading>
            <Text style={headerSubtitle}>Thank you for submitting to Tech Linkup</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {organizerName},</Text>
            <Text style={paragraph}>
              We&apos;ve received your event submission and it&apos;s now under review by our team.
              You&apos;ll receive an email notification once we&apos;ve reviewed your submission.
            </Text>

            {/* Event Details Card */}
            <Section style={cardPrimary}>
              <Heading as="h2" style={cardTitle}>
                Event Details
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
                </tbody>
              </table>
            </Section>

            {/* Tracking ID Card */}
            <Section style={cardSecondary}>
              <Heading as="h2" style={cardTitle}>
                Your Tracking ID
              </Heading>
              <Text style={trackingIdText}>{trackingId}</Text>
              <Text style={trackingNote}>
                Save this ID to track your submission status anytime.
              </Text>
            </Section>

            {/* What's Next */}
            <Section style={cardInfo}>
              <Heading as="h2" style={cardTitle}>
                What happens next?
              </Heading>
              <ul style={list}>
                <li style={listItem}>
                  Our team will review your event within 1-2 business days
                </li>
                <li style={listItem}>
                  You&apos;ll receive an email notification once your event is reviewed
                </li>
                <li style={listItem}>
                  If approved, your event will be published on Tech Linkup
                </li>
                <li style={listItem}>
                  If changes are needed, we&apos;ll provide feedback via email
                </li>
              </ul>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={trackingUrl}>
                Track My Submissions
              </Button>
            </Section>

            <Text style={helpText}>
              Need help? Reply to this email and we&apos;ll get back to you shortly.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated confirmation from Tech Linkup
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

export default OrganizerConfirmationEmail;

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
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  padding: "40px 30px",
  textAlign: "center" as const,
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
  color: "#dbeafe",
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
  fontWeight: "600",
};

const paragraph = {
  margin: "0 0 30px 0",
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
};

const cardPrimary = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "20px",
};

const cardSecondary = {
  backgroundColor: "#eff6ff",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const cardInfo = {
  backgroundColor: "#f0f9ff",
  borderRadius: "6px",
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
  width: "100px",
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

const trackingIdText = {
  margin: "10px 0",
  color: "#1e40af",
  fontSize: "24px",
  fontWeight: "700",
  fontFamily: "monospace",
  letterSpacing: "1px",
};

const trackingNote = {
  margin: "10px 0 0 0",
  color: "#6b7280",
  fontSize: "14px",
};

const list = {
  margin: "0",
  padding: "0 0 0 20px",
  color: "#374151",
};

const listItem = {
  margin: "10px 0",
  fontSize: "14px",
  lineHeight: "20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  display: "inline-block",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px 40px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  boxShadow: "0 4px 6px rgba(59, 130, 246, 0.25)",
};

const helpText = {
  margin: "30px 0 0 0",
  color: "#6b7280",
  fontSize: "14px",
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
