"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "../ui/date-picker";
import { eventSubmissionFormSchema, EventSubmissionFormData } from "@/lib/validations/event";
import { submitEventAction } from "@/app/actions/submission/submitEvent";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import MultiTagInput from "../ui/multi-tag-input";
import { CURRENCY_LIST } from "@/lib/format-currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressAutocomplete from "../address-autocomplete";
import { SUGGESTED_CATEGORIES } from "@/app/constants/categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface EventSubmissionFormProps {
  onSuccess: (trackingId: string) => void;
}

export function EventSubmissionForm({ onSuccess }: EventSubmissionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventSubmissionFormData>({
    resolver: zodResolver(eventSubmissionFormSchema),
    defaultValues: {
      title: "",
      start_date: new Date(),
      end_date: undefined,
      time: "",
      location: "",
      lat: 0,
      lng: 0,
      category: [],
      type: "In-person",
      price: "Free",
      currency: "NGN",
      price_amount: "",
      description: "",
      link: "",
      organizer_name: "",
      organizer_email: "",
      organizer_phone: "",
      organizer_organization: "",
    },
  });

  const onFormSubmit = async (formData: EventSubmissionFormData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const start = new Date(formData.start_date);
    const end = formData.end_date ? new Date(formData.end_date) : start;

    if (start > end) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    const isSingleDay = start.toDateString() === end.toDateString();
    const isStartInPast = start < today;
    const isEndInFuture = end >= today;

    if (isSingleDay && isStartInPast) {
      toast.info("Single-day events cannot be in the past.");
      return;
    }

    if (!isSingleDay && !isEndInFuture) {
      toast.info("Multi-day events must still be ongoing or in the future.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitEventAction(formData);

        if (!result.success) {
          toast.error(result.error || "Failed to submit event");
          return;
        }

        toast.success(result.message || "Event submitted successfully!");
        onSuccess(result.trackingId!);
      } catch (err) {
        console.error("Failed to submit event", err);
        toast.error("Something went wrong while submitting the event.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="max-w-3xl space-y-8 py-4">
        {/* Event Details Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Event Details</h3>
            <p className="text-sm text-muted-foreground">Tell us about your event</p>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Event Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Lagos Tech Meetup 2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
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
                        field.onChange(date);
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
                      field.onChange(date);
                    }}
                    minDate={form.watch("start_date")}
                  />
                  <FormDescription className="text-xs">Leave blank for single-day events</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Time <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="time" className="w-full" {...field} />
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
                <FormLabel>
                  Location <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value}
                    onChangeAction={(val) => field.onChange(val)}
                    onSelectAction={(address, lat, lng) => {
                      field.onChange(address);
                      form.setValue("lat", lat);
                      form.setValue("lng", lng);
                    }}
                  />
                </FormControl>
                <FormDescription className="text-xs">Start typing to search for a location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Categories <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <MultiTagInput
                    value={field.value}
                    onChange={(tags) => field.onChange(tags)}
                    suggestions={SUGGESTED_CATEGORIES}
                    placeholder="e.g., AI/ML, Web Development, Blockchain"
                  />
                </FormControl>
                <FormDescription className="text-xs">Add at least one category</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Event Type <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="In-person" id="in-person" />
                      <FormLabel htmlFor="in-person" className="font-normal cursor-pointer">
                        In-person
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <FormLabel htmlFor="online" className="font-normal cursor-pointer">
                        Online
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="In-person & Online" id="in-person-online" />
                      <FormLabel htmlFor="in-person-online" className="font-normal cursor-pointer">
                        Hybrid
                      </FormLabel>
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
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Free" id="free" />
                      <FormLabel htmlFor="free" className="font-normal cursor-pointer">
                        Free
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Paid" id="paid" />
                      <FormLabel htmlFor="paid" className="font-normal cursor-pointer">
                        Paid
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("price") === "Paid" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCY_LIST.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Price Amount <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
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
                <FormLabel>
                  Description <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event, what attendees can expect, topics covered, etc."
                    className="min-h-[120px]"
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
                <FormLabel>Event Link / Registration URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription className="text-xs">Optional: Link to your event page or registration</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Organizer Information Section */}
        <div className="space-y-6 pt-6 border-t">
          <div>
            <h3 className="text-lg font-semibold">Your Information</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;ll use this to contact you about your event submission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organizer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Your Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organizer_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+234 XXX XXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizer_organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company or community" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Event"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
