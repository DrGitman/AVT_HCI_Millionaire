import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { ChevronRight } from 'lucide-react'

const CreateRoomPage = ({ onNavigate }) => {
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [competitiveMode, setCompetitiveMode] = useState('real-time')
  const [selectedTheme, setSelectedTheme] = useState('case-studies')
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
    onNavigate(ROUTES.HOST_LOBBY, {
      roomConfig: {
        maxPlayers,
        competitiveMode,
        theme: selectedTheme,
        timePerQuestion,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#120d0c]">
      <AppNavBar active={ROUTES.MULTIPLAYER} onNavigate={onNavigate} />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 py-2 rounded-full border border-[#F5F2F0]/20 bg-[#3d2b2a] inline-block"
        >
          <span className="text-[#E05B2D] text-sm font-semibold">ROOM SETUP</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-[#F0A844] mb-2"
        >
          Configure Your Session
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#F5F2F0]/70 mb-12 text-lg"
        >
          Prepare the digital hearth for scholarly competition.
        </motion.p>

        {/* Config Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#2D2421] border-l-4 border-[#E05B2D] rounded-lg p-8 space-y-8"
        >
          {/* Max Players */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#F0A844] mb-4">
              MAX PLAYERS
            </h3>
            <p className="text-[#F5F2F0]/70 text-sm mb-4">
              Limit the number of players in this circle
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                className="w-12 h-12 rounded-lg bg-[#E05B2D] hover:bg-[#F27A52] text-white font-bold transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="text-3xl font-bold text-[#F5F2F0] w-12 text-center">
                {maxPlayers}
              </span>
              <button
                onClick={() => setMaxPlayers(Math.min(8, maxPlayers + 1))}
                className="w-12 h-12 rounded-lg bg-[#E05B2D] hover:bg-[#F27A52] text-white font-bold transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F5F2F0]/10"></div>

          {/* Competitive Mode */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#F0A844] mb-4">
              COMPETITIVE MODE
            </h3>
            <div className="flex flex-wrap gap-3">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setCompetitiveMode(mode.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    competitiveMode === mode.id
                      ? 'bg-[#E05B2D] text-[#120d0c]'
                      : 'bg-[#3d2b2a] text-[#F5F2F0] hover:bg-[#4a3532]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F5F2F0]/10"></div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#F0A844] mb-4">
              THEME
            </h3>
            <div className="space-y-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center justify-between border ${
                    selectedTheme === theme.id
                      ? 'bg-[#613736] border-[#F0A844] text-[#F0A844]'
                      : 'bg-[#3d2b2a] border-[#F5F2F0]/10 text-[#F5F2F0] hover:border-[#F5F2F0]/20'
                  }`}
                >
                  <span>{theme.label}</span>
                  {selectedTheme === theme.id && (
                    <span className="text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F5F2F0]/10"></div>

          {/* Time Per Question */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#F0A844] mb-4">
              TIME PER QUESTION
            </h3>
            <div className="flex gap-3">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTimePerQuestion(option.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    timePerQuestion === option.id
                      ? 'bg-[#E05B2D] text-[#120d0c]'
                      : 'bg-[#3d2b2a] text-[#F5F2F0] hover:bg-[#4a3532]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Create Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleCreateRoom}
          className="w-full mt-8 px-8 py-4 rounded-lg bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] font-bold text-lg transition-all flex items-center justify-center gap-2 group"
        >
          Create Room & Get Code{' '}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Info text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[#F5F2F0]/50 text-sm mt-6"
        >
          You will be designated as the Party Lead for this session.
        </motion.p>
      </div>
    </div>
  )
}

export default CreateRoomPage
