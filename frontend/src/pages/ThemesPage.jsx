import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { getNavActive } from '../navigation/navActive'
import { api } from '../lib/api'
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

const ThemeRow = ({ theme, isSelected, onToggle }) => {
  const Icon = theme.icon
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center gap-8 px-12 py-8 transition-all group ${
        isSelected
          ? 'text-[#F0A844]'
          : 'text-[#F5F2F0]/80 hover:text-[#F5F2F0]'
      }`}
      style={{
        clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
        backgroundColor: isSelected ? '#4A2B28' : '#1A1312',
        border: isSelected ? '2px solid #EF6637' : '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Icon size={32} strokeWidth={2.5} className={`${isSelected ? 'text-[#F0A844]' : 'text-[#F0A844]/60'} shrink-0 group-hover:scale-110 transition-transform`} />
      <span className="flex-1 text-left font-black text-[22px] font-serif italic tracking-tight">
        {theme.label}
      </span>
      <div
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          isSelected
            ? 'border-white bg-[#EF6637] shadow-[0_0_15px_rgba(239,102,55,0.5)]'
            : 'border-white/20 bg-transparent'
        }`}
      >
        {isSelected && <Check size={18} className="text-white" strokeWidth={4} />}
      </div>
    </motion.button>
  )
}

const ThemesPage = ({ onNavigate }) => {
  const [categories, setCategories] = useState([])
  const [selectedThemes, setSelectedThemes] = useState(new Set())

  useEffect(() => {
    api.getCategories().then(cats => {
      setCategories(cats)
      // Map existing THEMES to dynamic CategoryIds
      const defaultTheme = cats.find(c => c.name.toLowerCase().includes('case studies'))
      if (defaultTheme) setSelectedThemes(new Set([defaultTheme.CategoryId]))
    }).catch(console.error)
  }, [])

  const toggleTheme = (themeId) => {
    const next = new Set(selectedThemes)
    if (next.has(themeId)) next.delete(themeId)
    else next.add(themeId)
    setSelectedThemes(next)
  }

  return (
    <div className="min-h-screen bg-[#0D0908] flex flex-col font-sans overflow-hidden">
      <AppNavBar active={getNavActive(ROUTES.THEMES)} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col items-center justify-center max-w-[1440px] mx-auto px-10 py-12 w-full relative">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <img src="/Logo.png" alt="HCI Millionaire" className="w-32 h-32 object-contain" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-black text-[#F0A844] text-[64px] md:text-[88px] tracking-tighter mb-8 font-serif italic leading-none"
        >
          CHOOSE YOUR THEMES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-[#F5F2F0]/40 text-[22px] font-serif italic mb-20 max-w-3xl mx-auto leading-relaxed"
        >
          Select the foundational concepts you wish to explore in the hot seat. Your journey begins with knowledge.
        </motion.p>

        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.CategoryId}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <ThemeRow
                  theme={{ label: cat.name, icon: THEMES[i % THEMES.length].icon }}
                  isSelected={selectedThemes.has(cat.CategoryId)}
                  onToggle={() => toggleTheme(cat.CategoryId)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full max-w-[1440px] mx-auto px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-12 mt-auto border-t border-white/5 bg-[#1A1312]/30">
        <div className="flex gap-24">
          <div>
            <p className="text-[14px] font-black tracking-[0.4em] text-white/20 mb-8 uppercase font-sans">
              DIFFICULTY
            </p>
            <div className="flex gap-6">
              <div className="w-6 h-6 rounded-full bg-[#EF6637] shadow-[0_0_20px_rgba(239,102,55,0.6)] border-2 border-white/20" />
              <div className="w-6 h-6 rounded-full bg-[#4A2B28]/30 border-2 border-white/5" />
              <div className="w-6 h-6 rounded-full bg-[#4A2B28]/30 border-2 border-white/5" />
            </div>
          </div>
          <div>
            <p className="text-[14px] font-black tracking-[0.4em] text-white/20 mb-8 uppercase font-sans">
              TIME LIMIT
            </p>
            <p className="text-[#F0A844] font-black text-[40px] tracking-tighter font-serif italic leading-none">45s <span className="text-[20px] text-[#F0A844]/60 uppercase tracking-[0.1em] font-sans">/ Question</span></p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (selectedThemes.size > 0) {
              localStorage.setItem('hci_selected_categories', JSON.stringify([...selectedThemes]))
              onNavigate(ROUTES.HOME)
            }
          }}
          disabled={selectedThemes.size === 0}
          className={`px-20 py-8 rounded-[24px] font-black text-[22px] transition-all font-serif italic tracking-tight shadow-2xl ${
            selectedThemes.size > 0
              ? 'bg-[#EF6637] text-white hover:bg-[#F27A52] hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(239,102,55,0.3)]'
              : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
          }`}
        >
          Save Configuration
        </button>
      </div>
    </div>
  )
}

export default ThemesPage
