import { motion } from 'framer-motion'

export const Checkbox = ({ label, checked = false, onChange, ...props }) => {
  return (
    <motion.label 
      className="flex items-start gap-3 cursor-pointer group select-none"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center mt-0.5 flex-shrink-0 ${
          checked 
            ? 'bg-[#E05B2D] border-[#E05B2D]' 
            : 'border-[#F5F2F0]/40 group-hover:border-[#E05B2D]'
        }`}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 text-[#F5F2F0]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </motion.div>
      <div className="flex-1">{label}</div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
        {...props}
      />
    </motion.label>
  )
}
