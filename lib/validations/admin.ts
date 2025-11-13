// validations/admin.ts

import { z } from "zod";
import { passwordSchema } from "./auth";

export const baseAdminFields = {
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "super_admin"]),
  password: passwordSchema.optional(),
  // confirmPassword: z.string(),
};

export const adminFormSchema = z.object(baseAdminFields);


// Types
export type AdminFormValues = z.infer<typeof adminFormSchema>;
