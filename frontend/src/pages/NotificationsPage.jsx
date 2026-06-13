import { motion } from 'framer-motion'
import { MessageSquare, Trophy, Zap, Sparkles } from 'lucide-react'
import { PageBackHeader } from '../components/PageBackHeader'
import { ROUTES } from '../navigation/routes'

const NOTIFICATIONS = [
  {
    id: 1,
    unread: true,
    route: ROUTES.GAME,
    title: 'Room Invitation',
    titleColor: 'text-[#E5A942]',
    icon: MessageSquare,
    iconBg: 'bg-[#E5A942]',
    description: (
      <span className="text-white/40">
        <strong className="text-white">Player Two</strong> invited you to a high-stakes match in the Scholarly Archive.
      </span>
    ),
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
    description: (
      <span className="text-white/40">
        Your accuracy score advanced you to <strong className="text-[#D96C4A]">Platinum Tier</strong>. Keep the streak alive!
      </span>
    ),
    time: '15m ago',
  },
  {
    id: 3,
    unread: false,
    route: ROUTES.GAME,
    title: 'Daily Pulse',
    titleColor: 'text-[#F0A844]',
    icon: Zap,
    iconBg: 'bg-[#3D2C2A]',
    description: (
      <span className="text-white/20 italic">
        "The Great Library Mystery"
        <span className="not-italic text-white/40 ml-1">. 500 Bonus Credits at stake.</span>
      </span>
    ),
    time: '1h ago',
  },
  {
    id: 4,
    unread: false,
    route: ROUTES.VICTORY,
    title: 'New Badge',
    titleColor: 'text-[#F0A844]',
    icon: Sparkles,
    iconBg: 'bg-[#3D2C2A]',
    description: (
      <span className="text-white/40">
        You earned the <strong className="text-[#D96C4A]">Speed Scholar</strong> badge for answering 10 questions in under 30 seconds.
      </span>
    ),
    time: '4h ago',
  },
]

const NotificationsPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#0D0908] font-sans pb-24">
    <div className="max-w-[1200px] mx-auto px-10 py-16">
      <PageBackHeader
        title="Notifications"
        onBack={() => onNavigate(ROUTES.HOME)}
        titleClassName="text-[#F0A844] font-black text-[42px] font-serif italic tracking-tight"
        rightAction={
          <button
            type="button"
            className="text-[#EF6637] text-[14px] font-black uppercase tracking-[0.2em] hover:text-[#F0A844] transition-all font-sans italic border-b-2 border-transparent hover:border-[#EF6637] pb-1"
          >
            Mark all read
          </button>
        }
      />

      <div className="rounded-[40px] overflow-hidden mt-24 border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-[#1A1312]">
        {NOTIFICATIONS.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-start gap-12 px-12 py-12 text-left transition-all relative hover:bg-white/[0.03] group ${
                index < NOTIFICATIONS.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {/* Unread dot */}
              <div className="w-3 pt-8 shrink-0">
                {item.unread && (
                  <div className="w-3 h-3 rounded-full bg-[#EF6637] shadow-[0_0_20px_rgba(239,102,55,0.8)]" />
                )}
              </div>

              {/* Icon */}
              <div
                className={`w-20 h-20 rounded-[24px] ${item.iconBg} flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110 duration-500`}
              >
                <Icon size={32} className={item.iconBg === 'bg-[#3D2C2A]' ? 'text-[#EF6637]' : 'text-[#0D0908]'} strokeWidth={3} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-32 pt-2">
                <div className="flex flex-col gap-4">
                  <h3 className={`font-black text-[14px] tracking-[0.4em] ${item.titleColor} uppercase font-sans`}>
                    {item.title}
                  </h3>
                  <div className="text-[22px] leading-relaxed font-serif italic text-[#F5F2F0]/80 tracking-tight">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Time */}
              <span className="absolute top-12 right-12 text-white/20 text-[14px] font-black uppercase tracking-[0.2em] font-sans italic">
                {item.time}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  </div>
)

export default NotificationsPage
