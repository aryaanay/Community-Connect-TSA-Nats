'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react'

interface SettingsState {
  dark: boolean
  colorBlind: boolean
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  reducedMotion: boolean
  textToSpeech: boolean
  invertColors: boolean
  grayscale: number
  sepia: boolean
  largeCursor: boolean
  readingGuide: boolean
  zoom: number
  // New fields
  language: string
  dyslexiaFont: boolean
  increasedLineHeight: boolean
  increasedWordSpacing: boolean
  increasedLetterSpacing: boolean
  alwaysUnderlineLinks: boolean
  highContrast: boolean
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  reducedTransparency: boolean
  focusIndicators: boolean
  focusSpotlight: boolean
  largerClickTargets: boolean
  alwaysFocusRing: boolean
  screenReaderEnhancements: boolean
  tooltipAnnouncements: boolean
  adhdMode: boolean
  parkinsonMode: boolean
  epilepsyMode: boolean
  autismMode: boolean
  lowVisionMode: boolean
  motorImpairmentMode: boolean
}

type SettingsAction =
  | { type: 'TOGGLE_DARK' }
  | { type: 'TOGGLE_COLOR_BLIND' }
  | { type: 'SET_FONT_SIZE'; payload: SettingsState['fontSize'] }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'TOGGLE_TEXT_TO_SPEECH' }
  | { type: 'TOGGLE_INVERT_COLORS' }
  | { type: 'SET_GRAYSCALE'; payload: number }
  | { type: 'TOGGLE_SEPIA' }
  | { type: 'TOGGLE_LARGE_CURSOR' }
  | { type: 'TOGGLE_READING_GUIDE' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'REPLACE_STATE'; payload: Partial<SettingsState> }

const SETTINGS_KEY = 'community-connect-settings'

const initialState: SettingsState = {
  dark: true,
  colorBlind: false,
  fontSize: 'medium',
  reducedMotion: false,
  textToSpeech: false,
  invertColors: false,
  grayscale: 0,
  sepia: false,
  largeCursor: false,
  readingGuide: false,
  zoom: 100,
  language: 'en',
  dyslexiaFont: false,
  increasedLineHeight: false,
  increasedWordSpacing: false,
  increasedLetterSpacing: false,
  alwaysUnderlineLinks: false,
  highContrast: false,
  colorBlindMode: 'none',
  reducedTransparency: false,
  focusIndicators: false,
  focusSpotlight: false,
  largerClickTargets: false,
  alwaysFocusRing: false,
  screenReaderEnhancements: false,
  tooltipAnnouncements: false,
  adhdMode: false,
  parkinsonMode: false,
  epilepsyMode: false,
  autismMode: false,
  lowVisionMode: false,
  motorImpairmentMode: false,
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'REPLACE_STATE': return { ...state, ...action.payload }
    case 'TOGGLE_DARK': return { ...state, dark: !state.dark }
    case 'TOGGLE_COLOR_BLIND': return { ...state, colorBlind: !state.colorBlind }
    case 'SET_FONT_SIZE': return { ...state, fontSize: action.payload }
    case 'TOGGLE_REDUCED_MOTION': return { ...state, reducedMotion: !state.reducedMotion }
    case 'TOGGLE_TEXT_TO_SPEECH': return { ...state, textToSpeech: !state.textToSpeech }
    case 'TOGGLE_INVERT_COLORS': return { ...state, invertColors: !state.invertColors }
    case 'SET_GRAYSCALE': return { ...state, grayscale: Math.max(0, Math.min(100, action.payload)) }
    case 'TOGGLE_SEPIA': return { ...state, sepia: !state.sepia }
    case 'TOGGLE_LARGE_CURSOR': return { ...state, largeCursor: !state.largeCursor }
    case 'TOGGLE_READING_GUIDE': return { ...state, readingGuide: !state.readingGuide }
    case 'SET_ZOOM': return { ...state, zoom: Math.max(100, Math.min(200, action.payload)) }
    default: return state
  }
}

