import { motion } from 'framer-motion'

export const Card = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-secondary-container rounded-lg p-6 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
