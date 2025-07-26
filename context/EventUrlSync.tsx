"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { buildUrlParams } from "@/lib/filter-helper";
import { useEventContext } from "./EventContext";

export function EventUrlSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useEventContext();
  const debouncedFilters = useDebounce(filters, 500);

  const setFiltersSafe = useCallback(setFilters, [setFilters]);

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

    setFiltersSafe(newFilters);
  }, [searchParams, setFiltersSafe]);

  useEffect(() => {
    const newParams = buildUrlParams(debouncedFilters);
    const currentParams = searchParams.toString();

    if (!currentParams && !newParams) return;
    if (newParams === currentParams) return;

    const scrollY = window.scrollY;
    const newUrl = `${pathname}${newParams ? `?${newParams}` : ""}`;
    window.history.replaceState(null, "", newUrl);
    window.scrollTo({ top: scrollY, behavior: "auto" });
  }, [debouncedFilters, pathname, searchParams]);

  return null;
}
