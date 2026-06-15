import { motion } from 'framer-motion'
import { RefreshCw, ArrowLeft, Clock, BookOpen } from 'lucide-react'
import { ROUTES } from '../navigation/routes'
import { useState, useEffect } from 'react'
import { api } from '../lib/api'

const MultiplayerReviewPage = ({ onNavigate, gameId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await api.request(`/game/${gameId}/review`)
        setReviews(data)
      } catch (err) {
        console.error('Failed to fetch review:', err)
      } finally {
        setLoading(false)
      }
    }
    if (gameId) fetchReview()
    else setLoading(false)
  }, [gameId])

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
          {reviews.length > 0 ? reviews.map((card, idx) => (
            <motion.div
              key={idx}
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
                    QUESTION {String(card.question_num).padStart(2, '0')}
                  </span>
                </div>
                <div className="text-right text-[14px] uppercase tracking-widest text-white/30 font-black font-sans italic">
                   <p className={`${card.is_correct ? 'text-green-500' : 'text-[#EF6637]'}`}>
                    {card.is_correct ? 'CORRECTLY SOLVED' : 'INCORRECT ATTEMPT'}
                  </p>
                </div>
              </div>

              {/* User's Choice */}
              {!card.is_correct && (
                <div className="mb-6">
                   <span className="text-white/20 text-xs uppercase tracking-widest font-black">Your selection:</span>
                   <p className="text-white/60 font-serif italic text-xl">{card.user_answer}</p>
                </div>
              )}

              {/* Question Text */}
              <p className="font-serif font-black text-[42px] md:text-[52px] leading-[1.1] mb-16 text-white tracking-tighter italic">
                &ldquo;{card.question_text}&rdquo;
              </p>

              {/* Correct Answer */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16 bg-[#4A2B28]/20 p-10 rounded-[32px] border border-[#EF6637]/10">
                <span className="inline-block self-start px-5 py-2 bg-[#EF6637] text-white text-[12px] font-black rounded-xl tracking-[0.3em] uppercase font-sans shadow-lg shadow-[0_5px_15px_rgba(239,102,55,0.4)]">
                  CORRECT ARCHIVE
                </span>
                <span className="font-serif text-[#F0A844] text-[36px] md:text-[44px] leading-tight font-black italic tracking-tight">
                  {card.correct_answer}
                </span>
              </div>

              {/* Justification */}
              {card.justification && (
                 <div className="mb-12 p-8 bg-black/20 rounded-2xl border border-white/5">
                    <p className="text-[#F5F2F0]/60 italic font-serif text-[22px] leading-relaxed">
                      {card.justification}
                    </p>
                 </div>
              )}

              {/* Source */}
              <div className="flex items-center gap-3 text-[#F5F2F0]/20 font-serif italic text-[18px]">
                <BookOpen size={20} className="text-[#EF6637]/40" />
                <span>Reference: {card.source}</span>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 bg-[#1A1312] rounded-[48px] border-2 border-white/5">
                <p className="text-white/20 font-serif italic text-2xl">No question history found for this session.</p>
            </div>
          )}
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
