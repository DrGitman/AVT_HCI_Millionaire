import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, XCircle } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const EliminationSpectatorPage = ({ onNavigate }) => {
  const [spectating, setSpectating] = useState(false)

  return (
    <div className="min-h-screen bg-[#120d0b] text-[#F5F2F0]">
      <div className="h-1 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      <AppNavBar active={getNavActive(ROUTES.ELIMINATION_SPECTATOR)} onNavigate={onNavigate} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1 rounded-full border border-red-500/30 bg-red-950/20 text-red-400 text-[11px] font-bold tracking-wider flex items-center gap-1.5">
            <XCircle size={12} />
            ELIMINATED
          </span>
        </div>

        {spectating ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#3d2624] border border-[#E05B2D]/40 rounded-xl p-8 text-center"
          >
            <span className="inline-block bg-red-600 text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded mb-4">
              LIVE SPECTATING
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#F0A844] mb-2">
              Viewing Current Session
            </h2>
            <p className="text-sm text-[#F5F2F0]/60 mb-6">
              Sarah and Julian are on Question 11 ($64,000).
            </p>
            <div className="bg-[#2d2421] rounded-lg p-4 mb-6 space-y-3 text-left text-sm">
              <div className="flex justify-between border-b border-[#F5F2F0]/10 pb-2">
                <span>Sarah</span>
                <span className="text-emerald-400 text-xs font-bold">CHOOSING (22s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5F2F0]/60">Julian</span>
                <span className="text-[#F0A844] text-xs font-bold">USED PEER LIFELINE</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setSpectating(false)}
                className="px-6 py-2.5 rounded-lg border border-[#F5F2F0]/20 text-sm font-semibold hover:border-[#F5F2F0]/40"
              >
                Back to Review
              </button>
              <button
                type="button"
                onClick={() => onNavigate(ROUTES.MULTIPLAYER_STANDINGS)}
                className="px-6 py-2.5 rounded-lg bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] text-sm font-bold"
              >
                Skip to Standings
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-red-400 mb-2">
                Your Journey Ends Here
              </h1>
              <p className="text-[#F5F2F0]/70">
                You reached <span className="text-[#F0A844] font-bold">Question 9</span> — secured{' '}
                <span className="text-[#F0A844] font-bold">$16,000</span>
              </p>
            </div>

            <div className="bg-[#2d2421] border-l-4 border-emerald-600 rounded-lg p-5">
              <span className="text-[10px] font-bold tracking-wider text-emerald-500 uppercase">
                The Correct Logic
              </span>
              <h3 className="font-serif font-bold text-lg mt-2 mb-3">
                Option B: Engage local experts in co-creating evaluation heuristics.
              </h3>
              <p className="text-sm text-[#F5F2F0]/70 leading-relaxed mb-4">
                Co-designing heuristics with local community elders ensures technology
                evaluations are grounded in local epistemologies and values (Ubuntu).
              </p>
              <p className="text-[11px] text-[#d4a356] italic">
                Winschiers-Theophilus & Bidwell (2013). Toward an Afro-centric design paradigm.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Correct Questions', value: '8' },
                { label: 'Best Streak', value: '5' },
                { label: 'Final Level', value: '9' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-[#2d2421] rounded-lg p-4 text-center border border-[#F5F2F0]/10"
                >
                  <span className="text-[10px] text-[#F5F2F0]/50 block mb-1">{label}</span>
                  <span className="text-2xl font-bold text-[#F0A844]">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#3d2624] border border-[#E05B2D]/30 rounded-xl p-6 text-center">
              <h3 className="font-serif font-bold text-lg mb-2">Continue watching?</h3>
              <p className="text-xs text-[#F5F2F0]/60 mb-5 max-w-sm mx-auto">
                Watch remaining participants finish the round.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSpectating(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] font-bold text-sm rounded-lg"
                >
                  <Play size={14} fill="currentColor" />
                  Watch Live
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
                  className="px-6 py-3 border border-[#F5F2F0]/20 text-sm font-semibold rounded-lg hover:border-[#F5F2F0]/40"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EliminationSpectatorPage
