import { motion } from 'framer-motion'
import { ArrowLeft, Network, Lightbulb } from 'lucide-react'
import { getTopicById } from '../data/topics'
import { ROUTES } from '../navigation/routes'

const TopicDetailPage = ({ onNavigate, topicId = 'ubuntu' }) => {
  const topic = getTopicById(topicId)
  const nextTopic = topic.nextTopicId ? getTopicById(topic.nextTopicId) : null

  return (
    <div className="min-h-screen bg-[#120F0E]">
      <div className="max-w-container mx-auto px-4 md:px-12 py-6">
        <button
          type="button"
          onClick={() => onNavigate(ROUTES.LEARN_HUB)}
          className="flex items-center gap-2 text-[#E05B2D] font-bold mb-8 hover:text-[#F27A52]"
        >
          <ArrowLeft size={18} />
          {topic.title}
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#C19A6B]/40 bg-[#2d2421] mb-4">
            <Network size={40} className="text-[#E05B2D]" strokeWidth={1.5} />
          </div>
          <p className="text-[#C19A6B] text-[11px] font-bold tracking-[0.2em] mb-2">
            CORE PHILOSOPHY
          </p>
          <h1 className="font-sans font-bold text-[#F5F2F0] text-2xl md:text-3xl max-w-2xl mx-auto leading-tight">
            {topic.heroTitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-8">
            <div className="bg-[#2d2421] rounded-xl p-6 md:p-8 border border-[#F5F2F0]/5">
              <p className="font-serif text-[#F5F2F0] text-xl md:text-2xl italic leading-relaxed">
                &ldquo;{topic.quote}&rdquo;
              </p>
              <p className="text-[#C19A6B] text-sm mt-4">— {topic.quoteAttribution}</p>
            </div>

            <section>
              <h2 className="text-[#C19A6B] font-bold text-lg mb-3">
                The Ontology of Ubuntu
              </h2>
              <p className="text-[#F5F2F0]/85 text-[15px] leading-relaxed">
                Ubuntu represents a person&apos;s interconnectedness with their community.
                In HCI, this framework demands that interactive systems prioritize communal
                value over individual efficiency, ensuring technology reinforces social bonds
                rather than isolating users.
              </p>
            </section>

            <section>
              <h2 className="text-[#C19A6B] font-bold text-lg mb-3">
                Application to HCI & Co-Design
              </h2>
              <p className="text-[#F5F2F0]/85 text-[15px] leading-relaxed">
                Modern interface architecture must move beyond Western individualism. By
                embedding Ubuntu into co-design workshops, researchers can create tools that
                reflect local governance structures and collective decision-making protocols.
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-[#E05B2D] rounded-xl p-5">
              <Lightbulb size={20} className="text-[#1a1412] mb-3" />
              <h3 className="font-bold text-[#1a1412] text-lg mb-2">Impact Analytics</h3>
              <p className="text-[#1a1412]/90 text-[14px] leading-relaxed">
                77.8% of interactive systems utilizing Ubuntu design frameworks achieved
                superior adoption metrics.
              </p>
              <p className="text-[#1a1412]/70 text-[10px] font-bold tracking-wider mt-4">
                SOURCE: AFRICAN HCI CONSORTIUM RESEARCH (2023)
              </p>
            </div>

            <div className="bg-[#2d2421] rounded-xl overflow-hidden border border-[#F5F2F0]/5">
              <div className="h-36 bg-gradient-to-br from-[#3c3332] to-[#1a1412] flex items-center justify-center">
                <span className="text-[#F5F2F0]/30 text-sm">Case study imagery</span>
              </div>
              <div className="p-4">
                <p className="text-[#E05B2D] text-[11px] font-bold tracking-wider mb-2">
                  CASE STUDY
                </p>
                <p className="text-[#F5F2F0] text-[14px]">
                  Traditional weavers using co-design tablets in Western Cape.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#F5F2F0]/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.LEARN_HUB)}
            className="text-[#F5F2F0] hover:text-[#F0A844] flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Topics
          </button>
          {nextTopic && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onNavigate(ROUTES.TOPIC_DETAIL, { topicId: nextTopic.id })}
              className="bg-[#E05B2D] hover:bg-[#F27A52] text-[#1a1412] font-bold px-6 py-3 rounded-full text-sm"
            >
              Next Topic: {nextTopic.title} →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicDetailPage
