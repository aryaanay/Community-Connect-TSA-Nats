'use client'

import { Baby, Briefcase, GraduationCap, HandHeart, UserRound, UsersRound } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

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
  const { settings } = useSettings()
  const dark = settings.dark

  return (
    <section
      className="audience-ticker relative overflow-hidden border-y py-5 backdrop-blur-xl"
      style={dark ? {
        background: 'rgba(1,22,41,0.85)',
        borderColor: 'rgba(86,187,240,0.15)',
      } : {
        background: 'rgba(240,249,255,0.80)',
        borderColor: 'rgba(186,230,253,0.70)',
      }}
    >
      <div
        className="audience-ticker-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{ background: dark
          ? 'linear-gradient(to right, rgba(1,22,41,0.85), transparent)'
          : 'linear-gradient(to right, rgb(240,249,255), transparent)'
        }}
      />
      <div
        className="audience-ticker-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{ background: dark
          ? 'linear-gradient(to left, rgba(1,22,41,0.85), transparent)'
          : 'linear-gradient(to left, rgb(240,249,255), transparent)'
        }}
      />

      <div className="group/ticker flex items-center gap-5 overflow-hidden">
        <div className="audience-marquee-track flex min-w-max items-center gap-4 whitespace-nowrap group-hover/ticker:[animation-play-state:paused]">
          {repeated.map(({ Icon, label, note }, i) => (
            <div
              key={`${label}-${i}`}
              className="group/item inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-left shadow-sm backdrop-blur-xl transition-all duration-300 cursor-default select-none"
              style={dark ? {
                background: 'rgba(2,39,71,0.70)',
                border: '1px solid rgba(86,187,240,0.20)',
              } : {
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(186,230,253,0.80)',
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all"
                style={dark ? {
                  background: 'rgba(14,116,144,0.25)',
                  border: '1px solid rgba(86,187,240,0.25)',
                  color: '#56BBF0',
                } : {
                  background: 'rgb(224,242,254)',
                  border: '1px solid rgb(186,230,253)',
                  color: 'rgb(3,105,161)',
                }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span>
                <span
                  className="block font-syne text-sm font-bold"
                  style={{ color: dark ? '#C6EBFF' : 'rgb(12,74,110)' }}
                >
                  {label}
                </span>
                <span
                  className="block font-outfit text-xs"
                  style={{ color: dark ? 'rgba(86,187,240,0.75)' : 'rgb(2,132,199)' }}
                >
                  {note}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
