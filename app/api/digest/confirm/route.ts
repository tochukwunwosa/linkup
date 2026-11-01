import { NextResponse } from "next/server";
import { confirmDigestSubscription } from "@/lib/digest-subscribers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const ok = token ? await confirmDigestSubscription(token) : false;

  return NextResponse.redirect(
    new URL(`/email-alerts?status=${ok ? "confirmed" : "invalid"}`, url.origin),
    303
  );
}
