import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Phone,
  Lightbulb,
  Check,
  Trophy,
  Star,
  Brain,
  X,
  Smartphone,
  BookOpen
} from 'lucide-react'
import { ROUTES } from '../navigation/routes'
import { api } from '../lib/api'

const LADDER = [
  { level: 15, prize: '$1,000,000', milestone: 'trophy' },
  { level: 14, prize: '$500,000' },
  { level: 13, prize: '$250,000' },
  { level: 12, prize: '$125,000' },
  { level: 11, prize: '$64,000' },
  { level: 10, prize: '$32,000', current: true, milestone: 'check' },
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
  { id: 'A', text: 'The local regional government representative' },
  { id: 'B', text: 'The designated community elders' },
  { id: 'C', text: 'The youngest literate community demographic' },
  { id: 'D', text: 'The external international NGO program manager' },
]

const LIFELINES = [
  { id: '5050', label: '50:50', icon: null, text: '-1' },
  { id: 'class', label: 'Ask the Class', icon: Users },
  { id: 'phone', label: 'Phone a Peer', icon: Phone },
  { id: 'sage', label: 'Sayings of the Sage', icon: Brain },
]

const GamePage = ({ onNavigate }) => {
  const [game, setGame] = useState(null)
  const [selected, setSelected] = useState(null)
  const [timer, setTimer] = useState(45)
  const [gameOver, setGameOver] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [activeLifeline, setActiveLifeline] = useState(null)
  const [lifelineData, setLifelineData] = useState(null)
  const [removedAnswers, setRemovedAnswers] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('hci_selected_categories')
    const categoryIds = stored ? JSON.parse(stored) : [1, 2, 3, 4, 5]

    api.startGame(categoryIds)
      .then(res => {
        api.getGameState(res.GameId).then(setGame)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!game || gameOver || timer <= 0) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [game, gameOver, timer])

  const handleSelectAnswer = (ans) => {
    if (gameOver || selected || removedAnswers.includes(ans.AnswerId)) return
    setSelected(ans.AnswerId)

    api.submitAnswer(game.GameId, game.currentQuestion.QuestionId, ans.AnswerId, game.currentSequence)
      .then(res => {
        setCorrectAnswer(res.correctAnswer)
        setTimeout(() => {
          if (res.gameOver) {
            setGameOver(true)
            onNavigate(ROUTES.VICTORY, { result: res })
          } else {
            setSelected(null)
            setCorrectAnswer(null)
            setRemovedAnswers([])
            setTimer(45)
            setGame(prev => ({
              ...prev,
              currentQuestion: res.nextQuestion,
              currentSequence: prev.currentSequence + 1,
              prizeWon: res.prizeWon,
              lifelinesAvailable: prev.lifelinesAvailable // Should ideally refresh from state
            }))
            // Refresh lifelines from real state
            api.getGameState(game.GameId).then(setGame)
          }
        }, 3000)
      })
  }

  const useLifeline = (type) => {
    if (!game.lifelinesAvailable[type]) return
    const qid = game.currentQuestion.QuestionId

    if (type === 'fiftyFifty') {
      api.use5050(game.GameId, qid).then(res => {
        const allIds = game.currentQuestion.answers.map(a => a.AnswerId)
        const toRemove = allIds.filter(id => !res.remainingAnswers.includes(id))
        setRemovedAnswers(toRemove)
        setGame(prev => ({ ...prev, lifelinesAvailable: { ...prev.lifelinesAvailable, fiftyFifty: false } }))
      })
    } else if (type === 'phoneAPeer') {
      api.usePhone(game.GameId, qid).then(res => {
        setLifelineData(res)
        setActiveLifeline('phone')
        setGame(prev => ({ ...prev, lifelinesAvailable: { ...prev.lifelinesAvailable, phoneAPeer: false } }))
      })
    } else if (type === 'courseNotes') {
      api.useSage(game.GameId, qid).then(res => {
        setLifelineData(res)
        setActiveLifeline('sage')
        setGame(prev => ({ ...prev, lifelinesAvailable: { ...prev.lifelinesAvailable, courseNotes: false } }))
      })
    } else if (type === 'askClass') {
      api.getClassResults(game.GameId, qid).then(res => {
        setLifelineData(res)
        setActiveLifeline('class')
        setGame(prev => ({ ...prev, lifelinesAvailable: { ...prev.lifelinesAvailable, askClass: false } }))
      })
    }
  }

  if (!game) return <div className="min-h-screen bg-[#0D0908] flex items-center justify-center text-[#F0A844] font-serif italic text-2xl">Loading Session...</div>

  const q = game.currentQuestion

  return (
    <div className="min-h-screen bg-[#0D0908] flex flex-col font-sans selection:bg-[#EF6637]/30 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[1px] border-white/5 rounded-full -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-white/5 rounded-full -z-0" />

      {/* Header */}
      <header className="flex items-center justify-between px-16 py-6 bg-[#4A2B28] border-b border-[#F0A844]/20 shadow-2xl relative z-30">
        <div className="flex items-center gap-8">
          <img
            src="/Logo.png"
            alt="HCI Millionaire"
            className="h-16 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            onClick={() => onNavigate(ROUTES.HOME)}
          />
          <div className="w-[2px] h-10 bg-white/10" />
          <h2 className="text-[#F0A844] font-black text-[24px] font-serif italic tracking-tighter uppercase">Hot Seat: Scholar Level 10</h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.HOME)}
          className="bg-[#EF6637] hover:bg-[#F27A52] text-white font-black text-[14px] px-14 py-3 rounded-xl transition-all shadow-[0_10px_20px_rgba(239,102,55,0.3)] active:scale-95 uppercase tracking-widest"
        >
          Terminate Session
        </button>
      </header>

      <div className="flex-1 flex flex-row overflow-hidden relative z-10">
        {/* Left Sidebar: Lifelines */}
        <aside className="w-[360px] bg-[#1A1312]/80 backdrop-blur-md p-14 flex flex-col gap-10 border-r border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-[2px] bg-[#EF6637]" />
            <h2 className="text-[#F5F2F0]/40 text-[14px] font-black tracking-[0.4em] uppercase font-sans">
              LIFELINES
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <button
              onClick={() => useLifeline('fiftyFifty')}
              disabled={!game.lifelinesAvailable.fiftyFifty}
              className={`flex items-center gap-6 rounded-[24px] p-8 text-left transition-all group border active:scale-[0.98] shadow-lg ${
                game.lifelinesAvailable.fiftyFifty ? 'bg-[#4A2B28]/20 border-white/5 hover:bg-[#4A2B28]/40' : 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4A2B28] flex items-center justify-center shrink-0 border border-[#F0A844]/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <span className="text-[#F0A844] font-black text-3xl font-serif italic tracking-tighter">50</span>
              </div>
              <span className="text-[#F5F2F0]/80 text-[18px] font-black tracking-tight font-serif italic group-hover:text-white transition-colors">50:50</span>
            </button>

            <button
              onClick={() => useLifeline('askClass')}
              disabled={!game.lifelinesAvailable.askClass}
              className={`flex items-center gap-6 rounded-[24px] p-8 text-left transition-all group border active:scale-[0.98] shadow-lg ${
                game.lifelinesAvailable.askClass ? 'bg-[#4A2B28]/20 border-white/5 hover:bg-[#4A2B28]/40' : 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4A2B28] flex items-center justify-center shrink-0 border border-[#F0A844]/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Users size={32} strokeWidth={2.5} className="text-[#F0A844] group-hover:text-[#EF6637] transition-colors" />
              </div>
              <span className="text-[#F5F2F0]/80 text-[18px] font-black tracking-tight font-serif italic group-hover:text-white transition-colors">Ask the Class</span>
            </button>

            <button
              onClick={() => useLifeline('phoneAPeer')}
              disabled={!game.lifelinesAvailable.phoneAPeer}
              className={`flex items-center gap-6 rounded-[24px] p-8 text-left transition-all group border active:scale-[0.98] shadow-lg ${
                game.lifelinesAvailable.phoneAPeer ? 'bg-[#4A2B28]/20 border-white/5 hover:bg-[#4A2B28]/40' : 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4A2B28] flex items-center justify-center shrink-0 border border-[#F0A844]/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Phone size={32} strokeWidth={2.5} className="text-[#F0A844] group-hover:text-[#EF6637] transition-colors" />
              </div>
              <span className="text-[#F5F2F0]/80 text-[18px] font-black tracking-tight font-serif italic group-hover:text-white transition-colors">Phone a Peer</span>
            </button>

            <button
              onClick={() => useLifeline('courseNotes')}
              disabled={!game.lifelinesAvailable.courseNotes}
              className={`flex items-center gap-6 rounded-[24px] p-8 text-left transition-all group border active:scale-[0.98] shadow-lg ${
                game.lifelinesAvailable.courseNotes ? 'bg-[#4A2B28]/20 border-white/5 hover:bg-[#4A2B28]/40' : 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4A2B28] flex items-center justify-center shrink-0 border border-[#F0A844]/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Brain size={32} strokeWidth={2.5} className="text-[#F0A844] group-hover:text-[#EF6637] transition-colors" />
              </div>
              <span className="text-[#F5F2F0]/80 text-[18px] font-black tracking-tight font-serif italic group-hover:text-white transition-colors">Sage Advice</span>
            </button>
          </div>
        </aside>

        {/* Main Content: Gameplay Area */}
        <main className="flex-1 flex flex-col items-center py-16 px-20 overflow-y-auto custom-scrollbar relative">
          {/* Timer & Avatar */}
          <div className="relative mb-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] border-[2px] border-dashed border-[#F0A844]/20 rounded-full"
            />
            <div className="w-[220px] h-[220px] rounded-full border-[8px] border-[#F0A844] p-2 shadow-[0_0_60px_rgba(240,168,68,0.3)] relative overflow-visible bg-[#0D0908]">
              <img
                src="/male_avatar.png"
                alt="Player"
                className="w-full h-full rounded-full object-cover bg-[#4A2B28]/50"
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#EF6637] text-white text-[32px] font-black px-12 py-3 rounded-full shadow-[0_20px_40px_rgba(239,102,55,0.4)] border-4 border-[#0D0908] min-w-[140px] text-center font-serif italic">
                {timer}s
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div className="w-full max-w-[1000px] bg-[#4A2B28] rounded-[48px] p-20 mb-16 text-center relative border-2 border-[#F0A844]/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)] group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1A1312] border border-[#F0A844]/40 px-10 py-2 rounded-full shadow-xl">
              <span className="text-[#F0A844] text-[12px] font-black tracking-[0.5em] uppercase font-sans">QUESTION {game.currentSequence} OF 15</span>
            </div>
            <p className="text-[#F5F2F0] text-[32px] md:text-[36px] leading-[1.4] font-black max-w-5xl mx-auto font-serif italic tracking-tight">
              {q.question}
            </p>
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#F0A844]/40 to-transparent mx-auto mt-14 rounded-full" />
          </div>

          {/* Answers Grid */}
          <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {q.answers.map((ans, idx) => (
              <motion.button
                key={ans.AnswerId}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAnswer(ans)}
                disabled={removedAnswers.includes(ans.AnswerId)}
                className={`flex items-center gap-10 bg-[#1A1312] rounded-[32px] p-10 text-left border-2 transition-all group relative overflow-hidden ${
                  removedAnswers.includes(ans.AnswerId) ? 'opacity-0 cursor-default' : ''
                } ${
                  selected === ans.AnswerId
                    ? correctAnswer?.AnswerId === ans.AnswerId
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-[#F0A844] bg-[#3D2B28] shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-[1.02]'
                    : correctAnswer?.AnswerId === ans.AnswerId
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/5 hover:border-white/20'
                }`}
              >
                {selected === ans.AnswerId && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF6637]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                )}
                <div className={`w-[72px] h-[72px] rounded-[20px] flex items-center justify-center font-black text-white text-[28px] shrink-0 shadow-2xl transition-all font-serif italic ${
                  selected === ans.AnswerId ? 'bg-[#EF6637] scale-110 shadow-[0_0_20px_rgba(239,102,55,0.4)]' : 'bg-[#4A2B28]'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`text-[20px] font-black leading-snug font-serif italic tracking-tight ${
                  selected === ans.AnswerId ? 'text-white' : 'text-[#F5F2F0]/60 group-hover:text-white'
                }`}>{ans.answer}</span>
              </motion.button>
            ))}
          </div>

          {/* Selection Status */}
          <div className="flex items-center gap-6 text-[#F0A844] text-[16px] font-black tracking-[0.4em] uppercase font-sans animate-pulse">
            <div className="w-12 h-[2px] bg-[#EF6637]" />
            AWAITING FINAL SELECTION...
          </div>
        </main>

        {/* Right Sidebar: Progress Ladder */}
        <aside className="w-[440px] bg-[#1A1312]/80 backdrop-blur-md p-14 flex flex-col border-l border-white/5">
          <div className="flex items-center justify-between mb-14">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[2px] bg-[#EF6637]" />
              <h2 className="text-[#F5F2F0]/40 text-[14px] font-black tracking-[0.4em] uppercase font-sans">
                PROGRESS LADDER
              </h2>
            </div>
            <Trophy size={24} className="text-[#F0A844]" />
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-4 custom-scrollbar">
            {LADDER.map((step) => (
              <div
                key={step.level}
                className={`flex items-center justify-between px-8 py-4 rounded-[20px] transition-all relative overflow-hidden ${
                  game.currentSequence === step.level
                    ? 'bg-[#EF6637] text-white font-black shadow-[0_15px_30px_rgba(239,102,55,0.3)] scale-[1.05] z-10'
                    : 'bg-white/[0.02] text-[#F5F2F0]/20'
                }`}
              >
                {step.current && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                )}
                <div className="flex items-center gap-8 relative z-10">
                  <span className={`w-8 text-[14px] font-black tracking-tighter font-sans ${step.current ? 'text-white' : 'text-white/10'}`}>{step.level}</span>
                  <div className="shrink-0">
                    {step.milestone === 'trophy' && (
                      <Trophy size={24} strokeWidth={3} className={step.current ? 'text-white' : 'text-[#F0A844]'} />
                    )}
                    {step.milestone === 'check' && (
                      <Check size={24} strokeWidth={4} className={step.current ? 'text-white' : 'text-[#F0A844]'} />
                    )}
                    {step.milestone === 'star' && (
                      <Star size={24} strokeWidth={3} className={step.current ? 'text-white' : 'text-[#F0A844]'} fill={step.current ? 'currentColor' : 'none'} />
                    )}
                    {!step.milestone && (
                      <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center text-[12px] font-black ${step.current ? 'border-white' : 'border-white/5'}`}>
                        $
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-[24px] font-black tracking-tight font-serif italic relative z-10 ${
                  step.current
                    ? 'text-white'
                    : step.level % 5 === 0
                      ? 'text-[#F0A844]'
                      : 'text-white/30 group-hover:text-white/50'
                }`}>
                  {step.prize}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Lifeline Overlays */}
      <AnimatePresence>
        {activeLifeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D0908]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-10"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1A1312] border-2 border-[#F0A844]/30 rounded-[48px] p-16 max-w-2xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <button
                onClick={() => setActiveLifeline(null)}
                className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
              >
                <X size={32} strokeWidth={3} />
              </button>

              {activeLifeline === 'phone' && lifelineData && (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-[#EF6637] p-1 mx-auto mb-10 shadow-2xl">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lifelineData.avatarName}`} className="w-full h-full rounded-full bg-[#4A2B28]" />
                  </div>
                  <h3 className="text-[#F0A844] font-serif font-black text-3xl italic mb-6">Call with {lifelineData.avatarName}</h3>
                  <p className="text-white text-2xl font-serif italic leading-relaxed mb-12">&ldquo;{lifelineData.hintText}&rdquo;</p>
                </div>
              )}

              {activeLifeline === 'sage' && lifelineData && (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-[32px] bg-[#4A2B28] flex items-center justify-center mx-auto mb-10 shadow-2xl border-2 border-[#F0A844]/40">
                    <BookOpen size={64} className="text-[#F0A844]" />
                  </div>
                  <h3 className="text-[#F0A844] font-serif font-black text-3xl italic mb-6">Scholarly Guidance</h3>
                  <p className="text-white text-2xl font-serif italic leading-relaxed mb-12">&ldquo;{lifelineData.hintText}&rdquo;</p>
                </div>
              )}

              {activeLifeline === 'class' && lifelineData && (
                <div className="text-center">
                  <h3 className="text-[#F0A844] font-serif font-black text-4xl italic mb-12">Collective Consensus</h3>
                  <div className="space-y-6 mb-12">
                    {Object.entries(lifelineData.votes).map(([ansId, count]) => {
                      const percentage = lifelineData.totalVotes ? Math.round((count / lifelineData.totalVotes) * 100) : 0
                      return (
                        <div key={ansId} className="flex items-center gap-6">
                          <span className="w-12 font-black text-[#F0A844] text-xl font-serif">{ansId}</span>
                          <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className="h-full bg-[#EF6637] rounded-full shadow-[0_0_15px_rgba(239,102,55,0.5)]"
                            />
                          </div>
                          <span className="w-16 text-right font-black text-white text-xl">{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveLifeline(null)}
                className="w-full h-20 rounded-2xl bg-[#EF6637] text-white font-black text-xl uppercase tracking-widest hover:bg-[#f27a52] transition-all shadow-2xl font-serif italic"
              >
                Return to Hot Seat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GamePage
