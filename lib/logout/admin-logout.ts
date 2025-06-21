import { logoutAdmin } from "@/app/actions/admin/authAdmin";

export const adminLogout = async () => {
  await logoutAdmin();
}