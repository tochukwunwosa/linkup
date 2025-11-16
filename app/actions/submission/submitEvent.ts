"use server";

import { eventSubmissionFormSchema } from "@/lib/validations/event";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { sendAdminNotification, getAdminEmails, sendOrganizerConfirmation } from "@/lib/email/emailService";
import { formatDateToYYYYMMDD } from "@/lib/date-utils";

export async function submitEventAction(formData: unknown) {
  try {
    // Rate limiting - 5 submissions per IP per hour
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    const rateLimitResult = rateLimit(`submit_event:${ip}`, { maxRequests: 5, windowMs: 3600000 }); // 5 requests per hour
    if (!rateLimitResult.success) {
      return {
        success: false,
        error: `Too many submissions. Please try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)} minutes.`,
      };
    }

    // Validate form data
    const parsed = eventSubmissionFormSchema.safeParse(formData);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return {
        success: false,
        error: "Invalid event data. Please check all required fields.",
        validationErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    // Geocode the address
    const geo = await serverGeocodeAddress(data.location);

    // Create Supabase client (no auth required for public submissions)
    const supabase = await createClient();

    // Insert into event_submissions table
    const { data: submission, error: insertError } = await supabase
      .from("event_submissions")
      .insert({
        // Event details
        title: data.title,
        start_date: formatDateToYYYYMMDD(data.start_date), // Format as YYYY-MM-DD
        end_date: data.end_date ? formatDateToYYYYMMDD(data.end_date) : null,
        location: data.location,
        time: data.time,
        type: data.type,
        category: data.category,
        price: data.price,
        currency: data.currency || "NGN",
        price_amount: data.price_amount,
        description: data.description,
        link: data.link || null,
        city: geo?.city ?? null,
        country: geo?.country ?? null,
        lat: geo?.lat ?? data.lat ?? null,
        lng: geo?.lng ?? data.lng ?? null,
        // Organizer information
        organizer_name: data.organizer_name,
        organizer_email: data.organizer_email,
        organizer_phone: data.organizer_phone || null,
        organizer_organization: data.organizer_organization || null,
        // Submission status
        submission_status: "pending",
      })
      .select("id, tracking_id")
      .single();

    if (insertError) {
      console.error("Error inserting event submission:", insertError);
      return {
        success: false,
        error: "Failed to submit event. Please try again later.",
      };
    }

    // Revalidate admin submissions page
    revalidatePath("/admin/dashboard/submissions");

    // Send email notifications (async, don't block the response)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tech-linkup.vercel.app";
    const eventDate = new Date(data.start_date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Send confirmation email to organizer
    sendOrganizerConfirmation({
      organizerName: data.organizer_name,
      organizerEmail: data.organizer_email,
      eventTitle: data.title,
      eventDate,
      eventLocation: data.location,
      trackingId: submission.tracking_id,
      trackingUrl: `${siteUrl}/my-submissions`,
    }).catch((error) => {
      console.error("Failed to send organizer confirmation:", error);
      // Don't fail the submission if email fails
    });

    // Send notification to admins
    getAdminEmails(supabase).then(async (adminEmails) => {
      if (adminEmails.length > 0) {
        const submissionUrl = `${siteUrl}/admin/dashboard/submissions`;

        // Send notification to all admins
        for (const adminEmail of adminEmails) {
          await sendAdminNotification({
            eventTitle: data.title,
            organizerName: data.organizer_name,
            organizerEmail: data.organizer_email,
            eventDate,
            eventWebsite: data.link,
            eventLocation: data.location,
            trackingId: submission.tracking_id,
            submissionUrl,
            adminEmail,
          });
        }
      }
    }).catch((error) => {
      console.error("Failed to send admin notifications:", error);
      // Don't fail the submission if email fails
    });

    return {
      success: true,
      trackingId: submission.tracking_id,
      message: "Event submitted successfully! You'll receive an email notification once it's reviewed.",
    };
  } catch (error) {
    console.error("Unexpected error in submitEventAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
