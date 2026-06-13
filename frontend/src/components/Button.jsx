import { motion } from 'framer-motion'

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-sans font-semibold rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center'
  
  const variants = {
    primary: 'bg-[#E05B2D] text-[#F5F2F0] hover:bg-[#F27A52] shadow-sm',
    secondary: 'border border-[#F5F2F0]/15 text-[#F5F2F0] hover:bg-[#F5F2F0]/10',
    tertiary: 'text-[#E05B2D] hover:text-[#F27A52]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-3 text-[14px]',
    lg: 'px-8 py-4 text-[15px]',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
