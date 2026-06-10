import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Network,
  Lightbulb,
  Cpu,
  Shield,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { Button } from '../components'
import { TOPICS } from '../data/topics'
import { ROUTES } from '../navigation/routes'

const TOPIC_ICONS = {
  ubuntu: Network,
  sagacity: Lightbulb,
  paradigm: Cpu,
  ethics: Shield,
  wellbeing: Heart,
}

const LearnFirstHubPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#1a1412] flex flex-col">
    <div className="h-1 bg-gradient-to-r from-transparent via-[#F0A844]/60 to-transparent" />

    <div className="flex-1 max-w-[480px] w-full mx-auto px-4 py-6 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.HOME)}
          className="text-[#F5F2F0]/60 hover:text-[#F0A844] p-1"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-sans font-bold text-[#F0A844] text-xl tracking-wide">
          Learn First
        </h1>
        <span className="text-[11px] text-[#F5F2F0]/50 font-medium">
          5 Topics Available
        </span>
      </div>

      <p className="text-center text-[#F5F2F0]/55 text-sm italic mb-6">
        Study core theories before entering the hot seat.
      </p>

      <div className="space-y-3 flex-1">
        {TOPICS.map((topic, i) => {
          const Icon = TOPIC_ICONS[topic.id] ?? Network
          return (
            <motion.article
              key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative bg-[#2d2421] rounded-lg pl-4 pr-4 py-4 flex gap-4 border-l-4 border-[#E05B2D]"
            >
              <div className="shrink-0 w-10 h-10 flex items-center justify-center text-[#F0A844]">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-sans font-bold text-[#F0A844] text-[15px] mb-1">
                  {topic.title}
                </h2>
                <p className="text-[#F5F2F0]/55 text-[13px] leading-snug mb-3">
                  {topic.description}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate(ROUTES.TOPIC_DETAIL, { topicId: topic.id })}
                  className="bg-[#E05B2D] hover:bg-[#F27A52] text-[#1a1412] font-bold text-[12px] px-4 py-1.5 rounded-md transition-colors"
                >
                  Read
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="pt-6 pb-4"
      >
        <Button
          type="button"
          onClick={() => onNavigate(ROUTES.GAME)}
          className="w-full h-[48px] text-[#1a1412] font-bold bg-[#E05B2D] hover:bg-[#F27A52] rounded-lg gap-2"
        >
          I&apos;m Ready — Play Now
          <ArrowRight size={18} />
        </Button>
      </motion.div>
    </div>

    <div className="h-1 bg-gradient-to-r from-transparent via-[#F0A844]/60 to-transparent" />
  </div>
)

export default LearnFirstHubPage
