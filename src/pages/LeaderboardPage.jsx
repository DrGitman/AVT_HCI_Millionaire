import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MoreHorizontal } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'

const SCHOLARS = [
  {
    rank: 1,
    name: 'Dr. Elena Vos',
    title: 'Archival Theorist',
    gamesPlayed: '2,482',
    accuracy: '99.4%',
    learned: 8,
    avatar: 'EV',
    online: true,
    highlight: true,
  },
  {
    rank: 2,
    name: 'Marcus Thorne',
    title: 'Data Historian',
    gamesPlayed: '2,315',
    accuracy: '98.1%',
    learned: 7,
    avatar: 'MT',
  },
  {
    rank: 3,
    name: 'Aria Chen',
    title: 'Neuro-Linguist',
    gamesPlayed: '2,104',
    accuracy: '96.5%',
    learned: 6,
    avatar: 'AC',
  },
  {
    rank: 4,
    name: 'Julian Vance',
    title: 'Manuscript Expert',
    gamesPlayed: '1,892',
    accuracy: '94.2%',
    learned: 5,
    avatar: 'JV',
  },
  {
    rank: 5,
    name: 'Sarah Jennings',
    title: 'Semantic Analyst',
    gamesPlayed: '1,745',
    accuracy: '92.8%',
    learned: 4,
    avatar: 'SJ',
  },
]

const TABS = ['Reviews', 'Ratings', 'Followers']

const LeaderboardPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Reviews')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredScholars = SCHOLARS.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRankColor = (rank) => {
    if (rank === 1) return 'border-[#F0A844] text-[#F0A844]'
    if (rank === 2) return 'border-[#C0C0C0] text-[#C0C0C0]'
    if (rank === 3) return 'border-[#CD7F32] text-[#CD7F32]'
    return 'border-transparent text-[#F5F2F0]/60'
  }

  return (
    <div className="min-h-screen bg-[#120d0c]">
      <AppNavBar active={ROUTES.HOME} onNavigate={onNavigate} />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#F5F2F0] text-3xl md:text-4xl font-bold mb-3"
            >
              Leaderboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-[#F5F2F0]/60 text-sm md:text-base max-w-xl leading-relaxed"
            >
              Recognizing the most dedicated players in our communal network.
              Rankings are updated based on accuracy, volume of play, and
              overall amount of topics learned.
            </motion.p>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex rounded-lg overflow-hidden border border-[#F5F2F0]/15 shrink-0"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-[#3d2b2a] text-[#F5F2F0]'
                    : 'text-[#F5F2F0]/60 hover:text-[#F5F2F0] hover:bg-[#3d2b2a]/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 relative max-w-xs"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F2F0]/40" />
          <input
            type="text"
            placeholder="Search leaderboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1f1614] border border-[#F5F2F0]/10 text-[#F5F2F0] placeholder-[#F5F2F0]/40 text-sm focus:outline-none focus:border-[#E05B2D]/50 transition-colors"
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1f1614] rounded-xl overflow-hidden border border-[#F5F2F0]/5"
        >
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[80px_1fr_140px_120px_100px_160px] items-center px-6 py-3 border-b border-[#F5F2F0]/5">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#F5F2F0]/40 uppercase">
              Rank
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#F5F2F0]/40 uppercase">
              Scholar
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#F5F2F0]/40 uppercase">
              Games Played
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#F5F2F0]/40 uppercase">
              Accuracy
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#F5F2F0]/40 uppercase">
              Learned
            </span>
            <span></span>
          </div>

          {/* Table rows */}
          {filteredScholars.map((scholar, idx) => (
            <motion.div
              key={scholar.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.04 }}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_140px_120px_100px_160px] items-center gap-2 md:gap-0 px-6 py-4 border-b border-[#F5F2F0]/5 last:border-b-0 hover:bg-[#F5F2F0]/[0.02] transition-colors"
            >
              {/* Rank */}
              <div className="flex items-center justify-center md:justify-start">
                {scholar.rank <= 3 ? (
                  <span
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold ${getRankColor(scholar.rank)}`}
                  >
                    {scholar.rank}
                  </span>
                ) : (
                  <span className="text-[#F5F2F0]/50 font-semibold text-sm w-9 text-center">
                    {scholar.rank}
                  </span>
                )}
              </div>

              {/* Scholar info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#3d2b2a] flex items-center justify-center shrink-0">
                    <span className="text-[#F0A844] font-bold text-sm">
                      {scholar.avatar}
                    </span>
                  </div>
                  {scholar.online && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#1f1614]" />
                  )}
                </div>
                <div>
                  <p className="text-[#F5F2F0] font-semibold text-sm">
                    {scholar.name}
                  </p>
                  <p className="text-[#F5F2F0]/40 text-xs">{scholar.title}</p>
                </div>
              </div>

              {/* Games Played */}
              <div>
                <span className="md:hidden text-[#F5F2F0]/40 text-xs mr-2">
                  Games:{' '}
                </span>
                <span
                  className={`font-semibold text-sm ${
                    scholar.highlight ? 'text-[#F0A844]' : 'text-[#F5F2F0]/80'
                  }`}
                >
                  {scholar.gamesPlayed}
                </span>
              </div>

              {/* Accuracy */}
              <div>
                <span className="md:hidden text-[#F5F2F0]/40 text-xs mr-2">
                  Accuracy:{' '}
                </span>
                <span className="text-[#F5F2F0]/80 text-sm">
                  {scholar.accuracy}
                </span>
              </div>

              {/* Learned */}
              <div>
                <span className="md:hidden text-[#F5F2F0]/40 text-xs mr-2">
                  Learned:{' '}
                </span>
                <span className="text-[#F5F2F0]/80 text-sm">
                  {scholar.learned}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <button className="px-5 py-1.5 rounded-full border border-[#F5F2F0]/20 text-[#F5F2F0] text-xs font-semibold hover:border-[#F0A844]/50 hover:text-[#F0A844] transition-colors">
                  Connect
                </button>
                <button className="p-1.5 rounded-lg text-[#F5F2F0]/40 hover:text-[#F5F2F0] transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {filteredScholars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#F5F2F0]/40">No scholars found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default LeaderboardPage
