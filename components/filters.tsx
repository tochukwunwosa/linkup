"use client"

import React from 'react'
import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FiltersProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedFormat: string
  setSelectedFormat: (format: string) => void
  selectedLocation: string
  setSelectedLocation: (location: string) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
}

export default function Filters({ selectedCategory, setSelectedCategory, selectedFormat, setSelectedFormat, selectedLocation, setSelectedLocation, selectedDate, setSelectedDate }: FiltersProps) {
  return (
    <section id="filters" className="sticky top-16 z-40 bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="in-person">In-person</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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

          <Select value={selectedDate} onValueChange={setSelectedDate}>
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
        </div>
      </div>
    </section>
  )
}
