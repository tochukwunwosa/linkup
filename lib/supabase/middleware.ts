import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

// update last login of admin
  if (user) {
    await supabase
      .from("admins")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);
  }

  const pathname = request.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Redirect unauthenticated users trying to access /admin routes (excluding /admin/login)
  if (isAdminRoute && !user && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  let isAdmin = false;

  // Check if user is admin (only if user exists and trying to access an /admin route)
  if (user && isAdminRoute) {
    const { data, error } = await supabase
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();
    
    isAdmin = (data?.role === "super_admin" || data?.role === "admin")

    if (error || !data) {
      console.warn("Admin not found or error:", error);
      // redirect or deny access
    }

    // Not an admin, trying to access /admin — redirect to home
    if (!isAdmin && !isLoginPage) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }

    // If admin is at /admin/login — redirect to /admin/dashboard
    if (isAdmin && isLoginPage) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
