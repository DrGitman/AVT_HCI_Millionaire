import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ROUTES } from './navigation/routes'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import LearnFirstHubPage from './pages/LearnFirstHubPage'
import TopicDetailPage from './pages/TopicDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import GamePage from './pages/GamePage'
import SettingsPage from './pages/SettingsPage'
import VictoryPage from './pages/VictoryPage'
import ThemesPage from './pages/ThemesPage'
import JoinRoomPage from './pages/JoinRoomPage'
import CreateRoomPage from './pages/CreateRoomPage'
import MultiplayerHubPage from './pages/MultiplayerHubPage'
import GuestWaitingLobbyPage from './pages/GuestWaitingLobbyPage'
import HostWaitingLobbyPage from './pages/HostWaitingLobbyPage'
import MultiplayerGamePage from './pages/MultiplayerGamePage'
import EliminationSpectatorPage from './pages/EliminationSpectatorPage'
import MultiplayerFinalStandingsPage from './pages/MultiplayerFinalStandingsPage'
import MultiplayerReviewPage from './pages/MultiplayerReviewPage'
import './App.css'

function App() {
  const [nav, setNav] = useState({ page: ROUTES.LOGIN, params: {} })

  const onNavigate = (page, params = {}) => {
    setNav({ page, params })
    window.scrollTo(0, 0)
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const renderPage = () => {
    switch (nav.page) {
      case ROUTES.LOGIN:
        return <LoginPage onNavigate={onNavigate} />
      case ROUTES.SIGNUP:
        return <SignUpPage onNavigate={onNavigate} />
      case ROUTES.HOME:
        return <HomePage onNavigate={onNavigate} />
      case ROUTES.THEMES:
        return <ThemesPage onNavigate={onNavigate} />
      case ROUTES.MULTIPLAYER:
        return <MultiplayerHubPage onNavigate={onNavigate} />
      case ROUTES.JOIN_ROOM:
        return <JoinRoomPage onNavigate={onNavigate} />
      case ROUTES.CREATE_ROOM:
        return <CreateRoomPage onNavigate={onNavigate} />
      case ROUTES.PROFILE:
        return <ProfilePage onNavigate={onNavigate} />
      case ROUTES.LEADERBOARD:
        return <LeaderboardPage onNavigate={onNavigate} />
      case ROUTES.LEARN_HUB:
        return <LearnFirstHubPage onNavigate={onNavigate} />
      case ROUTES.TOPIC_DETAIL:
        return (
          <TopicDetailPage
            onNavigate={onNavigate}
            topicId={nav.params.topicId ?? 'ubuntu'}
          />
        )
      case ROUTES.NOTIFICATIONS:
        return <NotificationsPage onNavigate={onNavigate} />
      case ROUTES.GAME:
        return <GamePage onNavigate={onNavigate} />
      case ROUTES.SETTINGS:
        return <SettingsPage onNavigate={onNavigate} />
      case ROUTES.VICTORY:
        return (
          <VictoryPage
            onNavigate={onNavigate}
            result={nav.params.result}
          />
        )
      case ROUTES.GUEST_LOBBY:
        return <GuestWaitingLobbyPage onNavigate={onNavigate} />
      case ROUTES.HOST_LOBBY:
        return <HostWaitingLobbyPage onNavigate={onNavigate} />
      case ROUTES.MULTIPLAYER_GAME:
        return <MultiplayerGamePage onNavigate={onNavigate} />
      case ROUTES.ELIMINATION_SPECTATOR:
        return <EliminationSpectatorPage onNavigate={onNavigate} />
      case ROUTES.MULTIPLAYER_STANDINGS:
        return (
          <MultiplayerFinalStandingsPage
            onNavigate={onNavigate}
            gameId={nav.params.gameId}
            results={nav.params.results}
          />
        )
      case ROUTES.MULTIPLAYER_REVIEW:
        return (
          <MultiplayerReviewPage
            onNavigate={onNavigate}
            gameId={nav.params.gameId}
          />
        )
      default:
        return <LoginPage onNavigate={onNavigate} />
    }
  }

  const pageKey = nav.page + (nav.params.topicId ?? '')

  return (
    <div className="min-h-screen bg-surface">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
