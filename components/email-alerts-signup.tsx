"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subscribeToDigestAction } from "@/app/actions/digest/subscribe";

interface EmailAlertsSignupProps {
  /** State options (slug + label), passed from the server. */
  states: { slug: string; label: string }[];
  defaultState?: string;
  heading?: string;
}

export function EmailAlertsSignup({
  states,
  defaultState = "",
  heading = "Get tech events near you, every Monday",
}: EmailAlertsSignupProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState(defaultState);
  const [includeOnline, setIncludeOnline] = useState(true);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!state) return setError("Please choose your state.");
    if (!consent) return setError("Please tick the box to agree.");

    startTransition(async () => {
      const result = await subscribeToDigestAction({
        email,
        state,
        includeOnline,
        consent: true,
        website,
      });
      if (result.success) {
        setDone(result.message ?? "Check your inbox to confirm.");
      } else {
        const fieldError = result.validationErrors
          ? Object.values(result.validationErrors).flat()[0]
          : undefined;
        setError(fieldError ?? result.error ?? "Something went wrong. Please try again.");
      }
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-[#10b981]" />
        <p className="text-sm text-[#4a4a5a]">{done}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-[#0066cc]" />
        <h2 className="text-base font-semibold text-[#1a1b25]">{heading}</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:flex-1"
        />
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="sm:w-48" aria-label="Your state">
            <SelectValue placeholder="Your state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <label className="mt-4 flex items-center gap-2 text-sm text-[#4a4a5a]">
        <Checkbox checked={includeOnline} onCheckedChange={(v) => setIncludeOnline(v === true)} />
        Include online events
      </label>

      <label className="mt-3 flex items-start gap-2 text-sm text-[#4a4a5a]">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <span>
          I agree to receive a weekly email from TechLinkUp with tech events in my state. I can
          unsubscribe at any time. See our{" "}
          <Link href="/privacy-policy" className="text-[#0066cc] hover:underline">
            privacy policy
          </Link>
          .
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isPending} className="mt-4 w-full sm:w-auto">
        {isPending ? "Signing you up…" : "Get weekly events"}
      </Button>
    </form>
  );
}
