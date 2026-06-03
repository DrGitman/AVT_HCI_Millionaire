import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Phone,
  RefreshCw,
  Lightbulb,
  Check,
  Trophy,
  Star,
  DollarSign,
} from 'lucide-react'
import { ROUTES } from '../navigation/routes'

const LADDER = [
  { level: 15, prize: '$1,000,000', milestone: 'trophy' },
  { level: 14, prize: '$500,000' },
  { level: 13, prize: '$250,000' },
  { level: 12, prize: '$125,000' },
  { level: 11, prize: '$64,000' },
  { level: 10, prize: '$32,000', current: true },
  { level: 9, prize: '$16,000' },
  { level: 8, prize: '$8,000' },
  { level: 7, prize: '$4,000' },
  { level: 6, prize: '$2,000' },
  { level: 5, prize: '$1,000', milestone: 'star' },
  { level: 4, prize: '$500' },
  { level: 3, prize: '$300' },
  { level: 2, prize: '$200' },
  { level: 1, prize: '$100' },
]

const ANSWERS = [
  { id: 'A', text: 'The youngest community member' },
  { id: 'B', text: 'The designated community elders' },
  { id: 'C', text: 'The local government liaison' },
  { id: 'D', text: 'Any adult with a smartphone' },
]

const LIFELINES = [
  { id: '5050', label: '50:50', icon: null, text: '-1 50:50' },
  { id: 'class', label: 'Ask the Class', icon: Users },
  { id: 'phone', label: 'Phone a Peer', icon: Phone },
  { id: 'notes', label: 'Course Notes', icon: RefreshCw },
]

const GamePage = ({ onNavigate }) => {
  const [selected, setSelected] = useState('B')
  const [timer] = useState(19)

  return (
    <div className="min-h-screen bg-[#1a1311] flex flex-col">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#F5F2F0]/5">
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.HOME)}
          aria-label="Home"
        >
          <img src="/Logo.png" alt="Logo" className="w-11 h-12 object-contain" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.HOME)}
          className="bg-[#E05B2D] hover:bg-[#F27A52] text-[#F5F2F0] font-bold text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Quit
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 max-w-[1400px] mx-auto w-full">
        {/* Lifelines */}
        <aside className="lg:w-[180px] shrink-0">
          <h2 className="text-[#F0A844] text-[11px] font-bold tracking-[0.2em] mb-3">
            LIFELINES
          </h2>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {LIFELINES.map((ll) => {
              const Icon = ll.icon
              return (
                <button
                  key={ll.id}
                  type="button"
                  className="flex items-center gap-2 bg-[#4a2c2a] hover:bg-[#613736] border border-[#F5F2F0]/10 rounded-lg px-3 py-2.5 text-left min-w-[140px] lg:min-w-0 transition-colors"
                >
                  {Icon ? (
                    <Icon size={16} className="text-[#F0A844] shrink-0" />
                  ) : (
                    <span className="text-[#E05B2D] font-bold text-xs shrink-0">
                      {ll.text}
                    </span>
                  )}
                  <span className="text-[#F5F2F0] text-[12px] font-medium">{ll.label}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main game area */}
        <main className="flex-1 flex flex-col items-center min-w-0">
          <div className="relative mb-4">
            <img
              src="/female_avatar.png"
              alt="Player"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#F0A844]/50"
            />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#E05B2D] text-[#F5F2F0] text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[40px] text-center">
              {timer}s
            </span>
          </div>

          <div className="w-full max-w-2xl bg-[#4a2c2a] rounded-xl p-5 md:p-6 mb-6 border border-[#F5F2F0]/5">
            <p className="text-[#F5F2F0] text-center text-[15px] md:text-base leading-relaxed">
              You are an HCI designer engaging a San community for the first time.
              Guided by Philosophical Sagacity, who should you approach first to respect
              community protocol?
            </p>
          </div>

          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {ANSWERS.map((ans) => (
              <motion.button
                key={ans.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => setSelected(ans.id)}
                className={`flex items-center gap-3 bg-[#4a2c2a] rounded-lg p-3 text-left border-2 transition-colors ${
                  selected === ans.id
                    ? 'border-[#F0A844]'
                    : 'border-transparent hover:border-[#F5F2F0]/20'
                }`}
              >
                <span className="w-8 h-8 rounded bg-[#E05B2D] flex items-center justify-center font-bold text-[#1a1311] shrink-0">
                  {ans.id}
                </span>
                <span className="text-[#F5F2F0] text-[14px]">{ans.text}</span>
              </motion.button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate(ROUTES.VICTORY)}
            className="flex items-center gap-2 text-[#F0A844] text-[12px] font-bold tracking-wider"
          >
            <Lightbulb size={16} />
            AWAITING FINAL SELECTION...
          </button>
        </main>

        {/* Progress ladder */}
        <aside className="lg:w-[200px] shrink-0">
          <h2 className="text-[#F0A844] text-[11px] font-bold tracking-[0.2em] mb-3">
            PROGRESS LADDER
          </h2>
          <div className="bg-[#261e1d] rounded-xl p-3 max-h-[420px] overflow-y-auto space-y-1">
            {[...LADDER].reverse().map((step) => (
              <div
                key={step.level}
                className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded text-[12px] ${
                  step.current
                    ? 'bg-[#F0A844] text-[#1a1311] font-bold'
                    : 'text-[#F0A844]/90'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {step.milestone === 'trophy' && <Trophy size={14} />}
                  {step.milestone === 'star' && <Star size={14} />}
                  {step.current && <Check size={14} />}
                  {!step.milestone && !step.current && (
                    <DollarSign size={12} className="opacity-60" />
                  )}
                  <span>{step.level}</span>
                </span>
                <span className="font-semibold">{step.prize}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default GamePage
