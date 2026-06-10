import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Phone,
  RefreshCw,
  Lightbulb,
  Check,
  Trophy,
  Star,
  DollarSign,
  MessageSquare,
  Smile,
  Mic,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'
import { ROUTES } from '../navigation/routes'

const LADDER = [
  { level: 15, prize: '$1,000,000', milestone: 'trophy' },
  { level: 14, prize: '$500,000' },
  { level: 13, prize: '$250,000' },
  { level: 12, prize: '$125,000' },
  { level: 11, prize: '$64,000' },
  { level: 10, prize: '$32,000' },
  { level: 9, prize: '$16,000', current: true },
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
  { id: 'A', text: 'Impose Western evaluation rubrics directly to speed up analysis.' },
  { id: 'B', text: 'Engage local experts in co-creating evaluation heuristics that respect community norms.' },
  { id: 'C', text: 'Translate questionnaire sheets into the local language without layout changes.' },
  { id: 'D', text: 'Automate user studies using online testing portals.' },
]

const LIFELINES = [
  { id: '5050', label: '50:50', text: '-1 50:50' },
  { id: 'class', label: 'Ask the Class', icon: Users },
  { id: 'phone', label: 'Phone a Peer', icon: Phone },
  { id: 'notes', label: 'Course Notes', icon: RefreshCw },
]

const MULTIPLAYER_PLAYERS = [
  { id: 'julian', name: 'Julian', score: '$32,000', level: 10, avatar: 'JV', color: 'bg-indigo-600', active: true },
  { id: 'sarah', name: 'Sarah', score: '$64,000', level: 11, avatar: 'SJ', color: 'bg-emerald-600', active: true },
  { id: 'sammy', name: 'Sammy (You)', score: '$16,000', level: 9, avatar: 'S', color: 'bg-[#F0A844]', active: true },
  { id: 'kofi', name: 'Kofi', score: '$8,000', level: 8, avatar: 'K', color: 'bg-rose-600', active: true },
]

