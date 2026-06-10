import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hourglass, Zap, Clock, BookOpen, Lightbulb } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'

const GuestWaitingLobbyPage = ({ onNavigate }) => {
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setCountdown(5), 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      onNavigate(ROUTES.MULTIPLAYER_GAME)
      return
    }
    const interval = setInterval(() => setCountdown((p) => p - 1), 1000)
    return () => clearInterval(interval)
  }, [countdown, onNavigate])

  return (
    <div className="min-h-screen bg-[#120d0b] text-[#F5F2F0]">
      <div className="h-1 bg-gradient-to-r from-transparent via-[#F0A844]/50 to-transparent" />
      <AppNavBar active={getNavActive(ROUTES.GUEST_LOBBY)} onNavigate={onNavigate} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1 rounded-full border border-[#F5F2F0]/20 text-[11px] font-bold tracking-wider text-[#F5F2F0]/60">
            SESSION JOINED
          </span>
        </div>

        {countdown !== null ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#3d2624] border border-[#E05B2D] rounded-xl p-8 text-center mb-8"
          >
            <p className="text-[#F0A844] text-xs font-bold tracking-widest mb-2">
              HOST IS STARTING
            </p>
            <p className="text-5xl font-bold text-[#E05B2D]">{countdown}s</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#3d2624] border border-[#E05B2D]/60 rounded-xl p-8 text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#E05B2D]">
                Waiting for Host to Start...
              </h1>
              <Hourglass size={28} className="text-[#E05B2D]" />
            </div>
            <p className="text-[#F5F2F0]/55 italic text-sm">
              Relax. The game begins when Sammy is ready.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#2d2421] border border-[#F0A844]/40 rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#613736] flex items-center justify-center text-[#F0A844] font-bold mb-2">
              H
            </div>
            <p className="font-semibold text-sm">Host</p>
            <span className="mt-1 text-[10px] font-bold text-[#E05B2D] bg-[#E05B2D]/20 px-2 py-0.5 rounded">
              HOST
            </span>
          </div>
          <div className="bg-[#2d2421] border border-[#F5F2F0]/15 rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#613736] flex items-center justify-center text-[#F0A844] font-bold mb-2">
              N
            </div>
            <p className="font-semibold text-sm">Nandi_D</p>
            <span className="mt-1 text-[10px] font-bold text-emerald-400/90 bg-emerald-400/10 px-2 py-0.5 rounded">
              READY
            </span>
          </div>
          {[1, 2].map((slot) => (
            <div
              key={slot}
              className="border border-dashed border-[#F5F2F0]/20 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] text-[#F5F2F0]/35"
            >
              <span className="w-2 h-2 rounded-full bg-[#F5F2F0]/20 mb-2" />
              <span className="text-xs">Waiting...</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: Zap, label: 'Real-Time Speed' },
            { icon: Clock, label: '45s/Q' },
            { icon: BookOpen, label: 'African Philosophies + HCI Ethics' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2d2421] border border-[#F5F2F0]/10 text-[11px] text-[#F5F2F0]/70"
            >
              <Icon size={12} className="text-[#F0A844]" />
              {label}
            </span>
          ))}
        </div>

        <div className="bg-[#2d2421] border-l-4 border-[#E05B2D] rounded-lg p-5 mb-8">
          <div className="flex items-center gap-2 text-[#E05B2D] font-bold text-sm mb-3">
            <Lightbulb size={16} />
            While You Wait...
          </div>
          <p className="text-[#F5F2F0]/65 text-[13px] leading-relaxed mb-4">
            This session includes heavy emphasis on African Philosophies and their
            intersection with technology. We recommend a quick mental refresh on
            these core concepts:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Ubuntu', 'Philosophical Sagacity', "Ma'at"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-[#1a1412] text-[12px] text-[#F5F2F0]/80"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.LEARN_HUB)}
            className="text-[#E05B2D] font-bold text-sm hover:text-[#F27A52]"
          >
            Quick Review →
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="px-8 py-2.5 rounded-lg border border-[#F5F2F0]/25 text-[#F5F2F0]/70 hover:text-[#F5F2F0] text-sm font-semibold transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestWaitingLobbyPage
