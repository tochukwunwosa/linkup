/**
 * One-time backfill: generate slugs for existing published events that don't have one.
 * Run with: npx tsx scripts/backfill-published-event-slugs.ts
 *
 * Only run the follow-up "set slug not null + unique index" migration after
 * this completes cleanly with zero failures.
 *
 * See also scripts/backfill-event-slugs.ts, which does the same for
 * event_submissions rows (pending/approved/rejected submissions created
 * before this feature shipped also need a slug).
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { buildEventSlugBase, generateUniqueEventSlug } from "../lib/slug";

const BATCH_SIZE = 100;

async function backfillPublishedEventSlugs() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials are not configured");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let totalUpdated = 0;
  let totalFailed = 0;

  while (true) {
    const { data: events, error } = await supabase
      .from("events")
      .select("id, title, city, location")
      .is("slug", null)
      .limit(BATCH_SIZE);

    if (error) {
      console.error("Failed to fetch events missing a slug:", error);
      process.exit(1);
    }

    if (!events || events.length === 0) {
      break;
    }

    for (const event of events) {
      try {
        const base = buildEventSlugBase(event.title, event.city ?? undefined, event.location ?? undefined);
        const slug = await generateUniqueEventSlug(supabase, base);

        const { error: updateError } = await supabase
          .from("events")
          .update({ slug })
          .eq("id", event.id);

        if (updateError) {
          console.error(`Failed to set slug for event ${event.id}:`, updateError);
          totalFailed += 1;
          continue;
        }

        console.log(`event ${event.id} -> ${slug}`);
        totalUpdated += 1;
      } catch (err) {
        console.error(`Unexpected error backfilling event ${event.id}:`, err);
        totalFailed += 1;
      }
    }
  }

  console.log(`\nDone. Updated: ${totalUpdated}, Failed: ${totalFailed}`);
  if (totalFailed > 0) {
    console.log("Re-run this script to retry failed rows before applying the NOT NULL migration.");
    process.exit(1);
  }
}

backfillPublishedEventSlugs().catch((error) => {
  console.error("Backfill failed with error:", error);
  process.exit(1);
});
