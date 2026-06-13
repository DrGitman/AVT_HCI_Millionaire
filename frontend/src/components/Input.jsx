import { motion } from 'framer-motion'
import { useState } from 'react'

export const Input = ({ 
  type = 'text', 
  placeholder = '', 
  icon: Icon = null,
  label = '',
  error = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div className="w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {label && (
        <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} bg-surface-container border rounded-lg text-body-md transition-all duration-300 placeholder:text-on-surface-variant focus:outline-none ${
            isFocused 
              ? 'border-primary-container shadow-smooth' 
              : 'border-secondary-container'
          } ${error ? 'border-error' : ''} text-on-surface`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-error text-label-sm mt-2"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}
