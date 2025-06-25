"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Event } from "@/lib/validations/event";

export default function useInfiniteScrollEvents(
  events: Event[],
  batchSize = 10,
  buffer = 4
) {
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    setVisibleEvents((prev) => {
      const nextBatch = events.slice(
        prev.length,
        prev.length + batchSize + buffer
      );
      if (prev.length + nextBatch.length >= events.length) setHasMore(false);
      return [...prev, ...nextBatch];
    });
  }, [events, batchSize, buffer]);

  useEffect(() => {
    setVisibleEvents(events.slice(0, batchSize + buffer));
    setHasMore(events.length > batchSize + buffer);
  }, [events, batchSize, buffer]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return { visibleEvents, observerRef, hasMore };
}
