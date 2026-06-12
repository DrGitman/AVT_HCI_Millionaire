import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MoreHorizontal } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'
import { api } from '../lib/api'

const SCHOLARS = [
  {
    rank: 1,
    name: 'Dr. Elena Vos',
    title: 'Archival Theorist',
    gamesPlayed: '2,482',
    accuracy: '99.4%',
    learned: 8,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    online: true,
  },
  {
    rank: 2,
    name: 'Marcus Thorne',
    title: 'Data Historian',
    gamesPlayed: '2,315',
    accuracy: '98.1%',
    learned: 7,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    rank: 3,
    name: 'Aria Chen',
    title: 'Neuro-Linguist',
    gamesPlayed: '2,104',
    accuracy: '96.5%',
    learned: 6,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    rank: 4,
    name: 'Julian Vance',
    title: 'Manuscript Expert',
    gamesPlayed: '1,892',
    accuracy: '94.2%',
    learned: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    rank: 5,
    name: 'Sarah Jennings',
    title: 'Semantic Analyst',
    gamesPlayed: '1,745',
    accuracy: '92.8%',
    learned: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
]

const TABS = ['Reviews', 'Ratings', 'Followers']

const LeaderboardPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Reviews')
  const [searchTerm, setSearchTerm] = useState('')
  const [scholars, setScholars] = useState(SCHOLARS)

  useEffect(() => {
    api
      .leaderboard()
      .then((data) => {
        if (!data?.entries?.length) return
        setScholars(
          data.entries.map((entry, index) => ({
            rank: entry.rank ?? index + 1,
            name: entry.name || entry.username,
            title: entry.title || 'Scholar',
            gamesPlayed: String(entry.totalGames ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            accuracy: entry.totalGames ? `${Math.round((entry.totalCorrect / (entry.totalGames * 15)) * 1000) / 10}%` : '0%',
            learned: entry.totalCorrect ?? 0,
            avatar: entry.avatar || null,
            online: false,
          }))
        )
      })
      .catch(() => setScholars(SCHOLARS))
  }, [])

  const filteredScholars = scholars.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0D0908] text-[#F5F2F0]">
      <AppNavBar active={getNavActive(ROUTES.LEADERBOARD)} onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight font-serif italic text-[#F5F2F0]">Leaderboard</h1>
            <p className="text-[#F5F2F0]/60 text-[17px] md:text-[18px] leading-relaxed max-w-2xl font-serif">
              Recognizing the most dedicated players in our communal network. Rankings are
              updated based on accuracy, volume of play, and overall amount of topics learned.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-[#1A1312] rounded-xl p-1.5 flex gap-1 border border-white/5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-lg text-[15px] font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-[#EF6637] text-white shadow-lg'
                      : 'text-[#F5F2F0]/40 hover:text-[#F5F2F0]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-10 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F5F2F0]/40" />
          <input
            type="text"
            placeholder="Search leaderboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-[320px] bg-[#1A1312] border border-white/5 rounded-full h-[56px] pl-14 pr-6 text-[16px] text-[#F5F2F0] placeholder-[#F5F2F0]/20 focus:outline-none focus:border-[#EF6637]/60 transition-all font-serif italic"
          />
        </div>

        {/* Table Container */}
        <div className="bg-[#1A1312] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[140px_1fr_200px_200px_200px] items-center px-12 py-8 border-b border-white/5 text-[14px] font-bold tracking-[0.2em] text-[#F5F2F0]/20 uppercase">
            <span>Rank</span>
            <span>Scholar</span>
            <span className="text-center">Games Played</span>
            <span className="text-center">Accuracy</span>
            <span className="text-center">Learned</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {filteredScholars.map((scholar) => (
              <div
                key={scholar.rank}
                className="grid grid-cols-1 md:grid-cols-[140px_1fr_200px_200px_200px] items-center px-12 py-10 hover:bg-white/[0.02] transition-all group relative"
              >
                {/* Rank */}
                <div className="flex items-center mb-6 md:mb-0">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-[18px] font-black font-serif ${
                    scholar.rank === 1 ? 'border-[#F0A844] text-[#F0A844] bg-[#F0A844]/10' :
                    scholar.rank === 2 ? 'border-[#F5F2F0]/40 text-[#F5F2F0]/80' :
                    scholar.rank === 3 ? 'border-[#F5F2F0]/20 text-[#F5F2F0]/60' :
                    'border-transparent text-[#F5F2F0]/20'
                  }`}>
                    {scholar.rank}
                  </div>
                </div>

                {/* Scholar Info */}
                <div className="flex items-center gap-6 mb-6 md:mb-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
                      {scholar.avatar ? (
                        <img src={scholar.avatar} alt={scholar.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#4A2B28] flex items-center justify-center text-[20px] font-black text-[#F0A844]">
                          {scholar.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>
                    {scholar.rank === 1 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#F0A844] rounded-full border-2 border-[#1A1312] flex items-center justify-center shadow-lg">
                        <span className="text-[12px]">🥇</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[22px] font-bold text-[#F5F2F0] leading-tight font-serif tracking-tight">{scholar.name}</h4>
                    <p className="text-[14px] font-bold text-[#F5F2F0]/40 uppercase tracking-[0.1em] mt-1 font-sans">{scholar.title}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mb-4 md:mb-0 text-center">
                  <span className="md:hidden text-[12px] font-bold text-[#F5F2F0]/30 uppercase tracking-widest mb-2 block">Games Played</span>
                  <span className="text-[24px] font-black text-[#F0A844] tracking-tight font-serif italic">{scholar.gamesPlayed}</span>
                </div>

                <div className="mb-4 md:mb-0 text-center">
                  <span className="md:hidden text-[12px] font-bold text-[#F5F2F0]/30 uppercase tracking-widest mb-2 block">Accuracy</span>
                  <span className="text-[24px] font-black text-[#F5F2F0]/80 font-serif italic">{scholar.accuracy}</span>
                </div>

                <div className="mb-6 md:mb-0 text-center">
                  <span className="md:hidden text-[12px] font-bold text-[#F5F2F0]/30 uppercase tracking-widest mb-2 block">Learned</span>
                  <span className="text-[24px] font-black text-[#F5F2F0]/80 font-serif italic">{scholar.learned}</span>
                </div>

                {/* Connect Action - Absolute on Desktop for precise positioning */}
                <div className="md:absolute md:right-12 md:top-1/2 md:-translate-y-1/2 flex items-center gap-6">
                  <button className="px-8 py-3 rounded-xl border border-white/20 text-[15px] font-bold text-[#F5F2F0] hover:bg-[#F5F2F0] hover:text-[#0D0908] transition-all shadow-lg active:scale-95">
                    Connect
                  </button>
                  <button className="p-3 text-[#F5F2F0]/20 hover:text-[#F5F2F0] transition-all">
                    <MoreHorizontal size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredScholars.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[#F5F2F0]/20 text-lg">No scholars found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage
