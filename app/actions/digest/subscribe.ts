"use server";

import { z } from "zod";
import { after } from "next/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { getLocationMeta } from "@/constants/location-meta";
import { requestDigestSubscription } from "@/lib/digest-subscribers";
import { sendDigestConfirmation } from "@/lib/email/emailService";

const subscribeSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address").max(254),
  state: z.string().refine((s) => !!getLocationMeta(s), "Please choose your state"),
  includeOnline: z.boolean(),
  consent: z.literal(true, { error: "Please tick the box to agree" }),
  // Honeypot: real people never see or fill this field.
  website: z.string().max(0).optional(),
});

export type SubscribeInput = z.input<typeof subscribeSchema>;

// Same reply whether or not the address is already subscribed, so the form
// can't be used to find out who is on the list.
const CHECK_INBOX =
  "Almost done! Check your inbox for a confirmation email. It may take a few minutes, and might land in spam.";

export async function subscribeToDigestAction(input: SubscribeInput) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const limit = rateLimit(`digest_subscribe:${ip}`, { maxRequests: 5, windowMs: 3600000 });
    if (!limit.success) {
      return { success: false, error: "Too many attempts. Please try again later." };
    }

    const parsed = subscribeSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Please check the form and try again.",
        validationErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { email, state, includeOnline } = parsed.data;
    const token = await requestDigestSubscription(email, state, includeOnline);

    if (token) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techlinkup.xyz";
      const stateLabel = getLocationMeta(state)?.label ?? state;
      // Send after responding; after() keeps the function alive until it's done.
      after(() =>
        sendDigestConfirmation({
          email,
          stateLabel,
          includeOnline,
          confirmUrl: `${siteUrl}/api/digest/confirm?token=${encodeURIComponent(token)}`,
        })
      );
    }

    return { success: true, message: CHECK_INBOX };
  } catch (error) {
    console.error("Error in subscribeToDigestAction:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
