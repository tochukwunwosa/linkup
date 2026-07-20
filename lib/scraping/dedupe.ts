import { createHash } from "crypto";
import { distance } from "fastest-levenshtein";
import type { SupabaseClient } from "@supabase/supabase-js";

const FUZZY_WINDOW_DAYS = 3;
const FUZZY_THRESHOLD = 0.85;

export function normalizeForCompare(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function computeDedupeHash(title: string, startDate: string, city?: string): string {
  const normalized = `${normalizeForCompare(title)}|${startDate}|${normalizeForCompare(city ?? "")}`;
  return createHash("sha256").update(normalized).digest("hex");
}

function titleSimilarity(a: string, b: string): number {
  const normA = normalizeForCompare(a);
  const normB = normalizeForCompare(b);
  if (!normA || !normB) return 0;
  const maxLen = Math.max(normA.length, normB.length);
  return maxLen === 0 ? 1 : 1 - distance(normA, normB) / maxLen;
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export type DedupeCheckResult =
  | { isDuplicate: true }
  | { isDuplicate: false; possibleDuplicate: true; matchedTitle: string }
  | { isDuplicate: false; possibleDuplicate: false };

export async function checkDuplicate(
  supabase: SupabaseClient,
  params: { title: string; startDate: string; city?: string; dedupeHash: string }
): Promise<DedupeCheckResult> {
  const { title, startDate, city, dedupeHash } = params;

  const [{ data: exactEvent }, { data: exactSubmission }] = await Promise.all([
    supabase.from("events").select("id").eq("dedupe_hash", dedupeHash).maybeSingle(),
    supabase.from("event_submissions").select("id").eq("dedupe_hash", dedupeHash).maybeSingle(),
  ]);

  if (exactEvent || exactSubmission) {
    return { isDuplicate: true };
  }

  const windowStart = addDays(startDate, -FUZZY_WINDOW_DAYS);
  const windowEnd = addDays(startDate, FUZZY_WINDOW_DAYS);

  let eventsQuery = supabase
    .from("events")
    .select("title")
    .gte("start_date", windowStart)
    .lte("start_date", windowEnd);
  let submissionsQuery = supabase
    .from("event_submissions")
    .select("title")
    .gte("start_date", windowStart)
    .lte("start_date", windowEnd)
    .eq("submission_status", "pending");

  if (city) {
    eventsQuery = eventsQuery.eq("city", city);
    submissionsQuery = submissionsQuery.eq("city", city);
  }

  const [{ data: nearbyEvents }, { data: nearbySubmissions }] = await Promise.all([
    eventsQuery,
    submissionsQuery,
  ]);

  const candidates = [...(nearbyEvents ?? []), ...(nearbySubmissions ?? [])] as { title: string }[];

  for (const candidate of candidates) {
    if (titleSimilarity(title, candidate.title) >= FUZZY_THRESHOLD) {
      return { isDuplicate: false, possibleDuplicate: true, matchedTitle: candidate.title };
    }
  }

  return { isDuplicate: false, possibleDuplicate: false };
}
