"use server";

import { Resend } from "resend";

let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = "TechLinkUp Contact <admin@techlinkup.xyz>";
const TO_EMAIL = "tochukwunwosa28@gmail.com";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(
  data: ContactFormData
): Promise<ContactFormResult> {
  const { name, email, subject, message } = data;

  // Validate input
  if (!name || name.trim().length < 2) {
    return { success: false, error: "Name must be at least 2 characters." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }
  if (!subject) {
    return { success: false, error: "Please select a subject." };
  }
  if (!message || message.trim().length < 20) {
    return {
      success: false,
      error: "Message must be at least 20 characters.",
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not configured.");
    return { success: false, error: "Email service is not configured." };
  }

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[TechLinkUp Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f5f4f2; border-radius: 12px;">
          <h2 style="color: #1a1b25; margin-bottom: 4px;">New Contact Form Submission</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">via TechLinkUp contact form</p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 80px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; color: #1a1b25; font-size: 14px; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; color: #0066cc; font-size: 14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0; color: #1a1b25; font-size: 14px;">${subject}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 16px; background: #ffffff; border-radius: 8px; border: 1px solid rgba(0,0,0,0.07);">
            <p style="color: #64748b; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Message</p>
            <p style="color: #1a1b25; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}
