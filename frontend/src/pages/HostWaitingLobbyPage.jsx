import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, BookOpen, Copy, Check, Play, X } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const HostWaitingLobbyPage = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false)
  const roomCode = 'HCI-7F3'

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const players = [
    { name: 'Host (You)', role: 'HOST', avatar: 'Felix', active: true },
    { name: 'Nandi_D', role: 'READY', avatar: 'Nandi', active: true },
    { name: 'Waiting...', role: null, avatar: null, active: false },
    { name: 'Waiting...', role: null, avatar: null, active: false },
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
          className="mb-12 px-12 py-3 rounded-full border-2 border-[#F0A844]/20 bg-[#1A1312] inline-block shadow-2xl"
        >
          <span className="text-[#F0A844] text-[14px] font-black tracking-[0.4em] uppercase font-sans animate-pulse">WAITING FOR SCHOLARS (2/4)</span>
        </motion.div>

        {/* Room Code Card */}
        <div className="w-full max-w-3xl bg-[#1A1312] border-2 border-[#F0A844]/30 rounded-[48px] p-16 text-center mb-20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F0A844]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <p className="text-[#F0A844] text-[16px] font-black tracking-[0.5em] uppercase mb-6 font-sans italic opacity-60">
            ROOM ACCESS CODE
          </p>
          <div className="flex items-center justify-center gap-10">
            <h1 className="text-[120px] md:text-[140px] font-black tracking-tighter text-white leading-none font-serif italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {roomCode}
            </h1>
            <button
              onClick={copyCode}
              className={`w-20 h-20 rounded-3xl transition-all duration-500 flex items-center justify-center shadow-2xl active:scale-90 border-2 ${
                copied ? 'bg-green-500 border-green-400' : 'bg-[#EF6637] border-[#F0A844]/30 hover:scale-110'
              }`}
            >
              {copied ? <Check size={40} strokeWidth={4} /> : <Copy size={40} strokeWidth={3} />}
            </button>
          </div>
          <p className="mt-10 text-[#F5F2F0]/40 text-[20px] font-serif italic">
            &ldquo;Share this code with fellow scholars to initiate the session.&rdquo;
          </p>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1200px] mb-20">
          {players.map((player, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`relative rounded-[40px] p-12 flex flex-col items-center transition-all duration-500 min-h-[320px] justify-center overflow-hidden border-2 ${
                player.active
                  ? 'bg-[#4A2B28] border-[#F0A844]/40 shadow-2xl scale-105'
                  : 'bg-[#1A1312]/40 border-dashed border-white/10'
              }`}
            >
              {player.active ? (
                <>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="w-28 h-28 rounded-[32px] overflow-hidden border-4 border-[#F0A844]/20 mb-8 bg-[#0D0908] shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.avatar}`}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-black text-[24px] text-white mb-6 font-serif italic tracking-tight">{player.name}</p>
                  <span className={`px-6 py-2 rounded-xl text-[12px] font-black tracking-[0.3em] uppercase font-sans ${
                    player.role === 'HOST'
                      ? 'bg-[#EF6637] text-white shadow-[0_5px_15px_rgba(239,102,55,0.4)]'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {player.role}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center opacity-40">
                  <div className="w-20 h-20 rounded-[24px] border-4 border-white/5 flex items-center justify-center mb-8 bg-white/5">
                    <div className="w-4 h-4 rounded-full bg-[#F0A844]/40 animate-ping" />
                  </div>
                  <p className="text-white/40 text-[18px] font-black font-serif italic tracking-wide">Waiting...</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Config Summary */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {[
            { icon: Zap, label: 'Real-Time Speed' },
            { icon: Clock, label: '45s Evaluation' },
            { icon: BookOpen, label: 'Heritage + Ethics' },
          ].map(({ icon: Icon, label }, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-10 py-5 rounded-2xl bg-[#1A1312] border-2 border-white/5 text-[18px] font-black text-white/60 shadow-2xl font-serif italic tracking-tight"
            >
              <Icon size={24} strokeWidth={2.5} className="text-[#EF6637]" />
              {label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col items-center gap-8">
          <button
            onClick={() => onNavigate(ROUTES.MULTIPLAYER_GAME)}
            className="w-full max-w-xl h-24 rounded-3xl bg-[#EF6637] text-white font-black text-[28px] uppercase tracking-widest shadow-[0_25px_60px_rgba(239,102,55,0.4)] hover:bg-[#f27a52] hover:scale-105 transition-all flex items-center justify-center gap-8 group font-serif italic"
          >
            <Play size={40} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
            Commence Game
          </button>

          <button
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="w-full max-w-md py-6 rounded-2xl border-4 border-white/5 text-white/20 font-black text-[20px] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-4 font-serif italic tracking-tight"
          >
            <X size={28} strokeWidth={3} />
            Dissolve Room
          </button>

          <p className="mt-6 text-white/20 text-[16px] font-serif italic">
            &ldquo;Session will initiate automatically once the scholarly quorum is met.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}

export default HostWaitingLobbyPage
