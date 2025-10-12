"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "../ui/date-picker"
import { Event, EventType, PublishStatus } from "@/lib/validations/event"
import { createEventAction } from "@/app/actions/event/createEvent"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { updateEventAction } from "@/app/actions/event/updateEvent"
import MultiTagInput from "../ui/multi-tag-input"
import { CURRENCY_LIST } from '@/lib/format-currency'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AddressAutocomplete from "../address-autocomplete"
import { SUGGESTED_CATEGORIES } from "@/app/constants/categories"


interface EventFormProps {
  initialData?: Partial<Event> | null;
  onSubmit: () => void;
  onCancel: () => void;
}

type EventFormData = {
  title: string;
  start_date: Date;
  end_date: Date;
  time: string;
  location: string;
  category: string[];
  type: EventType;
  price: string;
  currency: string;
  price_amount: string;
  description: string;
  link: string;
  publish_status: PublishStatus;
  lat: number;
  lng: number
};



export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  // Add default in useState:
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
    end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
    time: initialData?.time || "",
    location: initialData?.location || "",
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    category: initialData?.category || [],
    type: initialData?.type || "In-person",
    price: initialData?.price || "Free",
    currency: initialData?.currency || 'NGN',
    price_amount: initialData?.price_amount || "",
    description: initialData?.description || "",
    link: initialData?.link || "",
    publish_status: initialData?.publish_status || "Draft",
  });


  const handleChange = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)

    if (start > end) {
      alert("Start date cannot be after end date.")
      return
    }

    const isSingleDay = start.toDateString() === end.toDateString()
    const isStartInPast = start < today
    const isEndInFuture = end >= today

    if (isSingleDay && isStartInPast) {
      toast.info("Single-day events cannot be in the past.")
      return
    }

    if (!isSingleDay && !isEndInFuture) {
      toast.info("Multi-day events must still be ongoing or in the future.")
      return
    }

    // Ensure start_date and end_date are set to noon to avoid timezone date shifting
    const startDateNoon = new Date(formData.start_date)
    startDateNoon.setHours(12, 0, 0, 0)
    const endDateNoon = new Date(formData.end_date)
    endDateNoon.setHours(12, 0, 0, 0)
    const data = {
      ...formData,
      category: formData.category.map((c) => c.trim()),
      start_date: startDateNoon.toISOString(),
      end_date: endDateNoon.toISOString(),
      currency: formData.currency,
    }


    startTransition(async () => {
      try {
        if (initialData?.id) {
          // 👈 Update existing
          await updateEventAction(initialData.id, data);
          toast.success("Event updated successfully!");
        } else {
          // 👈 Create new
          await createEventAction(data);
          toast.success("Event created successfully!");
        }

        onSubmit();
      } catch (err) {
        console.error("Failed to save event", err);
        toast.error("Something went wrong while saving the event.");
      }
    });
  }


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="w-fit mb-2">Event Title <span className='text-destructive text-xs'>*</span></Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              date={formData.start_date}
              required
              onChange={(date) => {
                if (date) {
                  setFormData({ ...formData, start_date: date })
                }
              }}
            />
            <DatePicker
              label="End Date"
              date={formData.end_date}
              onChange={(date) => {
                if (date) {
                  setFormData({ ...formData, end_date: date })
                }
              }}
              minDate={formData.start_date}
            />
          </div>

          <div>
            <Label htmlFor="time" className="w-fit mb-2">Time <span className='text-destructive text-xs'>*</span></Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className="w-fit"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="w-fit mb-2">Location <span className='text-destructive text-xs'>*</span></Label>
          <AddressAutocomplete
            value={formData.location}
            onChange={(val) => handleChange("location", val)}
            onSelect={(address, lat, lng) => {
              handleChange("location", address)
              handleChange("lat", lat)
              handleChange("lng", lng)
            }}
          />

        </div>

        <div className="relative">
          <Label htmlFor="category" className="w-fit mb-2">Categories <span className='text-destructive text-xs'>*</span></Label>
          <MultiTagInput
            value={formData.category}
            onChange={(tags) => handleChange("category", tags)}
            suggestions={SUGGESTED_CATEGORIES}
            placeholder="Add categories like AI, Web3, DevOps"
          />
        </div>

        <div>
          <Label className="w-fit mb-2">Event Type <span className='text-destructive text-xs'>*</span></Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => handleChange("type", value as EventType)}
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
          <Label className="w-fit mb-2">Pricing</Label>
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
            <Label htmlFor="currency" className="w-fit mb-2 block">Currency & Amount</Label>
            <div className="flex space-x-2">
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger className="w-1/5">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_LIST.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                id="price_amount"
                value={formData.price_amount}
                onChange={(e) => handleChange("price_amount", e.target.value)}
                placeholder="e.g. 1000"
                required
                className="w-2/3"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Price in selected currency (do not include commas)
            </p>
          </div>
        )}


        <div>
          <Label htmlFor="description" className="w-fit mb-2">Description <span className='text-destructive text-xs'>*</span></Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter event description"
            rows={4}
            required
            className="w-full resize-y"
          />
        </div>

        <div>
          <Label htmlFor="link" className="w-fit mb-2">Link</Label>
          <Textarea
            id="link"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            placeholder="Enter website link if any"
            rows={4}
            className="w-full resize-y"
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
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={isPending}
        >
          {isPending ?
            <div className="flex items-center gap-px">
              {initialData ? "Updating..." : "Creating..."}
              <Loader className="animate-spin" />
            </div>
            :
            <div className="flex items-center gap-px">
              {initialData ? "Update Event" : "Create Event"}
            </div>
          }
        </Button>

      </div>
    </form>
  )
}
