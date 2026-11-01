import { Resend } from "resend";
import { render } from "@react-email/components";
import { config } from "@/lib/config";
import { SUPPORT_EMAIL } from "@/constants/social";
import AdminNotificationEmail from "./templates/AdminNotificationEmail";
import OrganizerApprovedEmail from "./templates/OrganizerApprovedEmail";
import OrganizerRejectedEmail from "./templates/OrganizerRejectedEmail";
import OrganizerConfirmationEmail from "./templates/OrganizerConfirmationEmail";
import DigestConfirmEmail from "./templates/DigestConfirmEmail";
import WeeklyDigestEmail, { type DigestEmailEvent } from "./templates/WeeklyDigestEmail";

/**
 * Resend Email Service with React Email Templates
 * Handles sending emails for event submission notifications
 */

// Lazy initialization of Resend client to ensure API key is available
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(config.resend.apiKey);
  }
  return resendClient;
}

const FROM_EMAIL = "TechLinkUp <admin@techlinkup.xyz>";
const REPLY_TO = config.resend.replyToEmail;
// Weekly event emails (marketing) come from the support address so replies reach a person.
const MARKETING_FROM_EMAIL = `TechLinkUp <${SUPPORT_EMAIL}>`;

export interface AdminNotificationParams {
  eventTitle: string;
  organizerName: string;
  organizerEmail: string;
  eventDate: string;
  eventLocation: string;
  trackingId: string;
  eventWebsite?: string;
  submissionUrl: string;
  adminEmail: string;
}

export interface OrganizerApprovedParams {
  organizerName: string;
  organizerEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  trackingId: string;
  eventUrl: string;
}

export interface OrganizerRejectedParams {
  organizerName: string;
  organizerEmail: string;
  eventTitle: string;
  trackingId: string;
  feedback?: string;
  resubmitUrl: string;
}

export interface OrganizerConfirmationParams {
  organizerName: string;
  organizerEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventWebsite?: string;
  trackingId: string;
  trackingUrl: string;
}

/**
 * Send email notification to admin when a new event is submitted
 */
export async function sendAdminNotification(params: AdminNotificationParams): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Skipping admin notification.");
      return false;
    }

    const emailHtml = await render(
      AdminNotificationEmail({
        eventTitle: params.eventTitle,
        organizerName: params.organizerName,
        organizerEmail: params.organizerEmail,
        eventDate: params.eventDate,
        eventLocation: params.eventLocation,
        eventWebsite: params.eventWebsite,
        trackingId: params.trackingId,
        submissionUrl: params.submissionUrl,
      })
    );

    const resend = getResendClient();
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.adminEmail,
      replyTo: REPLY_TO,
      subject: `New Event Submission: ${params.eventTitle}`,
      html: emailHtml,
    });

    // Resend returns API errors instead of throwing them.
    if (sendError) throw new Error(`Resend: ${sendError.name}: ${sendError.message}`);

    console.log(`Admin notification sent to ${params.adminEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return false;
  }
}

/**
 * Send confirmation email to organizer when they submit an event
 */
export async function sendOrganizerConfirmation(params: OrganizerConfirmationParams): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Skipping organizer confirmation.");
      return false;
    }

    const emailHtml = await render(
      OrganizerConfirmationEmail({
        organizerName: params.organizerName,
        eventTitle: params.eventTitle,
        eventDate: params.eventDate,
        eventLocation: params.eventLocation,
        trackingId: params.trackingId,
        trackingUrl: params.trackingUrl,
      })
    );

    const resend = getResendClient();
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.organizerEmail,
      replyTo: REPLY_TO,
      subject: `We've Received Your Event Submission - "${params.eventTitle}"`,
      html: emailHtml,
    });

    // Resend returns API errors instead of throwing them.
    if (sendError) throw new Error(`Resend: ${sendError.name}: ${sendError.message}`);

    console.log(`Organizer confirmation sent to ${params.organizerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending organizer confirmation:", error);
    return false;
  }
}

/**
 * Send email notification to organizer when their event is approved
 */
export async function sendOrganizerApprovedNotification(params: OrganizerApprovedParams): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Skipping organizer approval notification.");
      return false;
    }

    const emailHtml = await render(
      OrganizerApprovedEmail({
        organizerName: params.organizerName,
        eventTitle: params.eventTitle,
        eventDate: params.eventDate,
        eventLocation: params.eventLocation,
        trackingId: params.trackingId,
        eventUrl: params.eventUrl,
      })
    );

    const resend = getResendClient();
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.organizerEmail,
      replyTo: REPLY_TO,
      subject: `Great News! Your Event "${params.eventTitle}" Has Been Approved`,
      html: emailHtml,
    });

    // Resend returns API errors instead of throwing them.
    if (sendError) throw new Error(`Resend: ${sendError.name}: ${sendError.message}`);

    console.log(`Organizer approval notification sent to ${params.organizerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending organizer approval notification:", error);
    return false;
  }
}

/**
 * Send email notification to organizer when their event is rejected
 */
