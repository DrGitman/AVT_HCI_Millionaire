import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Trophy, Zap, Sparkles, AlertCircle } from 'lucide-react'
import { PageBackHeader } from '../components/PageBackHeader'
import { ROUTES } from '../navigation/routes'
import { api } from '../lib/api'

const ICON_MAP = {
  INVITATION: MessageSquare,
  RANK: Trophy,
  DAILY: Zap,
  BADGE: Sparkles,
  ALERT: AlertCircle,
}

const COLOR_MAP = {
  INVITATION: 'text-[#E5A942]',
  RANK: 'text-[#D96C4A]',
  DAILY: 'text-[#F0A844]',
  BADGE: 'text-[#F0A844]',
  ALERT: 'text-red-500',
}

const BG_MAP = {
  INVITATION: 'bg-[#E5A942]',
  RANK: 'bg-[#D96C4A]',
  DAILY: 'bg-[#3D2C2A]',
  BADGE: 'bg-[#3D2C2A]',
  ALERT: 'bg-red-900',
}

const NotificationsPage = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = () => {
    api.getNotifications().then(setNotifications).catch(console.error)
  }

  const handleMarkRead = (id, route) => {
    api.markNotifRead(id).then(() => {
      fetchNotifications()
      if (route) onNavigate(route)
    })
  }

  const handleMarkAllRead = () => {
    api.markAllNotifsRead().then(fetchNotifications)
  }

  return (
    <div className="min-h-screen bg-[#0D0908] font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-10 py-16">
        <PageBackHeader
          title="Notifications"
          onBack={() => onNavigate(ROUTES.HOME)}
          titleClassName="text-[#F0A844] font-black text-[42px] font-serif italic tracking-tight"
          rightAction={
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[#EF6637] text-[14px] font-black uppercase tracking-[0.2em] hover:text-[#F0A844] transition-all font-sans italic border-b-2 border-transparent hover:border-[#EF6637] pb-1"
            >
              Mark all read
            </button>
          }
        />

        <div className="rounded-[40px] overflow-hidden mt-24 border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-[#1A1312]">
          {notifications.length > 0 ? (
            notifications.map((item, index) => {
              const Icon = ICON_MAP[item.type] || ICON_MAP.ALERT
              return (
                <motion.button
                  key={item.NotificationId}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleMarkRead(item.NotificationId, item.linkRoute)}
                  className={`w-full flex items-start gap-12 px-12 py-12 text-left transition-all relative hover:bg-white/[0.03] group ${
                    index < notifications.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="w-3 pt-8 shrink-0">
                    {!item.isRead && (
                      <div className="w-3 h-3 rounded-full bg-[#EF6637] shadow-[0_0_20px_rgba(239,102,55,0.8)]" />
                    )}
                  </div>

                  <div
                    className={`w-20 h-20 rounded-[24px] ${BG_MAP[item.type] || BG_MAP.ALERT} flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110 duration-500`}
                  >
                    <Icon size={32} className={(BG_MAP[item.type] || '').includes('3D2C2A') ? 'text-[#EF6637]' : 'text-[#0D0908]'} strokeWidth={3} />
                  </div>

                  <div className="flex-1 min-w-0 pr-32 pt-2">
                    <div className="flex flex-col gap-4">
                      <h3 className={`font-black text-[14px] tracking-[0.4em] ${COLOR_MAP[item.type] || COLOR_MAP.ALERT} uppercase font-sans`}>
                        {item.title}
                      </h3>
                      <div className="text-[22px] leading-relaxed font-serif italic text-[#F5F2F0]/80 tracking-tight">
                        {item.message}
                      </div>
                    </div>
                  </div>

                  <span className="absolute top-12 right-12 text-white/20 text-[14px] font-black uppercase tracking-[0.2em] font-sans italic">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </motion.button>
              )
            })
          ) : (
            <div className="p-20 text-center text-[#F5F2F0]/20 font-serif italic text-2xl">
              No notifications archived in this session.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
