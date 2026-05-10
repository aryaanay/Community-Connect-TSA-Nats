import { useSettings } from '@/context/SettingsContext'
import { getT } from '@/lib/translations'

export function useT() {
  const { settings } = useSettings()
  return getT(settings.language)
}
