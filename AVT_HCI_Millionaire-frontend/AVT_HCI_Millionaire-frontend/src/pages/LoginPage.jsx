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
    <div id="login-page" className="min-h-screen bg-[#191211] bg-gradient-to-b from-[#271F1E] to-[#191211] flex items-center justify-center px-4 py-4 overflow-hidden">
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
          <h1 className="font-serif text-[26px] font-bold leading-tight text-[#F0A844]">
            Welcome Back, Player
          </h1>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-2.5">

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="login-email"
              className="block text-[11px] font-bold tracking-[0.15em] text-[#F5F2F0]/80 mb-1 uppercase"
            >
              User Email
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5F2F0]/50">
                <Mail size={16} />
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
                className="w-full h-[44px] pl-10 pr-4 bg-[#613736] border border-transparent rounded-lg text-[15px] text-[#F5F2F0] placeholder:text-[#F5F2F0]/40 transition-all duration-300 focus:outline-none focus:border-[#E05B2D] focus:ring-1 focus:ring-[#E05B2D]/40"
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] mt-0.5">
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <PasswordField
              id="login-password"
              label="Password"
              labelClassName="block text-[11px] font-bold tracking-[0.15em] text-[#F5F2F0]/80 mb-1 uppercase"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              error={errors.password}
            />
          </motion.div>

          {/* Remember Me + Forgot Credentials */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-0.5 text-[14px]">
            <Checkbox
              label={<span className="text-[#F5F2F0]/80 text-[13px]">Remember Me</span>}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <button
              type="button"
              onClick={() => console.log('Forgot Credentials')}
              className="text-[#eedfdd]/75 hover:text-[#E05B2D] transition-colors font-medium text-[13px]"
            >
              Forgot Credentials?
            </button>
          </motion.div>

          {submitError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ffb4ab] text-[12px] text-center">
              {submitError}
            </motion.p>
          )}

          {/* Sign In Button */}
          <motion.div variants={itemVariants} className="pt-1.5">
            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              className="w-full h-[44px] text-[13px] tracking-[0.15em] font-bold uppercase"
              disabled={isLoading}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer Navigation */}
        <motion.div variants={itemVariants} className="mt-5 text-center text-[14px]">
          <p className="text-[#F5F2F0]/70">
            New to the platform?{' '}
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="button"
              id="login-to-signup-link"
              onClick={() => onNavigate(ROUTES.SIGNUP)}
              className="text-[#E05B2D] hover:text-[#F27A52] font-bold transition-colors ml-1"
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
