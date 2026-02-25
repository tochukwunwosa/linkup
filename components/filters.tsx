"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEventContext } from "@/context/EventContext";
import { NigerianStatesCombobox } from "./NigerianStatesCombobox";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { getCategoryColors } from "@/lib/category-color";

// Curated high-volume category chips
const CATEGORY_CHIPS = [
  "AI",
  "Web",
  "Web3",
  "Mobile",
  "Cloud",
  "Cybersecurity",
  "Data Science",
  "Design",
  "Startup",
  "Hackathon",
  "Fintech",
  "Career",
];

export default function Filters() {
  const { filters, setFilters } = useEventContext();
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value });
    setIsSearching(false);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.trim() === "") {
      setFilters({ search: "" });
      setIsSearching(false);
    } else {
      setIsSearching(true);
      debouncedSearch(value);
    }
  };

  useEffect(() => {
    if (filters.search === "" && searchValue !== "") {
      setSearchValue("");
      setIsSearching(false);
    }
  }, [filters.search, searchValue]);

  const handleClearSearch = () => {
    setSearchValue("");
    setFilters({ search: "" });
    setIsSearching(false);
  };

  const activeCategories = filters.category ?? [];

  const toggleCategory = (cat: string) => {
    const isActive = activeCategories.includes(cat);
    setFilters({
      category: isActive
        ? activeCategories.filter((c) => c !== cat)
        : [...activeCategories, cat],
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.format !== "all" ||
    filters.location !== "all" ||
    filters.date !== "all" ||
    activeCategories.length > 0;

  const clearFilters = () => {
    setSearchValue("");
    setIsSearching(false);
    setFilters({
      category: [],
      format: "all",
      location: "all",
      date: "all",
      city: "",
      country: "",
      search: "",
    });
  };

  const pillClass = (active: boolean) =>
    cn("filter-pill", active && "filter-pill-active");

  const FilterChips = () => (
    <>
      <Select value={filters.format} onValueChange={(value) => setFilters({ format: value })}>
        <SelectTrigger
          className={cn(
            pillClass(filters.format !== "all"),
            "border-none shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:line-clamp-1 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:opacity-60"
          )}
        >
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Formats</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="in-person">In-person</SelectItem>
        </SelectContent>
      </Select>

      <NigerianStatesCombobox
        className={cn(pillClass(filters.location !== "all"), "max-w-44")}
        value={filters.location}
        onValueChange={(value) => setFilters({ location: value })}
      />

      <Select value={filters.date} onValueChange={(value) => setFilters({ date: value })}>
        <SelectTrigger
          className={cn(
            pillClass(filters.date !== "all"),
            "border-none shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:line-clamp-1 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:opacity-60"
          )}
        >
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="filter-pill text-red-500 border-red-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 gap-1.5"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </>
  );

  return (
    <section id="filters" className="filters-glass sticky top-[env(safe-area-inset-top)] lg:top-16 z-50">
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,102,204,0.2) 30%, rgba(201,247,47,0.3) 50%, rgba(0,102,204,0.2) 70%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Row 1: Search + desktop chips */}
        <div className="flex gap-3 items-center">
          {/* Search input */}
          <div className="relative flex-1" aria-busy={isSearching}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0066cc]/40" />
            <Input
              type="text"
              placeholder="Search events by title or category..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9 h-9"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching && searchValue && (
                <Loader2 className="h-4 w-4 text-[#0066cc]/50 animate-spin" />
              )}
              {searchValue && !isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="text-[#64748b] hover:text-[#1a1b25] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop-only filter chips */}
          <div className="hidden md:flex items-center gap-2">
            <FilterChips />
          </div>
        </div>

        {/* Row 2: Mobile-only horizontal scroll chips */}
        <div className="md:hidden overflow-x-auto scrollbar-hide flex gap-2 mt-2 pb-0.5">
          <FilterChips />
        </div>

        {/* Row 3: Category chips — always visible */}
        <div className="overflow-x-auto scrollbar-hide flex gap-2 mt-2 pb-0.5">
          {CATEGORY_CHIPS.map((cat) => {
            const isActive = activeCategories.includes(cat);
            const catColors = getCategoryColors([cat]);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn("filter-pill text-xs px-3", isActive && "filter-pill-active")}
                style={
                  isActive
                    ? {
                        borderColor: catColors.solid,
                        color: catColors.solid,
                        background: catColors.overlay,
                      }
                    : undefined
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
