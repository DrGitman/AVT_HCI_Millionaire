import { motion } from 'framer-motion'
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react'
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
    scholarsCount: '9/12 scholars correct',
    fastestTime: '6s',
    question:
      'How do Adinkra symbols influence iconographic design in contemporary West African user interfaces?',
    correctAnswer:
      'They provide culturally grounded visual metaphors that communicate meaning through shared symbolic knowledge.',
    source: 'Decolonial Design Studies, 2022',
    players: ['J', 'S', 'N'],
    others: 6,
  },
]

const MultiplayerReviewPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#1a0f0a] text-[#F5F2F0] pb-12">
      <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-[#F5F2F0]/5">
        <img src="/Logo.png" alt="HCI Millionaire" className="w-12 h-[52px] object-contain" />
        <span className="text-[#F5F2F0] font-medium text-lg">Session Review</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6 mb-12">
          {REVIEW_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#4a2c2a] rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <span className="text-xs font-bold text-[#E05B2D] tracking-wider">
                  {card.num}
                </span>
                <div className="text-right text-[11px] text-[#F5F2F0]/50">
                  <p>{card.scholarsCount}</p>
                  <p className="flex items-center justify-end gap-1 text-[#E05B2D] mt-0.5">
                    <Clock size={11} />
                    Fastest: {card.fastestTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {card.players.map((p) => (
                  <span
                    key={p}
                    className="w-7 h-7 rounded-full bg-[#E05B2D] flex items-center justify-center text-[11px] font-bold text-white"
                  >
                    {p}
                  </span>
                ))}
                <span className="text-[11px] text-[#F5F2F0]/50 ml-1">
                  +{card.others} others
                </span>
              </div>

              <p className="font-serif text-lg md:text-xl leading-relaxed mb-5">
                {card.question}
              </p>

              <div className="flex flex-wrap items-baseline gap-2 mb-4">
                <span className="px-2 py-0.5 bg-[#E05B2D] text-white text-[10px] font-bold rounded">
                  CORRECT
                </span>
                <span className="font-serif text-[#E05B2D] text-base md:text-lg">
                  {card.correctAnswer}
                </span>
              </div>

              <p className="text-[11px] text-[#F5F2F0]/45 italic">
                Source: {card.source}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.HOME)}
            className="flex items-center gap-2 text-sm font-bold tracking-wider hover:text-[#F0A844] transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </button>
          <button
            type="button"
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#E05B2D] hover:bg-[#F27A52] text-white font-bold text-sm transition-colors"
          >
            Play Again
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultiplayerReviewPage
