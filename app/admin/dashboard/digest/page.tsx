import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DigestBuilder } from "@/components/dashboard/digest-builder"
import { createPublicClient } from "@/lib/supabase/public"
import { addDays } from "@/lib/digest"
import { todayInLagos } from "@/lib/date-utils"
import { Event } from "@/lib/validations/event"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz"

export default async function DigestPage() {
  // The next 7 days, starting today in WAT.
  const from = todayInLagos()
  const to = addDays(from, 6)

  // public_events only holds published, not-yet-ended events.
  const { data, error } = await createPublicClient()
    .from("public_events")
    .select("*")
    .lte("start_date", to)
    .order("start_date", { ascending: true })

  if (error) console.error("[digest] Error fetching events:", error)

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Weekly digest"
        description="Copy-ready WhatsApp Channel post for the next 7 days."
      />
      <DigestBuilder events={(data ?? []) as Event[]} from={from} to={to} siteUrl={siteUrl} />
    </div>
  )
}
