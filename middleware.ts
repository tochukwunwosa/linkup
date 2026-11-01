import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  /*
   * Only admin routes need the Supabase session. Running this on public
   * pages added an auth round-trip to every visitor and crawler request.
   */
  matcher: ["/admin/:path*"],
};
