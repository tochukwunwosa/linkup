"use client";

import { useState, useEffect } from "react";
import { useEventContext } from "@/context/EventContext";
import { NigerianStatesCombobox } from "@/components/NigerianStatesCombobox";
import { Calendar, ArrowRight, ArrowDownRight, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Hero({ initialTotal = 0 }: { initialTotal?: number }) {
  const { filters, setFilters, totalEventsFound } = useEventContext();
  const [loading, setLoading] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [cityCount, setCityCount] = useState(0);

  const animateValue = (
    start: number,
    end: number,
    duration: number,
    setter: (val: number) => void
  ) => {
    if (end === 0) return;
    const startTime = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setter(Math.floor(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const count = totalEventsFound || initialTotal || 0;
    if (count === 0) return;
    animateValue(0, count, 1800, setEventCount);
    animateValue(0, 15, 1800, setCityCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalEventsFound, initialTotal]);

  const handleStateChange = (value: string) => {
    if (value === filters.location) return;
    setLoading(true);
    setFilters({ location: value });
    setTimeout(() => {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setLoading(false);
    }, 800);
  };

  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative w-full min-h-[92svh] flex flex-col bg-[#070809] overflow-hidden">
      {/* Grain texture */}
      <div className="hero-grain absolute inset-0 z-1 pointer-events-none" aria-hidden="true" />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-2"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,102,204,0.6) 20%, #c9f72f 45%, #c9f72f 55%, rgba(107,70,193,0.6) 80%, transparent 100%)", opacity: 0.55 }}
        aria-hidden="true"
      />

      {/* Blue glow — bottom-left */}
      <div className="absolute -bottom-20 -left-40 w-150 h-125 pointer-events-none z-1"
        style={{background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,102,204,0.16) 0%, transparent 100%)"}}
        aria-hidden="true" />
      {/* Purple glow — upper-center */}
      <div className="absolute top-10 left-[30%] w-125 h-100 pointer-events-none z-1"
        style={{background:"radial-gradient(ellipse 50% 60% at 50% 50%, rgba(107,70,193,0.12) 0%, transparent 100%)"}}
        aria-hidden="true" />

      {/* Decorative concentric rings — top-right */}
      <div className="absolute -top-56 -right-56 pointer-events-none z-1" aria-hidden="true">
        <div className="w-150 h-150 rounded-full border border-[#c9f72f]/6" />
        <div className="absolute inset-15 rounded-full border border-[#c9f72f]/8" />
        <div className="absolute inset-30 rounded-full border border-[#c9f72f]/6" />
        <div className="absolute inset-45 rounded-full border border-[#c9f72f]/5" />
        <div className="absolute inset-[60 rounded-full border border-[#c9f72f]/8 bg-[#c9f72f]/2" />
      </div>

      {/* Faint bottom gradient fade into filters */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-2"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(7,8,9,0.8))" }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-16 pb-10 lg:pt-24 lg:pb-12 flex-1 flex flex-col">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          {/* ── Left column ── */}
          <div className="min-w-0 space-y-8 lg:space-y-10">

            {/* Platform badge */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#c9f72f]/25 animate-hero-in"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9f72f] animate-pulse shrink-0" />
              <span className="text-[#c9f72f] text-[11px] font-mono uppercase tracking-[0.15em]">
                Community-Driven Platform
              </span>
            </div>

            {/* Main heading */}
            <div
              className="animate-hero-in"
              style={{ animationDelay: "80ms" }}
            >
              <h1
                className="font-display leading-[0.9] tracking-tighter text-white"
                style={{ fontSize: "clamp(1.8rem, 9vw, 4.8rem)", fontWeight: 800 }}
              >
                Discover
                <br />
                <em
                  className="not-italic"
                  style={{
                    background: "linear-gradient(135deg, #c9f72f 0%, #a8e000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >Tech Events</em>
                <br />
                <span className="text-white/40">in Nigeria</span>
              </h1>
            </div>

            {/* Subheading */}
            <p
              className={cn(
                "text-[#8a8a96] text-base sm:text-lg leading-relaxed animate-hero-in"
              )}
              style={{ animationDelay: "160ms" }}
            >
              Conferences, meetups, and workshops across Nigeria — curated
              by the community, for the community.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row sm:flex-wrap gap-3 animate-hero-in"
              style={{ animationDelay: "240ms" }}
            >
              <button
                onClick={scrollToEvents}
                className="sm:inline-flex flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm text-[#070809] bg-[#c9f72f] hover:bg-[#dbff45] active:scale-95 transition-all duration-150 cursor-pointer"
              >
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link href="/submit-event" prefetch={false} className="sm:inline-flex flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white/75 border border-white/12 hover:bg-white/5 hover:border-white/25 hover:text-white active:scale-95 transition-all duration-150">
                  <Calendar className="h-4 w-4" />
                  Submit an Event
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="flex items-stretch gap-0 pt-2 animate-hero-in"
              style={{ animationDelay: "320ms" }}
            >
              <div className="pr-5 sm:pr-8">
                <div
                  className="font-display font-extrabold leading-none tracking-tighter tabular-nums text-white"
                  style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
                >
                  {eventCount > 0 ? `${eventCount}+` : (
                    <span className="opacity-20">—</span>
                  )}
                </div>
                <div className="text-accent text-[10px] font-mono uppercase tracking-[0.12em] mt-1.5">
                  Active Events
                </div>
              </div>

              <div className="w-px bg-white/8 self-stretch" />

              <div className="px-5 sm:px-8">
                <div
                  className="font-display font-extrabold leading-none tracking-tighter tabular-nums text-white"
                  style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
                >
                  {cityCount > 0 ? `${cityCount}+` : (
                    <span className="opacity-20">—</span>
                  )}
                </div>
                <div className="text-accent text-[10px] font-mono uppercase tracking-[0.12em] mt-1.5">
                  Cities
                </div>
              </div>

              <div className="w-px bg-white/8 self-stretch" />

              <div className="pl-5 sm:pl-8">
                <div
                  className="font-display font-extrabold leading-none tracking-tighter"
                  style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)", color: "#c9f72f" }}
                >
                  Free
                </div>
                <div className="text-accent text-[10px] font-mono uppercase tracking-[0.12em] mt-1.5">
                  Always
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column: Filter card ── */}
          <div
            className="lg:pt-6 animate-hero-in"
            style={{ animationDelay: "180ms" }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(201,247,47,0.06)]">
              {/* Card background: event photo + dark overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/assets/images/wceu.webp"
                  alt=""
                  fill
                  priority
                  quality={50}
                  sizes="400px"
                  className="object-cover object-center"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(160deg, rgba(7,8,9,0.92) 0%, rgba(7,8,9,0.82) 50%, rgba(7,8,9,0.96) 100%)" }}
                />
              </div>

              {/* Card content */}
              <div className="relative z-10 p-6 space-y-4">
                {/* Card header */}
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: "#c9f72f" }} />
                  <span className="text-white/80 text-sm font-medium">Find events near you</span>
                </div>

                <NigerianStatesCombobox
                  value={filters.location}
                  onValueChange={handleStateChange}
                  loading={loading}
                  className="w-full"
                />

                <button
                  onClick={scrollToEvents}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm text-[#070809] bg-[#c9f72f] hover:bg-[#dbff45] active:scale-[0.98] transition-all duration-150"
                >
                  Show Events
                  <ArrowDownRight className="h-4 w-4" />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-white/[0.07]" />
                  <span className="text-white/25 text-[10px] font-mono uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-white/[0.07]" />
                </div>

                <Link
                  href="/my-submissions"
                  className="block w-full text-center text-accent text-xs hover:text-white/50 transition-colors py-1"
                >
                  Track my submissions →
                </Link>
              </div>

              {/* Bottom accent bar */}
              <div
                className="h-0.5 w-full"
                style={{ background: "linear-gradient(90deg, transparent, #c9f72f 40%, #c9f72f 60%, transparent)" }}
              />
            </div>

            {/* Wordmark below card */}
            <div className="mt-5 hidden lg:flex items-center gap-3">
              <div className="flex-1 h-px bg-[#141418]" />
              <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">TECHLINKUP.XYZ</span>
              <div className="flex-1 h-px bg-[#141418]" />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="mt-auto pt-10 pb-2 flex items-center gap-3 animate-hero-in"
          style={{ animationDelay: "500ms" }}
          aria-hidden="true"
        >
          <div className="w-8 h-px bg-white/15" />
          <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.18em]">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
