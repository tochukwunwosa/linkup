"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEventContext } from "@/context/EventContext";
import { NigerianStatesCombobox } from "./NigerianStatesCombobox";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export default function Filters() {
  const { filters, setFilters } = useEventContext();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search to avoid too many API calls while typing
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value });
    setIsSearching(false);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.trim() === "") {
      // If empty, update immediately without debouncing
      setFilters({ search: "" });
      setIsSearching(false);
    } else {
      setIsSearching(true);
      debouncedSearch(value);
    }
  };

  // Sync searchValue with filters.search when filters are cleared externally
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

  const hasActiveFilters =
    filters.search !== "" ||
    filters.format !== "all" ||
    filters.location !== "all" ||
    filters.date !== "all";

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
      search: ""
    });
  };

  return (
    <section id="filters" className="sticky top-[env(safe-area-inset-top)] lg:top-0 z-50 bg-white border-b border-gray-200">
      {/* Desktop Filters */}
      <div className="hidden md:block py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>

            {/* Global Search Input */}
            <div className="relative min-w-[280px] flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events by title or category..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-9 h-9"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isSearching && searchValue && (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                )}
                {searchValue && !isSearching && (
                  <button
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <Select value={filters.format} onValueChange={(value) => setFilters({ format: value })}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-person</SelectItem>
              </SelectContent>
            </Select>

            {/* states */}
            <NigerianStatesCombobox
              className="w-[200px]"
              value={filters.location}
              onValueChange={(value) => setFilters({ location: value })}
            />

            <Select value={filters.date} onValueChange={(value) => setFilters({ date: value })}>
              <SelectTrigger className="w-fit">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        <div className="px-4 py-3 w-full space-y-3">
          {/* Always visible search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events by title or category..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9 h-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching && searchValue && (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              )}
              {searchValue && !isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* More filters button */}
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between h-10 bg-white hover:!bg-muted"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
              {(filters.format !== "all" || filters.location !== "all" || filters.date !== "all") && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Active</span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {showMobileFilters && (
          <div className="px-4 pb-4 space-y-3 bg-white border-t">
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm font-medium text-gray-700">Filter Options</span>
              {(filters.format !== "all" || filters.location !== "all" || filters.date !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      format: "all",
                      location: "all",
                      date: "all"
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 h-8 px-2 transition-colors duration-300 ease-in-out"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                  Format
                </label>
                <Select value={filters.format} onValueChange={(value) => setFilters({ format: value })}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                  Location
                </label>
                <NigerianStatesCombobox value={filters.location} onValueChange={(value) => setFilters({ location: value })} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                  Date
                </label>
                <Select value={filters.date} onValueChange={(value) => setFilters({ date: value })}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
