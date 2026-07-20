/**
 * One-time cleanup: re-extract descriptions for pending scraped submissions
 * that were inserted before the Readability paragraph-extraction fix
 * (sources/genericExtractor.ts), which previously produced run-on text with
 * no spacing between blocks (e.g. "Sandralia Hotel by WhitestoneAbuja...").
 *
 * Re-fetches each submission's source_url and re-runs the full extraction
 * (JSON-LD -> OG/meta -> Readability), then patches only the `description`
 * column — everything else about the pending submission is left untouched.
 *
 * Run with: npx tsx scripts/fix-scraped-descriptions.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { extractEvent } from "../sources/genericExtractor";
import type { SourceConnector } from "../sources/types";

async function fixScrapedDescriptions() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are not configured");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: submissions, error } = await supabase
    .from("event_submissions")
    .select("id, title, source_url, source_connector, description")
    .eq("submission_status", "pending")
    .eq("source_type", "scraped")
    .not("source_url", "is", null);

  if (error) {
    console.error("Failed to fetch pending scraped submissions:", error);
    process.exit(1);
  }

  if (!submissions || submissions.length === 0) {
    console.log("No pending scraped submissions found.");
    return;
  }

  console.log(`Found ${submissions.length} pending scraped submission(s) to re-check.\n`);

  let updated = 0;
  let unchanged = 0;
  let failed = 0;

  for (const submission of submissions) {
    try {
      const extraction = await extractEvent(
        submission.source_url as string,
        (submission.source_connector ?? "generic") as SourceConnector
      );

      if (extraction.data === null || !extraction.data.description) {
        console.log(`- ${submission.id} (${submission.title}): couldn't re-extract a description, left as-is`);
        unchanged += 1;
        continue;
      }

      if (extraction.data.description === submission.description) {
        unchanged += 1;
        continue;
      }

      const { error: updateError } = await supabase
        .from("event_submissions")
        .update({ description: extraction.data.description })
        .eq("id", submission.id);

      if (updateError) {
        console.error(`Failed to update ${submission.id}:`, updateError.message);
        failed += 1;
        continue;
      }

      console.log(`- ${submission.id} (${submission.title}): description updated`);
      updated += 1;
    } catch (err) {
      console.error(`Unexpected error re-extracting ${submission.id}:`, err);
      failed += 1;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Unchanged: ${unchanged}, Failed: ${failed}`);
}

fixScrapedDescriptions().catch((err) => {
  console.error(err);
  process.exit(1);
});
