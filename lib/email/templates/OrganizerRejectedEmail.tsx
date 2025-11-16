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
  resubmitUrl = "https://tech-linkup.vercel.app/submit-event",
}: OrganizerRejectedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update on Your Event Submission - &quot;{eventTitle}&quot;</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Event Submission Update</Heading>
            <Text style={headerSubtitle}>Regarding: {eventTitle}</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hello {organizerName},</Text>
            <Text style={paragraph}>
              Thank you for submitting your event to Tech Linkup. Unfortunately, we&apos;re
              unable to publish your event at this time.
            </Text>

            {/* Event Info Card */}
            <Section style={eventCard}>
              <Heading as="h2" style={cardTitle}>
                Event Details
              </Heading>
              <Text style={detailText}>
                <strong>Title:</strong> {eventTitle}
              </Text>
              <Text style={detailText}>
                <strong>Tracking ID:</strong>{" "}
                <code style={trackingCode}>{trackingId}</code>
              </Text>
            </Section>

            {/* Feedback Section - Only show if feedback exists */}
            {feedback && (
              <Section style={feedbackCard}>
                <Heading as="h2" style={cardTitle}>
                  Feedback from Our Team
                </Heading>
                <Text style={feedbackText}>{feedback}</Text>
              </Section>
            )}

            {/* Resubmit Info */}
            <Section style={infoCard}>
              <Text style={infoText}>
                We encourage you to review our submission guidelines and resubmit your
                event if appropriate. We&apos;re committed to showcasing quality tech events
                for the Nigerian community.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={resubmitUrl}>
                Submit New Event
              </Button>
            </Section>

            <Text style={helpText}>
              If you have any questions, please don&apos;t hesitate to reach out.
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

export default OrganizerRejectedEmail;

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
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
  color: "#fef3c7",
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

const eventCard = {
  backgroundColor: "#fef3c7",
  borderRadius: "6px",
  borderLeft: "4px solid #f59e0b",
  padding: "20px",
  marginBottom: "30px",
};

const feedbackCard = {
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
  borderLeft: "4px solid #ef4444",
  padding: "20px",
  marginBottom: "30px",
};

const infoCard = {
  backgroundColor: "#f0f9ff",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "30px",
};

const cardTitle = {
  margin: "0 0 10px 0",
  color: "#111827",
  fontSize: "16px",
  fontWeight: "600",
};

const detailText = {
  margin: "0 0 5px 0",
  color: "#111827",
  fontSize: "14px",
  lineHeight: "22px",
};

const trackingCode = {
  backgroundColor: "#ffffff",
  padding: "2px 6px",
  borderRadius: "3px",
  fontFamily: "monospace",
  fontSize: "14px",
};

const feedbackText = {
  margin: "0",
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
};

const infoText = {
  margin: "0",
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  display: "inline-block",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px 40px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  boxShadow: "0 4px 6px rgba(102, 126, 234, 0.25)",
};

const helpText = {
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
