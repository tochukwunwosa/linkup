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

interface AdminNotificationEmailProps {
  eventTitle: string;
  organizerName: string;
  organizerEmail: string;
  eventDate: string;
  eventLocation: string;
  trackingId: string;
  submissionUrl: string;
}

export const AdminNotificationEmail = ({
  eventTitle = "Lagos Tech Summit 2025",
  organizerName = "John Doe",
  organizerEmail = "john@example.com",
  eventDate = "December 15, 2025",
  eventLocation = "Lagos, Nigeria",
  trackingId = "EVT-A1B2C3D4",
  submissionUrl = "https://techup-linkup.vercel.app/admin/dashboard/submissions",
}: AdminNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New event submission: {eventTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>New Event Submission</Heading>
            <Text style={headerSubtitle}>Tech Linkup Admin Notification</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hello Admin,</Text>
            <Text style={paragraph}>
              A new event has been submitted to Tech Linkup and is awaiting your review.
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
                  <tr>
                    <td style={labelCell}>Tracking ID:</td>
                    <td style={trackingIdCell}>{trackingId}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Organizer Info Card */}
            <Section style={cardSecondary}>
              <Heading as="h2" style={cardTitle}>
                Organizer Information
              </Heading>
              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Name:</td>
                    <td style={valueCellNormal}>{organizerName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Email:</td>
                    <td style={valueCellNormal}>
                      <a href={`mailto:${organizerEmail}`} style={link}>
                        {organizerEmail}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={submissionUrl}>
                Review Submission
              </Button>
            </Section>
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

export default AdminNotificationEmail;

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
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
  color: "#e0e7ff",
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

const cardPrimary = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "30px",
};

const cardSecondary = {
  backgroundColor: "#f0fdf4",
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

const link = {
  color: "#667eea",
  textDecoration: "none",
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
