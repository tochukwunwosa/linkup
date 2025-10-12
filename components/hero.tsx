"use client";

import { useState } from "react";
import { useEventContext } from "@/context/EventContext";
import { NigerianStatesCombobox } from "@/components/NigerianStatesCombobox";

export default function Hero() {
  const { filters, setFilters } = useEventContext();
  const [loading, setLoading] = useState(false);

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

  return (
    <section className="relative w-full h-[500px] flex items-center justify-center text-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/images/wceu.jpeg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-white">
          Discover Tech Events Across Nigeria
        </h1>

        <p className="text-lg text-gray-200 mb-8">
          Connect, learn, and grow with other innovators in your city.
        </p>

        <div className="flex justify-center">
          <NigerianStatesCombobox
            className="max-w-[400px]"
            value={filters.location}
            onValueChange={handleStateChange}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}
