import { motion } from 'framer-motion'
import {
  BarChart3,
  Trophy,
  Users,
  Database,
  Clock,
  Upload,
  Pencil,
  ChevronRight,
} from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const STATS = [
  { value: '$14,500,000', label: 'PRESTIGE POINTS' },
  { value: '84.3%', label: 'CONTENT JUSTIFICATION' },
  { value: '24 Completed', label: 'EVALUATION ROUNDS' },
  { value: 'Top 4', label: 'LIVE LEADERBOARD POSITION' },
]

const ACHIEVEMENTS = [
  {
    title: 'UBUNTU MASTER',
    description: 'Acknowledged for collaborative ethics in design evaluation.',
    unlocked: true,
    icon: Users,
  },
  {
    title: 'SAGACITY PRACTITIONER',
    description: 'Expert-level pattern recognition in HCI heuristics.',
    unlocked: true,
    icon: Trophy,
  },
  {
    title: 'DATA SOVEREIGN',
    description: 'Achievement locked. Reach Level 15 to initiate.',
    unlocked: false,
    icon: Database,
  },
]

const LINKS = [
  { label: 'Review Performance History', icon: Clock, route: ROUTES.VICTORY },
  { label: 'Export Evaluation Data', icon: Upload, route: ROUTES.SETTINGS },
  { label: 'Change Profile Details', icon: Pencil, route: ROUTES.SETTINGS },
]

const ProfilePage = ({ onNavigate }) => (
  <div id="profile-page" className="min-h-screen bg-[#1a1110]">
    <AppNavBar active={getNavActive(ROUTES.PROFILE)} onNavigate={onNavigate} />

    <div className="max-w-container mx-auto px-4 md:px-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#3d2b2a] rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full bg-[#613736] flex items-center justify-center text-[#f9a875] font-bold text-2xl border-2 border-[#F5F2F0]/10">
            JD
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#E05B2D] text-[#F5F2F0] text-[10px] font-bold px-2 py-0.5 rounded">
            LVL 12
          </span>
        </div>
        <div className="flex-1 w-full text-center sm:text-left">
          <h1 className="text-[#f9a875] font-bold text-2xl">Justin_Design_88</h1>
          <p className="text-[#F5F2F0]/60 text-sm mt-1">Current Standing: Tier 3 Player</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#1a1110] rounded-full overflow-hidden">
              <div className="h-full w-[74%] bg-[#f9a875] rounded-full" />
            </div>
            <span className="text-[#f9a875] text-sm font-bold">74%</span>
          </div>
        </div>
      </motion.div>

      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-[#F5F2F0] font-bold text-lg mb-4">
          <BarChart3 size={20} className="text-[#E05B2D]" />
          Player Statistics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#3d2b2a]/60 backdrop-blur-sm rounded-lg p-4 border border-[#F5F2F0]/5"
            >
              <p className="text-[#E05B2D] font-bold text-lg md:text-xl">{stat.value}</p>
              <p className="text-[#F5F2F0]/70 text-[10px] font-semibold tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-[#F5F2F0] font-bold text-lg mb-4">
          <Trophy size={20} className="text-[#E05B2D]" />
          Achievement Progression
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const Icon = ach.icon
            return (
              <div
                key={ach.title}
                className={`rounded-lg p-4 border ${
                  ach.unlocked
                    ? 'bg-[#3d2b2a] border-[#E05B2D]/50'
                    : 'bg-[#3d2b2a]/40 border-transparent opacity-50'
                }`}
              >
                <Icon size={24} className="text-[#F0A844] mb-2" />
                <h3 className="text-[#f9a875] font-bold text-sm">{ach.title}</h3>
                <p className="text-[#F5F2F0]/60 text-[12px] mt-1 leading-snug">
                  {ach.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-2">
        {LINKS.map((link) => {
          const Icon = link.icon
          return (
            <motion.button
              key={link.label}
              whileHover={{ x: 4 }}
              type="button"
              onClick={() => onNavigate(link.route)}
              className="w-full bg-[#3d2b2a] rounded-lg px-4 py-4 flex items-center justify-between hover:bg-[#4a3532] transition-colors"
            >
              <span className="flex items-center gap-3 text-[#F5F2F0]">
                <Icon size={18} className="text-[#F0A844]" />
                {link.label}
              </span>
              <ChevronRight size={18} className="text-[#F5F2F0]/50" />
            </motion.button>
          )
        })}
      </section>
    </div>
  </div>
)

export default ProfilePage
