'use client'

import { useEffect } from 'react'
import { useSettings } from '@/context/SettingsContext'
import { useAchievements } from '@/context/AchievementsContext'
import { getT } from '@/lib/translations'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Type, Eye, Zap, Brain, Shield, Heart, ZoomIn,
  ArrowLeft, RotateCcw, CheckCircle2, Move, MousePointer, Moon, Sun,
} from 'lucide-react'

// ─── Toggle switch ─────────────────────────────────────────────────────────────
function ToggleSwitch({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${active ? 'bg-sky-500' : 'bg-gray-200'}`}
      role="switch" aria-checked={active}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

// ─── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({ label, description, active, onToggle }: { label: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-sky-50 last:border-0">
      <div className="min-w-0">
        <p className="font-outfit font-semibold text-sm text-sky-900 leading-tight">{label}</p>
        <p className="font-outfit text-xs text-sky-600 mt-0.5 leading-snug">{description}</p>
      </div>
      <ToggleSwitch active={active} onToggle={onToggle} />
    </div>
  )
}

// ─── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ icon: Icon, iconColor = 'text-sky-500', iconBg = 'bg-sky-50', title, badgeCount, onLabel, delay = 0, children }: {
  icon: React.ElementType; iconColor?: string; iconBg?: string; title: string; badgeCount?: number; onLabel: string; delay?: number; children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h2 className="font-syne text-lg font-bold text-sky-900">{title}</h2>
        </div>
        {!!badgeCount && (
          <span className="text-xs font-semibold bg-sky-100 text-sky-600 px-2.5 py-1 rounded-full">{badgeCount} {onLabel}</span>
        )}
      </div>
      {children}
    </motion.div>
  )
}

// ─── Preset card ───────────────────────────────────────────────────────────────
function PresetCard({ icon: Icon, iconColor, iconBg, borderColor, activeBg, title, description, active, onToggle }: {
  icon: React.ElementType; iconColor: string; iconBg: string; borderColor: string; activeBg: string;
  title: string; description: string; active: boolean; onToggle: () => void
}) {
  return (
    <div className={`flex gap-3 p-4 rounded-xl border transition-all ${active ? `${activeBg} ${borderColor}` : 'bg-gray-50 border-gray-100'}`}>
      <div className={`w-10 h-10 rounded-xl ${active ? iconBg : 'bg-white'} flex items-center justify-center flex-shrink-0 transition-colors`}>
        <Icon className={`w-5 h-5 ${active ? iconColor : 'text-gray-400'} transition-colors`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`font-outfit font-semibold text-sm leading-tight ${active ? 'text-sky-900' : 'text-gray-800'}`}>{title}</p>
          <ToggleSwitch active={active} onToggle={onToggle} />
        </div>
        <p className={`font-outfit text-xs mt-1 leading-snug ${active ? 'text-sky-600' : 'text-gray-600'}`}>{description}</p>
      </div>
    </div>
  )
}

// ─── Language data ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'zh', label: '中文',       flag: '🇨🇳' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', label: 'Tagalog',    flag: '🇵🇭' },
  { code: 'ko', label: '한국어',     flag: '🇰🇷' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
  { code: 'hi', label: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
]

const COLOR_BLIND_OPTIONS = [
  { value: 'protanopia' as const,    label: 'Protanopia',    emoji: '🔴', description: 'Red deficiency' },
  { value: 'deuteranopia' as const,  label: 'Deuteranopia',  emoji: '🟢', description: 'Green deficiency' },
  { value: 'tritanopia' as const,    label: 'Tritanopia',    emoji: '🔵', description: 'Blue deficiency' },
  { value: 'achromatopsia' as const, label: 'Achromatopsia', emoji: '⬛', description: 'No color vision' },
]

const FONT_SIZE_STEPS: { display: string; value: 'small' | 'medium' | 'large' | 'xlarge'; textSize: string }[] = [
  { display: 'XS', value: 'small',  textSize: 'text-[10px]' },
  { display: 'S',  value: 'small',  textSize: 'text-xs' },
  { display: 'M',  value: 'medium', textSize: 'text-sm' },
  { display: 'L',  value: 'large',  textSize: 'text-base' },
  { display: 'XL', value: 'xlarge', textSize: 'text-lg' },
  { display: 'XXL',value: 'xlarge', textSize: 'text-xl' },
]

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { settings, dispatch } = useSettings()
  const { unlock, markPageVisited } = useAchievements()
  const t = getT(settings.language)
  const toggle = (key: keyof typeof settings) =>
    dispatch({ type: 'REPLACE_STATE', payload: { [key]: !settings[key] } as any })

  useEffect(() => { markPageVisited('settings') }, [markPageVisited])
  useEffect(() => { if (settings.dark) unlock('night_owl') }, [settings.dark, unlock])
  useEffect(() => { if (settings.language !== 'en') unlock('polyglot') }, [settings.language, unlock])
  useEffect(() => {
    const accessibilityKeys: (keyof typeof settings)[] = [
      'dyslexiaFont','increasedLineHeight','increasedWordSpacing','increasedLetterSpacing',
      'readingGuide','alwaysUnderlineLinks','textToSpeech','highContrast','largeCursor',
      'reducedTransparency','focusIndicators','focusSpotlight','largerClickTargets',
      'alwaysFocusRing','reducedMotion','adhdMode','parkinsonMode','epilepsyMode',
      'autismMode','lowVisionMode','motorImpairmentMode',
    ]
    if (accessibilityKeys.some(k => settings[k] === true)) unlock('accessibility_advocate')
  }, [settings, unlock])

  const boolKeys = [
    'dark','reducedMotion','textToSpeech','invertColors','sepia','largeCursor','readingGuide',
    'dyslexiaFont','increasedLineHeight','increasedWordSpacing','increasedLetterSpacing',
    'alwaysUnderlineLinks','highContrast','reducedTransparency','focusIndicators','focusSpotlight',
    'largerClickTargets','alwaysFocusRing',
    'adhdMode','parkinsonMode','epilepsyMode','autismMode','lowVisionMode','motorImpairmentMode',
  ] as (keyof typeof settings)[]

  const activeCount =
    boolKeys.filter(k => settings[k] === true).length +
    (settings.colorBlindMode !== 'none' ? 1 : 0) +
    (settings.language !== 'en' ? 1 : 0) +
    (settings.grayscale > 0 ? 1 : 0)

  const onLabel = t('misc.on')
  const textBadge = (['dyslexiaFont','increasedLineHeight','increasedWordSpacing','increasedLetterSpacing','readingGuide','alwaysUnderlineLinks','textToSpeech'] as (keyof typeof settings)[]).filter(k => settings[k]).length
  const visionBadge = (['highContrast','largeCursor','reducedTransparency'] as (keyof typeof settings)[]).filter(k => settings[k]).length + (settings.grayscale > 0 ? 1 : 0) + (settings.colorBlindMode !== 'none' ? 1 : 0)
  const motionBadge = (['reducedMotion','focusIndicators','focusSpotlight','largerClickTargets','alwaysFocusRing'] as (keyof typeof settings)[]).filter(k => settings[k]).length
  const presetBadge = (['adhdMode','parkinsonMode','epilepsyMode','autismMode','lowVisionMode','motorImpairmentMode'] as (keyof typeof settings)[]).filter(k => settings[k]).length

  // Pluralization helper — replace {n} and {s} in translated strings
  const customized = t('set.customized')
    .replace('{n}', String(activeCount))
    .replace('{s}', activeCount !== 1 ? 's' : '')

  return (
    <>
      <Link href="/" className="liquid-glass-fixed fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-outfit text-sm text-white transition-all hover:brightness-125">
        <ArrowLeft className="w-4 h-4" /> {t('misc.back')}
      </Link>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fcff 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-12 w-52 h-52 bg-indigo-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 bg-white border border-sky-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
              <span className="font-outfit text-sm font-semibold text-sky-700">
                {activeCount === 0 ? t('set.defaults') : customized}
              </span>
              {activeCount > 0 && <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">{activeCount}</span>}
            </div>
            <h1 className="font-syne text-4xl md:text-5xl font-extrabold text-sky-900 mb-4 tracking-tight">{t('set.title')}</h1>
            <p className="font-outfit text-sky-700 text-lg max-w-xl mx-auto leading-relaxed">{t('set.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 space-y-5">

          {/* Language */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-xl">🌐</div>
                <h2 className="font-syne text-lg font-bold text-sky-900">{t('set.lang')}</h2>
              </div>
              {settings.language !== 'en' && <span className="text-xs font-semibold bg-sky-100 text-sky-600 px-2.5 py-1 rounded-full">1 {onLabel}</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {LANGUAGES.map(({ code, label, flag }) => (
                <button key={code} onClick={() => dispatch({ type: 'REPLACE_STATE', payload: { language: code } })}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border font-outfit font-medium transition-all ${
                    settings.language === code
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-200'
                      : 'bg-white border-sky-100 text-sky-800 hover:border-sky-300 hover:bg-sky-50'
                  }`}>
                  <span className="text-xl">{flag}</span>
                  <span className="text-[11px] leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Dark Mode */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.02 }}
            className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${settings.dark ? 'bg-indigo-50' : 'bg-amber-50'}`}>
                  {settings.dark
                    ? <Moon className="w-5 h-5 text-indigo-500" />
                    : <Sun className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h2 className="font-syne text-lg font-bold text-sky-900">Dark Mode</h2>
                  <p className="font-outfit text-xs text-sky-400 mt-0.5">Switch to a dark color scheme across the entire app</p>
                </div>
              </div>
              <ToggleSwitch active={settings.dark} onToggle={() => dispatch({ type: 'TOGGLE_DARK' })} />
            </div>
          </motion.div>

          {/* Text & Reading */}
          <SectionCard icon={Type} title={t('sec.text')} badgeCount={textBadge} onLabel={onLabel} delay={0.05}>
            <div className="pb-4 mb-1 border-b border-sky-50">
              <p className="font-outfit font-semibold text-sm text-sky-900 mb-0.5">{t('tog.textsize')}</p>
              <p className="font-outfit text-xs text-sky-600 mb-3">Scale the base font size across the entire app</p>
              <div className="flex gap-1.5">
                {FONT_SIZE_STEPS.map(({ display, value, textSize }, i) => {
                  const active = display === 'M' ? settings.fontSize === 'medium'
                    : display === 'L' ? settings.fontSize === 'large'
                    : display === 'XL' ? settings.fontSize === 'xlarge' && i === 4
                    : display === 'XXL' ? settings.fontSize === 'xlarge' && i === 5
                    : display === 'S' ? settings.fontSize === 'small' && i === 1
                    : settings.fontSize === 'small' && i === 0
                  return (
                    <button key={`${display}-${i}`} onClick={() => dispatch({ type: 'SET_FONT_SIZE', payload: value })}
                      className={`flex-1 py-2.5 rounded-xl border font-outfit font-bold transition-all ${textSize} ${
                        active ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-200'
                               : 'bg-white border-sky-100 text-sky-700 hover:border-sky-300 hover:bg-sky-50'
                      }`}>
                      {display}
                    </button>
                  )
                })}
              </div>
            </div>
            <SettingRow label={t('tog.dyslexia')} description="Switches to Lexend — a font proven to improve reading speed and reduce fatigue" active={settings.dyslexiaFont} onToggle={() => toggle('dyslexiaFont')} />
            <SettingRow label={t('tog.lineheight')} description="Adds extra space between lines to reduce visual crowding" active={settings.increasedLineHeight} onToggle={() => toggle('increasedLineHeight')} />
            <SettingRow label={t('tog.wordspacing')} description="Spreads words apart to improve reading comfort" active={settings.increasedWordSpacing} onToggle={() => toggle('increasedWordSpacing')} />
            <SettingRow label={t('tog.letterspacing')} description="Spreads characters apart to reduce letter crowding and improve clarity" active={settings.increasedLetterSpacing} onToggle={() => toggle('increasedLetterSpacing')} />
            <SettingRow label={t('tog.readingguide')} description="Highlights the line under your cursor to help track your place while reading" active={settings.readingGuide} onToggle={() => dispatch({ type: 'TOGGLE_READING_GUIDE' })} />
            <SettingRow label={t('tog.underline')} description="Makes links visible without relying solely on color" active={settings.alwaysUnderlineLinks} onToggle={() => toggle('alwaysUnderlineLinks')} />
            <SettingRow label={t('tog.tts')} description="Click any paragraph or heading to have it read aloud using your device's voice" active={settings.textToSpeech} onToggle={() => dispatch({ type: 'TOGGLE_TEXT_TO_SPEECH' })} />
          </SectionCard>

          {/* Vision */}
          <SectionCard icon={Eye} title={t('sec.vision')} badgeCount={visionBadge} onLabel={onLabel} delay={0.1}>
            <SettingRow label={t('tog.highcontrast')} description="Maximizes foreground/background contrast for low-vision users" active={settings.highContrast} onToggle={() => toggle('highContrast')} />

            <div className="py-3.5 border-b border-sky-50">
              <p className="font-outfit font-semibold text-sm text-sky-900 mb-0.5">{t('tog.colorblind')}</p>
              <p className="font-outfit text-xs text-sky-600 mb-3">Select your color vision type to apply a perceptual compensation filter</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button onClick={() => dispatch({ type: 'REPLACE_STATE', payload: { colorBlindMode: 'none' } })}
                  className={`py-2.5 px-3 rounded-xl border font-outfit text-xs font-semibold transition-all ${
                    settings.colorBlindMode === 'none' ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-white border-sky-100 text-sky-700 hover:border-sky-300 hover:bg-sky-50'
                  }`}>{t('misc.none')}</button>
                {COLOR_BLIND_OPTIONS.map(({ value, label, emoji, description }) => (
                  <button key={value} onClick={() => dispatch({ type: 'REPLACE_STATE', payload: { colorBlindMode: value } })}
                    className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl border font-outfit text-xs font-semibold transition-all ${
                      settings.colorBlindMode === value ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-white border-sky-100 text-sky-700 hover:border-sky-300 hover:bg-sky-50'
                    }`}>
                    <span className="text-base">{emoji}</span>
                    <span>{label}</span>
                    <span className={`text-[10px] font-normal ${settings.colorBlindMode === value ? 'text-sky-100' : 'text-sky-400'}`}>{description}</span>
                  </button>
                ))}
              </div>
            </div>

            <SettingRow label={t('tog.largecursor')} description="Replaces the default cursor with an oversized pointer for better tracking" active={settings.largeCursor} onToggle={() => dispatch({ type: 'TOGGLE_LARGE_CURSOR' })} />
            <SettingRow label={t('tog.reducedtrans')} description="Removes blur and glass effects that can cause disorientation or visual discomfort" active={settings.reducedTransparency} onToggle={() => toggle('reducedTransparency')} />

            <div className="pt-3.5">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="font-outfit font-semibold text-sm text-sky-900">{t('tog.grayscale')}</p>
                  <p className="font-outfit text-xs text-sky-600 mt-0.5">Removes all color — useful for photosensitivity or color-neutral viewing</p>
                </div>
                <ToggleSwitch active={settings.grayscale > 0} onToggle={() => dispatch({ type: 'SET_GRAYSCALE', payload: settings.grayscale > 0 ? 0 : 100 })} />
              </div>
              {settings.grayscale > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-outfit text-xs text-sky-400">{t('misc.intensity')}</span>
                    <span className="font-outfit text-xs font-semibold text-sky-600">{settings.grayscale}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={settings.grayscale}
                    onChange={e => dispatch({ type: 'SET_GRAYSCALE', payload: Number(e.target.value) })}
                    className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                </div>
              )}
            </div>
          </SectionCard>

          {/* Motion & Interaction */}
          <SectionCard icon={Zap} title={t('sec.motion')} badgeCount={motionBadge} onLabel={onLabel} delay={0.15}>
            <SettingRow label={t('tog.reducemotion')} description="Cuts animations and transitions to near-zero for users sensitive to motion" active={settings.reducedMotion} onToggle={() => dispatch({ type: 'TOGGLE_REDUCED_MOTION' })} />
            <SettingRow label={t('tog.focus')} description="Bold amber outlines on every focused element — critical for keyboard-only navigation" active={settings.focusIndicators} onToggle={() => toggle('focusIndicators')} />
            <SettingRow label={t('tog.spotlight')} description="Dims everything except the currently focused element for distraction-free navigation" active={settings.focusSpotlight} onToggle={() => toggle('focusSpotlight')} />
            <SettingRow label={t('tog.targets')} description="Ensures all buttons and links meet the 44×44px minimum touch target for motor impairment" active={settings.largerClickTargets} onToggle={() => toggle('largerClickTargets')} />
            <SettingRow label={t('tog.focusring')} description="Keeps a visible focus outline on all focused elements regardless of input device" active={settings.alwaysFocusRing} onToggle={() => toggle('alwaysFocusRing')} />
          </SectionCard>

          {/* Condition-Specific Presets */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.25 }}
            className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="font-syne text-lg font-bold text-sky-900">{t('sec.presets')}</h2>
                  <p className="font-outfit text-xs text-sky-600 mt-0.5">{t('sec.presets.sub')}</p>
                </div>
              </div>
              {presetBadge > 0 && <span className="text-xs font-semibold bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full flex-shrink-0">{presetBadge} {onLabel}</span>}
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <PresetCard icon={Brain} iconColor="text-purple-500" iconBg="bg-purple-50" borderColor="border-purple-100" activeBg="bg-purple-50/60"
                title={t('pre.adhd')} description="Reduces visual noise, increases focus aids, and enlarges text for better concentration"
                active={settings.adhdMode} onToggle={() => toggle('adhdMode')} />
              <PresetCard icon={Move} iconColor="text-blue-500" iconBg="bg-blue-50" borderColor="border-blue-100" activeBg="bg-blue-50/60"
                title={t('pre.parkinsons')} description="Larger targets, reduced hover sensitivity, and stabilized UI to accommodate tremors"
                active={settings.parkinsonMode} onToggle={() => toggle('parkinsonMode')} />
              <PresetCard icon={Shield} iconColor="text-red-500" iconBg="bg-red-50" borderColor="border-red-100" activeBg="bg-red-50/60"
                title={t('pre.epilepsy')} description="Eliminates all flashing, strobing, and rapid animations across the entire site"
                active={settings.epilepsyMode} onToggle={() => toggle('epilepsyMode')} />
              <PresetCard icon={Heart} iconColor="text-pink-500" iconBg="bg-pink-50" borderColor="border-pink-100" activeBg="bg-pink-50/60"
                title={t('pre.autism')} description="Predictable layouts, muted tones, and reduced sensory load for a calmer experience"
                active={settings.autismMode} onToggle={() => toggle('autismMode')} />
              <PresetCard icon={ZoomIn} iconColor="text-teal-500" iconBg="bg-teal-50" borderColor="border-teal-100" activeBg="bg-teal-50/60"
                title={t('pre.lowvision')} description="Enhanced contrast, larger UI elements, and high-visibility focus rings throughout"
                active={settings.lowVisionMode} onToggle={() => toggle('lowVisionMode')} />
              <PresetCard icon={MousePointer} iconColor="text-indigo-500" iconBg="bg-indigo-50" borderColor="border-indigo-100" activeBg="bg-indigo-50/60"
                title={t('pre.motor')} description="Larger hit targets, sticky inputs, and keyboard-first navigation across all pages"
                active={settings.motorImpairmentMode} onToggle={() => toggle('motorImpairmentMode')} />
            </div>
          </motion.div>

          {/* Reset */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-center pb-12">
            <button onClick={() => { window.localStorage.removeItem('community-connect-settings'); window.location.reload() }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-outfit font-semibold text-sky-600 border-2 border-sky-200 hover:bg-sky-50 hover:border-sky-300 transition-all">
              <RotateCcw className="w-4 h-4" /> {t('set.reset')}
            </button>
            <p className="mt-3 font-outfit text-sm text-sky-400">{t('set.saved')}</p>
          </motion.div>

        </div>
      </section>
    </>
  )
}
