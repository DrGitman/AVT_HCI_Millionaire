import { motion } from 'framer-motion'
import { ArrowLeft, Users, Lightbulb, ArrowRight } from 'lucide-react'
import { getTopicById } from '../data/topics'
import { ROUTES } from '../navigation/routes'

const TopicDetailPage = ({ onNavigate, topicId = 'ubuntu' }) => {
  const topic = getTopicById(topicId)
  const nextTopic = topic.nextTopicId ? getTopicById(topic.nextTopicId) : null

  return (
    <div className="min-h-screen bg-[#0D0908] font-sans text-[#F5F2F0] pb-24">
      {/* Top Header */}
      <header className="bg-[#1A1312] border-b border-white/5 py-6 px-10 md:px-20 flex items-center gap-6 sticky top-0 z-50 shadow-2xl">
        <button
          onClick={() => onNavigate(ROUTES.LEARN_HUB)}
          className="text-white/60 hover:text-[#EF6637] transition-all hover:scale-110"
        >
          <ArrowLeft size={32} strokeWidth={2.5} />
        </button>
        <div className="w-[2px] h-8 bg-white/10 mx-2" />
        <h2 className="text-[#F0A844] font-black text-[28px] font-serif italic tracking-tight">{topic.title}</h2>
      </header>

      <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-12"
          >
            <div className="w-[220px] h-[220px] rounded-full bg-[#1A1312] border-[6px] border-[#F0A844]/20 p-2 flex items-center justify-center shadow-[0_0_50px_rgba(240,168,68,0.15)]">
              <div className="w-full h-full rounded-full border-2 border-[#F0A844] flex items-center justify-center bg-[#4A2B28]/30">
                <Users size={80} strokeWidth={1.5} className="text-[#EF6637]" />
              </div>
            </div>
            <div className="absolute -bottom-4 right-0 bg-[#EF6637] text-white text-[12px] font-black px-4 py-2 rounded-lg shadow-xl uppercase tracking-widest">
              Level {topic.id === 'ubuntu' ? '01' : '02'}
            </div>
          </motion.div>

          <p className="text-[#F0A844] text-[16px] font-black tracking-[0.4em] mb-6 uppercase font-sans">
            CORE PHILOSOPHY
          </p>
          <h1 className="font-serif text-[64px] md:text-[80px] max-w-5xl leading-[1.1] font-black italic tracking-tighter">
            {topic.heroTitle}
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-24">
          {/* Main Content */}
          <div className="space-y-24">
            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#4A2B28] rounded-[40px] p-16 md:p-20 relative overflow-hidden shadow-2xl border border-[#F0A844]/20 group"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all" />

              <p className="font-serif text-[36px] md:text-[42px] italic leading-[1.4] text-[#F5F2F0] font-black relative z-10 tracking-tight">
                &ldquo;{topic.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-12 relative z-10">
                <div className="w-12 h-[2px] bg-[#F0A844]" />
                <p className="text-[#F0A844] text-[20px] font-black font-serif italic tracking-tight">{topic.quoteAttribution}</p>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-20">
              <section className="relative">
                <div className="absolute -left-10 top-0 bottom-0 w-[4px] bg-[#EF6637]/20 rounded-full" />
                <h2 className="text-[#F0A844] font-serif text-[40px] mb-8 font-black italic tracking-tight">
                  The Ontology of Ubuntu
                </h2>
                <p className="text-[#F5F2F0]/80 text-[22px] leading-[1.8] font-serif italic">
                  Ubuntu represents a profound African philosophical framework that emphasizes the interconnectedness of all humanity. In this ontological view, individual identity is not an isolated construct but a dynamic result of community participation. It shifts the Western Cartesian "I think, therefore I am" to a more relational "I am because we are." This foundation posits that human virtues—compassion, reciprocity, and dignity—are cultivated only within the social fabric of the collective.
                </p>
              </section>

              <section className="relative">
                <div className="absolute -left-10 top-0 bottom-0 w-[4px] bg-[#EF6637]/20 rounded-full" />
                <h2 className="text-[#F0A844] font-serif text-[40px] mb-8 font-black italic tracking-tight">
                  Application to HCI & Co-Design
                </h2>
                <p className="text-[#F5F2F0]/80 text-[22px] leading-[1.8] font-serif italic">
                  When applied to Human-Computer Interaction (HCI), Ubuntu challenges the solo-user paradigm. Modern interface architecture often prioritizes individual productivity; however, an Ubuntu-centered design focuses on communal value and co-design methodologies. This approach advocates for systems that facilitate shared agency, social harmony, and the democratization of digital spaces. By viewing the user as part of an ecosystem, HCI can foster more resilient, culturally grounded digital experiences that prioritize collective well-being over isolated interactions.
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Impact Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#EF6637] rounded-[32px] p-12 text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

              <Lightbulb size={56} strokeWidth={2.5} className="mb-10 text-white shadow-xl" />
              <h3 className="font-serif text-[36px] font-black mb-8 leading-tight italic tracking-tight">Impact Analytics</h3>
              <p className="text-[24px] leading-[1.6] mb-12 font-black font-serif italic">
                "77.8% of interactive systems utilizing Ubuntu design frameworks achieved
                superior adoption metrics."
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-[12px] font-black tracking-[0.2em] opacity-60 uppercase font-sans">
                  RESEARCH SOURCE:
                </p>
                <p className="text-[14px] font-black font-serif italic">AFRICAN HCI CONSORTIUM (2023)</p>
              </div>
            </motion.div>

            {/* Case Study Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1312] rounded-[32px] overflow-hidden shadow-2xl border border-white/5 group"
            >
              <div className="aspect-[4/5] bg-[#251c1b] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"
                  alt="Case Study"
                  className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1312] via-[#1A1312]/20 to-transparent" />

                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-[#EF6637] text-[14px] font-black tracking-[0.3em] mb-4 uppercase font-sans">
                    CASE STUDY
                  </p>
                  <p className="text-[#F5F2F0] text-[22px] font-black font-serif italic leading-tight tracking-tight">
                    Traditional weavers using co-design tablets in Western Cape.
                  </p>
                  <button className="mt-8 flex items-center gap-3 text-[#F0A844] font-black text-[14px] uppercase tracking-widest group-hover:gap-5 transition-all">
                    Explore
                    <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-white/10 mt-32 pt-16 flex flex-col sm:flex-row justify-between items-center gap-10">
          <button
            onClick={() => onNavigate(ROUTES.LEARN_HUB)}
            className="text-white/40 hover:text-[#EF6637] transition-all flex items-center gap-4 text-[20px] font-black font-serif italic group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-[#EF6637] transition-all">
              <ArrowLeft size={20} strokeWidth={3} />
            </div>
            Back to Topics
          </button>

          {nextTopic && (
            <button
              onClick={() => onNavigate(ROUTES.TOPIC_DETAIL, { topicId: nextTopic.id })}
              className="w-full sm:w-auto bg-[#EF6637] hover:bg-[#ff7a4d] text-white font-black px-14 py-6 rounded-2xl flex items-center justify-center gap-6 transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(239,102,55,0.3)] text-[22px] font-serif italic tracking-tight"
            >
              Next Module: {nextTopic.title}
              <ArrowRight size={28} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicDetailPage
