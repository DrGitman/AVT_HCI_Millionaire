import { useState } from 'react'
import { RefreshCw, Eye, Share2 } from 'lucide-react'
import { ROUTES } from '../navigation/routes'
import { AppNavBar } from '../components/AppNavBar'
import { motion } from 'framer-motion'
import { getNavActive } from '../navigation/navActive'

const PODIUM = [
  {
    rank: 3,
    name: 'Amara',
    title: 'EMERGING SAGE',
    height: 'h-28',
    order: 'order-1',
    avatar: 'A',
  },
  {
    rank: 1,
    name: 'Julian',
    title: 'HCI SAGE',
    score: '1,000,000',
    height: 'h-40',
    order: 'order-2',
    highlight: true,
    avatar: 'J',
  },
  {
    rank: 2,
    name: 'Sarah',
    title: 'UBUNTU SCHOLAR',
    height: 'h-32',
    order: 'order-3',
    avatar: 'S',
  },
  {
    rank: 4,
    name: 'Kofi',
    title: 'COMMUNITY LEARNER',
    height: 'h-24',
    order: 'order-4',
    avatar: 'K',
  },
]

const MultiplayerFinalStandingsPage = ({ onNavigate }) => {
  const [copiedLink, setCopiedLink] = useState(false)

  const handleShare = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#F5F2F0]">
      <div className="h-1 bg-gradient-to-r from-transparent via-[#F0A844]/50 to-transparent" />
      <AppNavBar active={getNavActive(ROUTES.MULTIPLAYER_STANDINGS)} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#E05B2D] bg-[#613736] flex items-center justify-center text-3xl font-bold text-[#F0A844] mb-4 shadow-[0_0_24px_rgba(224,91,45,0.4)]">
            J
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F0A844] mb-2">
            Julian is the HCI Sage!
          </h1>
          <p className="text-[#F5F2F0]/55 italic text-sm">
            The community&apos;s wisest mind — for now.
          </p>
        </motion.div>

        <div className="flex items-end justify-center gap-3 mb-10 px-2">
          {PODIUM.map((p) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: p.rank * 0.08 }}
              className={`flex flex-col items-center w-[22%] min-w-[72px] ${p.order}`}
            >
              {!p.highlight && (
                <div className="w-10 h-10 rounded-full bg-[#613736] flex items-center justify-center text-[#F0A844] font-bold text-sm mb-2">
                  {p.avatar}
                </div>
              )}
              {p.highlight && (
                <span className="text-[10px] font-bold text-[#F0A844] bg-[#F0A844]/15 px-2 py-0.5 rounded mb-2">
                  HCI SAGE
                </span>
              )}
              {!p.highlight && (
                <p className="text-[9px] font-bold text-[#F0A844]/80 tracking-wide mb-0.5">
                  {p.title}
                </p>
              )}
              {p.score && (
                <p className="text-[#F0A844]/70 text-xs font-semibold mb-1">{p.score}</p>
              )}
              <p className={`font-bold text-sm mb-2 ${p.highlight ? 'text-white text-base' : ''}`}>
                {p.name}
              </p>
              <div
                className={`w-full ${p.height} rounded-t-xl flex items-end justify-center pb-3 relative overflow-hidden ${
                  p.highlight
                    ? 'bg-gradient-to-t from-[#E05B2D] to-[#F0A844]'
                    : 'bg-gradient-to-t from-[#3d2624] to-[#4a3532]'
                }`}
              >
                <span
                  className={`text-5xl font-serif font-bold ${
                    p.highlight ? 'text-[#120d0c]/25' : 'text-[#F5F2F0]/10'
                  }`}
                >
                  {p.rank}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-[#2d2421] border border-[#F5F2F0]/10 rounded-xl p-6 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#E05B2D] mb-2">
              GROUP ACHIEVEMENT
            </p>
            <p className="text-sm">
              <span className="text-[#F5F2F0]/60">Total Neurons Generated: </span>
              <span className="font-bold">2.4M</span>
            </p>
            <p className="text-sm">
              <span className="text-[#F5F2F0]/60">Group Accuracy: </span>
              <span className="font-bold">88%</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Communal Focus', 'Sage Logic', 'Rapid Recall'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-[#F0A844]/30 text-[11px] text-[#F0A844]/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] font-bold text-sm transition-colors"
          >
            <RefreshCw size={16} />
            Play Again
          </button>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER_REVIEW)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#2d2421] border border-[#F0A844]/30 text-[#F5F2F0] font-bold text-sm hover:border-[#F0A844]/60 transition-colors"
          >
            <Eye size={16} />
            Review Answers
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#F0A844] hover:bg-[#f5b85c] text-[#120d0c] font-bold text-sm transition-colors"
          >
            <Share2 size={16} />
            {copiedLink ? 'Link Copied!' : 'Share with Cohort'}
          </button>
        </div>

        <p className="text-center font-serif text-[#F0A844]/70 italic text-sm">
          &ldquo;In Ubuntu, we rise together.&rdquo;
        </p>
      </div>
    </div>
  )
}

export default MultiplayerFinalStandingsPage
