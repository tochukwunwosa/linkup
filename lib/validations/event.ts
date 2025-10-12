import { z } from "zod";

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

