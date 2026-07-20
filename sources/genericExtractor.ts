import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import type { ExtractionResult, NormalizedEventInput, SourceConnector } from "./types";

const FETCH_TIMEOUT_MS = 15000;
const USER_AGENT = "TechLinkUpBot/1.0 (+https://techlinkup.xyz/about)";

export async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function flattenJsonLd(node: unknown): unknown[] {
  if (Array.isArray(node)) return node.flatMap(flattenJsonLd);
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const nested = obj["@graph"];
    if (Array.isArray(nested)) return [obj, ...nested.flatMap(flattenJsonLd)];
    return [obj];
  }
  return [];
}

function isEventNode(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const type = (node as Record<string, unknown>)["@type"];
  if (typeof type === "string") return type.toLowerCase().includes("event");
  if (Array.isArray(type)) {
    return type.some((t) => typeof t === "string" && t.toLowerCase().includes("event"));
  }
  return false;
}

function mapJsonLdEvent(node: Record<string, unknown>): Partial<NormalizedEventInput> | null {
  const title = asString(node.name);
  const startDate = asString(node.startDate);
  if (!title && !startDate) return null;

  let venue: string | undefined;
  let city: string | undefined;

  const location = node.location;
  if (location && typeof location === "object" && !Array.isArray(location)) {
    const loc = location as Record<string, unknown>;
    venue = asString(loc.name);
    const address = loc.address;
    if (address && typeof address === "object" && !Array.isArray(address)) {
      city = asString((address as Record<string, unknown>).addressLocality);
    } else {
      venue = venue ?? asString(address);
    }
  } else if (typeof location === "string") {
    venue = location;
  }

  // organizer may be a single object or an array of them (e.g. Luma lists co-hosts)
  const organizerNode = Array.isArray(node.organizer) ? node.organizer[0] : node.organizer;
  let organizer: string | undefined;
  if (organizerNode && typeof organizerNode === "object") {
    organizer = asString((organizerNode as Record<string, unknown>).name);
  } else {
    organizer = asString(organizerNode);
  }

  let registrationUrl: string | undefined;
  const offers = node.offers;
  const offer = Array.isArray(offers) ? offers[0] : offers;
  if (offer && typeof offer === "object") {
    registrationUrl = asString((offer as Record<string, unknown>).url);
  }
  registrationUrl = registrationUrl ?? asString(node.url);

  const attendanceModeRaw = asString(node.eventAttendanceMode)?.toLowerCase() ?? "";
  let attendanceMode: NormalizedEventInput["attendanceMode"];
  if (attendanceModeRaw.includes("mixed")) attendanceMode = "hybrid";
  else if (attendanceModeRaw.includes("online")) attendanceMode = "online";
  else if (attendanceModeRaw.includes("offline")) attendanceMode = "in-person";

  return {
    title,
    description: asString(node.description),
    startDate,
    endDate: asString(node.endDate),
    venue,
    city,
    registrationUrl,
    organizer,
    categories: [],
    attendanceMode,
  };
}

function extractJsonLdEvent($: CheerioAPI): Partial<NormalizedEventInput> | null {
  const scripts = $('script[type="application/ld+json"]').toArray();

  for (const script of scripts) {
    const raw = $(script).contents().text();
    if (!raw) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }

    for (const node of flattenJsonLd(parsed)) {
      if (isEventNode(node)) {
        const mapped = mapJsonLdEvent(node as Record<string, unknown>);
        if (mapped) return mapped;
      }
    }
  }

  return null;
}

function extractOpenGraph($: CheerioAPI): Partial<NormalizedEventInput> {
  const meta = (name: string) =>
    $(`meta[property="${name}"]`).attr("content") || $(`meta[name="${name}"]`).attr("content");

  const title = meta("og:title") || $("title").first().text().trim();
  const description = meta("og:description") || meta("description");

  // A handful of common non-standard patterns sites use for machine-readable
  // event dates when there's no JSON-LD.
  const startDate =
    $("time[datetime]").first().attr("datetime") ||
    $('[itemprop="startDate"]').first().attr("content") ||
    $('[itemprop="startDate"]').first().attr("datetime");

  const venue =
    $('[itemprop="location"]').first().attr("content") ||
    $('[itemprop="location"]').first().text().trim();

  return {
    title: asString(title),
    description: asString(description),
    startDate: asString(startDate),
    venue: asString(venue),
    categories: [],
  };
}

async function extractDescriptionViaReadability(html: string, url: string): Promise<string | undefined> {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article?.content) return undefined;

    // article.textContent flattens the WHOLE readability article — venue,
    // address, "Report this event" links, etc — into one run-on string
    // with no separators between blocks. Pull only real <p> paragraphs
    // instead, which is what a "description" should actually contain, and
    // join them with blank lines.
    const $ = cheerio.load(article.content);
    const paragraphs = $("p")
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter((text) => text.length > 30); // skip short labels/fragments, not prose

    const description = paragraphs.join("\n\n").trim();
    return description ? description.slice(0, 1500) : undefined;
  } catch {
    return undefined;
  }
}

function missingRequiredField(data: Partial<NormalizedEventInput>): string | null {
  if (!data.title) return "missing-title";
  if (!data.startDate) return "missing-start-date";
  if (!data.venue && !data.city) return "missing-location";
  return null;
}

export async function extractEvent(
  sourceUrl: string,
  sourceConnector: SourceConnector
): Promise<ExtractionResult> {
  const html = await fetchHtml(sourceUrl);
  if (!html) {
    return { data: null, method: "failed", reason: "fetch-failed" };
  }

  const $ = cheerio.load(html);
  const jsonLd = extractJsonLdEvent($);
  const merged: Partial<NormalizedEventInput> = { ...jsonLd, categories: [] };
  let usedFallback = false;

  if (!jsonLd || missingRequiredField(merged)) {
    usedFallback = true;
    const og = extractOpenGraph($);
    // Fill gaps only — never let a weaker signal overwrite a JSON-LD field.
    merged.title = merged.title ?? og.title;
    merged.description = merged.description ?? og.description;
    merged.startDate = merged.startDate ?? og.startDate;
    merged.venue = merged.venue ?? og.venue;
  }

  if (!merged.description || merged.description.length < 50) {
    merged.description = (await extractDescriptionViaReadability(html, sourceUrl)) ?? merged.description;
  }

  const missingReason = missingRequiredField(merged);
  if (missingReason) {
    return { data: null, method: "failed", reason: missingReason };
  }

  const data: NormalizedEventInput = {
    title: merged.title!,
    description: merged.description,
    startDate: merged.startDate!,
    endDate: merged.endDate,
    venue: merged.venue,
    city: merged.city,
    state: merged.state,
    registrationUrl: merged.registrationUrl ?? sourceUrl,
    organizer: merged.organizer,
    categories: merged.categories ?? [],
    attendanceMode: merged.attendanceMode,
    sourceUrl,
    sourceConnector,
  };

  return {
    data,
    method: jsonLd ? "json-ld" : "og-meta",
    usedFallback,
  };
}
