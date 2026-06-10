import { motion } from 'framer-motion'
import { MessageCircle, Trophy, Zap, Sparkles } from 'lucide-react'
import { PageBackHeader } from '../components/PageBackHeader'
import { ROUTES } from '../navigation/routes'

const NOTIFICATIONS = [
  {
    id: 1,
    unread: true,
    route: ROUTES.GAME,
    title: 'Room Invitation',
    titleColor: 'text-[#E5A942]',
    icon: MessageCircle,
    iconBg: 'bg-[#E5A942]',
    description:
      'Player Two invited you to a high-stakes match in the Scholarly Archive.',
    time: '2m ago',
  },
  {
    id: 2,
    unread: true,
    route: ROUTES.LEADERBOARD,
    title: 'Rank Shift',
    titleColor: 'text-[#D96C4A]',
    icon: Trophy,
    iconBg: 'bg-[#D96C4A]',
    description:
      'Your accuracy score advanced you to Platinum Tier. Keep the streak alive!',
    time: '15m ago',
  },
  {
    id: 3,
    unread: false,
    route: ROUTES.GAME,
    title: 'Daily Pulse',
    titleColor: 'text-[#8C7B75]',
    icon: Zap,
    iconBg: 'bg-[#4a3532]',
    description:
      'New daily challenge is active: "The Great Library Mystery". 500 Bonus Credits at stake.',
    time: '1h ago',
  },
  {
    id: 4,
    unread: false,
    route: ROUTES.VICTORY,
    title: 'New Badge',
    titleColor: 'text-[#8C7B75]',
    icon: Sparkles,
    iconBg: 'bg-[#5c4a3a]',
    description:
      'You earned the Speed Scholar badge for answering 10 questions in under 30 seconds.',
    time: '4h ago',
  },
]

const NotificationsPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#1A1110] px-4 py-6 md:px-8">
    <div className="max-w-[560px] mx-auto">
      <PageBackHeader
        title="Notifications"
        onBack={() => onNavigate(ROUTES.HOME)}
        rightAction={
          <button
            type="button"
            className="text-[#D96C4A] text-sm font-semibold hover:text-[#F27A52]"
          >
            Mark all read
          </button>
        }
      />

      <div className="bg-[#3A221F] rounded-xl overflow-hidden border border-[#F5F2F0]/5">
        {NOTIFICATIONS.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex gap-3 px-4 py-4 text-left hover:bg-[#1A1110]/40 transition-colors ${
                index < NOTIFICATIONS.length - 1 ? 'border-b border-[#1A1110]/80' : ''
              }`}
            >
              {item.unread && (
                <span className="w-2 h-2 rounded-full bg-[#E05B2D] shrink-0 mt-2" />
              )}
              {!item.unread && <span className="w-2 shrink-0" />}
              <div
                className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon size={18} className="text-[#1A1110]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${item.titleColor}`}>{item.title}</h3>
                <p className="text-[#8C7B75] text-[13px] leading-snug mt-0.5">
                  {item.description}
                </p>
              </div>
              <span className="text-[#8C7B75] text-xs shrink-0">{item.time}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  </div>
)

export default NotificationsPage
