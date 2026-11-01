"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  DIGEST_AREAS,
  DIGEST_MAX_EVENTS,
  DigestArea,
  buildWhatsAppDigest,
  filterDigestEvents,
} from "@/lib/digest"
import { Event } from "@/lib/validations/event"

interface DigestBuilderProps {
  events: Event[]
  from: string
  to: string
  siteUrl: string
}

export function DigestBuilder({ events, from, to, siteUrl }: DigestBuilderProps) {
  const [area, setArea] = useState<DigestArea>("lagos")

  const matching = useMemo(
    () => filterDigestEvents(events, area, from, to),
    [events, area, from, to]
  )
  const message = useMemo(
    () => buildWhatsAppDigest({ events: matching, area, from, to, siteUrl }),
    [matching, area, from, to, siteUrl]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      toast.success("Copied. Paste it into your WhatsApp Channel.")
    } catch {
      toast.error("Could not copy. Select the text and copy it manually.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Channel post</CardTitle>
        <CardDescription>
          {matching.length} event{matching.length === 1 ? "" : "s"} this week
          {matching.length > DIGEST_MAX_EVENTS &&
            ` (first ${DIGEST_MAX_EVENTS} shown, the rest behind a link)`}
          . Check it reads well before posting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={area} onValueChange={(value) => setArea(value as DigestArea)}>
          <TabsList>
            {DIGEST_AREAS.map((a) => (
              <TabsTrigger key={a.value} value={a.value}>
                {a.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Textarea
          readOnly
          value={message}
          className="min-h-[420px] font-mono text-sm"
          aria-label="WhatsApp digest message"
        />

        <Button onClick={handleCopy}>
          <Copy className="h-4 w-4" />
          Copy message
        </Button>
      </CardContent>
    </Card>
  )
}
