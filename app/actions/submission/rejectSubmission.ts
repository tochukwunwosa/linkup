"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendOrganizerRejectedNotification } from "@/lib/email/emailService";

export async function rejectSubmissionAction(submissionId: string, feedback?: string) {
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

    // Update submission status
    const { error: updateError } = await supabase
      .from("event_submissions")
      .update({
        submission_status: "rejected",
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
        admin_feedback: feedback || null,
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Error updating submission status:", updateError);
      return {
        success: false,
        error: "Failed to reject submission",
      };
    }

    // Revalidate paths
    revalidatePath("/admin/dashboard/submissions");

    // Send email notification to organizer (async, don't block the response)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";
    const resubmitUrl = `${siteUrl}/submit-event`;

    sendOrganizerRejectedNotification({
      organizerName: submission.organizer_name,
      organizerEmail: submission.organizer_email,
      eventTitle: submission.title,
      trackingId: submission.tracking_id,
      feedback,
      resubmitUrl,
    }).catch((error) => {
      console.error("Failed to send organizer rejection notification:", error);
      // Don't fail the rejection if email fails
    });

    return {
      success: true,
      message: "Submission rejected successfully",
    };
  } catch (error) {
    console.error("Unexpected error in rejectSubmissionAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
