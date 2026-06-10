import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'

const JoinRoomPage = ({ onNavigate }) => {
  const [roomCode, setRoomCode] = useState(['', '', '', '', '', ''])
  const [playerName] = useState('Sammy')

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^[A-Z0-9]*$/.test(value.toUpperCase())) {
      const newCode = [...roomCode]
      newCode[index] = value.toUpperCase()
      setRoomCode(newCode)

      // Auto focus next input
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !roomCode[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const completeCode = roomCode.join('')
  const isCodeComplete = completeCode.length === 6

  return (
    <div className="min-h-screen bg-[#120d0c]">
      <AppNavBar active={ROUTES.MULTIPLAYER} onNavigate={onNavigate} />
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 py-2 rounded-full border border-[#F5F2F0]/20 bg-[#3d2b2a]"
        >
          <span className="text-[#E05B2D] text-sm font-semibold">JOIN A SESSION</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl font-bold text-[#E05B2D] text-center mb-4"
        >
          Enter Room Code
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#F5F2F0]/70 text-center mb-12 text-lg"
        >
          Ask your host for the 6-character code
        </motion.p>

        {/* Code Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 md:gap-4 mb-6 justify-center flex-wrap"
        >
          {roomCode.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold rounded-lg border-2 border-[#E05B2D]/50 bg-[#3d2b2a] text-[#F0A844] placeholder-[#F5F2F0]/20 focus:outline-none focus:border-[#E05B2D] focus:ring-2 focus:ring-[#E05B2D]/30 transition-all"
              placeholder="0"
            />
          ))}
        </motion.div>

        {/* Info text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#F5F2F0]/50 text-sm mb-8"
        >
          CODE is case-insensitive
        </motion.p>

        {/* Player info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-[#F5F2F0]/70 mb-2">Joining as:</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E05B2D]/30 flex items-center justify-center">
              <span className="text-[#E05B2D] font-bold text-sm">S</span>
            </div>
            <p className="text-[#F5F2F0] font-medium">{playerName}</p>
          </div>
        </motion.div>

        {/* Join Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => isCodeComplete && onNavigate(ROUTES.GUEST_LOBBY)}
          disabled={!isCodeComplete}
          className={`w-full max-w-sm px-8 py-4 rounded-full font-bold text-lg transition-all mb-6 ${
            isCodeComplete
              ? 'bg-[#E05B2D] text-[#120d0c] hover:bg-[#F27A52] cursor-pointer'
              : 'bg-[#3d2b2a] text-[#F5F2F0]/50 cursor-not-allowed opacity-50'
          }`}
        >
          Join Session
        </motion.button>

        {/* Create Room Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-[#F5F2F0]/70">
            Don't have a code?{' '}
            <button
              onClick={() => onNavigate(ROUTES.CREATE_ROOM)}
              className="text-[#E05B2D] font-semibold hover:text-[#F27A52] transition-colors"
            >
              Create your own room →
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default JoinRoomPage
