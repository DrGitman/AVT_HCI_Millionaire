import { motion } from 'framer-motion'
import { Play, BookOpen, BarChart3, User } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'

const MENU_TILES = [
  {
    id: 'play',
    label: 'PLAY',
    sublabel: null,
    icon: Play,
    className: 'bg-[#E05B2D] hover:bg-[#F27A52] text-[#F5F2F0]',
    iconClass: 'fill-current',
    route: ROUTES.GAME,
  },
  {
    id: 'learn',
    label: 'LEARN FIRST',
    sublabel: 'Foundations of HCI',
    icon: BookOpen,
    className: 'bg-[#5c3c38] hover:bg-[#6d4a45] text-[#F5F2F0]',
    iconClass: 'text-[#F0A844]',
    route: ROUTES.LEARN_HUB,
  },
  {
    id: 'rankings',
    label: 'RANKINGS',
    sublabel: null,
    icon: BarChart3,
    className: 'bg-[#5c3c38] hover:bg-[#6d4a45] text-[#F5F2F0]',
    iconClass: 'text-[#F0A844]',
    route: ROUTES.LEADERBOARD,
  },
  {
    id: 'profile',
    label: 'PROFILE',
    sublabel: null,
    icon: User,
    className: 'bg-[#5c3c38] hover:bg-[#6d4a45] text-[#F5F2F0]',
    iconClass: 'text-[#F0A844]',
    route: ROUTES.PROFILE,
  },
]

const HomePage = ({ onNavigate }) => (
  <div id="home-page" className="min-h-screen bg-[#1a1210] flex flex-col">
    <AppNavBar active={ROUTES.HOME} onNavigate={onNavigate} />

    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-10">
      {/* Hero circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-[min(100%,320px)] aspect-square rounded-full border border-[#F0A844]/35 flex flex-col items-center justify-center mb-10 md:mb-12 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.12] bg-cover bg-center"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at center bottom, #5c3c38 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 text-center px-8">
          <p className="text-[#F5F2F0]/90 text-[11px] md:text-xs font-semibold tracking-[0.2em] mb-2">
            WHO WANTS TO BE AN
          </p>
          <h1 className="font-sans font-bold text-[#F0A844] text-2xl md:text-[28px] leading-tight tracking-tight">
            HCI MILLIONAIRE?
          </h1>
          <div className="w-16 h-px bg-[#F0A844]/50 mx-auto my-3" />
          <p className="font-serif text-[#d4a356] text-sm md:text-base italic">
            African Values &amp; Theories
          </p>
        </div>
      </motion.div>

      {/* 2×2 menu grid */}
      <div className="w-full max-w-[420px] grid grid-cols-2 gap-3 md:gap-4">
        {MENU_TILES.map((tile, i) => {
          const Icon = tile.icon
          return (
            <motion.button
              key={tile.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(tile.route)}
              className={`rounded-xl flex flex-col items-center justify-center min-h-[120px] md:min-h-[130px] px-3 py-5 transition-colors ${tile.className}`}
            >
              <Icon
                size={tile.id === 'play' ? 32 : 28}
                className={`mb-3 ${tile.iconClass}`}
                fill={tile.id === 'play' ? 'currentColor' : 'none'}
                strokeWidth={tile.id === 'play' ? 0 : 1.5}
              />
              <span className="font-bold text-[13px] tracking-[0.15em]">{tile.label}</span>
              {tile.sublabel && (
                <span className="text-[10px] text-[#F5F2F0]/60 mt-1 font-medium">
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
