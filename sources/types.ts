export type SourceConnector =
  | "eventbrite"
  | "luma"
  | "meetup"
  | "gdg"
  | "cchub"
  | "startupgrind"
  | "generic";

export type ExtractionMethod = "json-ld" | "og-meta";

// Fields pulled off the page, before geocoding/category-mapping/slugging.
export type NormalizedEventInput = {
  title: string;
  description?: string;
  startDate: string; // ISO date/datetime as found on the page
  endDate?: string;
  venue?: string;
  city?: string;
  state?: string;
  registrationUrl?: string;
  organizer?: string;
  categories: string[];
  attendanceMode?: "online" | "in-person" | "hybrid";
  sourceUrl: string;
  sourceConnector: SourceConnector;
};

export type ExtractionSuccess = {
  data: NormalizedEventInput;
  method: ExtractionMethod;
  // True when Open Graph/meta tags had to fill in fields JSON-LD didn't
  // provide (or JSON-LD was absent entirely) — used to score confidence
  // lower than a clean, fully self-sufficient JSON-LD extraction.
  usedFallback: boolean;
};

export type ExtractionFailure = {
  data: null;
  method: "failed";
  reason: string;
};

export type ExtractionResult = ExtractionSuccess | ExtractionFailure;
