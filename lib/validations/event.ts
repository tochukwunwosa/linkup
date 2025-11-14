import { z } from "zod";

// Form schema - uses Date objects for form handling
export const eventFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Event title is required").min(3, "Event title must be at least 3 characters"),
  start_date: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Please select a valid start date"
  }),
  end_date: z.date({
    required_error: "End date is required",
    invalid_type_error: "Please select a valid end date"
  }),
  location: z.string().min(1, "Location is required").min(3, "Location must be at least 3 characters"),
  time: z.string().min(1, "Event time is required"),
  type: z.enum(["Online", "In-person", "In-person & Online"], {
    errorMap: () => ({ message: "Please select a valid event type" })
  }),
  category: z.array(z.string()).min(1, "At least one category is required"),
  price: z.string().optional(),
  currency: z.string().optional(),
  price_amount: z.string().optional(),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  publish_status: z.enum(["Published", "Draft"]),
  link: z.string().optional(),
  lat: z.number({
    required_error: "Please select a valid location from the dropdown",
    invalid_type_error: "Please select a valid location from the dropdown"
  }),
  lng: z.number({
    required_error: "Please select a valid location from the dropdown",
    invalid_type_error: "Please select a valid location from the dropdown"
  })
}).superRefine((data, ctx) => {
  // Validate that a valid location was selected (lat/lng are not 0)
  if (data.lat === 0 || data.lng === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a valid location from the dropdown suggestions",
      path: ["location"]
    });
  }

  // Validate that paid events have a price amount
  if (data.price === "Paid" && (!data.price_amount || data.price_amount.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price amount is required for paid events",
      path: ["price_amount"]
    });
  }

  // Validate that price amount is a valid number if provided
  if (data.price === "Paid" && data.price_amount && isNaN(Number(data.price_amount))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price amount must be a valid number",
      path: ["price_amount"]
    });
  }

  // Validate that price amount is positive
  if (data.price === "Paid" && data.price_amount && Number(data.price_amount) <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price amount must be greater than 0",
      path: ["price_amount"]
    });
  }
});

// API schema - uses string dates for server actions
export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
  location: z.string(),
  time: z.string(),
  type: z.enum(["Online", "In-person", "In-person & Online"]),
  category: z.array(z.string()).min(1, "At least one category is required"),
  price: z.string().optional(),
  currency: z.string().optional(),
  price_amount: z.string().optional(),
  description: z.string(),
  publish_status: z.enum(["Published", "Draft"]).default("Draft"),
  link: z.string().optional(),
  lat: z.number(),
  lng:z.number()
});

export type PublishStatus = "Published" | "Draft";
export type EventType = "Online" | "In-person" | "In-person & Online";

// Infer form data type from the form schema
export type EventFormData = z.infer<typeof eventFormSchema>;

export type Event = {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  location: string;
  time: string;
  type: EventType;
  category: string[];
  price?: string;
  currency: string;
  price_amount?: string;
  description: string;
  publish_status: PublishStatus;
  link?: string;
  city?: string;
  country?: string;
  lat: number,
  lng: number
};

