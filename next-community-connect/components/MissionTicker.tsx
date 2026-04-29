'use client'

import { Baby, Briefcase, GraduationCap, HandHeart, UserRound, UsersRound } from 'lucide-react'

const audiences = [
  { Icon: Baby, label: 'Kids & Families', note: 'Programs, meals, care' },
  { Icon: GraduationCap, label: 'Students', note: 'Tutoring and mentors' },
  { Icon: Briefcase, label: 'Job Seekers', note: 'Career help nearby' },
  { Icon: HandHeart, label: 'Volunteers', note: 'Give time locally' },
  { Icon: UserRound, label: 'Seniors', note: 'Support and connection' },
  { Icon: UsersRound, label: 'All Residents', note: 'One community hub' },
]

export function MissionTicker() {
  const repeated = [...audiences, ...audiences, ...audiences, ...audiences]

  return (
    <section className="audience-ticker relative overflow-hidden border-y border-sky-200/70 bg-sky-50/80 py-5 backdrop-blur-xl">
      <div className="audience-ticker-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-sky-50 to-transparent" />
      <div className="audience-ticker-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-sky-50 to-transparent" />

      <div className="group/ticker flex items-center gap-5 overflow-hidden">
        <div className="audience-marquee-track flex min-w-max items-center gap-4 whitespace-nowrap group-hover/ticker:[animation-play-state:paused]">
          {repeated.map(({ Icon, label, note }, i) => (
            <button
              key={`${label}-${i}`}
              type="button"
              className="group/item inline-flex items-center gap-3 rounded-2xl border border-sky-200/80 bg-white/75 px-5 py-3 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-sky-300 hover:bg-white hover:shadow-xl hover:shadow-sky-500/15"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-sky-700 transition-all group-hover/item:bg-sky-500 group-hover/item:text-white">
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span>
                <span className="block font-syne text-sm font-bold text-sky-900">{label}</span>
                <span className="block font-outfit text-xs text-sky-600">{note}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
