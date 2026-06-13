import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, LogOut, BookOpen, Eye, MonitorPlay } from 'lucide-react'
import { ROUTES } from '../navigation/routes'

const EliminationSpectatorPage = ({ onNavigate }) => {
  const [spectating, setSpectating] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D0908] text-[#F5F2F0] flex flex-col items-center py-24 font-sans overflow-x-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-0" />

      <div className="max-w-[1000px] w-full px-10 relative z-10">
        {spectating ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1312] border-2 border-[#EF6637]/30 rounded-[48px] p-16 text-center shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 shadow-[0_0_15px_#ef4444]"></span>
              </span>
              <span className="text-red-500 font-black text-[16px] tracking-[0.4em] uppercase font-sans">
                LIVE SPECTATING
              </span>
            </div>

            <h2 className="text-[48px] md:text-[64px] font-serif font-black text-[#F0A844] mb-6 italic leading-none tracking-tighter">
              Viewing Current Session
            </h2>
            <p className="text-[24px] md:text-[28px] text-[#F5F2F0]/40 mb-12 max-w-2xl mx-auto font-serif italic">
              The remaining scholars are currently navigating Question 11 for <span className="text-[#F0A844] font-black">$64,000</span>.
            </p>

            <div className="bg-[#0D0908]/50 rounded-[32px] p-10 mb-12 space-y-8 text-left border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#4A2B28] flex items-center justify-center font-black text-[#F0A844] text-[24px] font-serif italic shadow-xl">S</div>
                  <span className="text-[24px] font-black font-serif italic tracking-tight text-white">Sarah</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#F0A844] text-[16px] font-black tracking-[0.2em] uppercase font-sans italic">CHOOSING</span>
                  <span className="text-white/40 text-[14px] font-bold">22s remaining</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#4A2B28] flex items-center justify-center font-black text-[#F0A844] text-[24px] font-serif italic shadow-xl opacity-50">J</div>
                  <span className="text-[24px] font-black font-serif italic tracking-tight text-white/50">Julian</span>
                </div>
                <span className="text-[#EF6637] text-[16px] font-black tracking-[0.2em] uppercase font-sans italic px-4 py-1 bg-[#EF6637]/10 rounded-lg">LIFELINE USED</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button
                type="button"
                onClick={() => setSpectating(false)}
                className="px-12 py-5 rounded-2xl border-4 border-white/10 text-[20px] font-black hover:bg-white/5 transition-all font-serif italic tracking-tight uppercase"
              >
                Back to Statistics
              </button>
              <button
                type="button"
                onClick={() => onNavigate(ROUTES.MULTIPLAYER_STANDINGS)}
                className="px-12 py-5 rounded-2xl bg-[#EF6637] hover:bg-[#f27a52] text-white text-[20px] font-black shadow-[0_20px_40px_rgba(239,102,55,0.4)] transition-all font-serif italic tracking-tight uppercase"
              >
                Skip to Standings
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {/* Header */}
            <div className="text-center mb-24">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[64px] md:text-[88px] font-serif font-black text-[#F0A844] mb-6 leading-none italic tracking-tighter"
              >
                Your Journey Ends Here
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#F5F2F0]/40 text-[24px] md:text-[28px] font-serif italic"
              >
                You reached <span className="text-white font-black">Question 9</span> —{' '}
                <span className="text-[#F0A844] font-black">$16,000</span>
              </motion.p>
            </div>

            {/* Correct Logic Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#4A2B28] rounded-[48px] p-12 md:p-16 relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border-2 border-[#EF6637]/30 group"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#EF6637]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#EF6637]/10 transition-all" />

              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-[2px] bg-[#EF6637]" />
                <span className="text-[16px] font-black tracking-[0.4em] text-[#EF6637] uppercase font-sans italic">
                  THE CORRECT LOGIC
                </span>
              </div>

              <h3 className="font-serif text-[40px] md:text-[48px] text-[#F5F2F0] mb-12 leading-tight font-black italic tracking-tighter">
                &ldquo;One must approach elders and authorities in the community with respect.&rdquo;
              </h3>

              <div className="flex items-center gap-4 text-[#F0A844] text-[16px] font-black uppercase tracking-[0.2em] font-sans italic">
                <BookOpen size={24} strokeWidth={3} className="text-[#EF6637]" />
                <span>Source: HCI Fundamentals Archive, 2024 Edition</span>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'QUESTIONS CORRECT', value: '8' },
                { label: 'BEST STREAK', value: '5' },
                { label: 'FINAL LEVEL', value: '9' },
              ].map(({ label, value }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-[#1A1312] rounded-[32px] p-12 text-center flex flex-col items-center justify-center border border-white/5 shadow-2xl hover:border-[#F0A844]/30 transition-all group"
                >
                  <span className="text-[72px] font-black text-[#F0A844] mb-3 leading-none font-serif italic tracking-tighter group-hover:scale-110 transition-transform">{value}</span>
                  <span className="text-[12px] text-white/20 font-black tracking-[0.3em] uppercase font-sans">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Spectator Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#1A1312] border-2 border-[#F0A844]/20 rounded-[48px] p-16 md:p-20 text-left relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-10 mb-12">
                <div className="w-24 h-24 rounded-[32px] bg-[#4A2B28]/30 border-2 border-[#F0A844]/20 flex items-center justify-center text-[#F0A844] shadow-2xl shrink-0">
                  <Eye size={48} strokeWidth={2} />
                </div>
                <h3 className="text-[48px] md:text-[56px] font-serif font-black text-[#F0A844] italic tracking-tighter leading-tight">
                  Continue watching?
                </h3>
              </div>
              <p className="text-[22px] md:text-[26px] text-[#F5F2F0]/40 mb-16 leading-relaxed max-w-3xl font-serif italic">
                Your contribution as an archivist doesn't end here. Stay to witness the ascent of
                fellow scholars and support the remaining community in their pursuit of brilliance.
              </p>
              <div className="flex flex-col md:flex-row gap-8">
                <button
                  type="button"
                  onClick={() => setSpectating(true)}
                  className="flex-1 flex items-center justify-center gap-4 px-12 h-20 bg-[#EF6637] hover:bg-[#f27a52] text-white font-black text-[22px] rounded-2xl transition-all shadow-[0_20px_40px_rgba(239,102,55,0.4)] active:scale-95 font-serif italic tracking-tight uppercase"
                >
                  <MonitorPlay size={32} strokeWidth={2.5} />
                  Watch Live
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
                  className="flex-1 flex items-center justify-center gap-4 px-12 h-20 border-4 border-white/10 text-white font-black text-[22px] rounded-2xl hover:bg-white/5 transition-all active:scale-95 font-serif italic tracking-tight uppercase shadow-xl"
                >
                  <LogOut size={32} strokeWidth={2.5} className="text-white/40" />
                  Exit to Lobby
                </button>
              </div>
            </motion.div>

            {/* Footer Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center pt-20 pb-16"
            >
              <div className="w-20 h-1 bg-white/5 mx-auto mb-10 rounded-full" />
              <p className="font-serif text-[#F0A844]/30 text-[40px] md:text-[48px] italic leading-tight max-w-xl mx-auto tracking-tighter font-black">
                &ldquo;The path continues through the eyes of others.&rdquo;
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EliminationSpectatorPage
