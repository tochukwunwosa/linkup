import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { createPublicClient } from "@/lib/supabase/public";
import { todayInLagos } from "@/lib/date-utils";
import { addDays, eventsForSubscriber, formatDay, formatPrice } from "@/lib/digest";
import { formatTo12Hour } from "@/lib/utils";
import { getLocationMeta } from "@/constants/location-meta";
import {
  deleteStalePendingSubscribers,
  getConfirmedSubscribers,
  markDigestSent,
} from "@/lib/digest-subscribers";
import { sendWeeklyDigests, type WeeklyDigestGroup } from "@/lib/email/emailService";
import type { DigestEmailEvent } from "@/lib/email/templates/WeeklyDigestEmail";
import { Event } from "@/lib/validations/event";
import { UTM, withUtm } from "@/lib/utm";

// Runs Mondays at 06:00 UTC (07:00 WAT); see vercel.json.
export const maxDuration = 60;

const MAX_EVENTS_PER_EMAIL = 10;

function toEmailEvent(event: Event, siteUrl: string): DigestEmailEvent {
  const end = event.end_date?.slice(0, 10);
  const days =
    end && end !== event.start_date.slice(0, 10)
      ? `${formatDay(event.start_date)} – ${formatDay(end)}`
      : formatDay(event.start_date);
  return {
    title: event.title,
    url: withUtm(`${siteUrl}/events/${event.slug}`, UTM.weeklyEmail),
    when: event.time ? `${days} · ${formatTo12Hour(event.time)}` : days,
    where: event.type === "Online" ? "Online" : event.city || event.location,
    price: formatPrice(event),
  };
}

export async function GET(req: Request) {
  // SECURITY: Verify cron secret to prevent unauthorized access
  if (req.headers.get("authorization") !== `Bearer ${config.security.cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";
  const from = todayInLagos();
  const to = addDays(from, 6);

  const deletedPending = await deleteStalePendingSubscribers();

  const { data, error } = await createPublicClient()
    .from("public_events")
    .select("*")
    .lte("start_date", to);
  if (error) {
    console.error("[send-digest] Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
  const events = (data ?? []) as Event[];

  // Group subscribers who get the same email (same state + online choice).
  const groups = new Map<string, WeeklyDigestGroup>();
  const emptyKeys = new Set<string>();
  let skippedNoEvents = 0;

  for (const sub of await getConfirmedSubscribers()) {
    const key = `${sub.state}:${sub.include_online}`;
    let group = groups.get(key);

    if (!group && emptyKeys.has(key)) {
      skippedNoEvents++;
      continue;
    }

    if (!group) {
      const matching = eventsForSubscriber(events, sub.state, sub.include_online, from, to);
      if (matching.length === 0) {
        emptyKeys.add(key);
        skippedNoEvents++;
        continue; // nothing this week: don't send an empty email
      }
      const meta = getLocationMeta(sub.state);
      group = {
        stateLabel: meta?.label ?? sub.state,
        weekLabel: `${formatDay(from)} – ${formatDay(to)}`,
        events: matching.slice(0, MAX_EVENTS_PER_EMAIL).map((e) => toEmailEvent(e, siteUrl)),
        moreCount: Math.max(0, matching.length - MAX_EVENTS_PER_EMAIL),
        browseUrl: withUtm(meta ? `${siteUrl}/location/${meta.slug}` : siteUrl, UTM.weeklyEmail),
        recipients: [],
      };
      groups.set(key, group);
    }

    group.recipients.push({ id: sub.id, email: sub.email, unsubscribeToken: sub.unsubscribe_token });
  }

  const { sentIds, failed } = await sendWeeklyDigests([...groups.values()], siteUrl);
  await markDigestSent(sentIds);

  const summary = { from, to, sent: sentIds.length, failed, skippedNoEvents, deletedPending };
  // warn, not log: production builds strip console.log (see next.config.ts)
  console.warn("[send-digest] summary", summary);
  return NextResponse.json(summary);
}
