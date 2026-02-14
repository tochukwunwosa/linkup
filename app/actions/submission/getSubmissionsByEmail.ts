"use server";

import { createClient } from "@/lib/supabase/server";
import type { EventSubmission } from "@/lib/validations/event";

export async function getSubmissionsByEmail(email: string) {
  try {
    if (!email || email.trim() === "" || !email.includes("@")) {
      return {
        success: false,
        error: "Valid email is required",
      };
    }

    const supabase = await createClient();

    const { data: submissions, error } = await supabase
      .rpc("get_submissions_by_email", { p_email: email });

    if (error) {
      console.error("Error fetching submissions by email:", error);
      return {
        success: false,
        error: "Failed to fetch submissions",
      };
    }

    return {
      success: true,
      submissions: submissions as EventSubmission[],
    };
  } catch (error) {
    console.error("Unexpected error in getSubmissionsByEmail:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
