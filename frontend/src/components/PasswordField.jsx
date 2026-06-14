import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'

export const PasswordField = ({
  id,
  label,
  labelClassName = 'block text-[13px] text-[#F5F2F0]/80 mb-1 font-medium',
  value,
  onChange,
  error = '',
  placeholder = '••••••••',
  inputClassName = "w-full h-[44px] pl-10 pr-14 bg-[#613736] border border-transparent rounded-lg text-[15px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/40 transition-all duration-300 focus:outline-none focus:border-[#E05B2D] focus:ring-1 focus:ring-[#E05B2D]/40",
  iconClassName = "absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5F2F0]/50 pointer-events-none",
  iconSize = 16,
  showTextClassName = ""
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <div className={iconClassName}>
          <Lock size={iconSize} />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClassName}
        />
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((prev) => !prev)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors transition-all duration-300 ${showTextClassName || 'text-[#F5F2F0]/40 hover:text-[#EF6637]'}`}
        >
          {showTextClassName ? (
            <span className="uppercase">{showPassword ? 'Hide' : 'Show'}</span>
          ) : (
            showPassword ? <EyeOff size={20} /> : <Eye size={20} />
          )}
        </button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#ffb4ab] text-[12px] mt-0.5"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
