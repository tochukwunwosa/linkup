/**
 * Places Service — server-side only.
 *
 * Wraps the Google Places API (New) using the correct session-based billing
 * pattern:
 *
 *   1. Every Autocomplete call in a session includes the same `sessionToken`.
 *   2. The matching Place Details call uses the SAME `sessionToken`.
 *   3. Google groups all of those requests into one "Autocomplete – Per Session"
 *      billing event, which is cheaper than per-request pricing.
 *   4. After Place Details is called the session is considered closed; the
 *      caller must discard the token and generate a fresh one next time.
 *
 * The API key never leaves this module — it is read from environment variables
 * via the centralised config object.
 */

import { config } from "@/lib/config";
import type { AutocompletePrediction, PlaceDetails } from "./types";

// ─── Endpoints ────────────────────────────────────────────────────────────────

const AUTOCOMPLETE_URL =
  "https://places.googleapis.com/v1/places:autocomplete";
const DETAILS_BASE_URL = "https://places.googleapis.com/v1/places";

// ─── Field masks (minimise payload → lower cost) ──────────────────────────────

/** Only the fields we actually display in the dropdown */
const AUTOCOMPLETE_FIELD_MASK = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.text",
  "suggestions.placePrediction.structuredFormat",
].join(",");

/** Only the fields needed to populate the form (no photos, reviews, etc.) */
const DETAILS_FIELD_MASK = [
  "displayName",
  "formattedAddress",
  "location",
  "addressComponents",
].join(",");

// ─── Google API response shapes ───────────────────────────────────────────────

interface GoogleStructuredText {
  text: string;
}

interface GoogleSuggestion {
  placePrediction: {
    placeId: string;
    text?: GoogleStructuredText;
    structuredFormat?: {
      mainText?: GoogleStructuredText;
      secondaryText?: GoogleStructuredText;
    };
  };
}

interface GoogleAddressComponent {
  longText: string;
  types: string[];
}

interface GooglePlaceDetailsResult {
  formattedAddress?: string;
  displayName?: { text: string };
  location?: { latitude: number; longitude: number };
  addressComponents?: GoogleAddressComponent[];
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Fetch autocomplete predictions from Google Places API (New).
 *
 * @param input       Text typed by the user (≥ 3 chars)
 * @param sessionToken UUID generated at the start of the typing session
 */
export async function fetchAutocompletePredictions(
  input: string,
  sessionToken: string
): Promise<AutocompletePrediction[]> {
  const response = await fetch(AUTOCOMPLETE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": config.googleMaps.serverKey,
      "X-Goog-FieldMask": AUTOCOMPLETE_FIELD_MASK,
    },
    body: JSON.stringify({
      input,
      sessionToken,
      /** Restrict results to Nigeria */
      includedRegionCodes: ["ng"],
      languageCode: "en",
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({})) as {
      error?: { message?: string };
    };
    throw new Error(
      `Places Autocomplete API error ${response.status}: ${
        errBody?.error?.message ?? response.statusText
      }`
    );
  }

  const data = await response.json() as { suggestions?: GoogleSuggestion[] };

  if (!data.suggestions?.length) return [];

  return data.suggestions.map((s) => ({
    placeId: s.placePrediction.placeId,
    description:
      s.placePrediction.text?.text ?? "",
    mainText:
      s.placePrediction.structuredFormat?.mainText?.text ??
      s.placePrediction.text?.text ??
      "",
    secondaryText:
      s.placePrediction.structuredFormat?.secondaryText?.text ?? "",
  }));
}

/**
 * Fetch full place details from Google Places API (New).
 *
 * Passing `sessionToken` here closes the billing session — Google groups the
 * preceding autocomplete requests with this details call and charges a single
 * "Autocomplete – Per Session" fee instead of per-request rates.
 *
 * Do NOT cache Place Details responses. The session token must be invalidated
 * after this call completes.
 *
 * @param placeId     Google Place ID (from autocomplete response)
 * @param sessionToken The SAME token used during autocomplete
 */
export async function fetchPlaceDetails(
  placeId: string,
  sessionToken: string
): Promise<PlaceDetails> {
  const url = new URL(`${DETAILS_BASE_URL}/${placeId}`);
  // Passing sessionToken as a query param closes the billing session
  url.searchParams.set("sessionToken", sessionToken);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": config.googleMaps.serverKey,
      "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    },
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({})) as {
      error?: { message?: string };
    };
    throw new Error(
      `Place Details API error ${response.status}: ${
        errBody?.error?.message ?? response.statusText
      }`
    );
  }

  const place = (await response.json()) as GooglePlaceDetailsResult;

  // Extract city + country from address components
  let city = "";
  let country = "";

  for (const component of place.addressComponents ?? []) {
    if (component.types.includes("locality")) {
      city = component.longText;
    } else if (
      component.types.includes("administrative_area_level_2") &&
      !city
    ) {
      city = component.longText;
    } else if (component.types.includes("country")) {
      country = component.longText;
    }
  }

  return {
    placeId,
    formattedAddress: place.formattedAddress ?? "",
    lat: place.location?.latitude ?? 0,
    lng: place.location?.longitude ?? 0,
    city,
    country,
    name: place.displayName?.text ?? place.formattedAddress ?? "",
  };
}
