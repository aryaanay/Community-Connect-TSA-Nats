'use client'

import { useAuth } from '@/context/AuthContext'

const JUDGE_ID = 'demo-judge-001'

export function JudgeNotice({ action = 'post or interact' }: { action?: string }) {
  const { user } = useAuth()
  if (user?.id !== JUDGE_ID) return null

  return (
    <div
      className="rounded-2xl border px-5 py-4 mb-6 flex items-start gap-3"
      style={{
        background: 'rgba(245,158,11,0.07)',
        borderColor: 'rgba(245,158,11,0.3)',
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <div>
        <p className="font-syne font-bold text-sm" style={{ color: '#FCD34D', marginBottom: 3 }}>
          Judge Demo Account
        </p>
        <p className="font-outfit text-sm leading-relaxed" style={{ color: 'rgba(252,211,77,0.75)' }}>
          The judge account (<span style={{ color: '#FCD34D' }}>judges@tsa.com</span>) is a demo-only account and cannot {action} — it is not linked to a real email.
          To fully test this feature, <strong style={{ color: '#FCD34D' }}>create a free account</strong> using any real email on the{' '}
          <a href="/signin" className="underline" style={{ color: '#FCD34D' }}>sign-in page</a>.
        </p>
      </div>
    </div>
  )
}
