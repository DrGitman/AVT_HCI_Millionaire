import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Checkbox, PasswordField } from '../components'
import { User, Mail } from 'lucide-react'
import { ROUTES } from '../navigation/routes'
import { api, saveAuthTokens } from '../lib/api'

const SignUpPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

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
      setSubmitError('')
      const username = formData.email.split('@')[0] || formData.fullName.toLowerCase().replace(/\s+/g, '_')
      api
        .register({
          username,
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
        })
        .then((tokens) => {
          saveAuthTokens(tokens)
          onNavigate(ROUTES.HOME)
        })
        .catch((error) => {
          setSubmitError(error.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
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
    <div id="signup-page" className="min-h-screen bg-[#0D0908] flex items-center justify-center px-4 py-8 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[480px] flex flex-col"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <img
            src="/Logo.png"
            alt="HCI Millionaire Logo"
            className="w-[120px] h-[120px] object-contain"
          />
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="font-serif text-[36px] font-bold text-[#F5F2F0] tracking-tight">
            Create Profile
          </h1>
        </motion.div>

        {/* Form Fields & Button & Footer */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-6">
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="signup-fullname"
              className="block font-serif text-[14px] text-[#F5F2F0]/60 mb-3 font-bold"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F2F0]/40">
                <User size={20} />
              </div>
              <input
                id="signup-fullname"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full h-[64px] pl-14 pr-4 bg-[#4A2B28] border border-white/5 rounded-xl text-[18px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/20 transition-all duration-300 focus:outline-none focus:border-[#EF6637] focus:ring-1 focus:ring-[#EF6637]/40"
              />
            </div>
            {errors.fullName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-2">
                {errors.fullName}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="signup-email"
              className="block font-serif text-[14px] text-[#F5F2F0]/60 mb-3 font-bold"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F2F0]/40">
                <Mail size={20} />
              </div>
              <input
                id="signup-email"
                type="email"
                placeholder="student@nust.na"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-[64px] pl-14 pr-4 bg-[#4A2B28] border border-white/5 rounded-xl text-[18px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/20 transition-all duration-300 focus:outline-none focus:border-[#EF6637] focus:ring-1 focus:ring-[#EF6637]/40"
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-2">
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Secure Password */}
          <motion.div variants={itemVariants}>
            <PasswordField
              id="signup-password"
              label="Secure Password"
              labelClassName="block font-serif text-[14px] text-[#F5F2F0]/60 mb-3 font-bold"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              inputClassName="w-full h-[64px] pl-14 pr-16 bg-[#4A2B28] border border-white/5 rounded-xl text-[18px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/20 transition-all duration-300 focus:outline-none focus:border-[#EF6637] focus:ring-1 focus:ring-[#EF6637]/40"
              iconClassName="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F2F0]/40 pointer-events-none"
              iconSize={20}
              showTextClassName="text-[#EF6637] font-bold text-[13px] tracking-wider"
            />
          </motion.div>

          {/* Consent Checkbox */}
          <motion.div
            variants={itemVariants}
            className="bg-[#1A1312] rounded-xl p-6 border border-white/5"
          >
            <Checkbox
              label={
                <span className="text-[#F5F2F0]/70 text-[15px] leading-[24px] block font-serif">
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
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-3">
                {errors.consent}
              </motion.p>
            )}
          </motion.div>

          {submitError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[14px] text-center">
              {submitError}
            </motion.p>
          )}

          {/* Register Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full h-[64px] bg-[#EF6637] hover:bg-[#F27A52] text-white text-[16px] tracking-[0.1em] font-bold uppercase rounded-xl transition-all shadow-xl active:scale-[0.98]"
            >
              {isLoading ? 'CREATING PROFILE...' : 'REGISTER PROFILE'}
            </button>
          </motion.div>
        </motion.form>

        {/* Footer Navigation */}
        <motion.div variants={itemVariants} className="mt-12 text-center text-[16px]">
          <p className="text-[#F5F2F0]/60">
            Already possess a profile?{' '}
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              id="signup-to-login-link"
              onClick={() => onNavigate(ROUTES.LOGIN)}
              className="text-[#EF6637] hover:text-[#F27A52] font-bold transition-colors ml-1"
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
