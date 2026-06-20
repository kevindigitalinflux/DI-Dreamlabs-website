# Automations Required — DI Dreamlabs Website

This document tracks every n8n automation the site needs. Add notes here as new triggers or
requirements are identified. Build these workflows in n8n before considering the lead pipeline
production-ready.

---

## WF-LEAD-NOTIFY — New Lead Email Notification

**Trigger:** Supabase insert on the `leads` table (or direct webhook from `POST /api/lead`).

**What it does:**
- Sends an email to `kevindigitalinflux@gmail.com` immediately on every new lead submission.

**Email should include:**
- Name
- Work email
- Industry (if submitted via the bottleneck calculator)
- Source (`calculator` | `contact_form`)
- Submission timestamp (formatted UK time)
- Any additional payload (bottleneck selected, team size, etc. from the calculator)

**n8n node sequence:**
1. Supabase trigger (or Webhook node for direct POST)
2. Set node — format the email body
3. Send Email node (Gmail / SMTP) → `kevindigitalinflux@gmail.com`

---

## WF-LEAD-SHEET — Append to Magnet Spreadsheet

**Trigger:** Same trigger as WF-LEAD-NOTIFY (chain from same workflow or separate).

**What it does:**
- Appends one row to a Google Sheet ("Lead Magnet Spreadsheet") for every new submission.
- Kevin uses this to track and manually follow up with leads.

**Columns to write:**
| Column | Value |
|--------|-------|
| Name | `leads.name` |
| Work Email | `leads.email` |
| Industry | `leads.industry` |
| Source | `leads.source` |
| Date Submitted | `leads.created_at` (formatted: DD/MM/YYYY HH:mm) |
| Status | `New` (default — Kevin updates manually) |
| Notes | (blank — Kevin fills in after follow-up) |

**n8n node sequence:**
1. (Shared trigger with WF-LEAD-NOTIFY)
2. Google Sheets node → Append Row → target sheet + tab

**Setup needed:**
- Create the Google Sheet, name the tab (e.g. "Leads")
- Connect Google Sheets credentials in n8n
- Paste the Sheet ID into the node config

---

## WF-LEAD-FOLLOWUP — Automated Weekly Follow-Up Email Sequence

**Trigger:** Schedule node (weekly) — checks `leads` table for leads that have not yet booked
an audit and are within the follow-up window.

**What it does:**
- Sends a follow-up email to each lead who submitted but has not yet booked, on a weekly cadence
  until they book or are marked as closed.
- Cadence: Day 7 → Day 14 → Day 21 → stop (3 touches max unless Kevin extends).

**Logic:**
- Query `leads` where `status = 'new'` and `created_at` is 7 / 14 / 21 days ago.
- Send the appropriate follow-up email (tone softens each week).
- If a lead books via Cal.com, update `leads.status = 'booked'` so the sequence stops.

**Follow-up email copy (draft — Kevin to approve before activating):**

*Week 1 (day 7):*
> Subject: Still thinking it over? Your free audit is waiting.
> Body: Quick reminder — the bottleneck check you ran last week put a number on what your
> biggest operational gap is costing you. The free audit replaces that estimate with your real
> numbers. No pitch, no invoice. [Book here → link]

*Week 2 (day 14):*
> Subject: One question
> Body: Is there anything holding you back from booking the audit? Reply to this email and I'll
> answer personally. — Kevin

*Week 3 (day 21):*
> Subject: Last nudge from me
> Body: I won't keep filling your inbox. If the timing isn't right, no problem at all — just
> reply "not now" and I'll make a note. The audit link stays open whenever you're ready. [link]

**n8n node sequence:**
1. Schedule trigger (daily, early morning — check all three windows at once)
2. Supabase node → SELECT leads WHERE status = 'new' AND created_at BETWEEN (now-22d, now-6d)
3. IF node — split by days-since-submission into week 1 / 2 / 3 buckets
4. Send Email node for each bucket
5. (Optional) Supabase node → UPDATE leads SET status = 'sequence_complete' after week 3

**Dependencies:**
- `leads.status` column must support values: `new`, `booked`, `sequence_complete`, `closed`
  (check `docs/supabase-leads.sql` — add enum values if needed)
- Cal.com webhook → n8n to mark leads as `booked` when they schedule

---

## WF-CAL-BOOKED — Cal.com Booking → Mark Lead as Booked

**Trigger:** Cal.com webhook on `BOOKING_CREATED`.

**What it does:**
- Matches the booking email to a row in `leads` and updates `status = 'booked'`.
- Sends Kevin a notification: who booked, when, and their original lead source.

**n8n node sequence:**
1. Webhook node (Cal.com → n8n URL)
2. Supabase node → UPDATE leads SET status = 'booked' WHERE email = booking.email
3. Send Email node → Kevin notification

---

## Notes

- All automations should log errors to a dedicated n8n execution log — don't fail silently.
- Rate limit: do not send more than one email per 7-day window to any single lead address.
- GDPR: include an unsubscribe line in every automated email. Update `leads.status = 'unsubscribed'`
  if the recipient clicks it (requires a simple unsubscribe endpoint or n8n webhook).
- Test each workflow with a real submission before activating on production leads.
