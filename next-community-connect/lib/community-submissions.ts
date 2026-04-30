import type { CommunityResource } from '@/data/community-data'

export const LOCAL_SUBMISSIONS_KEY = 'community-connect-local-submissions'

export type SubmissionDraft = Omit<CommunityResource, 'id' | 'featured'> & {
  submittedAt: string
}

export function loadLocalSubmissions(): CommunityResource[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(LOCAL_SUBMISSIONS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as SubmissionDraft[]

    return parsed.map((entry, index) => ({
      id: `local-${index}-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: entry.name,
      category: entry.category,
      organization: entry.organization,
      description: entry.description,
      audience: entry.audience,
      address: entry.address,
      hours: entry.hours,
      phone: entry.phone,
      email: entry.email,
      website: entry.website,
      tags: entry.tags,
    }))
  } catch {
    return []
  }
}

export function saveLocalSubmission(submission: SubmissionDraft) {
  if (typeof window === 'undefined') return

  const existing = loadLocalDrafts()
  const updated = [submission, ...existing]
  window.localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updated))
}

function loadLocalDrafts(): SubmissionDraft[] {
  const raw = window.localStorage.getItem(LOCAL_SUBMISSIONS_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as SubmissionDraft[]
  } catch {
    return []
  }
}
