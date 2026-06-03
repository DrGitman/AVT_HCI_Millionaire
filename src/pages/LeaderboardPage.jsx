import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'

const LEADERS = [
  { rank: 1, name: 'Scholar_Amakali', score: '$1,000,000', tier: 'HCI Sage' },
  { rank: 2, name: 'Justin_Design_88', score: '$875,000', tier: 'Platinum', highlight: true },
  { rank: 3, name: 'Ubuntu_Researcher', score: '$640,000', tier: 'Gold' },
  { rank: 4, name: 'CoDesign_Namibia', score: '$512,000', tier: 'Gold' },
  { rank: 5, name: 'Sagacity_Student', score: '$320,000', tier: 'Silver' },
]

const LeaderboardPage = ({ onNavigate }) => (
  <div id="leaderboard-page" className="min-h-screen bg-[#1a1210]">
    <AppNavBar active={null} onNavigate={onNavigate} />

    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Trophy size={32} className="text-[#F0A844] mx-auto mb-3" />
        <h1 className="font-sans font-bold text-[#F0A844] text-2xl tracking-wide">
          RANKINGS
        </h1>
        <p className="text-[#F5F2F0]/55 text-sm mt-2">Live cohort leaderboard</p>
      </motion.div>

      <div className="space-y-2">
        {LEADERS.map((player, i) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 rounded-lg px-4 py-3 ${
              player.highlight
                ? 'bg-[#E05B2D]/20 border border-[#E05B2D]/40'
                : 'bg-[#5c3c38]/60 border border-[#F5F2F0]/5'
            }`}
          >
            <span className="text-[#F0A844] font-bold w-6 text-center">{player.rank}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[#F5F2F0] font-semibold truncate">{player.name}</p>
              <p className="text-[#F5F2F0]/50 text-xs">{player.tier}</p>
            </div>
            <span className="text-[#E05B2D] font-bold text-sm">{player.score}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        type="button"
        onClick={() => onNavigate(ROUTES.HOME)}
        className="mt-8 w-full text-[#F0A844] text-sm font-semibold hover:text-[#F27A52]"
      >
        ← Back to Home
      </motion.button>
    </div>
  </div>
)

export default LeaderboardPage
