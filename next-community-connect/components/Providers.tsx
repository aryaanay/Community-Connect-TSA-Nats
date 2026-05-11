'use client'

import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import { AchievementsProvider } from '@/context/AchievementsContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AchievementsProvider>
          {children}
        </AchievementsProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}
