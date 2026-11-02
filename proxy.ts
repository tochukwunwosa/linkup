import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createPublicClient } from "@/lib/supabase/public";

const LEGACY_EVENT_PATH = /^\/events\/(\d+)\/?$/;

export async function proxy(request: NextRequest) {
  // Old numeric event URLs (/events/155, from before slugs) are still linked
  // and indexed. Redirect them here, before rendering: the event page streams
  // (it has a loading.tsx), so a redirect from the page itself arrives as a
  // 200 with a meta refresh and the home page's canonical, not a real 308.
  const legacy = LEGACY_EVENT_PATH.exec(request.nextUrl.pathname);
  if (legacy) {
    const { data } = await createPublicClient()
      .from("published_events")
      .select("slug")
      .eq("id", legacy[1])
      .maybeSingle();

    if (data?.slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/events/${data.slug}`;
      return NextResponse.redirect(url, 308);
    }
    // Unknown id: let the page handle it (not found).
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  /*
   * Only admin routes need the Supabase session. Running this on public
   * pages added an auth round-trip to every visitor and crawler request.
   * Numeric event URLs are matched only to redirect them to their slug.
   */
  matcher: ["/admin/:path*", "/events/:id(\\d+)"],
};
