import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import {
  BookOpen,
  Scale,
  Users,
  Zap,
  Landmark,
  Check,
} from 'lucide-react'

const THEMES = [
  { id: 'case-studies', label: 'Case Studies', icon: BookOpen },
  { id: 'engagement', label: 'Engagement Principles', icon: Users },
  { id: 'hci-ethics', label: 'HCI Ethics', icon: Scale },
  { id: 'interaction', label: 'Interaction Design', icon: Zap },
  { id: 'african-values', label: 'African Values and Philosophies', icon: Landmark },
]

const ThemeRow = ({ theme, isSelected, onToggle, fullWidth = false }) => {
  const Icon = theme.icon
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex items-center gap-4 px-5 py-4 bg-[#3d2b2a]/70 border transition-all ${
        fullWidth ? 'w-full' : 'w-full'
      } ${
        isSelected
          ? 'border-[#E05B2D] shadow-[0_0_0_1px_#E05B2D]'
          : 'border-[#F5F2F0]/15 hover:border-[#F5F2F0]/30'
      }`}
      style={{
        clipPath:
          'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)',
      }}
    >
      <Icon size={22} className="text-[#F0A844] shrink-0 ml-2" />
      <span className="flex-1 text-left font-semibold text-[#F5F2F0] text-[15px]">
        {theme.label}
      </span>
      <span
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-2 ${
          isSelected
            ? 'border-[#E05B2D] bg-[#E05B2D]'
            : 'border-[#F5F2F0]/30 bg-transparent'
        }`}
      >
        {isSelected && <Check size={14} className="text-[#120d0c]" strokeWidth={3} />}
      </span>
    </motion.button>
  )
}

const ThemesPage = ({ onNavigate }) => {
  const [selectedThemes, setSelectedThemes] = useState(new Set(['case-studies']))

  const toggleTheme = (themeId) => {
    const next = new Set(selectedThemes)
    if (next.has(themeId)) next.delete(themeId)
    else next.add(themeId)
    setSelectedThemes(next)
  }

  return (
    <div className="min-h-screen bg-[#120d0c]">
      <AppNavBar active={ROUTES.THEMES} onNavigate={onNavigate} />

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <img src="/Logo.png" alt="HCI Millionaire" className="w-16 h-[68px] object-contain" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-sans font-bold text-[#E05B2D] text-2xl md:text-3xl tracking-wide mb-3"
        >
          CHOOSE YOUR THEMES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-[#F5F2F0]/60 italic text-sm mb-10 max-w-md mx-auto"
        >
          Select the foundational concepts you wish to explore in the hot seat.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {THEMES.slice(0, 4).map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <ThemeRow
                theme={theme}
                isSelected={selectedThemes.has(theme.id)}
                onToggle={() => toggleTheme(theme.id)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-12"
        >
          <ThemeRow
            theme={THEMES[4]}
            isSelected={selectedThemes.has('african-values')}
            onToggle={() => toggleTheme('african-values')}
            fullWidth
          />
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[#F5F2F0]/10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#F5F2F0]/50 mb-2">
              DIFFICULTY
            </p>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E05B2D]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3d2b2a]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3d2b2a]" />
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#F5F2F0]/50 mb-1">
              TIME LIMIT
            </p>
            <p className="text-[#E05B2D] font-bold text-lg">45s / Question</p>
          </div>
          <button
            type="button"
            onClick={() => selectedThemes.size > 0 && onNavigate(ROUTES.HOME)}
            disabled={selectedThemes.size === 0}
            className={`px-8 py-3 rounded-lg font-bold text-sm transition-colors ${
              selectedThemes.size > 0
                ? 'bg-[#3d2b2a] text-[#F5F2F0] hover:bg-[#4a3532] border border-[#F5F2F0]/15'
                : 'bg-[#3d2b2a]/50 text-[#F5F2F0]/40 cursor-not-allowed'
            }`}
          >
            Save Options
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemesPage
