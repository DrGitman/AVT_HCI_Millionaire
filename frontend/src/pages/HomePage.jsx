import { motion } from 'framer-motion'
import { Play, BookOpen, BarChart3, User } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const MENU_TILES = [
  {
    id: 'play',
    label: 'PLAY',
    sublabel: null,
    icon: Play,
    className: 'bg-[#E05B2D] text-white',
    iconClass: 'fill-current',
    route: ROUTES.GAME,
  },
  {
    id: 'learn',
    label: 'LEARN FIRST',
    sublabel: 'Foundations of HCI',
    icon: BookOpen,
    className: 'bg-[#613736]/60 text-white',
    iconClass: 'text-[#F0A844]',
    route: ROUTES.LEARN_HUB,
  },
  {
    id: 'rankings',
    label: 'RANKINGS',
    sublabel: null,
    icon: BarChart3,
    className: 'bg-[#613736]/60 text-white',
    iconClass: 'text-[#F0A844]',
    route: ROUTES.LEADERBOARD,
  },
  {
    id: 'profile',
    label: 'PROFILE',
    sublabel: null,
    icon: User,
    className: 'bg-[#613736]/60 text-white',
    iconClass: 'text-[#F0A844]',
    route: ROUTES.PROFILE,
  },
]

const HomePage = ({ onNavigate }) => (
  <div id="home-page" className="min-h-screen bg-[#0D0908] flex flex-col relative overflow-hidden">
    {/* Background Decorative Rings */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[1000px] h-[1000px] rounded-full border border-[#EF6637]/[0.05] pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[800px] rounded-full border border-[#EF6637]/[0.03] pointer-events-none" />

    {/* Trees Background Overlay */}
    <div
      className="absolute inset-0 opacity-20 pointer-events-none bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: 'url("/Win_Page_Tree.png")' }}
    />

    <AppNavBar active={getNavActive(ROUTES.HOME)} onNavigate={onNavigate} />

    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">

      {/* Hero circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-[540px] h-[540px] rounded-full border border-white/10 flex flex-col items-center justify-center mb-16"
      >
        {/* Inner decorative border */}
        <div className="absolute inset-3 rounded-full border border-white/5" />

        <div className="relative z-10 text-center px-8">
          <p className="text-[#F5F2F0] text-[18px] font-bold tracking-[0.2em] mb-2 uppercase">
            WHO WANTS TO BE
          </p>
          <p className="text-[#F5F2F0] text-[18px] font-bold tracking-[0.2em] mb-4 uppercase">
            AN
          </p>
          <h1 className="font-serif italic font-black text-[#F0A844] text-[48px] leading-tight uppercase tracking-[0.05em]">
            HCI
          </h1>
          <h1 className="font-serif italic font-black text-[#F0A844] text-[64px] leading-none uppercase tracking-[0.05em] mb-8">
            MILLIONAIRE?
          </h1>
          <div className="w-32 h-[1px] bg-white/20 mx-auto mb-8" />
          <p className="font-sans text-[#F0A844] text-[16px] tracking-[0.1em] font-bold">
            African Values & Theories
          </p>
        </div>
      </motion.div>

      {/* 2×2 menu grid */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
        {MENU_TILES.map((tile, i) => {
          const Icon = tile.icon
          return (
            <motion.button
              key={tile.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(tile.route)}
              className={`rounded-[24px] flex flex-col items-center justify-center h-[280px] transition-all border border-white/5 shadow-2xl ${
                tile.id === 'play' ? 'bg-[#EF6637]' : 'bg-[#4A2B28]'
              }`}
            >
              <div className="mb-6">
                <Icon
                  size={36}
                  className={tile.id === 'play' ? 'text-white' : 'text-[#F0A844]'}
                  fill={tile.id === 'play' ? 'currentColor' : 'none'}
                  strokeWidth={tile.id === 'play' ? 0 : 2}
                />
              </div>
              <span className={`font-bold text-[18px] tracking-[0.2em] uppercase ${tile.id === 'learn' ? 'mb-1' : 'mb-0'}`}>
                {tile.label}
              </span>
              {tile.sublabel && (
                <span className="text-[13px] text-[#F5F2F0]/60 font-medium tracking-wide mt-2">
                  {tile.sublabel}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  </div>
)

export default HomePage
