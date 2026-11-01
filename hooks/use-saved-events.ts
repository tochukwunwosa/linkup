import { useCallback, useSyncExternalStore } from "react";
import type { Event as TechEvent } from "@/lib/validations/event";

// Saved events live only in this browser (localStorage); nothing is sent to
// the server. Each entry keeps a small snapshot so the Saved page works offline.

export interface SavedEvent {
  slug: string;
  title: string;
  start_date: string;
  end_date?: string | null;
  time: string;
  place: string;
  savedAt: string;
}

const STORAGE_KEY = "techlinkup:saved-events";
const CHANGE_EVENT = "techlinkup:saved-events-change";
const MAX_SAVED = 100;
const EMPTY: SavedEvent[] = [];

// useSyncExternalStore needs a stable snapshot, so cache the parsed list
// against the raw string it came from.
let cachedRaw: string | null = null;
let cachedList: SavedEvent[] = EMPTY;

function readSaved(): SavedEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = raw ? JSON.parse(raw) : [];
      cachedList = Array.isArray(parsed) ? parsed : EMPTY;
    }
    return cachedList;
  } catch {
    // Private mode, blocked storage or bad JSON: behave as if nothing is saved.
    return EMPTY;
  }
}

function writeSaved(list: SavedEvent[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
  } catch {
    // Storage full or blocked; saving just won't stick.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  // "storage" fires for other tabs; our own event covers this tab.
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function toSavedEvent(event: TechEvent): SavedEvent {
  return {
    slug: event.slug,
    title: event.title,
    start_date: event.start_date,
    end_date: event.end_date ?? null,
    time: event.time,
    place: event.type === "Online" ? "Online" : event.city || event.location,
    savedAt: new Date().toISOString(),
  };
}

export function useSavedEvents() {
  const saved = useSyncExternalStore(subscribe, readSaved, () => EMPTY);

  const isSaved = useCallback((slug: string) => saved.some((e) => e.slug === slug), [saved]);

  const toggle = useCallback((event: SavedEvent) => {
    const current = readSaved();
    const exists = current.some((e) => e.slug === event.slug);
    writeSaved(exists ? current.filter((e) => e.slug !== event.slug) : [event, ...current]);
    return !exists;
  }, []);

  const remove = useCallback((slug: string) => {
    writeSaved(readSaved().filter((e) => e.slug !== slug));
  }, []);

  return { saved, isSaved, toggle, remove };
}
