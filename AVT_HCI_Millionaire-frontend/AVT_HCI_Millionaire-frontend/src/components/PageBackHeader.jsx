import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export const PageBackHeader = ({
  title,
  onBack,
  rightAction = null,
  titleClassName = 'text-[#F0A844] font-sans font-bold text-lg',
}) => (
  <div className="flex items-center justify-between mb-6">
    <motion.button
      whileHover={{ x: -2 }}
      type="button"
      onClick={onBack}
      className="flex items-center gap-2 text-[#F0A844] font-sans font-bold text-lg"
    >
      <ArrowLeft size={20} />
      <span className={titleClassName}>{title}</span>
    </motion.button>
    {rightAction}
  </div>
)
