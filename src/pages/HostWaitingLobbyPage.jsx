import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Zap, Clock, BookOpen } from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'

const HostWaitingLobbyPage = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false)
  const roomCode = 'HCI-7F3'

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#120d0b] text-[#F5F2F0]">
      <div className="h-1 bg-gradient-to-r from-transparent via-[#F0A844]/50 to-transparent" />
      <AppNavBar active={ROUTES.MULTIPLAYER} onNavigate={onNavigate} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1 rounded-full border border-[#F5F2F0]/20 text-[11px] font-bold tracking-wider text-[#F5F2F0]/60">
            HOSTING SESSION
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#3d2624] border border-[#E05B2D]/60 rounded-xl p-8 text-center mb-8"
        >
          <p className="text-[#F5F2F0]/55 text-sm mb-3">
            Share this code with up to 3 scholars
          </p>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-[#F0A844]">
              {roomCode}
            </h1>
            <button
              type="button"
              onClick={copyCode}
              className="p-3 rounded-lg bg-[#2d2421] border border-[#F0A844]/25 text-[#F0A844] hover:border-[#F0A844] transition-colors"
              title="Copy room code"
            >
              {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
            </button>
          </div>
          {copied && (
            <p className="text-emerald-400 text-xs font-semibold mt-2">Code copied!</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#2d2421] border border-[#F0A844]/40 rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#613736] flex items-center justify-center text-[#F0A844] font-bold mb-2">
              H
            </div>
            <p className="font-semibold text-sm">Host (You)</p>
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

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER_GAME)}
            className="w-full max-w-sm py-3.5 rounded-lg bg-[#E05B2D] hover:bg-[#F27A52] text-[#120d0c] font-bold text-sm transition-colors"
          >
            Start Game
          </button>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="px-8 py-2.5 rounded-lg border border-[#F5F2F0]/25 text-[#F5F2F0]/70 hover:text-[#F5F2F0] text-sm font-semibold transition-colors"
          >
            Cancel Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostWaitingLobbyPage
