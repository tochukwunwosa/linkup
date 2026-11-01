"use server";

import { UTM, withUtm } from "@/lib/utm";
import { eventSubmissionFormSchema } from "@/lib/validations/event";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { sendAdminNotification, getAdminEmails, sendOrganizerConfirmation } from "@/lib/email/emailService";
import { formatDateToYYYYMMDD } from "@/lib/date-utils";
import { buildEventSlugBase } from "@/lib/slug";

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

    // Public submissions use the anon key. The RPC only inserts a pending
    // row and picks a unique slug; anon has no direct table access.
    const supabase = createPublicClient();

    const slugBase = buildEventSlugBase(data.title, geo?.city ?? undefined, data.location);

    const { data: submission, error: insertError } = await supabase
      .rpc("submit_event_submission", {
        p_slug_base: slugBase,
        // Event details
        p_title: data.title,
        p_start_date: formatDateToYYYYMMDD(data.start_date), // Format as YYYY-MM-DD
        p_end_date: data.end_date ? formatDateToYYYYMMDD(data.end_date) : null,
        p_location: data.location,
        p_time: data.time,
        p_type: data.type,
        p_category: data.category,
        p_price: data.price,
        p_currency: data.currency || "NGN",
        p_price_amount: data.price_amount,
        p_description: data.description,
        p_link: data.link || null,
        p_city: geo?.city ?? null,
        p_country: geo?.country ?? null,
        p_lat: geo?.lat ?? data.lat ?? null,
        p_lng: geo?.lng ?? data.lng ?? null,
        // Organizer information
        p_organizer_name: data.organizer_name,
        p_organizer_email: data.organizer_email,
        p_organizer_phone: data.organizer_phone || null,
        p_organizer_organization: data.organizer_organization || null,
      })
      .single<{ id: string; tracking_id: string }>();

    if (insertError || !submission) {
      console.error("Error inserting event submission:", insertError);
      return {
        success: false,
        error: "Failed to submit event. Please try again later.",
      };
    }

    // Revalidate admin submissions page
    revalidatePath("/admin/dashboard/submissions");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";
    const eventDate = new Date(data.start_date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Send emails after the response. after() keeps the function alive until
    // they finish; a bare un-awaited promise can be cut off on Vercel.
    after(async () => {
      try {
        await sendOrganizerConfirmation({
          organizerName: data.organizer_name,
          organizerEmail: data.organizer_email,
          eventTitle: data.title,
          eventDate,
          eventLocation: data.location,
          trackingId: submission.tracking_id,
          // Straight to this submission's status page, no need to type the ID.
          trackingUrl: withUtm(
            `${siteUrl}/my-submissions/${encodeURIComponent(submission.tracking_id)}`,
            UTM.organiserConfirmation
          ),
        });

        // Server-only read with no user input; anon must not see admin emails.
        const adminEmails = await getAdminEmails(createAdminClient());
        if (adminEmails.length === 0) {
          console.warn("No admin emails found; skipping admin notification.");
          return;
        }

        const submissionUrl = `${siteUrl}/admin/dashboard/submissions`;
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
      } catch (error) {
        // Don't fail the submission if email fails
        console.error("Failed to send submission emails:", error);
      }
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
