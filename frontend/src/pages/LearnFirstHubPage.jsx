import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Share2,
  BookOpen,
  Settings,
  Shield,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { TOPICS } from '../data/topics'
import { ROUTES } from '../navigation/routes'

const TOPIC_ICONS = {
  ubuntu: Share2,
  sagacity: BookOpen,
  paradigm: Settings,
  ethics: Shield,
  wellbeing: Heart,
}

const LearnFirstHubPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#0D0908] flex flex-col font-sans text-[#F5F2F0]">
    {/* Top decorative line */}
    <div className="h-[4px] bg-gradient-to-r from-transparent via-[#F0A844]/40 to-transparent" />

    <div className="flex-1 max-w-[1440px] w-full mx-auto px-10 py-12 flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-16">
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.HOME)}
          className="absolute left-0 text-white/60 hover:text-[#EF6637] transition-all p-3 hover:scale-110"
        >
          <ArrowLeft size={32} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <h1 className="text-[#F0A844] text-[48px] md:text-[56px] font-black font-serif italic tracking-tight">
            Learn First
          </h1>
          <p className="text-white/40 text-[18px] md:text-[20px] font-serif italic mt-2">
            Study core theories before entering the hot seat.
          </p>
        </div>
        <div className="absolute right-0 hidden md:flex flex-col items-end">
          <span className="text-[24px] font-black text-[#F0A844] font-serif italic">05</span>
          <span className="text-[12px] text-white/40 font-bold uppercase tracking-[0.2em]">Topics Available</span>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-8 flex-1 max-w-[1000px] mx-auto w-full">
        {TOPICS.map((topic, i) => {
          const Icon = TOPIC_ICONS[topic.id] ?? Share2
          return (
            <motion.article
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#1A1312] rounded-[32px] pl-10 pr-12 py-10 flex gap-10 border border-white/5 hover:border-[#F0A844]/30 hover:bg-[#1A1312]/80 transition-all shadow-2xl overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-[#F0A844] shadow-[4px_0_15px_rgba(240,168,68,0.3)]" />

              <div className="shrink-0 w-[80px] h-[80px] rounded-[24px] bg-[#4A2B28]/30 flex items-center justify-center text-[#F0A844] border border-[#F0A844]/20 group-hover:scale-110 transition-transform duration-500">
                <Icon size={36} strokeWidth={2.5} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-black text-[#F0A844] text-[32px] font-serif italic tracking-tight leading-tight">
                    {topic.title}
                  </h2>
                  <span className="text-[12px] font-bold text-white/20 uppercase tracking-[0.3em] mt-3">Module {String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-[#F5F2F0]/60 text-[18px] mb-8 font-serif leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => onNavigate(ROUTES.TOPIC_DETAIL, { topicId: topic.id })}
                    className="bg-[#EF6637] hover:bg-[#F27A52] text-white font-black text-[16px] px-10 py-3.5 rounded-xl transition-all active:scale-95 shadow-lg uppercase tracking-wider"
                  >
                    Read Module
                  </button>
                  <div className="flex items-center gap-2 text-white/20 font-bold text-[14px]">
                    <div className="w-8 h-[2px] bg-white/10" />
                    15 Min Read
                  </div>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-20 pb-12"
      >
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.GAME)}
          className="w-full h-[88px] flex items-center justify-center text-white font-black bg-[#EF6637] hover:bg-[#F27A52] rounded-[24px] gap-6 text-[24px] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(239,102,55,0.3)] group uppercase tracking-[0.1em]"
        >
          I&apos;m Ready — Play Now
          <ArrowRight size={32} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>

    {/* Bottom decorative line */}
    <div className="h-[4px] bg-gradient-to-r from-transparent via-[#F0A844]/40 to-transparent mt-auto" />
  </div>
)

export default LearnFirstHubPage
