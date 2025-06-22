"use client"

import { useState } from "react"
import { Filter, ChevronDown, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEventContext } from "./context/EventContext"

export default function Filters() {
  const { filters, setFilters } = useEventContext()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const hasActiveFilters = Object.values(filters).some((value) => value !== "all")

  const clearFilters = () => {
    setFilters({
      category: "all",
      format: "all",
      location: "all",
      date: "all",
    })
  }

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

            <Select value={filters.category} onValueChange={(value) => setFilters({ category: value })}>
              <SelectTrigger className="min-w-[140px] w-fit">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="web3">Web3</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>

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

            <Select value={filters.location} onValueChange={(value) => setFilters({ location: value })}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="san francisco">San Francisco</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="toronto">Toronto</SelectItem>
              </SelectContent>
            </Select>

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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                Clear all
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="relative md:hidden">
        {/* Mobile Filter Toggle */}
        <div className="px-4 py-3 max-w-fit">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between h-10"
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

        {/* Mobile Filter Panel */}
        {showMobileFilters && (
          <div className="absolute w-full px-4 pb-4 space-y-3 bg-gray-50 border-t">
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm font-medium text-gray-700">Filter Options</span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 h-8 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ category: value })}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="web3">Web3</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Format</label>
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Location</label>
                <Select value={filters.location} onValueChange={(value) => setFilters({ location: value })}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="san francisco">San Francisco</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="toronto">Toronto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Date</label>
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
  )
}
