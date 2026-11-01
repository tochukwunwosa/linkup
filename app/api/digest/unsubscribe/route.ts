import { NextResponse } from "next/server";
import { unsubscribeFromDigest } from "@/lib/digest-subscribers";

// POST only, so link scanners that open URLs in emails can't unsubscribe
// people. Handles both the email client's one-click unsubscribe (RFC 8058)
// and the button on /email-alerts/unsubscribe.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  if (token) await unsubscribeFromDigest(token);

  const body = await req.text().catch(() => "");
  if (body.includes("List-Unsubscribe=One-Click")) {
    return new NextResponse("Unsubscribed", { status: 200 });
  }

  return NextResponse.redirect(new URL("/email-alerts?status=unsubscribed", url.origin), 303);
}
