'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Send, Sparkles } from 'lucide-react'
import { resources, type ResourceCategory } from '@/data/community-data'
import { saveLocalSubmission } from '@/lib/community-submissions'
import { supabase } from '@/lib/supabaseClient'

const categories = Array.from(
  new Set(resources.map((resource) => resource.category)),
) as ResourceCategory[]

const emptyState = {
  name: '',
  organization: '',
  category: '' as ResourceCategory | '',
  description: '',
  audience: '',
  address: '',
  hours: '',
  phone: '',
  email: '',
  website: '',
  tags: '',
}

export function ResourceSubmissionForm() {
  const [formState, setFormState] = useState(emptyState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const payload = {
      name: formState.name.trim(),
      organization: formState.organization.trim(),
      category: formState.category as ResourceCategory,
      description: formState.description.trim(),
      audience: formState.audience.trim(),
      address: formState.address.trim(),
      hours: formState.hours.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim(),
      website: formState.website.trim(),
      tags: formState.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      submittedAt: new Date().toISOString(),
    }

    try {
      saveLocalSubmission(payload)

      try {
        await supabase.from('resources').insert({
          name: payload.name,
          category: payload.category,
          description: payload.description,
          address: payload.address,
          hours: payload.hours,
          phone: payload.phone,
          email: payload.email,
          website_url: payload.website,
          is_verified: false,
          is_featured: false,
        })
      } catch {
        // Local storage is the guaranteed path for this competition build.
      }

      setSubmitted(true)
      setFormState(emptyState)
    } catch {
      setError('The resource could not be saved. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-panel p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="section-kicker">Resident Submission Form</span>
          <h2 className="section-title">Help the hub stay current.</h2>
          <p className="section-copy">
            Residents can recommend organizations, support services, or community
            programs that should be added to the directory.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Competition mode: submissions are saved locally so they can appear in
          the live directory immediately.
        </div>
      </div>

      <AnimatePresence>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 text-emerald-50"
          >
            <div className="mb-2 flex items-center gap-3 text-lg font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Resource submitted successfully
            </div>
            <p className="text-sm text-emerald-100/80">
              The recommendation has been saved and can now be viewed from the
              directory page.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-50"
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Resource name"
            required
            value={formState.name}
            onChange={(value) => setFormState((state) => ({ ...state, name: value }))}
            placeholder="Bothell Learning Collective"
          />
          <Field
            label="Organization"
            required
            value={formState.organization}
            onChange={(value) =>
              setFormState((state) => ({ ...state, organization: value }))
            }
            placeholder="Name of nonprofit or provider"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">
              Category <span className="text-[var(--accent-hot)]">*</span>
            </span>
            <select
              required
              value={formState.category}
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  category: event.target.value as ResourceCategory,
                }))
              }
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)]"
            >
              <option value="">Select one</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Primary audience"
            required
            value={formState.audience}
            onChange={(value) => setFormState((state) => ({ ...state, audience: value }))}
            placeholder="Teens, families, older adults, job seekers..."
          />
        </div>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-[var(--foreground)]">
            Description <span className="text-[var(--accent-hot)]">*</span>
          </span>
          <textarea
            required
            rows={5}
            value={formState.description}
            onChange={(event) =>
              setFormState((state) => ({ ...state, description: event.target.value }))
            }
            className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)]"
            placeholder="Explain what the resource offers and why community members might use it."
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Address or service area"
            required
            value={formState.address}
            onChange={(value) => setFormState((state) => ({ ...state, address: value }))}
            placeholder="Street address, city, or remote support area"
          />
          <Field
            label="Hours"
            required
            value={formState.hours}
            onChange={(value) => setFormState((state) => ({ ...state, hours: value }))}
            placeholder="Mon-Fri 9 AM-5 PM"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Phone"
            required
            value={formState.phone}
            onChange={(value) => setFormState((state) => ({ ...state, phone: value }))}
            placeholder="(425) 555-0123"
          />
          <Field
            label="Email"
            required
            type="email"
            value={formState.email}
            onChange={(value) => setFormState((state) => ({ ...state, email: value }))}
            placeholder="hello@example.org"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Website"
            required
            type="url"
            value={formState.website}
            onChange={(value) => setFormState((state) => ({ ...state, website: value }))}
            placeholder="https://example.org"
          />
          <Field
            label="Tags"
            value={formState.tags}
            onChange={(value) => setFormState((state) => ({ ...state, tags: value }))}
            placeholder="food, tutoring, counseling"
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="glass-chip max-w-xl text-sm text-[var(--muted)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-strong)]" />
            Include specific details so future users can tell what the resource
            does before they click out to the organization website.
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send className={`h-4 w-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
            {isSubmitting ? 'Submitting...' : 'Submit resource'}
          </button>
        </div>
      </form>
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  type?: string
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: FieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--foreground)]">
        {label}
        {required ? <span className="text-[var(--accent-hot)]"> *</span> : null}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)]"
      />
    </label>
  )
}
