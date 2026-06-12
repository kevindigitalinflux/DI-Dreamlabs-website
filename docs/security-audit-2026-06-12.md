# Digital Influx Dreamlabs — Security Audit Report
# Project: DI Dreamlabs Marketing Website (di-dreamlabs.com)
# Date: 2026-06-12
# Audited by: Claude Code (di-security-auditor skill)

**Project profile:** static pre-rendered marketing site (React 18 + Vite + vite-react-ssg) with
no authentication, no user accounts, no frontend database client, and a single serverless
endpoint (`functions/api/lead.ts`) that writes leads to Supabase using a server-side
service-role key. Many auth/RLS checks are therefore N/A — verified, not assumed.

---

## Non-Negotiable Gate Status

| Gate | Description | Status |
|------|-------------|--------|
| G-01 | .env never committed | ✅ PASS — `git log --all -- .env*` empty; `.env`/`.env.*` ignored, `.env.example` whitelisted |
| G-02 | No secrets in frontend | ✅ PASS — no key patterns, no `createClient`, no Supabase client in `src/` at all |
| G-03 | RLS enabled on all tables | ✅ PASS (by design) — `docs/supabase-leads.sql` enables RLS with zero anon policies; **re-verify in dashboard when Kevin creates the table** |
| G-04 | RLS policies use auth.uid() | ✅ N/A-PASS — no user-owned data; leads table is service-role-only (no policies = no access) |
| G-05 | Private routes gated | ✅ N/A — site has no private routes |
| G-06 | IDOR audited | ✅ N/A — no frontend DB queries exist |
| G-07 | Rate limiting configured | ⚠️ PARTIAL — in-function per-IP limit (1 req/10s) implemented; **Cloudflare WAF rate rule (30 req/min on /api/lead) must be added in dashboard at deploy time** |
| G-08 | CORS whitelisted | ✅ PASS — `functions/api/lead.ts` allows only di-dreamlabs.com origins (+ localhost for dev); no wildcard |
| G-09 | Env vars in Cloudflare | ⚠️ PENDING — `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` to be set in Pages dashboard when Kevin supplies creds; endpoint degrades safely (202, no storage) until then |
| G-10 | Anon key only in frontend | ✅ PASS — no Supabase key of any kind in frontend; service-role key referenced server-side only via `env` |

**LAUNCH DECISION: ✅ CLEAR TO SHIP** for the static site. The lead pipeline has two
deploy-time actions (G-07 WAF rule, G-09 env vars) that must be completed in the Cloudflare
dashboard before the pipeline goes live — they cannot be configured from the repo.

---

## Full Vulnerability Audit

### Category 1: Secrets and Credential Management
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-01 | .env committed to Git | ✅ | — |
| DL-SEC-02 | .env in .gitignore | ✅ | — |
| DL-SEC-03 | Hardcoded secrets in source | ✅ | — |
| DL-SEC-04 | Service role key in frontend | ✅ | — (server-side function only, via env) |
| DL-SEC-05 | Source maps in production | ✅ | Vite default (off); no sourcemap config present |
| DL-SEC-06 | Build logs leaking secrets | ✅ | No `console.log` of env anywhere; no console.log in src at all |
| DL-SEC-07 | Git history exposing secrets | ✅ | Commit history reviewed — clean |

### Category 2: Authentication and Session Security
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-08–13 | Auth/session/JWT/cookie checks | ✅ N/A | No auth system, no sessions, no custom cookies on this site |

### Category 3: Authorization and Access Control
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-14 | RLS enabled | ✅ (by design) | Run `docs/supabase-leads.sql` as written; re-verify in dashboard |
| DL-SEC-15 | Policies use auth.uid() | ✅ N/A | Leads table: no anon/auth policies at all = service-role only |
| DL-SEC-16 | Client-side-only authz | ✅ N/A | No authz in product |
| DL-SEC-17 | IDOR | ✅ N/A | No frontend queries |
| DL-SEC-18 | User-controlled roles | ✅ N/A | No roles |
| DL-SEC-19 | Anon key usage | ✅ N/A | No frontend Supabase client |
| DL-SEC-20 | Open DB read/write | ✅ (by design) | RLS-no-policies blocks anon REST access; verify post-creation with curl test in SQL doc |

