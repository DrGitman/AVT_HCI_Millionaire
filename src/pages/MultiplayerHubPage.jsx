import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { getNavActive } from '../navigation/navActive'
import { Users, Plus } from 'lucide-react'

const MultiplayerHubPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#120d0c]">
      <AppNavBar active={getNavActive(ROUTES.MULTIPLAYER)} onNavigate={onNavigate} />
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Users className="w-16 h-16 text-[#E05B2D]" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-[#F0A844] text-center mb-4"
        >
          Multiplayer Mode
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#F5F2F0]/70 text-center mb-16 text-lg max-w-2xl"
        >
          Challenge other scholars in real-time multiplayer matches. Join an existing session or create your own room.
        </motion.p>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {/* Join Room */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(ROUTES.JOIN_ROOM)}
            className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#3d2b2a] to-[#2a1f1d] border-2 border-[#E05B2D]/50 hover:border-[#E05B2D] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#E05B2D]/5 group-hover:bg-[#E05B2D]/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-[#E05B2D]/20 flex items-center justify-center mb-4 group-hover:bg-[#E05B2D]/30 transition-colors">
                <Users className="w-6 h-6 text-[#E05B2D]" />
              </div>
              <h3 className="text-2xl font-bold text-[#F5F2F0] mb-2">Join Session</h3>
              <p className="text-[#F5F2F0]/70 mb-6">Enter a room code to join an existing game</p>
              <span className="inline-block text-[#E05B2D] font-semibold group-hover:translate-x-2 transition-transform">
                Join Now →
              </span>
            </div>
          </motion.button>

          {/* Create Room */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(ROUTES.CREATE_ROOM)}
            className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#3d2b2a] to-[#2a1f1d] border-2 border-[#F0A844]/50 hover:border-[#F0A844] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#F0A844]/5 group-hover:bg-[#F0A844]/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-[#F0A844]/20 flex items-center justify-center mb-4 group-hover:bg-[#F0A844]/30 transition-colors">
                <Plus className="w-6 h-6 text-[#F0A844]" />
              </div>
              <h3 className="text-2xl font-bold text-[#F5F2F0] mb-2">Create Room</h3>
              <p className="text-[#F5F2F0]/70 mb-6">Set up a new game and invite other players</p>
              <span className="inline-block text-[#F0A844] font-semibold group-hover:translate-x-2 transition-transform">
                Create Now →
              </span>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  )
}

export default MultiplayerHubPage
