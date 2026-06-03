import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Shield, LogOut, Volume2 } from 'lucide-react'
import { PageBackHeader } from '../components/PageBackHeader'
import { ROUTES } from '../navigation/routes'

const THEMES = ['Heritage Earth', 'Afro-Futurism', 'Minimalist']

const SettingsPage = ({ onNavigate }) => {
  const [speedInvites, setSpeedInvites] = useState(true)
  const [theme, setTheme] = useState('Heritage Earth')
  const [volume, setVolume] = useState(85)

  return (
    <div className="min-h-screen bg-[#120d0c] px-4 py-6 md:px-8">
      <div className="max-w-[520px] mx-auto">
        <PageBackHeader
          title="System Configuration"
          onBack={() => onNavigate(ROUTES.HOME)}
          titleClassName="text-[#E05B2D] font-sans font-bold text-lg"
        />

        <section className="mb-8">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#a8938d] mb-3">
            MATCHMAKING PROTOCOLS
          </h2>
          <div className="bg-[#1f1614] rounded-lg px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-[#e0d7d5] font-medium text-[15px]">
                Allow Speed Round Invitations
              </p>
              <p className="text-[#a8938d] text-[13px] mt-0.5">
                Rapid challenge requests from scholars.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={speedInvites}
              onClick={() => setSpeedInvites(!speedInvites)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                speedInvites ? 'bg-[#E05B2D]' : 'bg-[#3c3332]'
              }`}
            >
              <motion.span
                layout
                className={`absolute top-1 w-5 h-5 rounded-full bg-[#F5F2F0] ${
                  speedInvites ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#a8938d] mb-3">
            AUDIO & VISUALS
          </h2>
          <div className="bg-[#1f1614] rounded-lg p-4 mb-3">
            <p className="text-[#e0d7d5] font-medium text-[15px] mb-3">
              Aesthetic Interface Layout
            </p>
            <div className="flex rounded-lg overflow-hidden border border-[#59413a]/50">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2.5 text-[12px] font-semibold transition-colors ${
                    theme === t
                      ? 'bg-[#E05B2D] text-[#1a1412]'
                      : 'text-[#e0d7d5]/80 hover:bg-[#302827]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#1f1614] rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[#e0d7d5] font-medium text-[15px]">
                Aural Narrative Cues (Prof. Kwame)
              </p>
              <span className="text-[#E05B2D] text-sm font-bold">{volume}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 size={16} className="text-[#a8938d] shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-[#3c3332] accent-[#E05B2D]"
              />
              <Volume2 size={16} className="text-[#a8938d] shrink-0" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#a8938d] mb-3">
            ACCOUNT UTILITIES
          </h2>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.PROFILE)}
            className="w-full bg-[#1f1614] rounded-lg px-4 py-4 flex items-center justify-between mb-2 hover:bg-[#302827] transition-colors"
          >
            <span className="flex items-center gap-3 text-[#e0d7d5]">
              <Trophy size={18} className="text-[#F0A844]" />
              Personal Achievement Archive
            </span>
            <span className="text-[#a8938d]">&gt;</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.HOME)}
            className="w-full bg-[#1f1614] rounded-lg px-4 py-4 flex items-center justify-between mb-4 hover:bg-[#302827] transition-colors"
          >
            <span className="flex items-center gap-3 text-[#e0d7d5]">
              <Shield size={18} className="text-[#F0A844]" />
              Cryptography & Privacy
            </span>
            <span className="text-[#a8938d]">&gt;</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.LOGIN)}
            className="w-full bg-[#4a2c28] rounded-lg px-4 py-4 flex items-center justify-center gap-2 text-[#e0d7d5] font-bold text-[13px] tracking-wider hover:bg-[#5c3834] transition-colors"
          >
            <LogOut size={18} />
            DE-AUTHORIZE SESSION
          </button>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
