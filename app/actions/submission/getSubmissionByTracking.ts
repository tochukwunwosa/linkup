"use server";

import { createClient } from "@/lib/supabase/server";
import type { EventSubmission } from "@/lib/validations/event";

export async function getSubmissionByTrackingId(trackingId: string) {
  try {
    if (!trackingId || trackingId.trim() === "") {
      return {
        success: false,
        error: "Tracking ID is required",
      };
    }

    const supabase = await createClient();

    const { data: submission, error } = await supabase
      .from("event_submissions")
      .select("*")
      .eq("tracking_id", trackingId.toUpperCase())
      .single();

    if (error || !submission) {
      return {
        success: false,
        error: "Submission not found. Please check your tracking ID.",
      };
    }

    return {
      success: true,
      submission: submission as EventSubmission,
    };
  } catch (error) {
    console.error("Error fetching submission by tracking ID:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