const MultiplayerGamePage = ({ onNavigate }) => {
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(9)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeLifeline, setActiveLifeline] = useState(null)
  const [activeEmoji, setActiveEmoji] = useState(null)

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) {
      // Time run out -> Spectator
      onNavigate(ROUTES.ELIMINATION_SPECTATOR)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, onNavigate])

  const handleSelectAnswer = (id) => {
    setSelected(id)
  }

  const triggerLifeline = (id) => {
    setActiveLifeline(id)
  }

  const triggerEmoji = (emoji) => {
    setActiveEmoji(emoji)
    setShowEmojiPicker(false)
    setTimeout(() => {
      setActiveEmoji(null)
    }, 2500)
  }

  const handleFinalSelection = () => {
    if (selected === 'B') {
      // Correct! Route to standings (simulate final victory for demo or move to standings)
      onNavigate(ROUTES.MULTIPLAYER_STANDINGS)
    } else {
      // Incorrect -> Spectator
      onNavigate(ROUTES.ELIMINATION_SPECTATOR)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1311] flex flex-col text-[#F5F2F0] font-sans">
      {/* Top connected player bar */}
      <div className="bg-[#120d0c] border-b border-[#F5F2F0]/10 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="Logo" className="w-8 h-9 object-contain" />
          <span className="text-[11px] font-bold tracking-widest text-[#F0A844] uppercase hidden sm:inline">
            MULTIPLAYER HEARTH
          </span>
        </div>

        {/* Players Grid */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {MULTIPLAYER_PLAYERS.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                p.id === 'sammy' ? 'border-[#F0A844] bg-[#F0A844]/5' : 'border-[#F5F2F0]/10 bg-[#1f1614]/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full ${p.color} flex items-center justify-center font-bold text-xs text-white`}>
                {p.avatar}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold leading-tight">{p.name}</p>
                <p className="text-[9px] text-[#F0A844] font-semibold">{p.score} (Lvl {p.level})</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Actions & Timer */}
        <div className="flex items-center gap-3 relative">
          {/* Active Emoji Bubble */}
          <AnimatePresence>
            {activeEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -45, scale: 1.2 }}
                exit={{ opacity: 0, y: -60, scale: 0.8 }}
                className="absolute right-28 bg-[#3d2b2a] border border-[#F0A844]/30 rounded-full px-3 py-1.5 text-xl z-20"
              >
                {activeEmoji}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 bg-[#3d2b2a] hover:bg-[#4a3532] border border-[#F5F2F0]/10 rounded-lg text-[#F0A844] transition-colors"
            title="Send Emoji"
          >
            <Smile size={18} />
          </button>
          
          <button
            className="p-2 bg-[#3d2b2a] hover:bg-[#4a3532] border border-[#F5F2F0]/10 rounded-lg text-[#F5F2F0]/50 transition-colors cursor-not-allowed"
            disabled
            title="Microphone (Muted)"
          >
            <Mic size={18} />
          </button>

          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="absolute right-12 top-12 bg-[#1f1614] border border-[#F0A844]/30 rounded-lg p-3 grid grid-cols-4 gap-2 z-30 shadow-elevation">
              {['💡', '👍', '🔥', '🤔', '😎', '🤯', '👏', '🏆'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerEmoji(emoji)}
                  className="text-lg hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Timer Display */}
          <div className="w-10 h-10 rounded-full bg-[#E05B2D]/20 border border-[#E05B2D] flex items-center justify-center font-bold text-[#E05B2D] animate-pulse">
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1400px] mx-auto w-full">
        {/* Lifelines sidebar */}
        <aside className="lg:w-[200px] shrink-0">
          <h2 className="text-[#F0A844] text-[11px] font-bold tracking-[0.2em] mb-3 uppercase">
            COMMUNAL LIFELINES
          </h2>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {LIFELINES.map((ll) => {
              const Icon = ll.icon
              return (
                <button
                  key={ll.id}
                  onClick={() => triggerLifeline(ll.id)}
                  className="flex items-center gap-2.5 bg-[#4a2c2a] hover:bg-[#613736] border border-[#F5F2F0]/10 rounded-lg px-4 py-3 text-left min-w-[150px] lg:min-w-0 transition-colors shrink-0"
                >
                  {Icon ? (
                    <Icon size={16} className="text-[#F0A844] shrink-0" />
                  ) : (
                    <span className="text-[#E05B2D] font-bold text-xs shrink-0">{ll.text}</span>
                  )}
                  <span className="text-[#F5F2F0] text-xs font-semibold">{ll.label}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 flex flex-col items-center justify-center min-w-0 py-4">
          <div className="w-full max-w-2xl bg-[#4a2c2a] rounded-xl p-6 mb-6 border border-[#F5F2F0]/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#F0A844]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#F0A844] uppercase block mb-2">
              QUESTION 9 • MULTIPLAYER LEVEL
            </span>
            <p className="text-[#F5F2F0] text-lg md:text-xl font-medium leading-relaxed">
              When applying human-centered design heuristics in an indigenous Namibian community, what approach aligns best with the principle of "Ubuntu" (Interconnectedness)?
            </p>
          </div>

          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {ANSWERS.map((ans) => (
              <motion.button
                key={ans.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectAnswer(ans.id)}
                className={`flex items-start gap-3 bg-[#4a2c2a] rounded-lg p-4 text-left border-2 transition-all min-h-[92px] ${
                  selected === ans.id
                    ? 'border-[#F0A844] bg-[#613736]'
                    : 'border-transparent hover:border-[#F5F2F0]/20'
                }`}
              >
                <span className="w-7 h-7 rounded bg-[#E05B2D] flex items-center justify-center font-bold text-[#1a1311] shrink-0 text-sm mt-0.5">
                  {ans.id}
                </span>
                <span className="text-[#F5F2F0] text-sm leading-snug">{ans.text}</span>
              </motion.button>
            ))}
          </div>

          {selected ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFinalSelection}
              className="px-8 py-3 bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] font-bold text-sm tracking-wide rounded-lg flex items-center gap-2 uppercase transition-all shadow-elevation"
            >
              Submit Answer
              <ArrowRight size={16} />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 text-[#F0A844]/60 text-xs font-semibold">
              <Lightbulb size={16} />
              SELECT AN OPTION BEFORE TIME EXPIRES
            </div>
          )}
        </main>

        {/* Progress Ladder */}
        <aside className="lg:w-[200px] shrink-0">
          <h2 className="text-[#F0A844] text-[11px] font-bold tracking-[0.2em] mb-3 uppercase">
            MILLIONAIRE LADDER
          </h2>
          <div className="bg-[#261e1d] rounded-xl p-3 max-h-[420px] overflow-y-auto space-y-1">
            {[...LADDER].reverse().map((step) => (
              <div
                key={step.level}
                className={`flex items-center justify-between gap-2 px-2 py-1 rounded text-xs ${
                  step.current
                    ? 'bg-[#F0A844] text-[#1a1311] font-bold'
                    : 'text-[#F0A844]/80 hover:bg-[#1a1311]/20'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {step.milestone === 'trophy' && <Trophy size={12} />}
                  {step.milestone === 'star' && <Star size={12} />}
                  {step.current && <Check size={12} />}
                  {!step.milestone && !step.current && (
                    <DollarSign size={10} className="opacity-60" />
                  )}
                  <span>{step.level}</span>
                </span>
                <span className="font-semibold">{step.prize}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Lifeline Overlay Simulator Modal */}
      <AnimatePresence>
        {activeLifeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setActiveLifeline(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1f1614] border border-[#F0A844]/40 rounded-xl p-6 max-w-md w-full shadow-elevation"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4 text-[#F0A844]">
                <Users size={24} className="text-[#E05B2D]" />
                <h3 className="font-serif font-bold text-xl uppercase">
                  {activeLifeline === '5050' && '50:50 Lifeline'}
                  {activeLifeline === 'class' && 'Ask the Class'}
                  {activeLifeline === 'phone' && 'Phone a Peer'}
                  {activeLifeline === 'notes' && 'Sage Counsel'}
                </h3>
              </div>

              <div className="text-sm text-[#F5F2F0]/80 space-y-4">
                {activeLifeline === '5050' && (
                  <p>
                    The Sage has eliminated options <strong>A</strong> and <strong>C</strong>. You are left with option <strong>B</strong> (correct) and <strong>D</strong>.
                  </p>
                )}
                {activeLifeline === 'class' && (
                  <div>
                    <p className="mb-3">The collective wisdom of the cohort indicates:</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>A (Direct Western Rubrics)</span>
                          <span>8%</span>
                        </div>
                        <div className="h-2 bg-[#4a2c2a] rounded-full overflow-hidden">
                          <div className="h-full bg-rose-600" style={{ width: '8%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-[#F0A844]">
                          <span>B (Ubuntu Co-creation)</span>
                          <span>76%</span>
                        </div>
                        <div className="h-2 bg-[#4a2c2a] rounded-full overflow-hidden">
                          <div className="h-full bg-[#F0A844]" style={{ width: '76%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>C (Literal Translation)</span>
                          <span>12%</span>
                        </div>
                        <div className="h-2 bg-[#4a2c2a] rounded-full overflow-hidden">
                          <div className="h-full bg-[#F5F2F0]/40" style={{ width: '12%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>D (Automate Online)</span>
                          <span>4%</span>
                        </div>
                        <div className="h-2 bg-[#4a2c2a] rounded-full overflow-hidden">
                          <div className="h-full bg-rose-600" style={{ width: '4%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeLifeline === 'phone' && (
                  <div className="bg-[#4a2c2a]/40 p-4 rounded-lg border border-[#F5F2F0]/5 font-mono text-xs">
                    <p className="text-[#F0A844] mb-1">📞 PEER DIAL ACTIVE - MARCUS CHEN:</p>
                    <p className="text-[#F5F2F0]/80 italic">
                      "Sammy! I read about this. Ubuntu is about relationships. Direct translation or direct rubrics ignore local agency. co-creating local evaluation heuristics is 100% option B!"
                    </p>
                  </div>
                )}
                {activeLifeline === 'notes' && (
                  <div>
                    <p className="italic text-[#d4a356] mb-3">
                      "A path is made by walking it. We build systems to enhance relationships, not replace them."
                    </p>
                    <p className="text-xs text-[#F5F2F0]/60">
                      <strong>Course Notes Citation:</strong> Bidwell, N. J. (2016). Decolonising HCI and Ubuntu Ethics. Proceedings of the 9th International Conference on Development Informatics.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveLifeline(null)}
                className="w-full mt-6 py-2 rounded bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] font-bold text-xs tracking-wider uppercase transition-colors"
              >
                Resume Match
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MultiplayerGamePage
