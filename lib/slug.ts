import type { SupabaseClient } from "@supabase/supabase-js";

// Matches combining diacritical marks (U+0300-U+036F) left behind after
// NFKD normalization splits accented characters into base + mark.
const COMBINING_DIACRITICS = new RegExp("[̀-ͯ]", "g");

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildEventSlugBase(title: string, city?: string, location?: string): string {
  const place = city || location || "";
  return slugify(`${title} ${place}`);
}

export async function generateUniqueEventSlug(
  supabase: SupabaseClient,
  base: string
): Promise<string> {
  const safeBase = base || "event";
  let candidate = safeBase;
  let attempt = 1;

  while (true) {
    const [{ data: eventMatch }, { data: submissionMatch }] = await Promise.all([
      supabase.from("events").select("id").eq("slug", candidate).maybeSingle(),
      supabase.from("event_submissions").select("id").eq("slug", candidate).maybeSingle(),
    ]);

    if (!eventMatch && !submissionMatch) {
      return candidate;
    }

    attempt += 1;
    candidate = `${safeBase}-${attempt}`;
  }
}
