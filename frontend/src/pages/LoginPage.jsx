import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Checkbox, PasswordField } from '../components'
import { Mail } from 'lucide-react'
import { ROUTES } from '../navigation/routes'
import { api, saveAuthTokens } from '../lib/api'

const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setSubmitError('')
      api
        .login({ email, password })
        .then((tokens) => {
          saveAuthTokens(tokens)
          if (rememberMe) {
            localStorage.setItem('hci_remember_me', 'true')
          }
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
    <div
      id="login-page"
      className="min-h-screen bg-[#0D0908] flex items-center justify-center px-4 py-4 overflow-hidden"
    >
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
        <motion.div variants={itemVariants} className="text-center mb-2">
          <h1 className="font-serif text-[36px] font-bold text-[#F0A844] tracking-tight">Welcome Back, Player</h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-[#F5F2F0]/60 text-[16px] mb-14">
          Access your AVT810S cohort profile.
        </motion.p>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-6">

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="login-email"
              className="block text-[12px] font-bold tracking-[0.1em] text-[#F5F2F0]/60 mb-3 uppercase"
            >
              User Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F2F0]/40">
                <Mail size={20} />
              </div>
              <input
                id="login-email"
                type="email"
                placeholder="researcher@hci.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                className="w-full h-[64px] pl-14 pr-4 bg-[#4A2B28] border border-white/5 rounded-xl text-[18px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/20 transition-all duration-300 focus:outline-none focus:border-[#EF6637] focus:ring-1 focus:ring-[#EF6637]/40"
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-2">
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <PasswordField
              id="login-password"
              label="Password"
              labelClassName="block text-[12px] font-bold tracking-[0.1em] text-[#F5F2F0]/60 mb-3 uppercase"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              error={errors.password}
              inputClassName="w-full h-[64px] pl-14 pr-16 bg-[#4A2B28] border border-white/5 rounded-xl text-[18px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/20 transition-all duration-300 focus:outline-none focus:border-[#EF6637] focus:ring-1 focus:ring-[#EF6637]/40"
              iconClassName="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F2F0]/40 pointer-events-none"
              iconSize={20}
              showTextClassName="text-[#EF6637] font-bold text-[13px] tracking-wider"
            />
          </motion.div>

          {/* Remember Me + Forgot Credentials */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-1 text-[14px]">
            <Checkbox
              label={<span className="text-[#F5F2F0]/80 text-[15px] ml-1">Remember Me</span>}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <button
              type="button"
              onClick={() => console.log('Forgot Credentials')}
              className="text-[#F5F2F0]/80 hover:text-[#EF6637] transition-colors font-medium text-[15px]"
            >
              Forgot Credentials?
            </button>
          </motion.div>

          {submitError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[14px] text-center">
              {submitError}
            </motion.p>
          )}

          {/* Sign In Button */}
        <motion.div variants={itemVariants} className="pt-8">
          <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
            className="w-full h-[64px] bg-[#EF6637] hover:bg-[#F27A52] text-white text-[16px] tracking-[0.1em] font-bold uppercase rounded-xl transition-all shadow-xl active:scale-[0.98]"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
          </motion.div>
        </motion.form>

        {/* Footer Navigation */}
        <motion.div variants={itemVariants} className="mt-16 text-center text-md">
          <p className="text-[#F5F2F0]/60">
            New to the platform?{' '}
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              id="login-to-signup-link"
              onClick={() => onNavigate(ROUTES.SIGNUP)}
              className="text-[#EF6637] hover:text-[#F27A52] font-bold transition-colors ml-1"
            >
              Create A Profile
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
