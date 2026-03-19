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
  dark: false,
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
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'REPLACE_STATE':
      return { ...state, ...action.payload }
    case 'TOGGLE_DARK':
      return { ...state, dark: !state.dark }
    case 'TOGGLE_COLOR_BLIND':
      return { ...state, colorBlind: !state.colorBlind }
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload }
    case 'TOGGLE_REDUCED_MOTION':
      return { ...state, reducedMotion: !state.reducedMotion }
    case 'TOGGLE_TEXT_TO_SPEECH':
      return { ...state, textToSpeech: !state.textToSpeech }
    case 'TOGGLE_INVERT_COLORS':
      return { ...state, invertColors: !state.invertColors }
    case 'SET_GRAYSCALE':
      return { ...state, grayscale: Math.max(0, Math.min(100, action.payload)) }
    case 'TOGGLE_SEPIA':
      return { ...state, sepia: !state.sepia }
    case 'TOGGLE_LARGE_CURSOR':
      return { ...state, largeCursor: !state.largeCursor }
    case 'TOGGLE_READING_GUIDE':
      return { ...state, readingGuide: !state.readingGuide }
    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(100, Math.min(200, action.payload)) }
    default:
      return state
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
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SettingsState>
        dispatch({ type: 'REPLACE_STATE', payload: parsed })
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const html = document.documentElement

    // Theme
    if (settings.dark) {
      html.setAttribute('data-theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
    }

    // Modes
    ['colorBlind', 'reducedMotion'].forEach(key => {
      const attr = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      if (settings[key as keyof SettingsState] as boolean) {
        html.setAttribute(`data-${attr}`, 'true')
      } else {
        html.removeAttribute(`data-${attr}`)
      }
    })

    // Font size
    html.setAttribute('data-font-size', settings.fontSize)
    const sizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
      xlarge: '1.25rem'
    }
    html.style.fontSize = sizeMap[settings.fontSize]

    // Transform & Filter
    let filters = []
    if (settings.grayscale > 0) filters.push(`grayscale(${settings.grayscale}%)`)
    if (settings.invertColors) filters.push('invert(1)')
    if (settings.sepia) filters.push('sepia(1)')
    html.style.filter = filters.length ? filters.join(' ') : 'none'

    // Scale (zoom) - only apply transform when not 100%, otherwise fixed positioning breaks
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

    // Reading guide (simple line overlay via attr)
    if (settings.readingGuide) {
      html.setAttribute('data-reading-guide', 'true')
    } else {
      html.removeAttribute('data-reading-guide')
    }
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