export async function sendOrganizerRejectedNotification(params: OrganizerRejectedParams): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Skipping organizer rejection notification.");
      return false;
    }

    const emailHtml = await render(
      OrganizerRejectedEmail({
        organizerName: params.organizerName,
        eventTitle: params.eventTitle,
        trackingId: params.trackingId,
        feedback: params.feedback,
        resubmitUrl: params.resubmitUrl,
      })
    );

    const resend = getResendClient();
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.organizerEmail,
      replyTo: REPLY_TO,
      subject: `Update on Your Event Submission - "${params.eventTitle}"`,
      html: emailHtml,
    });

    // Resend returns API errors instead of throwing them.
    if (sendError) throw new Error(`Resend: ${sendError.name}: ${sendError.message}`);

    console.log(`Organizer rejection notification sent to ${params.organizerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending organizer rejection notification:", error);
    return false;
  }
}

/**
 * Get all admin emails from the database
 * This is a helper function to be used in server actions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAdminEmails(supabase: any): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc("get_admin_emails");

    if (error) {
      console.error("Error fetching admin emails:", error);
      return [];
    }

    return data?.map((row: { email: string }) => row.email) || [];
  } catch (error) {
    console.error("Error in getAdminEmails:", error);
    return [];
  }
}

/**
 * Send the double opt-in email for weekly event alerts
 */
export async function sendDigestConfirmation(params: {
  email: string;
  stateLabel: string;
  includeOnline: boolean;
  confirmUrl: string;
}): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Skipping digest confirmation.");
      return false;
    }

    const emailHtml = await render(
      DigestConfirmEmail({
        stateLabel: params.stateLabel,
        includeOnline: params.includeOnline,
        confirmUrl: params.confirmUrl,
      })
    );

    const resend = getResendClient();
    const { error: sendError } = await resend.emails.send({
      from: MARKETING_FROM_EMAIL,
      to: params.email,
      replyTo: SUPPORT_EMAIL,
      subject: "Confirm your weekly tech events email",
      html: emailHtml,
    });

    // Resend returns API errors instead of throwing them.
    if (sendError) throw new Error(`Resend: ${sendError.name}: ${sendError.message}`);

    return true;
  } catch (error) {
    console.error("Error sending digest confirmation:", error);
    return false;
  }
}

export interface WeeklyDigestRecipient {
  id: string;
  email: string;
  unsubscribeToken: string;
}

export interface WeeklyDigestGroup {
  stateLabel: string;
  weekLabel: string;
  events: DigestEmailEvent[];
  moreCount: number;
  browseUrl: string;
  recipients: WeeklyDigestRecipient[];
}

// Placeholder swapped for each recipient's token, so each group renders once.
const UNSUBSCRIBE_PLACEHOLDER = "__UNSUBSCRIBE_TOKEN__";
const BATCH_SIZE = 100; // Resend batch API maximum

/**
 * Send the weekly digest. Each group (same state and online choice) is
 * rendered once; only the unsubscribe link differs per recipient.
 * Returns the ids of subscribers whose email was accepted by Resend.
 */
export async function sendWeeklyDigests(
  groups: WeeklyDigestGroup[],
  siteUrl: string
): Promise<{ sentIds: string[]; failed: number }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not configured. Skipping weekly digest.");
    return { sentIds: [], failed: 0 };
  }

  const resend = getResendClient();
  const sentIds: string[] = [];
  let failed = 0;

  for (const group of groups) {
    const html = await render(
      WeeklyDigestEmail({
        stateLabel: group.stateLabel,
        weekLabel: group.weekLabel,
        events: group.events,
        moreCount: group.moreCount,
        browseUrl: group.browseUrl,
        unsubscribeUrl: `${siteUrl}/email-alerts/unsubscribe?token=${UNSUBSCRIBE_PLACEHOLDER}`,
      })
    );
    const total = group.events.length + group.moreCount;
    const subject = `${total} tech event${total === 1 ? "" : "s"} this week in ${group.stateLabel}`;

    for (let i = 0; i < group.recipients.length; i += BATCH_SIZE) {
      const batch = group.recipients.slice(i, i + BATCH_SIZE);
      const { error } = await resend.batch.send(
        batch.map((r) => {
          const token = encodeURIComponent(r.unsubscribeToken);
          return {
            from: MARKETING_FROM_EMAIL,
            to: r.email,
            replyTo: SUPPORT_EMAIL,
            subject,
            html: html.replaceAll(UNSUBSCRIBE_PLACEHOLDER, token),
            headers: {
              // One-click unsubscribe (RFC 8058), required by Gmail and Yahoo for bulk mail.
              "List-Unsubscribe": `<${siteUrl}/api/digest/unsubscribe?token=${token}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          };
        })
      );

      if (error) {
        console.error("Error sending weekly digest batch:", error);
        failed += batch.length;
      } else {
        sentIds.push(...batch.map((r) => r.id));
      }
    }
  }

  return { sentIds, failed };
}
