"use client";

import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEventContext } from "@/context/EventContext";
import MultiTagInput from "./ui/multi-tag-input";
import { NigerianStatesCombobox } from "./NigerianStatesCombobox";
import { SUGGESTED_CATEGORIES } from "@/app/constants/categories";

export default function Filters() {
  const { filters, setFilters } = useEventContext();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.format !== "all" ||
    filters.location !== "all" ||
    filters.date !== "all";

  const clearFilters = () => {
    setFilters({
      category: [],
      format: "all",
      location: "all",
      date: "all",
      city: "",
      country: ""
    });
  };

  return (
    <section id="filters" className="sticky top-16 z-40 bg-white border-b border-gray-200">
      {/* Desktop Filters */}
      <div className="hidden md:block py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>

            {/* Multi-tag input for category */}
            <div className="min-w-[180px]">
              <MultiTagInput
                value={filters.category}
                onChange={(tags) => setFilters({ category: tags })}
                suggestions={SUGGESTED_CATEGORIES}
                placeholder="Search by categories"
              />
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

      {/* Mobile Filters (unchanged except category tag input added) */}
      <div className="relative md:hidden">
        <div className="px-4 py-3 w-full">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between h-10 bg-white hover:!bg-muted"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Active</span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {showMobileFilters && (
          <div className="absolute w-full px-4 pb-4 space-y-3 bg-white border min-h-[70vh]">
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm font-medium text-gray-700">Filter Options</span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
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
                  Categories
                </label>
                <MultiTagInput
                  value={filters.category}
                  onChange={(tags) => setFilters({ category: tags })}
                  suggestions={SUGGESTED_CATEGORIES}
                  placeholder="Add categories"
                />
              </div>

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
