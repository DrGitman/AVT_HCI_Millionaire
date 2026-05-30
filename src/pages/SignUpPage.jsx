import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Checkbox, PasswordField } from '../components'
import { User, Mail } from 'lucide-react'

const SignUpPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password && formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters'
    if (!consent) newErrors.consent = 'You must accept the terms'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        console.log('Sign Up:', formData)
      }, 1000)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.03,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  return (
    <div id="signup-page" className="min-h-screen bg-[#191211] bg-gradient-to-b from-[#271F1E] to-[#191211] flex items-center justify-center px-4 py-4 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] flex flex-col"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex justify-center mb-2">
          <img
            src="/Logo.png"
            alt="HCI Millionaire Logo"
            className="w-[64px] h-[68px] object-contain"
          />
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="text-center mb-4">
          <h1 className="font-serif text-[26px] font-bold leading-tight text-[#F5F2F0]">
            Create Profile
          </h1>
        </motion.div>

        {/* Form Fields & Button & Footer */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-2.5">
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="signup-fullname"
              className="block text-[13px] text-[#F5F2F0]/80 mb-1 font-medium"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5F2F0]/50">
                <User size={16} />
              </div>
              <input
                id="signup-fullname"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 bg-[#613736] border border-transparent rounded-lg text-[15px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/40 transition-all duration-300 focus:outline-none focus:border-[#E05B2D] focus:ring-1 focus:ring-[#E05B2D]/40"
              />
            </div>
            {errors.fullName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-0.5">
                {errors.fullName}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="signup-email"
              className="block text-[13px] text-[#F5F2F0]/80 mb-1 font-medium"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5F2F0]/50">
                <Mail size={16} />
              </div>
              <input
                id="signup-email"
                type="email"
                placeholder="student@nust.na"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 bg-[#613736] border border-transparent rounded-lg text-[15px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/40 transition-all duration-300 focus:outline-none focus:border-[#E05B2D] focus:ring-1 focus:ring-[#E05B2D]/40"
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-0.5">
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Secure Password */}
          <motion.div variants={itemVariants}>
            <PasswordField
              id="signup-password"
              label="Secure Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
            />
          </motion.div>

          {/* Consent Checkbox */}
          <motion.div
            variants={itemVariants}
            className="bg-[#613736]/20 rounded-lg p-2.5 border border-[#F5F2F0]/10"
          >
            <Checkbox
              label={
                <span className="text-[#F5F2F0]/80 text-[12.5px] leading-[17px] block">
                  I consent to the processing of anonymous research
                  metrics for the{' '}
                  <span className="font-bold text-[#F0A844]">AVT810S</span>{' '}
                  evaluation framework.
                </span>
              }
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }))
              }}
            />
            {errors.consent && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-1">
                {errors.consent}
              </motion.p>
            )}
          </motion.div>

          {/* Register Button */}
          <motion.div variants={itemVariants} className="pt-1.5">
            <Button
              id="signup-submit-btn"
              type="submit"
              variant="primary"
              className="w-full h-[44px] text-[13px] tracking-[0.15em] font-bold uppercase"
              disabled={isLoading}
            >
              {isLoading ? 'CREATING PROFILE...' : 'REGISTER PROFILE'}
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer Navigation */}
        <motion.div variants={itemVariants} className="mt-5 text-center text-[14px]">
          <p className="text-[#F5F2F0]/70">
            Already possess a profile?{' '}
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              id="signup-to-login-link"
              onClick={() => onNavigate('login')}
              className="text-[#E05B2D] hover:text-[#F27A52] font-bold transition-colors ml-1"
            >
              Log In
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUpPage
