"use client";

import { useState, useEffect } from "react";
import { useEventContext } from "@/context/EventContext";
import { NigerianStatesCombobox } from "@/components/NigerianStatesCombobox";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const { filters, setFilters, totalEventsFound } = useEventContext();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    events: 0,
    cities: 0,
    community: 0,
  });

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (
      start: number,
      end: number,
      duration: number,
      setter: (val: number) => void
    ) => {
      const startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        setter(current);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Use actual total from context, fallback to 50+ if none
    const eventCount = totalEventsFound || 0;
    animateValue(0, eventCount, 1500, (val) =>
      setStats((prev) => ({ ...prev, events: val }))
    );
    animateValue(0, 15, 1500, (val) =>
      setStats((prev) => ({ ...prev, cities: val }))
    );
    animateValue(0, 1000, 2000, (val) =>
      setStats((prev) => ({ ...prev, community: val }))
    );
  }, [totalEventsFound]);

  const handleStateChange = (value: string) => {
    setLoading(true);
    setFilters({ location: value });

    setTimeout(() => {
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setLoading(false);
    }, 800);
  };

  const scrollToEvents = () => {
    const eventsSection = document.getElementById("events");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center text-center overflow-hidden bg-white">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/images/wceu.jpeg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm mb-6 animate-fade-in">
          <span className="font-medium">Community-Driven Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-white animate-fade-in-up">
          Discover Tech Events
          <br />
          Built by the Community
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
          Join thousands of tech enthusiasts discovering conferences, meetups,
          and workshops across Nigeria.
        </p>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 animate-fade-in-up delay-300">
          <NigerianStatesCombobox
            className="w-full sm:w-auto sm:min-w-[300px]"
            value={filters.location}
            onValueChange={handleStateChange}
            loading={loading}
          />
          <Button
            onClick={scrollToEvents}
            size="lg"
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8"
          >
            Browse Events
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-400">
          <Link href="/submit-event">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-primary hover:bg-white/10 hover:text-white backdrop-blur-sm font-medium"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Submit Your Event
            </Button>
          </Link>
          <Link href="/my-submissions">
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-white hover:bg-white/10 hover:text-muted font-medium"
            >
              Track My Submissions
            </Button>
          </Link>
        </div>

        {/* Stats - Simple animated numbers */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-white animate-fade-in-up delay-500">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold mb-1">
              {stats.events}{stats.events > 0 ? '+' : ""}
            </div>
            <div className="text-sm text-gray-300">Active Events</div>
          </div>

          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold mb-1">
              {stats.cities}+
            </div>
            <div className="text-sm text-gray-300">Cities</div>
          </div>
        </div>
      </div>
    </section>
  );
}