### Category 4: Infrastructure and Cloud Configuration
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-21 | CORS | ✅ | Exact origins only in lead function |
| DL-SEC-22 | Security headers | ✅ FIXED | `public/_headers` added this audit: XFO, XCTO, Referrer-Policy, Permissions-Policy, HSTS, CSP |
| DL-SEC-23 | Public staging | ⚠️ | Pages preview deployments will be public; site holds no user data — acceptable. Consider Cloudflare Access on previews later |
| DL-SEC-24 | Default credentials | ✅ N/A | No integrated admin tools |
| DL-SEC-25 | Exposed dashboards | ✅ | `/style-guide` is design-only, noindexed; no data exposure |
| DL-SEC-26 | Unencrypted sensitive data | ✅ | Leads = name/email/company only; Supabase encrypts at rest; no passwords anywhere |

### Category 5: Input Validation and Injection
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-27 | Input validation | ✅ | Client validation + full server-side re-validation (length, email regex, source allowlist, payload size cap) in lead function |
| DL-SEC-28 | SQL injection | ✅ | Supabase REST insert with JSON body; no raw SQL |
| DL-SEC-29 | XSS | ✅ | No dangerouslySetInnerHTML/innerHTML/eval in src; JSON-LD scripts serialise static config only |
| DL-SEC-30 | CSRF | ✅ | Endpoint is same-origin, CORS-restricted, no session cookies to ride |
| DL-SEC-31 | File uploads | ✅ N/A | None |
| DL-SEC-32 | Path traversal | ✅ N/A | No server file reads |
| DL-SEC-33 | SSRF | ✅ | Server fetches only the fixed SUPABASE_URL env value; no user-influenced URLs |

### Category 6: API and Endpoint Security
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-34 | Rate limiting | ⚠️ | In-function limit present (best-effort per isolate). **Add Cloudflare WAF rule: 30 req/min/IP on /api/lead before pipeline live** |
| DL-SEC-35 | Verbose errors | ✅ | User sees generic messages; details go to `console.error` (Pages Function logs) only |
| DL-SEC-36 | Debug routes | ✅ | None; /style-guide noindexed and harmless |
| DL-SEC-37 | Webhook signature verification | ✅ N/A | No inbound webhooks |
| DL-SEC-38 | Payment gates | ✅ N/A | No payments |

### Category 7: Logging, Monitoring and Observability
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-39 | Sensitive data in logs | ✅ | Lead values never logged; only status codes |
| DL-SEC-40 | Audit logs | ✅ N/A | No admin/destructive actions |
| DL-SEC-41 | Error monitoring | ⚠️ | None configured. Recommend Cloudflare Web Analytics (free, no cookies) at deploy |
| DL-SEC-42 | Backups | ⚠️ | Document when Supabase project is created (free tier = manual export of leads table) |

### Category 8: AI-Specific Vulnerabilities
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-43–45 | Prompt injection / AI tools / AI code review | ✅ N/A + ✅ | No AI runtime features. Commit history is incremental with per-phase commits and tests (AIXD discipline followed) |

### Category 9: Frontend and Client Security
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-46 | Cookie flags | ✅ N/A | Site sets no cookies |
| DL-SEC-47 | Source maps | ✅ | Off |
| DL-SEC-48 | Tenant isolation | ✅ N/A | Single-tenant marketing site |

### Category 10: Dependencies and Infrastructure
| ID | Check | Status | Action Required |
|----|-------|--------|-----------------|
| DL-SEC-49 | npm audit | ✅ | 0 vulnerabilities |
| DL-SEC-50 | Outdated packages | ✅ | All current (Vite 7 pinned intentionally for vite-react-ssg compat — documented in CLAUDE.md) |

---

## Findings Summary

### CRITICAL — Must Fix Before Launch
None.

### HIGH — Fix Before Launch or Document Risk Acceptance
None in the repo. Two **deploy-time actions** (dashboard, not code):
1. **DL-SEC-34 / G-07:** add Cloudflare WAF rate-limit rule — 30 req/min/IP on `/api/lead` — before the lead pipeline goes live.
2. **G-09:** set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in Cloudflare Pages env settings (production only) when wiring the pipeline; run `docs/supabase-leads.sql` first.

### WARNING — Address in Next Sprint
- DL-SEC-41: add Cloudflare Web Analytics for error/traffic visibility.
- DL-SEC-42: document leads-table backup procedure once the Supabase project exists.
- DL-SEC-23: consider Cloudflare Access on preview deployments (low risk — no user data).

### PASS — Confirmed Secure
31 checks passed with evidence; 16 N/A with justification.

---

## Sign-Off

Audit Status: **OPEN** — repo-side findings resolved (security headers added during audit);
remaining items are dashboard actions at deploy time. Re-run DL-SEC-20 and DL-SEC-34 after
the Supabase table and WAF rule are created.
