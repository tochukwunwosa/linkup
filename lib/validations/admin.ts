import { z } from 'zod';
import { mockAdmins } from '../mock-data';

// Base fields shared between schemas
const baseAdminFields = {
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'super_admin']).default('admin'),
};

// Full Admin Schema (e.g., from DB)
export const adminSchema = z.object({
  id: z.number().min(1),
  ...baseAdminFields,
  last_login: z.string().datetime('Invalid datetime for last_login'),
  created_at: z.string().datetime('Invalid datetime for created_at'),
  updated_at: z.string().datetime('Invalid datetime for created_at'),
  
});

// Create Admin Schema (client-side input)
export const createAdminSchema = z.object({
  ...baseAdminFields,
});

// Update Admin Schema (partial + no required fields)
export const updateAdminSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'super_admin']).optional(),
});

// Types
export type Admin = z.infer<typeof adminSchema>;
export type CreateAdmin = z.infer<typeof createAdminSchema>;
export type UpdateAdmin = z.infer<typeof updateAdminSchema>; // already partial

// Helper: Safe parsing of raw data
export const parsedAdmins: Admin[] = mockAdmins
  .map((admin) => {
    const result = adminSchema.safeParse(admin);
    return result.success ? result.data : null;
  })
  .filter((a): a is Admin => a !== null);
