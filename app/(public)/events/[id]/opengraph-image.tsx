import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { getCategoryColors } from "@/lib/category-color";
import { formatDateRange } from "@/lib/utils";
import { Event } from "@/lib/validations/event";

export const runtime = "edge";
export const alt = "TechLinkUp Event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("public_events")
    .select("*")
    .eq("id", id)
    .single<Event>();

  if (!event) {
    // Fallback for missing events
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0066cc",
          color: "white",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        TechLinkUp
      </div>,
      { ...size }
    );
  }

  const colors = getCategoryColors(event.category ?? []);
  const dateStr = formatDateRange(event.start_date, event.end_date ?? undefined);
  const location = event.city || event.location || "Nigeria";
  const primaryCategory = event.category?.[0] ?? "Tech";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${colors.solid} 0%, ${colors.light} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle top-right */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      {/* Decorative circle bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top: brand + category */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.3px",
            }}
          >
            TechLinkUp
          </div>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
            }}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.18)",
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            {primaryCategory}
          </div>
        </div>

        {/* Middle: event title */}
        <div
          style={{
            fontSize: event.title.length > 60 ? 44 : event.title.length > 40 ? 52 : 60,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            letterSpacing: "-1px",
            maxWidth: "90%",
          }}
        >
          {event.title}
        </div>

        {/* Bottom: date + location pill */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,0,0,0.25)",
              padding: "10px 20px",
              borderRadius: 999,
              color: "white",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {dateStr}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,0,0,0.25)",
              padding: "10px 20px",
              borderRadius: 999,
              color: "white",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {location}
          </div>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
