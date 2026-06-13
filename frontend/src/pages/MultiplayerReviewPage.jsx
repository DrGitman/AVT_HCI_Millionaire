import { motion } from 'framer-motion'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import { ROUTES } from '../navigation/routes'

const REVIEW_CARDS = [
  {
    id: 'q1',
    num: 'QUESTION 01',
    scholarsCount: '11/12 scholars correct',
    fastestTime: '4s',
    question:
      'In a communal HCI framework, which stakeholder group should be consulted first during the requirements elicitation phase?',
    correctAnswer: 'The designated community elders',
    source: 'African HCI Frameworks, 2023',
    players: ['A', 'M', 'K'],
    others: 9,
  },
  {
    id: 'q2',
    num: 'QUESTION 02',
    scholarsCount: '8/12 scholars correct',
    fastestTime: '7s',
    question:
      'How do Adinkra symbols influence iconographic design in contemporary West African user interfaces?',
    correctAnswer: 'By mapping abstract values to utilitarian functions',
    source: 'Journal of African Digital Design, 2022',
    players: ['S', 'J', 'L'],
    others: 5,
  },
]

const MultiplayerReviewPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0D0908] text-[#F5F2F0] pb-32 font-sans overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#EF6637]/5 to-transparent -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#EF6637]/5 rounded-full blur-[120px] -z-0" />

      {/* Header */}
      <header className="flex items-center justify-between px-16 md:px-32 py-20 relative z-10">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-[#EF6637] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(239,102,55,0.4)] transition-transform hover:rotate-6">
            <span className="text-white font-black text-3xl font-serif italic">M</span>
          </div>
          <div className="w-[2px] h-12 bg-white/10" />
          <h1 className="text-[#F0A844] font-serif font-black text-[56px] italic tracking-tighter leading-none">Session Review</h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#EF6637] text-[14px] font-black tracking-[0.4em] uppercase font-sans">EVALUATION COMPLETE</span>
          <span className="text-white/40 text-[18px] font-serif italic">15 Topics Archived</span>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-10 relative z-10">
        <div className="space-y-16 mb-24">
          {REVIEW_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-[#1A1312] rounded-[48px] p-16 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-2 border-white/5 group hover:border-[#EF6637]/30 transition-all"
            >
              {/* Top Row: Question # and Stats */}
              <div className="flex flex-wrap items-start justify-between gap-8 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[2px] bg-[#EF6637]" />
                  <span className="text-[16px] font-black text-[#EF6637] tracking-[0.4em] uppercase font-sans italic">
                    {card.num}
                  </span>
                </div>
                <div className="text-right text-[14px] uppercase tracking-widest text-white/30 font-black font-sans italic">
                  <p className="group-hover:text-white/60 transition-colors">{card.scholarsCount}</p>
                  <p className="text-[#EF6637] mt-2 flex items-center justify-end gap-2 text-[16px]">
                    <Clock size={16} strokeWidth={3} /> Fastest: {card.fastestTime}
                  </p>
                </div>
              </div>

              {/* Player Avatars */}
              <div className="flex items-center gap-4 mb-12">
                <div className="flex -space-x-3">
                  {card.players.map((p, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-[#4A2B28] border-2 border-[#1A1312] flex items-center justify-center text-[14px] font-black text-[#F0A844] shadow-xl font-serif italic"
                    >
                      {p}
                    </div>
                  ))}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 mx-2" />
                <span className="text-[14px] font-black text-[#F5F2F0]/20 tracking-[0.2em] uppercase font-sans">
                  +{card.others} scholars matched
                </span>
              </div>

              {/* Question Text */}
              <p className="font-serif font-black text-[42px] md:text-[52px] leading-[1.1] mb-16 text-white tracking-tighter italic">
                &ldquo;{card.question}&rdquo;
              </p>

              {/* Correct Answer */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16 bg-[#4A2B28]/20 p-10 rounded-[32px] border border-[#EF6637]/10">
                <span className="inline-block self-start px-5 py-2 bg-[#EF6637] text-white text-[12px] font-black rounded-xl tracking-[0.3em] uppercase font-sans shadow-lg shadow-[0_5px_15px_rgba(239,102,55,0.4)]">
                  CORRECT ARCHIVE
                </span>
                <span className="font-serif text-[#F0A844] text-[36px] md:text-[44px] leading-tight font-black italic tracking-tight">
                  {card.correctAnswer}
                </span>
              </div>

              {/* Source */}
              <div className="flex items-center gap-3 text-[#F5F2F0]/20 font-serif italic text-[18px]">
                <BookOpen size={20} className="text-[#EF6637]/40" />
                <span>Reference: {card.source}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t-2 border-white/5">
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.HOME)}
            className="flex items-center gap-4 text-[18px] font-black tracking-[0.2em] text-[#F5F2F0]/40 hover:text-[#EF6637] transition-all uppercase font-sans italic group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-[#EF6637] transition-all">
              <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
            </div>
            Back to Archive
          </button>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="flex items-center gap-6 px-16 h-24 rounded-[32px] bg-[#EF6637] hover:bg-[#f27a52] text-white font-black text-[28px] transition-all shadow-[0_30px_60px_rgba(239,102,55,0.4)] active:scale-95 font-serif italic tracking-tight group"
          >
            Initiate New Session
            <RefreshCw size={32} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultiplayerReviewPage
