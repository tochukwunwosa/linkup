"use client"

import type React from "react"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "../ui/date-picker"
import { Event, eventFormSchema, EventFormData } from "@/lib/validations/event"
import { createEventAction } from "@/app/actions/event/createEvent"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { updateEventAction } from "@/app/actions/event/updateEvent"
import MultiTagInput from "../ui/multi-tag-input"
import { CURRENCY_LIST } from '@/lib/format-currency'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AddressAutocomplete from "../address-autocomplete"
import { SUGGESTED_CATEGORIES } from "@/app/constants/categories"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


interface EventFormProps {
  initialData?: Partial<Event> | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [isPending, startTransition] = useTransition()

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
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
    },
  });



  const onFormSubmit = async (formData: EventFormData) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)

    if (start > end) {
      toast.error("Start date cannot be after end date.")
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="max-w-2xl space-y-6 py-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title <span className='text-destructive text-xs'>*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <DatePicker
                      label="Start Date"
                      date={field.value}
                      required
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date)
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <DatePicker
                      label="End Date"
                      date={field.value}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date)
                        }
                      }}
                      minDate={form.watch("start_date")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time <span className='text-destructive text-xs'>*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="w-fit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location <span className='text-destructive text-xs'>*</span></FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    onSelect={(address, lat, lng) => {
                      field.onChange(address)
                      form.setValue("lat", lat)
                      form.setValue("lng", lng)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories <span className='text-destructive text-xs'>*</span></FormLabel>
                <FormControl>
                  <MultiTagInput
                    value={field.value}
                    onChange={(tags) => field.onChange(tags)}
                    suggestions={SUGGESTED_CATEGORIES}
                    placeholder="Add categories like AI, Web3, DevOps"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type <span className='text-destructive text-xs'>*</span></FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="In-person" id="in-person" />
                      <FormLabel htmlFor="in-person" className="font-normal">In-person</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <FormLabel htmlFor="online" className="font-normal">Online</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="In-person & Online" id="in-person-online" />
                      <FormLabel htmlFor="in-person-online" className="font-normal">In-person & Online</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Free" id="free" />
                      <FormLabel htmlFor="free" className="font-normal">Free</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Paid" id="paid" />
                      <FormLabel htmlFor="paid" className="font-normal">Paid</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("price") === "Paid" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency & Amount</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="price_amount"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="e.g. 1000"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_amount"
                render={() => (
                  <FormItem>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Price in selected currency (do not include commas)
                    </p>
                  </FormItem>
                )}
              />
            </div>
          )}


          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className='text-destructive text-xs'>*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter event description"
                    rows={4}
                    className="w-full resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter website link if any"
                    rows={4}
                    className="w-full resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publish_status"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      id="published"
                      checked={field.value === "Published"}
                      onCheckedChange={(checked) => field.onChange(checked ? "Published" : "Draft")}
                    />
                  </FormControl>
                  <FormLabel htmlFor="published" className="font-normal">Publish event</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden fields for lat/lng validation */}
          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  )
}
