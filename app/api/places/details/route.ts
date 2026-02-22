import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { fetchPlaceDetails } from "@/lib/places/places-service";
import type { PlaceDetailsApiResponse } from "@/lib/places/types";

// Place Details is intentionally NOT cached:
//   • Calling details with a session token CLOSES the Google billing session.
//   • Caching the result and skipping the Google call would prevent the session
//     from being properly closed, causing future details calls with the same
//     token to be billed as standalone (more expensive) requests.
//   • Users only call this endpoint once per selection event — it is not a
//     hot path that benefits from caching.

const requestSchema = z.object({
  /** Google Place ID from the autocomplete response */
  placeId: z.string().min(1).max(300),
  /** The SAME UUID v4 that was used for autocomplete — closes the billing session */
  sessionToken: z.string().uuid("sessionToken must be a valid UUID v4"),
});

export async function POST(
  req: NextRequest
): Promise<NextResponse<PlaceDetailsApiResponse>> {
  // ── Rate limiting: 20 requests per IP per minute ──────────────────────────
  // Place Details is called at most once per address selection, so a lower
  // limit than autocomplete is appropriate and reduces cost exposure.
  const clientIp = getClientIp(req);
  const rl = rateLimit(`places:details:${clientIp}`, {
    maxRequests: 20,
    windowMs: 60_000,
  });

  if (!rl.success) {
    const waitSecs = Math.ceil((rl.resetTime - Date.now()) / 1_000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${waitSecs}s.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(waitSecs),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // ── Parse + validate body ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const { placeId, sessionToken } = parsed.data;

  // ── Call Google Places Details API ────────────────────────────────────────
  // The session token is forwarded to Google, which closes the billing session.
  // After this call the client MUST discard the session token.
  try {
    const place = await fetchPlaceDetails(placeId, sessionToken);
    return NextResponse.json({ place });
  } catch (err) {
    console.error("[places/details]", err);
    return NextResponse.json(
      { error: "Failed to retrieve location details." },
      { status: 503 }
    );
  }
}
