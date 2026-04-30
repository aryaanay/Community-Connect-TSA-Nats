'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Search,
  Tags,
} from 'lucide-react'
import {
  categoryIcons,
  type CommunityResource,
  resources as baseResources,
} from '@/data/community-data'
import { loadLocalSubmissions } from '@/lib/community-submissions'

type ResourceDirectoryProps = {
  limit?: number
  showHeader?: boolean
  compact?: boolean
}

const categories = ['All', ...Object.keys(categoryIcons)] as const

export function ResourceDirectory({
  limit,
  showHeader = true,
  compact = false,
}: ResourceDirectoryProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [mergedResources, setMergedResources] =
    useState<CommunityResource[]>(baseResources)

  useEffect(() => {
    const locals = loadLocalSubmissions()
    const merged = [...locals, ...baseResources].filter(
      (resource, index, array) =>
        index ===
        array.findIndex(
          (candidate) =>
            candidate.name.toLowerCase() === resource.name.toLowerCase(),
        ),
    )

    setMergedResources(merged)
  }, [])

  const filteredResources = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase()

    const results = mergedResources.filter((resource) => {
      const matchesCategory =
        activeCategory === 'All' || resource.category === activeCategory
      const haystack = [
        resource.name,
        resource.organization,
        resource.description,
        resource.audience,
        resource.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery = loweredQuery.length === 0 || haystack.includes(loweredQuery)

      return matchesCategory && matchesQuery
    })

    return typeof limit === 'number' ? results.slice(0, limit) : results
  }, [activeCategory, limit, mergedResources, query])

  return (
    <section className="section-shell">
      {showHeader ? (
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-kicker">Resource Hub</span>
            <h2 className="section-title">Search, compare, and connect.</h2>
            <p className="section-copy">
              The directory is organized so residents can move from a broad need
              to usable contact information with as little friction as possible.
            </p>
          </div>
          <div className="glass-panel max-w-md p-4 text-sm text-[var(--muted)]">
            <p>
              Try searching terms like <strong>food</strong>,{' '}
              <strong>mental health</strong>, <strong>volunteer</strong>, or{' '}
              <strong>job help</strong>.
            </p>
          </div>
        </div>
      ) : null}

      <div className="glass-panel mb-8 p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row">
          <label className="group relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by service, organization, or audience..."
              className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)] focus:bg-white/[0.14]"
            />
          </label>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Suggest a new resource
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? 'border-[var(--accent-strong)] bg-[var(--accent)] text-white'
                  : 'border-white/20 bg-white/[0.08] text-[var(--muted)] hover:border-white/30 hover:text-[var(--foreground)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <p>
          Showing <strong className="text-[var(--foreground)]">{filteredResources.length}</strong>{' '}
          resource{filteredResources.length === 1 ? '' : 's'}
        </p>
        {limit ? (
          <Link href="/resources" className="inline-flex items-center gap-1 text-[var(--accent-strong)] hover:underline">
            View full directory
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {filteredResources.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            No resources matched that search.
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Try a broader keyword or switch to a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource, index) => {
            const Icon = categoryIcons[resource.category]
            const expanded = expandedId === resource.id

            return (
              <motion.article
                key={resource.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: Math.min(index * 0.06, 0.24), duration: 0.45 }}
                className="glass-panel spotlight-border overflow-hidden"
              >
                <div className="h-1.5 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-strong)] to-[var(--accent-hot)]" />
                <div className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.12] text-[var(--foreground)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          {resource.category}
                        </p>
                        <h3 className="text-xl font-semibold text-[var(--foreground)]">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-[var(--muted)]">
                          {resource.organization}
                        </p>
                      </div>
                    </div>
                    {resource.featured ? (
                      <span className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <p className="mb-5 text-sm leading-7 text-[var(--muted)]">
                    {resource.description}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1 text-xs text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/12 bg-[rgba(255,255,255,0.05)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                      <Tags className="h-4 w-4 text-[var(--accent-strong)]" />
                      Best for
                    </div>
                    <p className="text-sm text-[var(--muted)]">{resource.audience}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((current) =>
                        current === resource.id ? null : resource.id,
                      )
                    }
                    className="mt-5 flex w-full items-center justify-between border-t border-white/12 pt-4 text-left text-sm font-semibold text-[var(--foreground)]"
                  >
                    <span>{expanded ? 'Hide contact details' : 'View contact details'}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 rounded-2xl border border-white/12 bg-black/10 p-4 text-sm text-[var(--muted)]">
                          <div className="flex gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent-strong)]" />
                            <div>
                              <p className="font-medium text-[var(--foreground)]">Location</p>
                              <p>{resource.address}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent-strong)]" />
                            <div>
                              <p className="font-medium text-[var(--foreground)]">Phone and hours</p>
                              <p>{resource.phone}</p>
                              <p>{resource.hours}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent-strong)]" />
                            <div>
                              <p className="font-medium text-[var(--foreground)]">Email and website</p>
                              <p>{resource.email}</p>
                              <a
                                href={resource.website}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[var(--accent-strong)] hover:underline"
                              >
                                Visit organization website
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}

      {compact ? null : (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            'Use search when you know the type of help you need.',
            'Use category filters when you want to compare similar services.',
            'Use the submission form if you know a resource that should be added.',
          ].map((tip) => (
            <div key={tip} className="glass-panel p-4 text-sm text-[var(--muted)]">
              {tip}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
