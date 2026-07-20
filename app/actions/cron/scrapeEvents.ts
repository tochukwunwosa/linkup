"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { extractEvent } from "@/sources/genericExtractor";
import { normalizeAndInsert } from "@/sources/normalize";
import type { SourceConnector } from "@/sources/types";
import * as eventbrite from "@/sources/eventbrite";
import * as luma from "@/sources/luma";
import * as meetup from "@/sources/meetup";
import * as gdg from "@/sources/gdg";
import * as cchub from "@/sources/cchub";
import * as startupgrind from "@/sources/startupgrind";

const CONNECTORS: { name: SourceConnector; fetchCandidateUrls: () => Promise<string[]> }[] = [
  { name: "eventbrite", fetchCandidateUrls: eventbrite.fetchCandidateUrls },
  { name: "luma", fetchCandidateUrls: luma.fetchCandidateUrls },
  { name: "meetup", fetchCandidateUrls: meetup.fetchCandidateUrls },
  { name: "gdg", fetchCandidateUrls: gdg.fetchCandidateUrls },
  { name: "cchub", fetchCandidateUrls: cchub.fetchCandidateUrls },
  { name: "startupgrind", fetchCandidateUrls: startupgrind.fetchCandidateUrls },
];

// Stays inside Vercel Hobby's ~60s function timeout: only this many
// connectors run per invocation, rotating through the rest via the
// scrape_cursor table on subsequent days. Each connector is also capped on
// how many candidate URLs it processes, since fetch+parse per URL adds up.
const CONNECTORS_PER_RUN = 1;
const MAX_URLS_PER_CONNECTOR = 15;

type ScrapeSummary = {
  connectorsRun: string[];
  processed: number;
  inserted: number;
  duplicates: number;
  skipped: number;
  failed: number;
};

export async function scrapeEventsCron(): Promise<{ success: boolean } & ScrapeSummary> {
  const supabase = createAdminClient();

  const { data: cursor } = await supabase
    .from("scrape_cursor")
    .select("last_connector_index")
    .eq("id", true)
    .single();

  const startIndex = ((cursor?.last_connector_index ?? -1) + 1) % CONNECTORS.length;
  const runIndexes = Array.from({ length: CONNECTORS_PER_RUN }, (_, i) => (startIndex + i) % CONNECTORS.length);

  const summary: ScrapeSummary = {
    connectorsRun: [],
    processed: 0,
    inserted: 0,
    duplicates: 0,
    skipped: 0,
    failed: 0,
  };

  for (const index of runIndexes) {
    const connector = CONNECTORS[index];
    summary.connectorsRun.push(connector.name);

    let candidateUrls: string[] = [];
    try {
      candidateUrls = (await connector.fetchCandidateUrls()).slice(0, MAX_URLS_PER_CONNECTOR);
    } catch (err) {
      console.error(`[scrape-events] ${connector.name} discovery failed:`, err);
      continue;
    }

    for (const url of candidateUrls) {
      summary.processed += 1;
      try {
        const extraction = await extractEvent(url, connector.name);

        if (extraction.data === null) {
          summary.skipped += 1;
          console.log(`[scrape-events] discarded ${url} (${extraction.reason})`);
          continue;
        }

        const outcome = await normalizeAndInsert(supabase, extraction);
        if (outcome.status === "inserted") {
          summary.inserted += 1;
        } else if (outcome.status === "duplicate") {
          summary.duplicates += 1;
        } else {
          summary.skipped += 1;
          console.log(`[scrape-events] skipped ${url} (${outcome.reason})`);
        }
      } catch (err) {
        summary.failed += 1;
        console.error(`[scrape-events] error processing ${url}:`, err);
      }
    }
  }

  const nextIndex = runIndexes[runIndexes.length - 1];
  await supabase
    .from("scrape_cursor")
    .update({ last_connector_index: nextIndex, last_run_at: new Date().toISOString() })
    .eq("id", true);

  return { success: true, ...summary };
}
