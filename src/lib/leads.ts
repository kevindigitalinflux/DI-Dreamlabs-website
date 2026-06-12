/** Client for the lead-capture endpoint (functions/api/lead.ts). */

export type LeadSource = 'calculator' | 'contact' | 'newsletter'

export type LeadSubmission = {
  name: string
  email: string
  company?: string
  industry?: string
  source: LeadSource
  /** Extra context, e.g. calculator answers. Stored as JSON. */
  payload?: Record<string, unknown>
  /** Honeypot — must stay empty; bots fill it. */
  website?: string
}

export type LeadResult = { ok: true } | { ok: false; error: string }

/** Submits a lead. Resolves to a result object — never throws. */
export const submitLead = async (lead: LeadSubmission): Promise<LeadResult> => {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (response.ok || response.status === 202) return { ok: true }
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    return { ok: false, error: data?.error ?? 'Something went wrong — please try again.' }
  } catch {
    return { ok: false, error: 'Could not reach the server — check your connection and try again.' }
  }
}
