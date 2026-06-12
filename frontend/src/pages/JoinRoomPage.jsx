import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { getNavActive } from '../navigation/navActive'

const JoinRoomPage = ({ onNavigate }) => {
  const [roomCode, setRoomCode] = useState(['H', 'C', 'I', '2', '0', '2'])
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
    <div className="min-h-screen bg-[#0D0908] font-sans text-[#F5F2F0] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-0" />

      <AppNavBar active={getNavActive(ROUTES.MULTIPLAYER)} onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-10 py-16 flex flex-col items-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 px-12 py-3 rounded-full border-2 border-[#F0A844]/20 bg-[#1A1312] inline-block shadow-2xl"
        >
          <span className="text-[#F0A844] text-[14px] font-black tracking-[0.4em] uppercase font-sans">JOIN A SESSION</span>
        </motion.div>

        {/* Title Section */}
        <div className="text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[64px] md:text-[88px] font-black text-[#F0A844] mb-6 font-serif italic tracking-tighter leading-none"
          >
            Enter Room Code
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#F5F2F0]/40 text-[24px] font-serif italic"
          >
            Ask your host for the unique 6-character access code
          </motion.p>
        </div>

        {/* Code Input Area */}
        <div className="w-full flex flex-col items-center gap-12">
          <div className="flex gap-6 md:gap-8 justify-center">
            {roomCode.map((digit, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <input
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength="1"
                  className={`w-20 h-32 md:w-[120px] md:h-[160px] text-center text-[72px] font-black rounded-[32px] border-4 transition-all duration-500 focus:outline-none font-serif italic shadow-2xl ${
                    digit
                      ? 'border-[#EF6637] bg-[#4A2B28] text-white shadow-[0_20px_50px_rgba(239,102,55,0.3)]'
                      : 'border-white/10 bg-[#1A1312] text-white/20'
                  }`}
                  autoFocus={index === 0}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-[2px] bg-white/10" />
            <p className="text-white/20 text-[14px] font-black tracking-[0.4em] uppercase font-sans">
              CODE IS CASE-INSENSITIVE
            </p>
            <div className="w-12 h-[2px] bg-white/10" />
          </div>
        </div>

        {/* Joining As */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 flex flex-col items-center gap-8"
        >
          <p className="text-white/30 text-[18px] font-serif italic tracking-tight">Joining the session as:</p>
          <div className="flex items-center gap-6 bg-[#1A1312] px-10 py-5 rounded-[24px] border border-white/5 shadow-2xl scale-110">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#4A2B28] border-2 border-[#F0A844]/20 shadow-inner">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sammy"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-black text-[24px] font-serif italic tracking-tight">{playerName}</span>
          </div>
        </motion.div>

        {/* Join Button */}
        <div className="mt-24 w-full flex flex-col items-center">
          <button
            onClick={() => isCodeComplete && onNavigate(ROUTES.GUEST_LOBBY)}
            disabled={!isCodeComplete}
            className={`w-full max-w-xl h-24 rounded-[32px] font-black text-[28px] transition-all duration-500 font-serif italic tracking-tight shadow-2xl ${
              isCodeComplete
                ? 'bg-[#EF6637] text-white hover:bg-[#f27a52] hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(239,102,55,0.4)]'
                : 'bg-[#1A1312] text-white/10 cursor-not-allowed border-2 border-white/5'
            }`}
          >
            Authenticate & Join
          </button>

          <div className="mt-24 h-[2px] w-full max-w-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <p className="mt-16 text-[#F5F2F0]/40 text-[20px] font-serif italic">
            Don't have a code?{' '}
            <button
              onClick={() => onNavigate(ROUTES.CREATE_ROOM)}
              className="text-[#F0A844] font-black hover:text-[#EF6637] transition-all ml-2 underline underline-offset-8 decoration-2"
            >
              Create your own room →
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default JoinRoomPage
