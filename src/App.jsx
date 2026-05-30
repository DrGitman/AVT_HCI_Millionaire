import { useState } from 'react'
import { motion } from 'framer-motion'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }

  return (
    <div className="min-h-screen bg-surface">
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {currentPage === 'login' && (
          <LoginPage onNavigate={setCurrentPage} />
        )}
        {currentPage === 'signup' && (
          <SignUpPage onNavigate={setCurrentPage} />
        )}
      </motion.div>
    </div>
  )
}

export default App
