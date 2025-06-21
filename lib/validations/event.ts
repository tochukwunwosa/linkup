import { z } from "zod";

// Define the schema for type safety
export const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
  location: z.string(),
  time: z.string(),
  type: z.enum(["Online", "In-person", "In-person & Online"]),
  category: z.string(),
  price: z.string().optional(),
  price_amount: z.string().optional(),
  description: z.string(),
  publish_status: z.enum(["Published", "Draft"]).default("Draft"),
  link: z.string().optional(),
});

export type PublishStatus = "Published" | "Draft"
export type EventType = "Online" | "In-person" | "In-person & Online"

export type Event = {
  id: number;
  title: string;
  start_date: string;
  end_date?: string;
  location: string;
  time: string;
  type: EventType;
  category: string;
  price?: string;
  price_amount?: string;
  description: string;
  publish_status: PublishStatus;
  link?: string
}


