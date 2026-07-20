import type { SupabaseClient } from "@supabase/supabase-js";
import { serverGeocodeAddress } from "@/lib/geocode/geocode-server";
import { buildEventSlugBase, generateUniqueEventSlug } from "@/lib/slug";
import { computeDedupeHash, checkDuplicate } from "@/lib/scraping/dedupe";
import { parseDateSafe } from "@/lib/date-utils";
import { categoryMeta } from "@/constants/category-meta";
import type { ExtractionSuccess, ExtractionMethod, NormalizedEventInput } from "./types";

const TRUSTED_DOMAINS = ["eventbrite.com", "lu.ma", "meetup.com"];

export type NormalizeOutcome =
  | { status: "inserted"; submissionId: string }
  | { status: "duplicate" }
  | { status: "skipped"; reason: string };

export async function normalizeAndInsert(
  supabase: SupabaseClient,
  extraction: ExtractionSuccess
): Promise<NormalizeOutcome> {
  const { data, method, usedFallback } = extraction;

  const startDateOnly = parseDateSafe(data.startDate);
  if (!startDateOnly) {
    return { status: "skipped", reason: "unparseable-start-date" };
  }
  const endDateOnly = data.endDate ? parseDateSafe(data.endDate) : null;
  const time = extractTimeOfDay(data.startDate);

  const geoInput = data.venue || data.city;
  const geo = geoInput ? await serverGeocodeAddress(geoInput) : null;
  const city = geo?.city ?? data.city;
  const country = geo?.country;
  const lat = geo?.lat ?? 0;
  const lng = geo?.lng ?? 0;

  const dedupeHash = computeDedupeHash(data.title, startDateOnly, city);
  const dupeCheck = await checkDuplicate(supabase, {
    title: data.title,
    startDate: startDateOnly,
    city,
    dedupeHash,
  });

  if (dupeCheck.isDuplicate) {
    return { status: "duplicate" };
  }

  const categories = inferCategoryLabels(`${data.title} ${data.description ?? ""}`);
  const slugBase = buildEventSlugBase(data.title, city, data.venue);
  const slug = await generateUniqueEventSlug(supabase, slugBase);
  const type = mapAttendanceModeToType(data.attendanceMode);

  const { score, breakdown } = scoreConfidence({
    method,
    usedFallback,
    data,
    hasCoordinates: Boolean(geo),
    categoryCount: categories.length,
    possibleDuplicate: dupeCheck.possibleDuplicate,
  });

  const { data: inserted, error } = await supabase
    .from("event_submissions")
    .insert({
      title: data.title,
      slug,
      start_date: startDateOnly,
      end_date: endDateOnly,
      location: data.venue || city || "See event page",
      time,
      type,
      category: categories,
      description: data.description || `Imported from ${data.sourceUrl}`,
      link: data.registrationUrl,
      city: city ?? null,
      country: country ?? null,
      lat,
      lng,
      organizer_name: data.organizer ?? null,
      organizer_email: null,
      submission_status: "pending",
      source_type: "scraped",
      source_url: data.sourceUrl,
      source_connector: data.sourceConnector,
      extraction_method: method,
      confidence_score: score,
      confidence_breakdown: breakdown,
      dedupe_hash: dedupeHash,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { status: "skipped", reason: error?.message ?? "insert-failed" };
  }

  return { status: "inserted", submissionId: inserted.id };
}

function extractTimeOfDay(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (isNaN(date.getTime())) return "00:00";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function mapAttendanceModeToType(mode: NormalizedEventInput["attendanceMode"]): "Online" | "In-person" | "In-person & Online" {
  if (mode === "online") return "Online";
  if (mode === "hybrid") return "In-person & Online";
  return "In-person"; // default — most scraped sources are in-person meetups/conferences
}

function inferCategoryLabels(text: string): string[] {
  const lower = text.toLowerCase();
  const matches = new Set<string>();
  for (const meta of categoryMeta) {
    if (meta.dbKeywords.some((keyword) => lower.includes(keyword.toLowerCase()))) {
      matches.add(meta.label);
    }
  }
  return Array.from(matches).slice(0, 3);
}

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function scoreConfidence(input: {
  method: ExtractionMethod;
  usedFallback: boolean;
  data: NormalizedEventInput;
  hasCoordinates: boolean;
  categoryCount: number;
  possibleDuplicate: boolean;
}): { score: number; breakdown: Record<string, unknown> } {
  const breakdown: Record<string, unknown> = {};
  let score: number;

  if (input.method === "json-ld" && !input.usedFallback) {
    score = 70;
    breakdown.base = "json-ld-clean";
  } else {
    score = 50;
    breakdown.base = input.method === "json-ld" ? "json-ld-partial-plus-og" : "og-meta-only";
  }

  if (input.data.endDate) {
    score += 5;
    breakdown.hasEndDate = true;
  }
  if (input.hasCoordinates) {
    score += 10;
    breakdown.geocoded = true;
  }
  if (input.data.registrationUrl && input.data.registrationUrl !== input.data.sourceUrl) {
    score += 5;
    breakdown.hasRegistrationUrl = true;
  }
  if (input.data.description && input.data.description.length > 50) {
    score += 5;
    breakdown.hasDescription = true;
  }
  if (input.categoryCount > 0) {
    score += 5;
    breakdown.categoriesMatched = input.categoryCount;
  }

  const host = safeHostname(input.data.sourceUrl);
  if (host && TRUSTED_DOMAINS.some((domain) => host.endsWith(domain))) {
    score += 10;
    breakdown.trustedSource = host;
  }

  if (input.possibleDuplicate) {
    score = Math.min(score, 65);
    breakdown.possibleDuplicate = true;
  }

  return { score: Math.min(score, 100), breakdown };
}
