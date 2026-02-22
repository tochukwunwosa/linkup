"use client"

/**
 * AddressAutocomplete
 *
 * Implements Google Places Autocomplete using proper session-based billing:
 *
 *  Session lifecycle
 *  ─────────────────
 *  1. A UUID session token is generated lazily on the FIRST debounced keystroke
 *     (once input reaches 3 characters).
 *  2. Every autocomplete request within the same typing session reuses that
 *     token.  Google bundles all those requests into one billing event.
 *  3. When the user selects a suggestion, the SAME token is sent with the Place
 *     Details request.  This "closes" the session on Google's side and the whole
 *     flow — N autocomplete requests + 1 details request — is charged as a
 *     single "Autocomplete – Per Session" fee.
 *  4. The token is discarded immediately after the details call.
 *  5. The next time the user starts typing, a brand-new token is created.
 *
 *  Cost optimisations applied
 *  ──────────────────────────
 *  • Session tokens (see above).
 *  • 400 ms debounce — reduces API calls for fast typists.
 *  • 3-character minimum — skips requests for very short inputs.
 *  • AbortController — cancels in-flight requests when the input changes,
 *    preventing stale responses from landing after a newer one.
 *  • Server-side in-memory cache (keyed by input + session token, 5 min TTL) —
 *    re-typing the same text within a session costs nothing.
 *  • API key lives only on the server — the client never sees it.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import type { AutocompletePrediction, PlaceDetails } from "@/lib/places/types"

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  value: string
  onChangeAction: (val: string) => void
  onSelectAction: (
    address: string,
    lat: number,
    lng: number,
    city: string,
    country: string
  ) => void
}

type DropdownState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "results"; predictions: AutocompletePrediction[] }
  | { kind: "resolving" }   // fetching Place Details after selection
  | { kind: "error"; message: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newSessionToken(): string {
  return crypto.randomUUID()
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddressAutocomplete({
  value,
  onChangeAction,
  onSelectAction,
}: Props) {
  const [dropdown, setDropdown] = useState<DropdownState>({ kind: "idle" })

  // The session token lives in a ref — mutations never trigger re-renders
  const sessionTokenRef = useRef<string | null>(null)
  // Track in-flight autocomplete requests so we can cancel them
  const abortRef = useRef<AbortController | null>(null)
  // Debounce timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // True only when value changed because the user typed — not because code
  // called onChangeAction() (e.g. after a selection). This prevents the
  // useEffect from firing a new autocomplete search after a place is selected.
  const isUserTypingRef = useRef(false)

  /** Return the current session token, creating one if needed */
  const getOrCreateToken = useCallback((): string => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = newSessionToken()
    }
    return sessionTokenRef.current
  }, [])

  /** Discard the current session token (must be called after Place Details) */
  const invalidateToken = useCallback(() => {
    sessionTokenRef.current = null
  }, [])

  // ── Autocomplete fetch ──────────────────────────────────────────────────────

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (!input || input.length < 3) {
        setDropdown({ kind: "idle" })
        return
      }

      // Cancel the previous in-flight request to prevent race conditions
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      const sessionToken = getOrCreateToken()
      setDropdown({ kind: "loading" })

      try {
        const res = await fetch("/api/places/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, sessionToken }),
          signal: abortRef.current.signal,
        })

        // Guard against non-JSON responses (e.g. HTML error pages from Next.js)
        const contentType = res.headers.get("content-type") ?? ""
        if (!contentType.includes("application/json")) {
          setDropdown({ kind: "error", message: "Location search unavailable." })
          return
        }

        const data = await res.json() as
          | { predictions: AutocompletePrediction[]; cached: boolean }
          | { error: string }

        if (!res.ok || "error" in data) {
          setDropdown({
            kind: "error",
            message: "error" in data ? data.error : "Location search unavailable.",
          })
          return
        }

        setDropdown(
          data.predictions.length > 0
            ? { kind: "results", predictions: data.predictions }
            : { kind: "idle" }
        )
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return
        setDropdown({
          kind: "error",
          message: "Location search unavailable. Please try again.",
        })
      }
    },
    [getOrCreateToken]
  )

  // ── Debounced effect ────────────────────────────────────────────────────────

  useEffect(() => {
    // Only fetch when the user is actively typing.
    // Programmatic calls to onChangeAction() (from handleSelect) do NOT set
    // isUserTypingRef, so they never trigger a new autocomplete search.
    const shouldFetch = isUserTypingRef.current
    isUserTypingRef.current = false

    if (!shouldFetch) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPredictions(value), 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, fetchPredictions])

  // Abort in-flight requests on unmount
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  // ── Selection handler ───────────────────────────────────────────────────────

  const handleSelect = useCallback(
    async (prediction: AutocompletePrediction) => {
      // Guard: do nothing if a details call is already in-flight
      if (dropdown.kind === "resolving") return

      const sessionToken = sessionTokenRef.current
      if (!sessionToken) return

      // Optimistically update the input and close the dropdown
      onChangeAction(prediction.description)
      setDropdown({ kind: "resolving" })

      try {
        const res = await fetch("/api/places/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId: prediction.placeId, sessionToken }),
        })

        // Guard against non-JSON responses (e.g. HTML error pages from Next.js)
        const contentType = res.headers.get("content-type") ?? ""
        if (!contentType.includes("application/json")) {
          setDropdown({ kind: "error", message: "Could not retrieve location details." })
          return
        }

        const data = await res.json() as
          | { place: PlaceDetails }
          | { error: string }

        if (!res.ok || "error" in data) {
          setDropdown({
            kind: "error",
            message: "error" in data ? data.error : "Could not retrieve location details.",
          })
          return
        }

        // Session is now closed on Google's side — discard the token
        invalidateToken()

        const { place } = data
        onChangeAction(place.formattedAddress)
        onSelectAction(
          place.formattedAddress,
          place.lat,
          place.lng,
          place.city,
          place.country
        )
        setDropdown({ kind: "idle" })
      } catch (err) {
        console.error("[AddressAutocomplete] Place Details error:", err)
        setDropdown({
          kind: "error",
          message: "Could not retrieve location details.",
        })
      }
    },
    [dropdown.kind, onChangeAction, onSelectAction, invalidateToken]
  )

  // Close dropdown when user blurs the input (e.g. clicks elsewhere).
  // The 150 ms delay lets onMouseDown + onClick fire first so list-item clicks
  // still work correctly.
  const handleBlur = useCallback(() => {
    setTimeout(() => setDropdown({ kind: "idle" }), 150)
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────────

  const isLoading =
    dropdown.kind === "loading" || dropdown.kind === "resolving"
  const showResults =
    dropdown.kind === "results" && dropdown.predictions.length > 0
  const showError =
    dropdown.kind === "error" && value.length >= 3

  return (
    <div className="relative">
      <Input
        placeholder="Start typing an address…"
        value={value}
        onChange={(e) => {
          isUserTypingRef.current = true
          onChangeAction(e.target.value)
        }}
        onBlur={handleBlur}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute z-10 mt-1 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
          Searching…
        </div>
      )}

      {/* Error / service unavailable */}
      {!isLoading && showError && (
        <div className="absolute z-10 mt-1 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-sm text-amber-600 shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:text-amber-400">
          {dropdown.message}
        </div>
      )}

      {/* Autocomplete suggestions */}
      {!isLoading && showResults && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border-2 border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
          {dropdown.predictions.map((p) => (
            <li
              key={p.placeId}
              // onMouseDown prevents input blur before onClick fires
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(p)}
              className="cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="font-medium">{p.mainText}</span>
              {p.secondaryText && (
                <span className="ml-1 text-muted-foreground">
                  {p.secondaryText}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
