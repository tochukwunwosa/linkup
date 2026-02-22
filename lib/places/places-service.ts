/**
 * Places Service — server-side only.
 *
 * Uses the Google Places API (legacy, maps.googleapis.com) which:
 *   • Shares the same API key and domain as the existing Geocoding API.
 *   • Has a stable, battle-tested response format.
 *   • Fully supports session-based billing with sessiontoken.
 *
 * Session-based billing:
 *   1. Include the same sessionToken in every Autocomplete request.
 *   2. Include that same token in the subsequent Place Details request.
 *   3. Google bills the entire session as one "Autocomplete – Per Session" event.
 *   4. After the Details call the session is closed; discard the token.
 *
 * Required Google Cloud API: "Places API" (legacy)
 *   → console.cloud.google.com/apis/library/places-backend.googleapis.com
 * (Different from "Places API (New)" — enable the standard "Places API".)
 */

import { config } from "@/lib/config";
import type { AutocompletePrediction, PlaceDetails } from "./types";

// ─── Endpoints ────────────────────────────────────────────────────────────────

const AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

// ─── Google API response shapes ───────────────────────────────────────────────

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface LegacyAutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
}

interface LegacyAutocompleteResponse {
  status: string;
  predictions: LegacyAutocompletePrediction[];
  error_message?: string;
}

interface LegacyDetailsResponse {
  status: string;
  result: {
    formatted_address?: string;
    name?: string;
    geometry?: {
      location: { lat: number; lng: number };
    };
    address_components?: GoogleAddressComponent[];
  };
  error_message?: string;
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Fetch autocomplete predictions from the legacy Places Autocomplete API.
 */
export async function fetchAutocompletePredictions(
  input: string,
  sessionToken: string
): Promise<AutocompletePrediction[]> {
  const url = new URL(AUTOCOMPLETE_URL);
  url.searchParams.set("input", input);
  url.searchParams.set("sessiontoken", sessionToken);
  url.searchParams.set("components", "country:ng");
  url.searchParams.set("language", "en");
  url.searchParams.set("key", config.googleMaps.serverKey);

  // cache: "no-store" — opt out of Next.js server-side fetch caching
  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Places Autocomplete request failed: HTTP ${response.status}`
    );
  }

  const data = (await response.json()) as LegacyAutocompleteResponse;

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Places API key error: ${data.error_message ?? "REQUEST_DENIED"}. ` +
        `Ensure "Places API" is enabled in Google Cloud Console.`
    );
  }

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(
      `Places Autocomplete API error: ${data.status}${
        data.error_message ? ` — ${data.error_message}` : ""
      }`
    );
  }

  return (data.predictions ?? []).map((p) => ({
    placeId: p.place_id,
    description: p.description,
    mainText: p.structured_formatting.main_text,
    secondaryText: p.structured_formatting.secondary_text ?? "",
  }));
}

/**
 * Fetch place details from the legacy Place Details API.
 *
 * Passing the same sessionToken that was used for autocomplete closes the
 * billing session — the whole flow (autocomplete + details) is charged as
 * one "Autocomplete – Per Session" fee.
 *
 * Do NOT cache Place Details responses.
 */
export async function fetchPlaceDetails(
  placeId: string,
  sessionToken: string
): Promise<PlaceDetails> {
  const url = new URL(DETAILS_URL);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("sessiontoken", sessionToken);
  // Only request the fields we actually need — minimises cost
  url.searchParams.set(
    "fields",
    "formatted_address,name,geometry,address_components"
  );
  url.searchParams.set("key", config.googleMaps.serverKey);

  // cache: "no-store" — Place Details must never be cached (closes session)
  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Place Details request failed: HTTP ${response.status}`
    );
  }

  const data = (await response.json()) as LegacyDetailsResponse;

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Places API key error: ${data.error_message ?? "REQUEST_DENIED"}. ` +
        `Ensure "Places API" is enabled in Google Cloud Console.`
    );
  }

  if (data.status !== "OK") {
    throw new Error(
      `Place Details API error: ${data.status}${
        data.error_message ? ` — ${data.error_message}` : ""
      }`
    );
  }

  const result = data.result;
  let city = "";
  let country = "";

  for (const component of result.address_components ?? []) {
    if (component.types.includes("locality")) {
      city = component.long_name;
    } else if (
      component.types.includes("administrative_area_level_2") &&
      !city
    ) {
      city = component.long_name;
    } else if (component.types.includes("country")) {
      country = component.long_name;
    }
  }

  return {
    placeId,
    formattedAddress: result.formatted_address ?? "",
    lat: result.geometry?.location.lat ?? 0,
    lng: result.geometry?.location.lng ?? 0,
    city,
    country,
    name: result.name ?? result.formatted_address ?? "",
  };
}
