import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Shield, LogOut, Volume2, Volume1, ChevronRight } from 'lucide-react'
import { PageBackHeader } from '../components/PageBackHeader'
import { ROUTES } from '../navigation/routes'
import { api } from '../lib/api'

const THEMES = ['Heritage Earth', 'Afro-Futurism', 'Minimalist']

const SettingsPage = ({ onNavigate }) => {
  const [speedInvites, setSpeedInvites] = useState(true)
  const [theme, setTheme] = useState('Heritage Earth')
  const [volume, setVolume] = useState(85)

  useEffect(() => {
    api.getSettings().then(data => {
      setSpeedInvites(data.allowSpeedInvites)
      setTheme(data.themePreference)
      setVolume(data.volumeLevel)
    }).catch(console.error)
  }, [])

  const updateSetting = (patch) => {
    api.updateSettings(patch).catch(console.error)
  }

  return (
    <div className="min-h-screen bg-[#0D0908] font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-10 py-16">
        <PageBackHeader
          title="System Configuration"
          onBack={() => onNavigate(ROUTES.HOME)}
          titleClassName="text-[#F0A844] font-black text-[42px] font-serif italic tracking-tight"
        />

        <div className="mt-24 space-y-20">
          {/* Matchmaking */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-[2px] bg-[#EF6637]" />
              <h2 className="text-[14px] font-black tracking-[0.4em] text-white/30 uppercase font-sans">
                Matchmaking Protocols
              </h2>
            </div>
            <div className="bg-[#1A1312] rounded-[32px] p-12 border border-white/5 flex items-center justify-between shadow-2xl group hover:border-[#F0A844]/20 transition-all">
              <div>
                <p className="text-[#F5F2F0] font-black text-[22px] mb-3 font-serif italic tracking-tight">
                  Allow Speed Round Invitations
                </p>
                <p className="text-[#F5F2F0]/40 text-[16px] font-serif italic">
                  Rapid challenge requests from scholars in the global network
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={speedInvites}
                onClick={() => {
                  const next = !speedInvites
                  setSpeedInvites(next)
                  updateSetting({ allowSpeedInvites: next })
                }}
                className={`w-20 h-10 rounded-full transition-all relative ${
                  speedInvites ? 'bg-[#EF6637] shadow-[0_0_20px_rgba(239,102,55,0.4)]' : 'bg-[#0D0908]'
                } border-2 border-white/10`}
              >
                <motion.span
                  layout
                  className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg left-1"
                  animate={{ x: speedInvites ? 40 : 0 }}
                />
              </button>
            </div>
          </section>

          {/* Audio & Visuals */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-[2px] bg-[#EF6637]" />
              <h2 className="text-[14px] font-black tracking-[0.4em] text-white/30 uppercase font-sans">
                Audio & Visuals
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1A1312] rounded-[32px] p-12 border border-white/5 shadow-2xl group hover:border-[#F0A844]/20 transition-all">
                <p className="text-[#F5F2F0] font-black text-[22px] mb-10 font-serif italic tracking-tight">
                  Aesthetic Interface Layout
                </p>
                <div className="flex flex-col bg-[#0D0908] rounded-[24px] p-3 border border-white/5 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTheme(t)
                        updateSetting({ themePreference: t })
                      }}
                      className={`w-full py-5 text-[16px] font-black transition-all rounded-xl font-serif italic tracking-tight ${
                        theme === t
                          ? 'bg-[#EF6637] text-white shadow-xl scale-[1.02]'
                          : 'text-[#F5F2F0]/40 hover:text-[#F5F2F0]/60 hover:bg-white/5'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1312] rounded-[32px] p-12 border border-white/5 shadow-2xl group hover:border-[#F0A844]/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-10">
                    <p className="text-[#F5F2F0] font-black text-[22px] font-serif italic tracking-tight leading-tight">
                      Aural Narrative Cues <br />
                      <span className="text-[16px] text-[#F5F2F0]/40 uppercase tracking-[0.1em] font-sans font-bold">(Prof. Kwame)</span>
                    </p>
                    <span className="text-[#EF6637] text-[28px] font-black font-serif italic">{volume}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <Volume1 size={32} className="text-white/20 shrink-0" />
                  <div className="relative flex-1 group">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setVolume(val)
                        updateSetting({ volumeLevel: val })
                      }}
                      className="w-full h-3 appearance-none bg-[#0D0908] rounded-full cursor-pointer accent-[#EF6637]"
                    />
                  </div>
                  <Volume2 size={32} className="text-white/20 shrink-0" />
                </div>
              </div>
            </div>
          </section>

          {/* Account Utilities */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-[2px] bg-[#EF6637]" />
              <h2 className="text-[14px] font-black tracking-[0.4em] text-white/30 uppercase font-sans">
                Account Utilities
              </h2>
            </div>
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => onNavigate(ROUTES.PROFILE)}
                className="w-full bg-[#1A1312] rounded-[32px] px-12 py-10 flex items-center justify-between border border-white/5 hover:border-[#EF6637]/30 transition-all group shadow-2xl"
              >
                <span className="flex items-center gap-8 text-[#F5F2F0] font-black text-[20px] font-serif italic tracking-tight">
                  <div className="text-[#F0A844] w-16 h-16 bg-[#4A2B28]/30 rounded-2xl flex items-center justify-center border border-[#F0A844]/20 group-hover:scale-110 transition-transform">
                    <Trophy size={32} strokeWidth={2.5} />
                  </div>
                  Personal Achievement Archive
                </span>
                <ChevronRight size={28} className="text-white/20 group-hover:translate-x-2 transition-transform group-hover:text-[#EF6637]" />
              </button>

              <button
                type="button"
                className="w-full bg-[#1A1312] rounded-[32px] px-12 py-10 flex items-center justify-between border border-white/5 hover:border-[#EF6637]/30 transition-all group shadow-2xl"
              >
                <span className="flex items-center gap-8 text-[#F5F2F0] font-black text-[20px] font-serif italic tracking-tight">
                  <div className="text-[#F0A844] w-16 h-16 bg-[#4A2B28]/30 rounded-2xl flex items-center justify-center border border-[#F0A844]/20 group-hover:scale-110 transition-transform">
                    <Shield size={32} strokeWidth={2.5} />
                  </div>
                  Cryptography & Privacy
                </span>
                <ChevronRight size={28} className="text-white/20 group-hover:translate-x-2 transition-transform group-hover:text-[#EF6637]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate(ROUTES.LOGIN)}
                className="w-full mt-12 bg-[#4A2B28] hover:bg-[#5A3B38] rounded-[32px] px-12 py-12 flex items-center justify-center gap-8 text-[#F5F2F0] font-black text-[18px] tracking-[0.4em] uppercase border border-white/10 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] group"
              >
                <LogOut size={28} className="text-[#EF6637] group-hover:-translate-x-2 transition-transform" />
                DE-AUTHORIZE SESSION
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
