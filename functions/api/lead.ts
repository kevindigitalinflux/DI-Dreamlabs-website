/**
 * Cloudflare Pages Function — lead capture endpoint (Brief §10).
 * POST /api/lead with JSON { name, email, company?, industry?, source, payload?, website? }
 *
 * Protections: method check, payload validation, honeypot field ("website"),
 * naive per-IP rate limiting, CORS restricted to known origins. Writes to the
 * Supabase `leads` table via the REST API using the service-role key
 * (server-side only — never exposed to the client). If credentials are not
 * configured yet, the lead is acknowledged with 202 so the UI keeps working.
 */

type Env = {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

/** Minimal local Pages Function signature — avoids pulling Cloudflare's
 *  global worker types into the DOM-typed app tsconfig. */
type PagesFunction<E = unknown> = (context: {
  request: Request
  env: E
}) => Promise<Response> | Response

type LeadBody = {
  name?: unknown
  email?: unknown
  phone?: unknown
  company?: unknown
  industry?: unknown
  source?: unknown
  payload?: unknown
  website?: unknown // honeypot — humans never see or fill this field
}

const ALLOWED_ORIGINS = ['https://didreamlabs.com', 'https://www.didreamlabs.com']
const ALLOWED_SOURCES = ['calculator', 'contact', 'newsletter'] as const
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Naive in-memory rate limit — best effort per isolate (1 req / 10s / IP). */
const recentRequests = new Map<string, number>()
const isRateLimited = (ip: string): boolean => {
  const now = Date.now()
  // Opportunistic cleanup to keep the map bounded.
  if (recentRequests.size > 1000) {
    for (const [key, at] of recentRequests) if (now - at > 60_000) recentRequests.delete(key)
  }
  const last = recentRequests.get(ip)
  recentRequests.set(ip, now)
  return last !== undefined && now - last < 10_000
}

const corsHeaders = (origin: string | null): Record<string, string> => {
  const allowed =
    origin && (ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost'))
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0]!,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
}

const json = (status: number, body: object, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) })

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) })

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin')
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'

  if (isRateLimited(ip)) {
    return json(429, { error: 'Too many requests — please try again shortly.' }, origin)
  }

  let body: LeadBody
  try {
    body = (await request.json()) as LeadBody
  } catch {
    return json(400, { error: 'Invalid JSON body.' }, origin)
  }

  // Honeypot: bots fill every field. Pretend success, store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(200, { ok: true }, origin)
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : null
  const company = typeof body.company === 'string' ? body.company.trim().slice(0, 200) : null
  const industry = typeof body.industry === 'string' ? body.industry.trim().slice(0, 60) : null
  const source = typeof body.source === 'string' ? body.source : ''

  if (name.length < 2 || name.length > 120) {
    return json(400, { error: 'Please enter your name.' }, origin)
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(400, { error: 'Please enter a valid email address.' }, origin)
  }
  if (!ALLOWED_SOURCES.includes(source as (typeof ALLOWED_SOURCES)[number])) {
    return json(400, { error: 'Invalid source.' }, origin)
  }
  const payload =
    body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
      ? body.payload
      : null

  // Credentials not configured yet — acknowledge without storing (spec §7).
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Lead received but Supabase credentials are not configured.')
    return json(202, { ok: true, queued: false }, origin)
  }

  const insert = await fetch(`${env.SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ name, email, phone, company, industry, source, payload }),
  })

  if (!insert.ok) {
    console.error('Supabase insert failed', insert.status, await insert.text())
    return json(502, { error: 'Something went wrong saving your details — please try again.' }, origin)
  }

  return json(200, { ok: true }, origin)
}
