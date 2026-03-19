'use client'

import { useSettings } from '@/context/SettingsContext'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2, Moon, Sun, Palette, EyeOff, Hash, ZoomIn } from 'lucide-react'
import { HeroDemo } from '@/components/ui/animated-hero-demo'

const fontSizes = [
  { value: 'small', label: 'Small', icon: Minimize2 },
  { value: 'medium', label: 'Medium', icon: Minimize2 },
  { value: 'large', label: 'Large', icon: Maximize2 },
  { value: 'xlarge', label: 'X-Large', icon: Maximize2 },
]

function ToggleBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-outfit font-semibold text-sm transition-all border ${
        active
          ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-500/20'
          : 'bg-white border-sky-200 text-sky-800 hover:border-sky-300 hover:bg-sky-50'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
      <span className={`ml-auto text-xs font-bold rounded-full px-2 py-0.5 ${active ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-500'}`}>
        {active ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}

export default function SettingsPage() {
  const { settings, dispatch } = useSettings()

  const toggle = (type: any) => dispatch({ type })
  const setFontSize = (size: string) => dispatch({ type: 'SET_FONT_SIZE', payload: size as any })
  const setGrayscale = (value: number) => dispatch({ type: 'SET_GRAYSCALE', payload: value })
  const setZoom = (value: number) => dispatch({ type: 'SET_ZOOM', payload: value })

  const resetAll = () => {
    window.localStorage.removeItem('community-connect-settings')
    window.location.reload()
  }

  return (
    <>
      <HeroDemo
        badge="Inclusive Design"
        staticTitle="Accessibility Settings"
        subtitle="Customize your experience for comfort and clarity. All changes save automatically and apply site-wide."
        backgroundImage="/img/page-5.jpg"
      />

      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          {/* Display & Theme */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-sky-100 p-8 shadow-sm">
            <h2 className="font-syne text-xl font-bold text-sky-900 mb-6 flex items-center gap-2">
              <Sun className="w-5 h-5 text-sky-500" /> Display & Theme
            </h2>
            <div className="grid gap-3">
              <ToggleBtn active={settings.dark} onClick={() => toggle('TOGGLE_DARK')} icon={Moon} label="Dark Mode" />
            </div>
          </motion.div>

          {/* Font Size */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl border border-sky-100 p-8 shadow-sm">
            <h2 className="font-syne text-xl font-bold text-sky-900 mb-6 flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-sky-500" /> Font Size
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fontSizes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFontSize(value)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border font-outfit font-semibold text-sm transition-all ${
                    settings.fontSize === value
                      ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-500/20'
                      : 'bg-white border-sky-200 text-sky-800 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Color Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-sky-100 p-8 shadow-sm">
            <h2 className="font-syne text-xl font-bold text-sky-900 mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-500" /> Color Filters
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <ToggleBtn active={settings.colorBlind} onClick={() => toggle('TOGGLE_COLOR_BLIND')} icon={Palette} label="Color Blind Mode" />
              <ToggleBtn active={settings.invertColors} onClick={() => toggle('TOGGLE_INVERT_COLORS')} icon={EyeOff} label="Invert Colors" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-outfit font-semibold text-sm text-sky-900">Grayscale Intensity</label>
                <span className="font-outfit text-sm text-sky-500">{settings.grayscale}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={settings.grayscale}
                onChange={(e) => setGrayscale(Number(e.target.value))}
                className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </motion.div>

          {/* Motion & Zoom */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-sky-100 p-8 shadow-sm">
            <h2 className="font-syne text-xl font-bold text-sky-900 mb-6 flex items-center gap-2">
              <ZoomIn className="w-5 h-5 text-sky-500" /> Motion & Zoom
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <ToggleBtn active={settings.reducedMotion} onClick={() => toggle('TOGGLE_REDUCED_MOTION')} icon={Hash} label="Reduced Motion" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-outfit font-semibold text-sm text-sky-900">Page Zoom</label>
                  <span className="font-outfit text-sm text-sky-500">{settings.zoom}%</span>
                </div>
                <input
                  type="range" min="100" max="200" step="10" value={settings.zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Reset */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center pb-8">
            <button
              onClick={resetAll}
              className="px-8 py-3 rounded-xl font-outfit font-semibold text-sky-600 border-2 border-sky-200 hover:bg-sky-50 transition-all"
            >
              Reset All to Defaults
            </button>
            <p className="mt-3 text-sm text-sky-400 font-outfit">Settings save automatically</p>
          </motion.div>

        </div>
      </section>
    </>
  )
}
