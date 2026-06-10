import { motion } from 'framer-motion'
import { Bell, Settings } from 'lucide-react'
import { ROUTES } from '../navigation/routes'

const NAV_ITEMS = [
  { id: ROUTES.HOME, label: 'HOME' },
  { id: ROUTES.THEMES, label: 'THEMES' },
  { id: ROUTES.MULTIPLAYER, label: 'MULTIPLAYER' },
]

export const AppNavBar = ({ active = ROUTES.HOME, onNavigate }) => {
  const isActive = (id) => active === id

  return (
  <header className="w-full max-w-container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
    <button
      type="button"
      onClick={() => onNavigate(ROUTES.HOME)}
      className="shrink-0"
      aria-label="Home"
    >
      <img src="/Logo.png" alt="HCI Millionaire" className="w-12 h-[50px] object-contain" />
    </button>

    <nav className="flex items-center gap-4 sm:gap-8">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigate(item.id)}
          className={`font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.12em] transition-colors relative pb-1 ${
            isActive(item.id) ? 'text-[#F0A844]' : 'text-[#F5F2F0]/70 hover:text-[#F5F2F0]'
          }`}
        >
          {item.label}
          {isActive(item.id) && (
            <motion.span
              layoutId="nav-underline"
              className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#E05B2D] rounded-full"
            />
          )}
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-3 sm:gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => onNavigate(ROUTES.NOTIFICATIONS)}
        className="text-[#F0A844] p-1"
        aria-label="Notifications"
      >
        <Bell size={20} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => onNavigate(ROUTES.SETTINGS)}
        className="text-[#F0A844] p-1"
        aria-label="Settings"
      >
        <Settings size={20} />
      </motion.button>
    </div>
  </header>
  )
}
