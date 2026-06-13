import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Trophy,
  Users,
  Database,
  History,
  Download,
  Edit3,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'
import { api } from '../lib/api'

const STATS = [
  { value: '$14,500,000', label: 'PRESTIGE POINTS', trend: '+12% this week', trendColor: 'text-orange-500' },
  { value: '84.3%', label: 'CONTENT JUSTIFICATION', trend: '✓ Verified Dataset', trendColor: 'text-orange-500/60' },
  { value: '24 Rounds', label: 'EVALUATION ROUNDS', trend: 'Last active: 2h ago', trendColor: 'text-white/20' },
  { value: 'Top 4', label: 'LEADERBOARD RANK', trend: '🏆 Elite Status', trendColor: 'text-amber-500' },
]

const ACHIEVEMENTS = [
  {
    title: 'UBUNTU MASTER',
    description: 'Acknowledged for collaborative ethics in design evaluation and peer-review excellence.',
    unlocked: true,
    icon: Users,
    date: 'Oct 2023'
  },
  {
    title: 'SAGACITY PRACTITIONER',
    description: 'Expert-level pattern recognition in HCI heuristics and cognitive walkthroughs.',
    unlocked: true,
    icon: Trophy,
    date: 'Dec 2023'
  },
  {
    title: 'DATA SOVEREIGN',
    description: 'Achievement locked. Reach Level 15 to initiate sovereign data authority protocols.',
    unlocked: false,
    icon: Database,
  },
]

const LINKS = [
  { label: 'Change Profile Details', icon: Edit3, route: ROUTES.SETTINGS, active: true },
  { label: 'Performance History', icon: History, route: ROUTES.VICTORY },
  { label: 'Export Data', icon: Download, route: ROUTES.SETTINGS },
]

