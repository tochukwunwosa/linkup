# Event Services directory — plan

Status: planned (v1 not started). Agreed 2026-11-01.

## What it is (v1)

A directory of businesses that hire out equipment and services for tech
events. Organisers browse by service and state, then contact the vendor
directly on WhatsApp. **TechLinkUp does not handle bookings or payments in v1.**

Decisions:

- Name: **Event Services**
- Launch states: **Lagos and Abuja** (other states later)
- Free for vendors in v1; consider paid featured spots once there is click data

## Categories

Kept in `constants/` like `category-meta.ts` and `location-meta.ts`.

| Tech-specific | General |
|---|---|
| Internet & Starlink hire | Sound & PA |
| Power backup (inverters, generators) | Projectors & screens |
| Live streaming & recording | Furniture, canopies & tents |
| Hybrid event setup | Photography & video |
| Laptops & devices for hackathons | Printing & branding |

Venues and catering are out of scope for v1.

## Data model

`vendors` table:

| Column | Notes |
|---|---|
| `id`, `slug`, `tracking_id` | Same pattern as `event_submissions` |
| `business_name`, `description`, `logo_url`, `photos[]` | Images on Cloudinary |
| `categories[]` | From the constants file |
| `states[]` | Service areas, `location-meta` slugs |
| `whatsapp`, `website`, `instagram` | Public |
| `contact_name`, `contact_email` | **Private**: review and account emails only |
| `price_note` | Vendor's own free text, e.g. "From ₦50,000/day"; labelled as the vendor's pricing, not verified |
| `status` | `pending` / `approved` / `rejected` / `suspended` |
| `verified`, `consent_at`, `created_at`, `updated_at` | |

Access (same model as `submit_event_submission`):

- No direct anon access to `vendors`.
- Public reads through a `public_vendors` view: approved only, public columns only.
- Sign-ups through a `submit_vendor()` security-definer function that can only
  insert a `pending` row.

## Pages

| Route | Purpose |
|---|---|
| `/vendors` | Hub: category grid, state filter, "List your business" |
| `/vendors/[category]/[state]` | SEO landing pages ("Starlink hire in Lagos"). Static + hourly revalidate, like `/location/[state]`. `noindex` when there are no vendors. |
| `/vendors/v/[slug]` | Profile: photos, description, areas served, "Chat on WhatsApp" |
| `/vendors/join` | Sign-up: zod validation, rate limit, tracking ID, confirmation email |
| `/admin/dashboard/vendors` | Review queue: approve / reject / suspend (reuse the submissions table UI) |

WhatsApp button: `wa.me` link with a prefilled message, e.g. "Hi, I found you
on TechLinkUp. I'd like to ask about hiring [service] for an event on [date]."

Cross-linking: "Need equipment for your event?" on the event-submitted page and
in the organiser confirmation email; footer and main navigation.

## Measuring

- WhatsApp / website / phone clicks as **Umami custom events** (no new table,
  no personal data about visitors).
- Key number: WhatsApp clicks per vendor per month.

## Trust and safety

- Manual review of every vendor before it goes live.
- "Report this vendor" link on each profile (emails admins).
- No reviews or ratings in v1.
- "Verified" badge only after a check (e.g. CAC registration or a past job).
- Terms of use: vendors are independent; TechLinkUp is not part of bookings or
  payments. **Needs a lawyer to review the wording.**

## Data protection (NDPA)

Many vendors are sole traders, so names and phone numbers are personal data.

- Consent checkbox on sign-up stating what will be published; link to the
  privacy policy.
- Contact name and email stay private.
- Easy removal: link in vendor emails, or by email request.
- Update the privacy policy before launch.

## Launch

1. Seed 20–30 vendors in Lagos and Abuja before going public.
2. Soft launch: link from submission confirmations; announce to organisers.
3. Review after 6–8 weeks using clicks per vendor; decide on phase 2.

## Phase 2 (only if v1 gets traction)

- Paid featured spots per category and state (price from click data).
- Vendor self-editing via emailed login links (no passwords).
- "Ask several vendors": one request sent to matching vendors (needs more
  data-protection and terms work).

## Rough effort (v1)

About 1.5–2 weeks (estimate, not a commitment):

- Database and access rules: 1–2 days
- Sign-up and admin review: 2–3 days
- Public and SEO pages: 3–4 days
- Emails, tracking, polish: 2 days
