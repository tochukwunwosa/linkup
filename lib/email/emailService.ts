import { Resend } from "resend";
import { render } from "@react-email/components";
import AdminNotificationEmail from "./templates/AdminNotificationEmail";
import OrganizerApprovedEmail from "./templates/OrganizerApprovedEmail";
import OrganizerRejectedEmail from "./templates/OrganizerRejectedEmail";
import OrganizerConfirmationEmail from "./templates/OrganizerConfirmationEmail";

/**
 * Resend Email Service with React Email Templates
 * Handles sending emails for event submission notifications
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Tech Linkup <onboarding@resend.dev>"; // Using Resend's default domain
const REPLY_TO = process.env.REPLY_TO_EMAIL || "noreply@tech-linkup.vercel.app";

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

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.adminEmail,
      replyTo: REPLY_TO,
      subject: `New Event Submission: ${params.eventTitle}`,
      html: emailHtml,
    });

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

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.organizerEmail,
      replyTo: REPLY_TO,
      subject: `We've Received Your Event Submission - "${params.eventTitle}"`,
      html: emailHtml,
    });

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

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.organizerEmail,
      replyTo: REPLY_TO,
      subject: `Great News! Your Event "${params.eventTitle}" Has Been Approved`,
      html: emailHtml,
    });

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

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.organizerEmail,
      replyTo: REPLY_TO,
      subject: `Update on Your Event Submission - "${params.eventTitle}"`,
      html: emailHtml,
    });

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
    const { data: admins, error } = await supabase
      .from("admins")
      .select("email")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching admin emails:", error);
      return [];
    }

    return admins?.map((admin: { email: string }) => admin.email) || [];
  } catch (error) {
    console.error("Error in getAdminEmails:", error);
    return [];
  }
}
