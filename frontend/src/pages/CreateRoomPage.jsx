import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { getNavActive } from '../navigation/navActive'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { api } from '../lib/api'

const CreateRoomPage = ({ onNavigate }) => {
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [competitiveMode, setCompetitiveMode] = useState('real-time')
  const [selectedTheme, setSelectedTheme] = useState('hci-ethics')
  const [timePerQuestion, setTimePerQuestion] = useState('45s')

  const THEMES = [
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'hci-ethics', label: 'HCI Ethics' },
    { id: 'engagement', label: 'Engagement Principles' },
    { id: 'interaction', label: 'Interaction Design' },
    { id: 'african-values', label: 'African Values and Philosophies' },
  ]

  const MODES = [
    { id: 'real-time', label: 'Real-Time Speed' },
    { id: 'survival', label: 'Survival' },
    { id: 'turn-based', label: 'Turn-Based' },
  ]

  const TIME_OPTIONS = [
    { id: '30s', label: '30s' },
    { id: '45s', label: '45s' },
    { id: '60s', label: '60s' },
  ]

  const handleCreateRoom = () => {
    const stored = localStorage.getItem('hci_selected_categories')
    const categoryIds = stored ? JSON.parse(stored) : [1, 2, 3, 4, 5]

    api.startGame(categoryIds, maxPlayers).then(res => {
      onNavigate(ROUTES.HOST_LOBBY, {
        gameId: res.GameId,
        roomCode: res.gameCode,
        maxPlayers: res.maxPlayers
      })
    }).catch(console.error)
  }

  return (
    <div className="min-h-screen bg-[#0D0908] font-sans text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#EF6637]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-0" />

      <AppNavBar active={getNavActive(ROUTES.CREATE_ROOM)} onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-10 py-16 flex flex-col items-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 px-12 py-3 rounded-full border-2 border-[#F0A844]/20 bg-[#1A1312] inline-block shadow-2xl"
        >
          <span className="text-[#F0A844] text-[14px] font-black tracking-[0.4em] uppercase font-sans">ROOM SETUP</span>
        </motion.div>

        {/* Title Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[64px] md:text-[88px] font-black text-[#F0A844] mb-6 font-serif italic tracking-tighter leading-none"
          >
            Configure Your Session
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#F5F2F0]/40 text-[24px] font-serif italic"
          >
            Prepare the digital hearth for scholarly competition.
          </motion.p>
        </div>

        {/* Config Card */}
        <div className="w-full max-w-6xl bg-[#1A1312] border-l-[12px] border-[#EF6637] rounded-[48px] p-16 md:p-24 space-y-20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Max Players */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h3 className="text-[16px] font-black tracking-[0.4em] text-[#EF6637] mb-4 uppercase font-sans italic">
                MAX PLAYERS
              </h3>
              <p className="text-[#F5F2F0]/40 text-[20px] font-serif italic">
                Limit the number of players participating in this scholarly circle.
              </p>
            </div>
            <div className="flex items-center bg-[#0D0908] p-3 rounded-[32px] border-2 border-white/5 shadow-inner">
              <button
                onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                className="w-16 h-16 rounded-2xl bg-[#4A2B28] hover:bg-[#EF6637] text-white flex items-center justify-center transition-all active:scale-90 border border-[#F0A844]/20 group"
              >
                <Minus size={32} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
              </button>
              <span className="text-[42px] font-black text-white w-24 text-center font-serif italic">
                {maxPlayers}
              </span>
              <button
                onClick={() => setMaxPlayers(Math.min(8, maxPlayers + 1))}
                className="w-16 h-16 rounded-2xl bg-[#4A2B28] hover:bg-[#EF6637] text-white flex items-center justify-center transition-all active:scale-90 border border-[#F0A844]/20 group"
              >
                <Plus size={32} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Competitive Mode */}
          <div>
            <h3 className="text-[16px] font-black tracking-[0.4em] text-[#EF6637] mb-10 uppercase font-sans italic">
              COMPETITIVE MODE
            </h3>
            <div className="flex flex-wrap gap-6">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setCompetitiveMode(mode.id)}
                  className={`px-14 py-5 rounded-2xl font-black text-[18px] transition-all duration-500 font-serif italic tracking-tight ${
                    competitiveMode === mode.id
                      ? 'bg-[#EF6637] text-white shadow-[0_15px_30px_rgba(239,102,55,0.4)] scale-105'
                      : 'bg-[#0D0908] text-white/20 hover:text-white/40 border-2 border-white/5'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-[16px] font-black tracking-[0.4em] text-[#EF6637] mb-10 uppercase font-sans italic">
              SELECT SCHOLARLY THEME
            </h3>
            <div className="flex flex-wrap gap-x-8 gap-y-6">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`relative px-12 py-5 font-black text-[18px] transition-all duration-500 min-w-[220px] font-serif italic tracking-tight ${
                    selectedTheme === theme.id
                      ? "text-[#F0A844] border-[#EF6637] bg-[#4A2B28] shadow-2xl scale-105"
                      : "text-white/20 border-white/5 bg-[#0D0908]"
                  }`}
                  style={{
                    clipPath: "polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)",
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Per Question */}
          <div>
            <h3 className="text-[16px] font-black tracking-[0.4em] text-[#EF6637] mb-10 uppercase font-sans italic">
              TIME PER EVALUATION
            </h3>
            <div className="flex gap-6">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTimePerQuestion(option.id)}
                  className={`w-36 py-5 rounded-2xl font-black text-[20px] transition-all duration-500 font-serif italic tracking-tight ${
                    timePerQuestion === option.id
                      ? 'bg-[#EF6637] text-white shadow-[0_15px_30px_rgba(239,102,55,0.4)] scale-105'
                      : 'bg-[#0D0908] text-white/20 hover:text-white/40 border-2 border-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Create Button Section */}
          <div className="pt-20 border-t-2 border-white/5 flex flex-col items-center">
            <button
              onClick={handleCreateRoom}
              className="w-full max-w-2xl h-24 bg-[#EF6637] hover:bg-[#f27a52] text-white font-black rounded-3xl flex items-center justify-center gap-6 transition-all shadow-[0_30px_60px_rgba(239,102,55,0.3)] active:scale-[0.98] group uppercase tracking-[0.1em]"
            >
              <span className="text-[28px] font-serif italic">Create Room & Get Code</span>
              <ArrowRight size={36} strokeWidth={3} className="group-hover:translate-x-3 transition-transform" />
            </button>
            <p className="mt-12 text-[#F5F2F0]/20 text-[18px] font-serif italic">
              &ldquo;You will be designated as the <span className="text-[#F0A844] font-black">Party Lead</span> for this session.&rdquo;
            </p>
          </div>
        </div>

        {/* Bottom Decorative Pattern */}
        <div className="mt-24 opacity-20">
          <div className="w-20 h-20 border-4 border-[#F0A844] rotate-45 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[#F0A844]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRoomPage
