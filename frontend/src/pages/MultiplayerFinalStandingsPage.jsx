import { useState } from 'react'
import { RefreshCw, Eye, Share2, Trophy } from 'lucide-react'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { motion } from 'framer-motion'
import { getNavActive } from '../navigation/navActive'

const MultiplayerFinalStandingsPage = ({ onNavigate, results, gameId }) => {
  // Sort results by rank if provided, otherwise fallback to defaults
  const sortedResults = results ? [...results].sort((a, b) => a.rank - b.rank) : [
    { rank: 1, name: 'Julian', title: 'HCI SAGE', score: '1,000,000', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop' },
    { rank: 2, name: 'Sarah', title: 'UBUNTU SCHOLAR', score: '500,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { rank: 3, name: 'Amara', title: 'EMERGING SAGE', score: '250,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara' },
    { rank: 4, name: 'Kofi', title: 'COMMUNITY LEARNER', score: '100,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi' },
  ]

  const winner = sortedResults[0]

  const getPodiumData = (res) => {
     return res.map(p => ({
        ...p,
        height: p.rank === 1 ? 'h-[380px]' : p.rank === 2 ? 'h-[300px]' : p.rank === 3 ? 'h-[240px]' : 'h-[160px]',
        order: p.rank === 1 ? 'order-2' : p.rank === 2 ? 'order-3' : p.rank === 3 ? 'order-1' : 'order-4',
        highlight: p.rank === 1,
        color: p.rank === 1 ? 'bg-gradient-to-b from-[#F0A844] to-[#3b2826]' : p.rank === 2 ? 'bg-[#533330]' : p.rank === 3 ? 'bg-[#3b2826]' : 'bg-[#211A19]',
        titleColor: p.rank === 1 ? 'text-[#F0A844]' : p.rank === 2 ? 'text-[#F0A844]' : p.rank === 3 ? 'text-[#ef6637]' : 'text-[#F5F2F0]/40'
     }))
  }

  const podium = getPodiumData(sortedResults.slice(0, 4))

  const [copiedLink, setCopiedLink] = useState(false)

  const handleShare = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0D0908] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border-[1px] border-white/5 rounded-full -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-0" />

      <AppNavBar active={getNavActive(ROUTES.MULTIPLAYER_STANDINGS)} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col items-center justify-center py-16 px-10 relative z-10">
        {/* Winner Hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <div className="relative inline-block mb-10">
            <div className="w-[220px] h-[220px] rounded-full border-[8px] border-[#f0a844] p-1 shadow-[0_0_80px_rgba(240,168,68,0.4)] overflow-hidden">
              <img
                src={winner.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"}
                alt={winner.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-4 right-0 w-16 h-16 bg-[#EF6637] rounded-2xl border-4 border-[#0D0908] flex items-center justify-center shadow-2xl rotate-12">
              <Trophy size={32} strokeWidth={3} className="text-white" />
            </div>
          </div>
          <h1 className="text-[72px] md:text-[88px] font-serif font-black text-[#F0A844] mb-4 italic tracking-tighter leading-none">
            {winner.name} is the HCI Sage!
          </h1>
          <p className="text-[#F5F2F0]/40 italic text-[28px] font-serif">
            &ldquo;The community&apos;s wisest mind — for now.&rdquo;
          </p>
        </motion.div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 w-full max-w-6xl mb-24 px-4">
          {podium.map((p) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: p.rank * 0.2 }}
              className={`flex flex-col items-center flex-1 ${p.order}`}
            >
              {/* Avatar/Title Area */}
              <div className="flex flex-col items-center mb-10 min-h-[180px] justify-end w-full text-center px-4">
                {p.highlight ? (
                  <>
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="px-6 py-2 rounded-xl bg-[#F0A844] text-[#0D0908] text-[14px] font-black tracking-[0.2em] uppercase mb-6 shadow-2xl font-sans"
                    >
                      HCI SAGE
                    </motion.span>
                    <p className="text-[32px] font-black text-[#F0A844] mb-3 font-serif italic tracking-tighter leading-none">
                      ${p.score}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-[24px] border-4 border-white/10 overflow-hidden bg-[#1A1312] mb-6 shadow-2xl">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <p className={`text-[12px] font-black tracking-[0.3em] uppercase mb-3 font-sans ${p.titleColor}`}>
                      {p.title}
                    </p>
                  </>
                )}
                <p className={`font-serif font-black tracking-tighter italic ${p.highlight ? 'text-[42px] text-white leading-none' : 'text-[24px] text-white/80'}`}>
                  {p.name}
                </p>
              </div>

              {/* Pedestal */}
              <div
                className={`w-full ${p.height} rounded-t-[32px] flex items-center justify-center relative border-x-2 border-t-2 border-white/10 ${p.color} overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] group`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span
                  className={`text-[140px] md:text-[180px] font-serif font-black select-none italic tracking-tighter ${
                    p.highlight ? 'text-white/20' : 'text-white/5'
                  }`}
                >
                  {p.rank}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Group Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full max-w-5xl bg-[#1A1312] border-2 border-white/5 rounded-[48px] p-16 mb-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF6637]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-[2px] bg-[#EF6637]" />
              <p className="text-[#EF6637] text-[16px] font-black tracking-[0.4em] uppercase font-sans italic">
                GROUP ACHIEVEMENT
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-16">
              <div className="flex flex-col gap-2">
                <p className="text-white/30 text-[14px] font-black uppercase tracking-[0.2em] font-sans">Total Neurons Generated</p>
                <p className="text-[48px] font-black text-white leading-none font-serif italic tracking-tighter">2.4M</p>
              </div>
              <div className="h-20 w-[2px] bg-white/10 hidden sm:block" />
              <div className="flex flex-col gap-2">
                <p className="text-white/30 text-[14px] font-black uppercase tracking-[0.2em] font-sans">Group Accuracy</p>
                <p className="text-[48px] font-black text-[#F0A844] leading-none font-serif italic tracking-tighter">88%</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            {['Communal Focus', 'Sage Logic', 'Rapid Recall'].map((tag) => (
              <span
                key={tag}
                className="px-8 py-3 rounded-2xl border-2 border-[#F0A844]/20 bg-[#F0A844]/5 text-[14px] font-black tracking-widest text-[#F0A844] uppercase font-sans italic shadow-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-center gap-10 w-full max-w-5xl mb-32">
          <button
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="flex items-center justify-center gap-6 px-12 h-24 rounded-[32px] bg-[#EF6637] text-white font-black text-[24px] hover:bg-[#F27A52] transition-all shadow-[0_20px_50px_rgba(239,102,55,0.4)] active:scale-95 flex-1 font-serif italic tracking-tight uppercase"
          >
            <RefreshCw size={32} strokeWidth={3} />
            Play Again
          </button>
          <button
            onClick={() => onNavigate(ROUTES.MULTIPLAYER_REVIEW, { gameId })}
            className="flex items-center justify-center gap-6 px-12 h-24 rounded-[32px] bg-[#1A1312] border-4 border-white/10 text-white font-black text-[24px] hover:bg-[#4A2B28] transition-all active:scale-95 flex-1 font-serif italic tracking-tight uppercase shadow-2xl"
          >
            <Eye size={32} strokeWidth={3} className="text-[#F0A844]" />
            Review Session
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-6 px-12 h-24 rounded-[32px] bg-[#F0A844] text-[#0D0908] font-black text-[24px] hover:bg-[#ffbd5e] transition-all shadow-[0_20px_50px_rgba(240,168,68,0.3)] active:scale-95 flex-1 font-serif italic tracking-tight uppercase"
          >
            <Share2 size={32} strokeWidth={3} />
            Share with Cohort
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5 }}
          className="text-center font-serif text-[#F0A844] italic text-[48px] font-black tracking-tighter mb-24"
        >
          &ldquo;In Ubuntu, we rise together.&rdquo;
        </motion.p>
      </div>
    </div>
  )
}

export default MultiplayerFinalStandingsPage
