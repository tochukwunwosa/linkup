import { Role } from "@/lib/auth";

declare interface Admin {
  email: string;
  name: string;
  role: Role;
  invited_by: string;
  created_at: string;
}

