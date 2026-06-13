import { motion } from 'framer-motion'
import { RotateCcw, Eye, Share2 } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const STATS = [
  { label: 'FINAL PRIZE', value: '$1,000,000', accent: true },
  { label: 'ACCURACY', value: '15 / 15 Correct', accent: false },
  { label: 'COHORT RANK', value: 'Top 0.1%', accent: true },
]

const VictoryPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#0D0908] font-sans selection:bg-[#EF6637]/30 text-[#F5F2F0] overflow-hidden relative">
    {/* Background Decorative Rings */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border-[1px] border-white/5 rounded-full -z-0" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[1px] border-white/5 rounded-full -z-0" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-0" />

    <AppNavBar active={getNavActive(ROUTES.VICTORY)} onNavigate={onNavigate} />

    <div className="max-w-[1440px] mx-auto px-10 py-12 flex flex-col items-center relative z-10">
      {/* Achievement Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[500px] aspect-square bg-[#4A2B28] rounded-[48px] flex flex-col items-center justify-center p-12 mb-20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden border-2 border-[#F0A844]/20 group"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EF6637]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.img
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ repeat: Infinity, duration: 4, repeatType: "mirror" }}
            src="/Win_Page_Tree.png"
            alt="HCI Sage emblem"
            className="w-[320px] h-[320px] object-contain mb-10 drop-shadow-[0_20px_50px_rgba(240,168,68,0.4)]"
          />
          <div className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-[#F0A844]" />
            <p className="text-[#F0A844] text-[18px] font-black tracking-[0.4em] uppercase font-sans">
              HCI SAGE STATUS UNLOCKED
            </p>
            <div className="w-8 h-[2px] bg-[#F0A844]" />
          </div>
        </div>
      </motion.div>

      {/* Hero Text */}
      <div className="text-center mb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-serif font-black text-[72px] md:text-[100px] mb-8 leading-none italic tracking-tighter text-[#F0A844]"
        >
          You are an HCI Millionaire!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-[#F5F2F0]/60 text-[28px] md:text-[32px] max-w-5xl mx-auto leading-relaxed italic font-serif"
        >
          &ldquo;Your mastery of contextually grounded African interactive design principles has
          secured the highest tier of intellectual prestige.&rdquo;
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-24 w-full max-w-6xl">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.2 }}
            className="bg-[#1A1312] rounded-[32px] p-12 flex flex-col items-center justify-center shadow-2xl border border-white/5 hover:border-[#EF6637]/30 transition-all group"
          >
            <p className="text-[#F5F2F0]/20 text-[14px] font-black tracking-[0.4em] mb-6 uppercase font-sans">
              {stat.label}
            </p>
            <p
              className={`font-black text-[48px] font-serif italic tracking-tighter leading-none ${
                stat.accent ? 'text-[#F0A844]' : 'text-white'
              }`}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col md:flex-row items-center justify-center gap-12 w-full"
      >
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.GAME)}
          className="flex items-center justify-center gap-4 px-16 h-20 bg-[#EF6637] text-white font-black rounded-2xl hover:bg-[#F27A52] transition-all shadow-[0_20px_50px_rgba(239,102,55,0.4)] active:scale-95 text-[22px] font-serif italic min-w-[320px] uppercase tracking-wider"
        >
          <RotateCcw size={32} strokeWidth={3} />
          Play Again
        </button>
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.GAME)}
          className="flex items-center justify-center gap-4 px-16 h-20 rounded-2xl border-4 border-white/10 bg-[#1A1312] text-white font-black hover:bg-[#4A2B28] transition-all text-[22px] font-serif italic min-w-[320px] shadow-2xl group uppercase tracking-wider"
        >
          <Eye size={32} strokeWidth={3} className="text-[#F0A844] group-hover:scale-110 transition-transform" />
          Review Answers
        </button>
        <button
          type="button"
          className="flex items-center gap-4 text-[#F5F2F0]/40 font-black hover:text-[#EF6637] transition-all text-[20px] font-serif italic group"
        >
          <Share2 size={28} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
          Share Performance
        </button>
      </motion.div>
    </div>
  </div>
)

export default VictoryPage