const ProfilePage = ({ onNavigate }) => {
  const [player, setPlayer] = useState({
    initials: 'JD',
    username: 'Justin_Design_88',
  })

  useEffect(() => {
    api
      .me()
      .then((data) => {
        const displayName = data.username || data.name || 'Player'
        const initials = (data.name || displayName)
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()

        setPlayer({
          initials: initials || 'P',
          username: displayName,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0908] pb-32 text-[#F5F2F0]">
      <AppNavBar active={getNavActive(ROUTES.PROFILE)} onNavigate={onNavigate} />

      <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-20 flex flex-col lg:flex-row gap-20">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-[#1A1312] rounded-[32px] p-12 border border-white/5 shadow-2xl flex flex-col items-center text-center">
            <div className="relative mb-10">
              <div className="w-[180px] h-[180px] rounded-full border-[6px] border-[#EF6637] p-2 flex items-center justify-center shadow-[0_0_40px_rgba(239,102,55,0.2)]">
                <div className="w-full h-full rounded-full bg-[#4A2B28] flex items-center justify-center text-[#F0A844] font-black text-6xl font-serif italic tracking-tighter">
                  {player.initials}
                </div>
              </div>
              <div className="absolute -bottom-2 right-4 bg-[#F0A844] text-[#0D0908] text-[14px] font-black px-4 py-2 rounded-xl border-[4px] border-[#1A1312] shadow-xl font-serif">
                LVL 12
              </div>
            </div>

            <h1 className="text-[#F5F2F0] font-black text-[32px] mb-6 tracking-tight font-serif italic">{player.username}</h1>

            <div className="bg-[#4A2B28]/30 px-6 py-3 rounded-full flex items-center gap-3 border border-[#F0A844]/20 mb-12">
              <CheckCircle2 size={18} className="text-[#F0A844]" />
              <span className="text-[#F5F2F0]/80 text-[12px] font-black uppercase tracking-[0.2em] font-sans">
                NUST HCI Honours Cohort
              </span>
            </div>

            <div className="w-full space-y-4">
              <p className="text-[#F5F2F0]/20 text-[12px] font-bold uppercase tracking-[0.3em] px-4 text-left">
                Account Actions
              </p>
              <div className="space-y-3">
                {LINKS.map((link) => {
                  const Icon = link.icon
                  return (
                    <button
                      key={link.label}
                      onClick={() => onNavigate(link.route)}
                      className={`w-full flex items-center gap-6 px-8 py-5 rounded-2xl transition-all group ${
                        link.active
                          ? 'bg-[#4A2B28]/40 text-[#F5F2F0] border border-[#F0A844]/20 shadow-xl scale-[1.02]'
                          : 'text-[#F5F2F0]/40 hover:text-[#F5F2F0] hover:bg-[#4A2B28]/20'
                      }`}
                    >
                      <Icon size={24} strokeWidth={2.5} className={link.active ? 'text-[#EF6637]' : 'text-[#F5F2F0]/20 group-hover:text-[#F5F2F0]/40'} />
                      <span className="text-[16px] font-black tracking-tight font-serif italic">{link.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-20">
          {/* Standing Banner */}
          <div className="bg-[#1A1312] rounded-[40px] p-16 border border-white/5 relative overflow-hidden shadow-2xl group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF6637]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all group-hover:bg-[#EF6637]/10" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="flex-1">
                <p className="text-[#F5F2F0]/20 text-[14px] font-black tracking-[0.4em] uppercase mb-6 font-sans">
                  Current Standing
                </p>
                <h2 className="text-[#EF6637] font-serif text-[64px] font-black mb-12 leading-none italic tracking-tighter">
                  Tier 3 Researcher
                </h2>
                <div className="space-y-6 max-w-md">
                  <div className="flex justify-between text-[14px] font-black uppercase tracking-[0.2em] font-sans">
                    <span className="text-[#F5F2F0]/40">Promotion Progress</span>
                    <span className="text-[#F0A844] text-[18px]">74%</span>
                  </div>
                  <div className="h-[12px] bg-black/40 rounded-full overflow-hidden p-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '74%' }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#EF6637] to-[#F0A844] rounded-full shadow-[0_0_15px_rgba(239,102,55,0.5)]"
                    />
                  </div>
                </div>
              </div>
              <div className="shrink-0 md:text-right flex flex-col items-start md:items-end">
                <p className="text-[#F0A844] font-serif text-[64px] font-black tracking-tighter leading-none italic">$14,500,000</p>
                <p className="text-[#F5F2F0]/20 text-[14px] font-black tracking-[0.3em] uppercase mt-4 font-sans">
                  Lifetime Prestige
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <section>
            <div className="flex items-center gap-5 text-[#F5F2F0]/40 font-black text-[14px] mb-12 uppercase tracking-[0.4em] font-sans">
              <div className="w-12 h-[2px] bg-[#EF6637]" />
              Player Statistics
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1A1312] rounded-[32px] p-10 border border-white/5 hover:border-[#EF6637]/30 transition-all group shadow-xl"
                >
                  <p className="text-[#F5F2F0]/20 text-[12px] font-black tracking-[0.2em] uppercase mb-8 leading-tight font-sans">
                    {stat.label}
                  </p>
                  <p className="text-[#F5F2F0] font-black text-[32px] mb-3 tracking-tighter font-serif italic">
                    {stat.value}
                  </p>
                  <div className={`${stat.trendColor} text-[13px] font-black flex items-center gap-2 font-sans italic`}>
                    <div className="w-4 h-[2px] bg-current opacity-20" />
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-5 text-[#F5F2F0]/40 font-black text-[14px] uppercase tracking-[0.4em] font-sans">
                <div className="w-12 h-[2px] bg-[#EF6637]" />
                Achievement Archive
              </div>
              <button className="text-[#F0A844] text-[13px] font-black uppercase tracking-[0.2em] hover:text-[#EF6637] transition-all font-sans italic border-b-2 border-transparent hover:border-[#EF6637] pb-1">
                View All Badges
              </button>
            </div>
            <div className="space-y-6">
              {ACHIEVEMENTS.map((ach) => {
                const Icon = ach.icon
                return (
                  <div
                    key={ach.title}
                    className={`relative rounded-[32px] p-10 border transition-all flex flex-col md:flex-row items-center gap-10 overflow-hidden ${
                      ach.unlocked
                        ? 'bg-[#1A1312] border-[#EF6637]/30 shadow-2xl group hover:bg-[#1A1312]/80'
                        : 'bg-[#1A1312]/20 border-white/5 opacity-50'
                    }`}
                  >
                    {ach.unlocked && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF6637]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    )}

                    <div className={`w-24 h-24 rounded-[24px] flex items-center justify-center shrink-0 border-4 transition-transform group-hover:scale-110 duration-500 ${
                      ach.unlocked
                        ? 'bg-[#4A2B28]/30 border-[#F0A844]/20 text-[#F0A844] shadow-[0_0_30px_rgba(240,168,68,0.1)]'
                        : 'bg-black/10 border-white/5 text-white/10'
                    }`}>
                      <Icon size={44} strokeWidth={2.5} />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <h4 className={`font-black text-[24px] tracking-tight font-serif italic ${ach.unlocked ? 'text-[#F5F2F0]' : 'text-[#F5F2F0]/40'}`}>
                          {ach.title}
                        </h4>
                        {ach.unlocked && (
                          <span className="bg-[#EF6637] text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] font-sans shadow-lg">
                            Unlocked
                          </span>
                        )}
                        {!ach.unlocked && <Lock size={16} className="text-white/20" />}
                      </div>
                      <p className={`text-[18px] leading-relaxed max-w-3xl font-serif italic ${ach.unlocked ? 'text-[#F5F2F0]/60' : 'text-[#F5F2F0]/20'}`}>
                        {ach.description}
                      </p>
                    </div>

                    <div className="text-center md:text-right shrink-0">
                      {ach.unlocked ? (
                        <>
                          <p className="text-[#F5F2F0]/20 text-[12px] font-black uppercase tracking-[0.2em] mb-2 font-sans">Earned</p>
                          <p className="text-[#F0A844] text-[18px] font-black font-serif italic">{ach.date}</p>
                        </>
                      ) : (
                        <p className="text-[#F5F2F0]/10 text-[12px] font-black uppercase tracking-[0.2em] font-sans">Locked</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
