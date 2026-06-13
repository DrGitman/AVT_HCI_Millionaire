import { motion } from 'framer-motion'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { getNavActive } from '../navigation/navActive'
import { Users, Plus } from 'lucide-react'

const MultiplayerHubPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0D0908] font-sans overflow-hidden">
      <AppNavBar active={getNavActive(ROUTES.MULTIPLAYER)} onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-10 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] relative">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-10" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 px-10 py-3 rounded-full border-2 border-[#F0A844]/20 bg-[#1A1312] inline-block shadow-2xl"
        >
          <span className="text-[#F0A844] text-[14px] font-black tracking-[0.5em] uppercase font-sans">MULTIPLAYER HUB</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[72px] md:text-[100px] font-black text-[#F0A844] text-center mb-8 tracking-tighter font-serif italic leading-none"
        >
          Choose Your Path
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#F5F2F0]/40 text-center mb-24 text-[24px] max-w-3xl font-serif italic leading-relaxed"
        >
          Challenge other scholars in real-time multiplayer matches. Join an existing session or create your own room.
        </motion.p>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl">
          {/* Join Room */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(ROUTES.JOIN_ROOM)}
            className="group relative p-16 rounded-[48px] bg-[#1A1312] border border-white/5 hover:border-[#EF6637]/40 transition-all shadow-[0_40px_100px_rgba(0,0,0,0.5)] text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF6637]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#EF6637]/10 transition-all" />
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-[32px] bg-[#EF6637] flex items-center justify-center mb-10 shadow-2xl group-hover:rotate-6 transition-all duration-500">
                <Users className="w-12 h-12 text-white shadow-xl" strokeWidth={2.5} />
              </div>
              <h3 className="text-[42px] font-black text-[#F5F2F0] mb-6 font-serif italic tracking-tight">Join Session</h3>
              <p className="text-[#F5F2F0]/40 text-[20px] mb-12 font-serif italic leading-relaxed">Enter a room code to join an existing game and compete instantly with scholars worldwide.</p>
              <div className="flex items-center gap-4 text-[#EF6637] font-black text-[16px] tracking-[0.2em] uppercase font-sans group-hover:gap-6 transition-all italic">
                Join Now <span className="text-[24px]">→</span>
              </div>
            </div>
          </motion.button>

          {/* Create Room */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(ROUTES.CREATE_ROOM)}
            className="group relative p-16 rounded-[48px] bg-[#1A1312] border border-white/5 hover:border-[#F0A844]/40 transition-all shadow-[0_40px_100px_rgba(0,0,0,0.5)] text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0A844]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#F0A844]/10 transition-all" />
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-[32px] bg-[#4A2B28] flex items-center justify-center mb-10 shadow-2xl group-hover:-rotate-6 transition-all duration-500 border border-[#F0A844]/20">
                <Plus className="w-12 h-12 text-[#F0A844] shadow-xl" strokeWidth={3} />
              </div>
              <h3 className="text-[42px] font-black text-[#F5F2F0] mb-6 font-serif italic tracking-tight">Create Room</h3>
              <p className="text-[#F5F2F0]/40 text-[20px] mb-12 font-serif italic leading-relaxed">Set up a new game, configure custom rules, and invite your fellow scholars to the hot seat.</p>
              <div className="flex items-center gap-4 text-[#F0A844] font-black text-[16px] tracking-[0.2em] uppercase font-sans group-hover:gap-6 transition-all italic">
                Create Now <span className="text-[24px]">→</span>
              </div>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  )
}

export default MultiplayerHubPage
