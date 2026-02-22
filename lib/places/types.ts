// ─── Autocomplete ────────────────────────────────────────────────────────────

export interface AutocompletePrediction {
  placeId: string;
  /** Full formatted text, e.g. "Victoria Island, Lagos, Nigeria" */
  description: string;
  /** Primary part of the result, e.g. "Victoria Island" */
  mainText: string;
  /** Secondary part, e.g. "Lagos, Nigeria" */
  secondaryText: string;
}

export interface AutocompleteSuccessResponse {
  predictions: AutocompletePrediction[];
  /** True when the response was served from the in-memory cache */
  cached: boolean;
}

export interface AutocompleteErrorResponse {
  error: string;
}

export type AutocompleteApiResponse =
  | AutocompleteSuccessResponse
  | AutocompleteErrorResponse;

// ─── Place Details ────────────────────────────────────────────────────────────

export interface PlaceDetails {
  placeId: string;
  /** Human-readable address returned by Google */
  formattedAddress: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  /** Display name of the place (business / landmark name if available) */
  name: string;
}

export interface PlaceDetailsSuccessResponse {
  place: PlaceDetails;
}

export interface PlaceDetailsErrorResponse {
  error: string;
}

export type PlaceDetailsApiResponse =
  | PlaceDetailsSuccessResponse
  | PlaceDetailsErrorResponse;
