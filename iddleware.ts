import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path starts with /admin
  if (!session && request.nextUrl.pathname.startsWith("/admin")) {
    const redirectUrl = new URL("/auth/signin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in, check for admin role
  if (session && request.nextUrl.pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
