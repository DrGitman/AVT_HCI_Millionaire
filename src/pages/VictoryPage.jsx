import { motion } from 'framer-motion'
import { RotateCcw, Eye, Share2 } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { Button } from '../components'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const STATS = [
  { label: 'FINAL PRIZE', value: '$1,000,000', accent: true },
  { label: 'ACCURACY', value: '15 / 15 Correct', accent: false },
  { label: 'COHORT RANK', value: 'Top 0.1%', accent: true },
]

const VictoryPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#1a0f0e]">
    <AppNavBar active={getNavActive(ROUTES.VICTORY)} onNavigate={onNavigate} />

    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-block bg-[#6b3e3a] rounded-2xl p-8 mb-8"
      >
        <img
          src="/Win_Page_Tree.png"
          alt="HCI Sage — baobab achievement emblem"
          className="w-28 h-28 md:w-32 md:h-32 mx-auto object-contain mb-4"
        />
        <p className="text-[#F0A844] text-[11px] font-bold tracking-[0.25em]">
          HCI SAGE STATUS UNLOCKED
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-sans font-bold text-[#F5F2F0] text-3xl md:text-4xl mb-4"
      >
        You are an HCI Millionaire!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-[#F5F2F0]/80 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed"
      >
        Your mastery of contextually grounded African interactive design principles has
        secured the highest tier of intellectual prestige.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="bg-[#6b3e3a] rounded-xl p-5"
          >
            <p className="text-[#F0A844]/80 text-[10px] font-bold tracking-wider mb-2">
              {stat.label}
            </p>
            <p
              className={`font-bold text-xl ${
                stat.accent ? 'text-[#E05B2D]' : 'text-[#F5F2F0]'
              }`}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          type="button"
          onClick={() => onNavigate(ROUTES.GAME)}
          className="gap-2 px-6 h-11 bg-[#E05B2D] text-[#1a0f0e] font-bold"
        >
          <RotateCcw size={18} />
          Play Again
        </Button>
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.GAME)}
          className="flex items-center gap-2 px-6 h-11 rounded-lg border border-[#F0A844]/50 text-[#F0A844] font-semibold hover:bg-[#F0A844]/10 transition-colors"
        >
          <Eye size={18} />
          Review Answers
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-6 h-11 text-[#F0A844] font-semibold hover:text-[#F27A52] transition-colors"
        >
          <Share2 size={18} />
          Share Performance
        </button>
      </div>
    </div>
  </div>
)

export default VictoryPage
