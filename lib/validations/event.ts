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
  price_amount: z.string().optional(),
  description: z.string(),
  publish_status: z.enum(["Published", "Draft"]).default("Draft"),
  link: z.string().optional(),
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
  price_amount?: string;
  description: string;
  publish_status: PublishStatus;
  link?: string;
  city?: string;
  country?: string
};

export const CATEGORY_SUGGESTIONS = [
  "ai",
  "web",
  "web3",
  "mobile",
  "frontend",
  "backend",
  "fullstack",
  "devops",
  "cloud",
  "blockchain",
  "crypto",
  "data",
  "ml",
  "nlp",
  "design",
  "ui",
  "ux",
  "figma",
  "saas",
  "startup",
  "product",
  "security",
  "testing",
  "performance",
  "graphql",
  "rest",
  "typescript",
  "javascript",
  "python",
  "react",
  "vue",
  "nextjs",
  "flutter",
  "android",
  "ios",
  "docker",
  "kubernetes",
  "serverless",
  "firebase",
  "tailwind",
  "opensource",
  "coding",
  "hackathon",
  "prompt",
  "genai",
  "tools",
  "infra",
  "career",
  "jobs",
  "remote"
];

