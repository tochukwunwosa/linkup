// validations/admin.ts

import { z } from "zod";

export const baseAdminFields = {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "super_admin"]),
  password: z.string(),
  confirmPassword: z.string(),
};

export const createAdminFormSchema = z
  .object(baseAdminFields)
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const updateAdminFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    role: z.enum(["admin", "super_admin"]),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    { path: ["confirmPassword"], message: "Passwords do not match" }
  );

// Types
export type CreateAdminFormValues = z.infer<typeof createAdminFormSchema>;
export type UpdateAdminFormValues = z.infer<typeof updateAdminFormSchema>;

