import { z } from "zod";

// Define the schema for type safety
export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  start_date: z.string(),
  endDate: z.string().optional(),
  location: z.string(),
  time: z.string(),
  type: z.enum(["Online", "In-person", "In-person & Online"]),
  category: z.string(),
  price: z.string().optional(),
  price_amount: z.string().optional(),
  description: z.string(),
  publish_status: z.enum(['published', 'draft']).default('draft'),
  link: z.string().optional()
});

export type Event = z.infer<typeof eventSchema>;