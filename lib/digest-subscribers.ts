import { createHash, randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// Weekly email alerts: subscriber storage. Server-only; uses the service role
// because digest_subscribers has no anon access at all (personal data).

export const DIGEST_CONSENT_TEXT =
  "I agree to receive a weekly email from TechLinkUp with tech events in my state. I can unsubscribe at any time.";

const CONFIRM_TTL_MS = 7 * 24 * 60 * 60 * 1000; // confirm link valid for 7 days
const RESEND_COOLDOWN_MS = 10 * 60 * 1000; // at most one confirm email per 10 min per address

const newToken = () => randomBytes(32).toString("base64url");
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * Records a sign-up (or a change of state for an existing subscriber) as
 * pending. Returns the raw confirm token to email, or null if a confirm
 * email was sent to this address very recently.
 */
export async function requestDigestSubscription(
  email: string,
  state: string,
  includeOnline: boolean
): Promise<string | null> {
  const supabase = createAdminClient();
  const normalisedEmail = email.trim().toLowerCase();
  const token = newToken();
  const now = new Date();

  const pending = {
    pending_state: state,
    pending_include_online: includeOnline,
    confirm_token_hash: hashToken(token),
    confirm_expires_at: new Date(now.getTime() + CONFIRM_TTL_MS).toISOString(),
    consent_text: DIGEST_CONSENT_TEXT,
    consent_at: now.toISOString(),
  };

  const { data: existing, error: lookupError } = await supabase
    .from("digest_subscribers")
    .select("id, consent_at")
    .eq("email", normalisedEmail)
    .maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    // Stops the form being used to flood someone's inbox.
    if (now.getTime() - new Date(existing.consent_at).getTime() < RESEND_COOLDOWN_MS) {
      return null;
    }
    const { error } = await supabase.from("digest_subscribers").update(pending).eq("id", existing.id);
    if (error) throw error;
    return token;
  }

  const { error } = await supabase.from("digest_subscribers").insert({
    email: normalisedEmail,
    unsubscribe_token: newToken(),
    ...pending,
  });
  if (error) throw error;
  return token;
}

/** Applies the pending preferences for a confirm token. */
export async function confirmDigestSubscription(token: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { data: subscriber } = await supabase
    .from("digest_subscribers")
    .select("id, pending_state, pending_include_online")
    .eq("confirm_token_hash", hashToken(token))
    .gt("confirm_expires_at", new Date().toISOString())
    .maybeSingle();

  if (!subscriber?.pending_state) return false;

  const { error } = await supabase
    .from("digest_subscribers")
    .update({
      state: subscriber.pending_state,
      include_online: subscriber.pending_include_online ?? true,
      pending_state: null,
      pending_include_online: null,
      confirm_token_hash: null,
      confirm_expires_at: null,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", subscriber.id);

  return !error;
}

/** Deletes the subscriber outright (we keep nothing after unsubscribe). */
export async function unsubscribeFromDigest(token: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("digest_subscribers")
    .delete()
    .eq("unsubscribe_token", token)
    .select("id");
  return !error && (data?.length ?? 0) > 0;
}

/** Removes sign-ups that were never confirmed within 7 days. */
export async function deleteStalePendingSubscribers(): Promise<number> {
  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - CONFIRM_TTL_MS).toISOString();
  const { data, error } = await supabase
    .from("digest_subscribers")
    .delete()
    .eq("status", "pending")
    .lt("created_at", cutoff)
    .select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

export interface ConfirmedSubscriber {
  id: string;
  email: string;
  state: string;
  include_online: boolean;
  unsubscribe_token: string;
}

/** All confirmed subscribers, paged past Supabase's 1,000-row limit. */
export async function getConfirmedSubscribers(): Promise<ConfirmedSubscriber[]> {
  const supabase = createAdminClient();
  const pageSize = 1000;
  const all: ConfirmedSubscriber[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("digest_subscribers")
      .select("id, email, state, include_online, unsubscribe_token")
      .eq("status", "confirmed")
      .order("created_at", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw error;
    all.push(...((data ?? []) as ConfirmedSubscriber[]));
    if (!data || data.length < pageSize) return all;
  }
}

export async function markDigestSent(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("digest_subscribers")
    .update({ last_sent_at: new Date().toISOString() })
    .in("id", ids);
  if (error) throw error;
}
