"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "../ui/date-picker"
import { convertTo24Hour } from "@/lib/utils"
import { Event } from "@/lib/validations/event"

interface EventFormProps {
  initialData?: Partial<Event> | null
  onSubmit: () => void
  onCancel: () => void
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
    time: initialData?.time || "",
    location: initialData?.location || "",
    category: initialData?.category || "",
    type: initialData?.type || "In-person",
    price: initialData?.price || "Free",
    price_amount: initialData?.price_amount || "",
    description: initialData?.description || "",
    publish_status: initialData?.publish_status || "Draft",
  })


  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const start = new Date(formData.start_date)
    const end = new Date(formData.endDate)

    if (start > end) {
      alert("Start date cannot be after end date.")
      return
    }

    const isSingleDay = start.toDateString() === end.toDateString()
    const isStartInPast = start < today
    const isEndInFuture = end >= today

    if (isSingleDay && isStartInPast) {
      alert("Single-day events cannot be in the past.")
      return
    }

    if (!isSingleDay && !isEndInFuture) {
      alert("Multi-day events must still be ongoing or in the future.")
      return
    }

    console.log("Form data:", formData)
    onSubmit()
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              date={formData.start_date}
              onChange={(date) => {
                if (date) {
                  setFormData({ ...formData, start_date: date })
                }
              }}
            />
            <DatePicker
              label="End Date"
              date={formData.endDate}
              onChange={(date) => {
                if (date) {
                  setFormData({ ...formData, endDate: date })
                }
              }}
              minDate={formData.start_date}
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={convertTo24Hour(formData.time)}
              onChange={(e) => handleChange("time", e.target.value)}
              required
            />

          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter location or online platform"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AI">AI</SelectItem>
              <SelectItem value="Web3">Web3</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Event Type</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="In-person" id="in-person" />
              <Label htmlFor="in-person">In-person</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Online" id="online" />
              <Label htmlFor="online">Online</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="In-person & Online" id="in-person-online" />
              <Label htmlFor="in-person-online">In-person & Online</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Pricing</Label>
          <RadioGroup
            value={formData.price}
            onValueChange={(value) => handleChange("price", value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Free" id="free" />
              <Label htmlFor="free">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Paid" id="paid" />
              <Label htmlFor="paid">Paid</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.price === "Paid" && (
          <div>
            <Label htmlFor="price_amount">Price Amount</Label>
            <Input
              id="price_amount"
              value={formData.price_amount}
              onChange={(e) => handleChange("price_amount", e.target.value)}
              placeholder="e.g. $99"
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter event description"
            rows={4}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.publish_status === "Published"}
            onCheckedChange={(checked) => handleChange("publish_status", checked ? "Published" : "Draft")}
          />
          <Label htmlFor="published">Publish event</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