interface SettingsContextType {
  settings: SettingsState
  dispatch: Dispatch<SettingsAction>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) dispatch({ type: 'REPLACE_STATE', payload: JSON.parse(saved) as Partial<SettingsState> })
    } catch (e) { console.error('Failed to load settings:', e) }
  }, [])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const html = document.documentElement

    // Theme
    settings.dark ? html.setAttribute('data-theme', 'dark') : html.removeAttribute('data-theme')

    // Language
    html.setAttribute('lang', settings.language)
    html.setAttribute('data-language', settings.language)

    // Font size
    html.setAttribute('data-font-size', settings.fontSize)
    html.style.fontSize = { small: '0.875rem', medium: '1rem', large: '1.125rem', xlarge: '1.25rem' }[settings.fontSize]

    // Legacy reduced motion
    settings.reducedMotion ? html.setAttribute('data-reduced-motion', 'true') : html.removeAttribute('data-reduced-motion')

    // Reading guide
    settings.readingGuide ? html.setAttribute('data-reading-guide', 'true') : html.removeAttribute('data-reading-guide')

    // CSS filters (grayscale, invert, sepia, color blind mode)
    const filters: string[] = []
    if (settings.grayscale > 0) filters.push(`grayscale(${settings.grayscale}%)`)
    if (settings.invertColors) filters.push('invert(1)')
    if (settings.sepia) filters.push('sepia(1)')
    switch (settings.colorBlindMode) {
      case 'protanopia':   filters.push('sepia(0.25) hue-rotate(-10deg) saturate(0.8)'); break
      case 'deuteranopia': filters.push('sepia(0.25) hue-rotate(10deg) saturate(0.8)'); break
      case 'tritanopia':   filters.push('sepia(0.2) hue-rotate(175deg) saturate(0.65)'); break
      case 'achromatopsia': filters.push('grayscale(1)'); break
    }
    html.style.filter = filters.length ? filters.join(' ') : 'none'

    // Zoom / scale
    if (settings.zoom !== 100) {
      html.style.transform = `scale(${settings.zoom / 100})`
      html.style.transformOrigin = 'top left'
      html.style.width = `calc(100% / ${settings.zoom / 100})`
      html.style.height = `calc(100% / ${settings.zoom / 100})`
    } else {
      html.style.transform = ''
      html.style.transformOrigin = ''
      html.style.width = ''
      html.style.height = ''
    }

    // Boolean attribute helpers
    const toggle = (attr: string, on: boolean) =>
      on ? html.setAttribute(attr, 'true') : html.removeAttribute(attr)

    toggle('data-dyslexia-font', settings.dyslexiaFont)
    toggle('data-increased-line-height', settings.increasedLineHeight)
    toggle('data-increased-word-spacing', settings.increasedWordSpacing)
    toggle('data-increased-letter-spacing', settings.increasedLetterSpacing)
    toggle('data-underline-links', settings.alwaysUnderlineLinks)
    toggle('data-high-contrast', settings.highContrast)
    toggle('data-large-cursor', settings.largeCursor)
    toggle('data-reduced-transparency', settings.reducedTransparency)
    toggle('data-focus-indicators', settings.focusIndicators)
    toggle('data-focus-spotlight', settings.focusSpotlight)
    toggle('data-larger-click-targets', settings.largerClickTargets)
    toggle('data-always-focus-ring', settings.alwaysFocusRing)
    toggle('data-screen-reader', settings.screenReaderEnhancements)
    toggle('data-tooltip-announcements', settings.tooltipAnnouncements)
    toggle('data-adhd-mode', settings.adhdMode)
    toggle('data-parkinson-mode', settings.parkinsonMode)
    toggle('data-autism-mode', settings.autismMode)
    toggle('data-low-vision-mode', settings.lowVisionMode)
    toggle('data-motor-mode', settings.motorImpairmentMode)
    toggle('data-text-to-speech', settings.textToSpeech)

    // Epilepsy mode also forces reduced-motion
    if (settings.epilepsyMode) {
      html.setAttribute('data-epilepsy-mode', 'true')
      html.setAttribute('data-reduced-motion', 'true')
    } else {
      html.removeAttribute('data-epilepsy-mode')
      if (!settings.reducedMotion) html.removeAttribute('data-reduced-motion')
    }

    // Color blind mode attribute (CSS fallback)
    settings.colorBlindMode !== 'none'
      ? html.setAttribute('data-color-blind-mode', settings.colorBlindMode)
      : html.removeAttribute('data-color-blind-mode')
  }, [settings])

  // Text-to-speech: click any readable element to speak it
  useEffect(() => {
    if (!settings.textToSpeech) return
    const speak = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const text = el.innerText?.trim()
      if (!text || !window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text)
      utt.rate = 0.95
      window.speechSynthesis.speak(utt)
    }
    document.addEventListener('click', speak)
    return () => {
      document.removeEventListener('click', speak)
      window.speechSynthesis?.cancel()
    }
  }, [settings.textToSpeech])

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) throw new Error('useSettings must be used within a SettingsProvider')
  return context
}
