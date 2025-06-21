import { Role } from "@/lib/auth";

export type Admin = {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: Role;
  invited_by: string;
  last_login: string;
};

