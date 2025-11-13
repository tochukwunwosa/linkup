import { z } from "zod";

// Strong password validation
const passwordSchema = z
  .string({ message: "Password is required" })
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string({ message: "Password is required" }), // Login doesn't need strict validation
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Export password schema for use in other validation schemas
export { passwordSchema };
