"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEventContext } from "./EventContext";
import { useDebounce } from "@/hooks/use-debounce";
import { buildUrlParams } from "@/lib/filter-helper";

export function EventUrlSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useEventContext();
  const debouncedFilters = useDebounce(filters, 500);

  // Fix: Remove setFilters from dependency array and use useCallback for setFilters
  useEffect(() => {
    const category = searchParams.get("category")
      ?.split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean) || [];

    const newFilters = {
      category,
      format: searchParams.get("format") || "all",
      location: searchParams.get("location") || "all",
      date: searchParams.get("date") || "all",
      city: searchParams.get("city") || "",
      country: searchParams.get("country") || "",
    };

    setFilters(newFilters);
  }, [searchParams]); // Remove setFilters from dependency array

  useEffect(() => {
    const newParams = buildUrlParams(debouncedFilters);
    const currentParams = searchParams.toString();

    if (newParams !== currentParams) {
      const scrollY = window.scrollY;
      const newUrl = `${pathname}${newParams ? `?${newParams}` : ""}`;
      window.history.replaceState(null, "", newUrl);
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }
  }, [debouncedFilters, pathname, searchParams]);

  return null;
}