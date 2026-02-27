"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendOrganizerApprovedNotification } from "@/lib/email/emailService";

export async function approveSubmissionAction(submissionId: string) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .single();

    if (adminError || !admin) {
      console.error("Unauthorized access attempt by user:", user.id);
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the submission
    const { data: submission, error: fetchError } = await supabase
      .from("event_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return {
        success: false,
        error: "Submission not found",
      };
    }

    if (submission.submission_status !== "pending") {
      return {
        success: false,
        error: `This submission has already been ${submission.submission_status}`,
      };
    }

    // Insert into events table
    const { data: newEvent, error: eventError } = await supabase
      .from("events")
      .insert({
        title: submission.title,
        start_date: submission.start_date,
        end_date: submission.end_date,
        location: submission.location,
        time: submission.time,
        type: submission.type,
        category: submission.category,
        price: submission.price,
        currency: submission.currency,
        price_amount: submission.price_amount,
        description: submission.description,
        publish_status: "Published", // Automatically publish approved events
        link: submission.link,
        city: submission.city,
        country: submission.country,
        lat: submission.lat,
        lng: submission.lng,
        created_by: admin.id,
      })
      .select("id")
      .single();

    if (eventError) {
      console.error("Error creating event from submission:", eventError);
      return {
        success: false,
        error: "Failed to publish event",
      };
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from("event_submissions")
      .update({
        submission_status: "approved",
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
        published_event_id: newEvent.id,
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Error updating submission status:", updateError);
      return {
        success: false,
        error: "Event published but failed to update submission status",
      };
    }

    // Revalidate paths
    revalidatePath("/admin/dashboard/submissions");
    revalidatePath("/admin/dashboard/events");
    revalidatePath("/");

    // Send email notification to organizer (async, don't block the response)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";
    const eventDate = new Date(submission.start_date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    sendOrganizerApprovedNotification({
      organizerName: submission.organizer_name,
      organizerEmail: submission.organizer_email,
      eventTitle: submission.title,
      eventDate,
      eventLocation: submission.location,
      trackingId: submission.tracking_id,
      eventUrl: `${siteUrl}/events/${newEvent.id}`,
    }).catch((error) => {
      console.error("Failed to send organizer approval notification:", error);
      // Don't fail the approval if email fails
    });

    return {
      success: true,
      message: "Event approved and published successfully",
      eventId: newEvent.id,
    };
  } catch (error) {
    console.error("Unexpected error in approveSubmissionAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
