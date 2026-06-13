import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hourglass, Zap, Clock, BookOpen, Lightbulb } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const GuestWaitingLobbyPage = ({ onNavigate }) => {
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setCountdown(5), 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      onNavigate(ROUTES.MULTIPLAYER_GAME)
      return
    }
    const interval = setInterval(() => setCountdown((p) => p - 1), 1000)
    return () => clearInterval(interval)
  }, [countdown, onNavigate])

  const players = [
    { name: 'Sammy (Host)', role: 'HOST', active: true, avatar: 'Sammy' },
    { name: 'Nandi_D', role: 'READY', active: true, avatar: 'Nandi' },
    { name: 'Waiting...', role: null, active: false, avatar: null },
    { name: 'Waiting...', role: null, active: false, avatar: null },
  ]

  return (
    <div className="min-h-screen bg-[#0D0908] text-[#F5F2F0] font-sans overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-0" />

      <AppNavBar active={getNavActive(ROUTES.MULTIPLAYER)} onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-10 py-12 flex flex-col items-center relative z-10">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 px-12 py-3 rounded-full border-2 border-[#EF6637]/20 bg-[#1A1312] inline-block shadow-2xl"
        >
          <span className="text-[#EF6637] text-[14px] font-black tracking-[0.4em] uppercase font-sans italic">SESSION CONNECTED</span>
        </motion.div>

        {/* Status Card */}
        <div className="w-full max-w-4xl bg-[#1A1312] border-2 border-[#F0A844]/30 rounded-[48px] p-20 text-center mb-16 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          {countdown !== null ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-4"
            >
              <p className="text-[#F0A844] text-[18px] font-black tracking-[0.5em] uppercase mb-8 font-sans italic">
                INITIATING EVALUATION IN
              </p>
              <h1 className="text-[140px] font-black text-[#EF6637] leading-none font-serif italic tracking-tighter drop-shadow-[0_0_30px_rgba(239,102,55,0.4)]">
                {countdown}s
              </h1>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-10">
                <h1 className="text-[56px] md:text-[64px] font-black text-[#F0A844] leading-tight font-serif italic tracking-tighter">
                  Awaiting Host to Commence...
                </h1>
                <div className="bg-[#EF6637] w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(239,102,55,0.4)] relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                  <Hourglass size={48} strokeWidth={3} className="relative z-10" />
                </div>
              </div>
              <p className="text-[#F5F2F0]/40 text-[24px] font-serif italic">
                &ldquo;Relax, scholar. The evaluation begins when <span className="text-[#F0A844] font-black">Sammy</span> signals.&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl mb-16">
          {players.map((player, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`relative rounded-[40px] p-10 flex flex-col items-center justify-center transition-all duration-500 min-h-[300px] border-2 overflow-hidden ${
                player.active
                  ? idx === 0
                    ? 'bg-[#4A2B28] border-[#F0A844]/40 shadow-2xl scale-105'
                    : 'bg-[#1A1312] border-white/10 shadow-xl'
                  : 'border-dashed border-white/5 bg-white/[0.02] opacity-40'
              }`}
            >
              {player.active ? (
                <>
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-[#F0A844]/20 mb-6 bg-[#0D0908] shadow-2xl">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.avatar}`}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-black text-[22px] text-white mb-4 font-serif italic tracking-tight">{player.name}</p>
                  <span className={`px-6 py-1.5 rounded-xl text-[12px] font-black tracking-[0.3em] uppercase font-sans ${
                    player.role === 'HOST'
                      ? 'bg-[#EF6637] text-white shadow-lg'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {player.role}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-[24px] border-2 border-white/10 flex items-center justify-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-[#F0A844]/20" />
                  </div>
                  <p className="text-white/20 text-[14px] font-black tracking-[0.3em] uppercase font-sans">WAITING...</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Educational Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-4xl bg-[#4A2B28] border-l-[12px] border-[#EF6637] rounded-[48px] p-16 mb-20 relative shadow-[0_40px_80px_rgba(0,0,0,0.4)] group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF6637]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#EF6637]/10 transition-all" />

          <div className="flex items-center gap-6 text-[#F0A844] font-black text-[18px] mb-8 uppercase tracking-[0.4em] font-sans italic">
            <Lightbulb size={32} strokeWidth={2.5} className="text-[#EF6637]" />
            While You Wait...
          </div>
          <p className="text-[#F5F2F0]/80 text-[24px] leading-relaxed mb-10 font-serif italic">
            This session includes heavy emphasis on <span className="text-white font-black">African Philosophies</span> and their intersection with technology. Quick refresh on these core concepts:
          </p>
          <div className="flex flex-wrap gap-6 mb-12">
            {['Ubuntu', 'Philosophical Sagacity', "Ma'at"].map((tag) => (
              <span
                key={tag}
                className="px-8 py-4 rounded-2xl bg-[#0D0908] border-2 border-white/5 text-[18px] font-black text-[#F0A844] shadow-2xl font-serif italic tracking-tight"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => onNavigate(ROUTES.LEARN_HUB)}
            className="text-[#EF6637] font-black text-[18px] uppercase tracking-[0.3em] hover:text-[#F0A844] transition-all flex items-center gap-4 group font-sans italic border-b-2 border-transparent hover:border-[#F0A844] pb-1"
          >
            QUICK ARCHIVE REVIEW
            <span className="text-3xl group-hover:translate-x-3 transition-transform">→</span>
          </button>
        </motion.div>

        {/* Leave Room Action */}
        <button
          onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
          className="px-16 py-6 rounded-2xl border-4 border-white/10 text-white/20 font-black text-[18px] hover:bg-white/5 hover:text-white transition-all font-serif italic tracking-tight uppercase"
        >
          Dissociate from Room
        </button>
      </div>
    </div>
  )
}

export default GuestWaitingLobbyPage
