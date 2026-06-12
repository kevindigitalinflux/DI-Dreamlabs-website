import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input, Select, TextArea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { INDUSTRIES } from '@/lib/calculator'
import { submitLead } from '@/lib/leads'

type Status = 'idle' | 'submitting' | 'sent' | 'error'

/** Free-audit contact form → /api/lead with source "contact". */
export const ContactForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (name.trim().length < 2) {
      setError('Please enter your name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setStatus('submitting')
    const result = await submitLead({
      name,
      email,
      company,
      industry,
      source: 'contact',
      payload: { message: message.slice(0, 2000) },
    })
    if (!result.ok) {
      setStatus('error')
      setError(result.error)
      return
    }
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="rounded-card bg-white p-8 text-center shadow-card" aria-live="polite">
        <h3 className="font-heading text-xl font-semibold text-navy-deep">
          Got it — we'll be in touch.
        </h3>
        <p className="mt-3 font-body text-base leading-relaxed text-navy-deep/75">
          Expect a reply within one working day. No pitch deck, no pressure — just a conversation
          about your bottleneck.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate aria-live="polite">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
        <Input
          label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          error={error ?? undefined}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
        />
        <Select label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">Choose one (optional)</option>
          {INDUSTRIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
          <option value="other">Something else</option>
        </Select>
      </div>
      <TextArea
        label="What's slowing you down?"
        hint="A sentence or two is plenty — we'll dig into the detail together."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* Honeypot — hidden from humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <Button type="submit" variant="primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Request my free audit'}
      </Button>
    </form>
  )
}
