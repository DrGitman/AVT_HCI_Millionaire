import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Zap,
  Clock,
  Lightbulb,
  Trophy,
  Star,
  Check,
  MessageSquare,
  Smile,
  Mic,
  Volume2,
  VolumeX,
  Smartphone,
  BookOpen,
  X
} from 'lucide-react'
import { AppNavBar } from '../components/AppNavBar'
import { ROUTES } from '../navigation/routes'
import { getNavActive } from '../navigation/navActive'
import { api } from '../lib/api'

const LADDER = [
  { level: 15, prize: '$1,000,000', milestone: 'trophy' },
  { level: 14, prize: '$500,000' },
  { level: 13, prize: '$250,000' },
  { level: 12, prize: '$125,000' },
  { level: 11, prize: '$64,000' },
  { level: 10, prize: '$32,000', current: true, milestone: 'check' },
  { level: 9, prize: '$16,000' },
  { level: 8, prize: '$8,000' },
  { level: 7, prize: '$4,000' },
  { level: 6, prize: '$2,000' },
  { level: 5, prize: '$1,000', milestone: 'star' },
  { level: 4, prize: '$500' },
  { level: 3, prize: '$300' },
  { level: 2, prize: '$200' },
  { level: 1, prize: '$100' },
]

const ANSWERS = [
  { id: 'A', text: 'The local regional government representative' },
  { id: 'B', text: 'The designated community elders' },
  { id: 'C', text: 'The youngest literate community demographic' },
  { id: 'D', text: 'The external international NGO program manager' },
]

const PLAYERS = [
  { id: 1, name: 'Julian', prize: '$32,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian', talking: true, ready: true },
  { id: 2, name: 'Sarah', prize: '$64,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', talking: false, ready: false, active: true },
  { id: 3, name: 'Amara', prize: '$16,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara', talking: false, ready: true },
  { id: 4, name: 'Kofi', prize: '$8,000', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi', talking: false, ready: false, muted: true },
]

const MultiplayerGamePage = ({ onNavigate, roomCode = 'HCI-7F3' }) => {
  const [user, setUser] = useState(null)
  const [players, setPlayers] = useState(PLAYERS)
  const [selected, setSelected] = useState('B')
  const [timeLeft, setTimeLeft] = useState(9)
  const [activeLifeline, setActiveLifeline] = useState(null)

  // Real-time states
  const [messages, setMessages] = useState([])
  const [chatOpen, setChatOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [reactions, setReactions] = useState([])
  const [isMuted, setIsMuted] = useState(false)

  const socketRef = useRef(null)
  const scrollRef = useRef(null)
  const localStream = useRef(null)
  const peerConnections = useRef({})

  useEffect(() => {
    api.me().then(setUser).catch(console.error)
  }, [])

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = `${protocol}//${host}/api/v1/game/ws/game/${roomCode}`

    socketRef.current = new WebSocket(wsUrl)

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.event === 'chat_message') {
        setMessages(prev => [...prev, data])
      } else if (data.event === 'emoji_reaction') {
        const id = Date.now()
        setReactions(prev => [...prev, { id, emoji: data.emoji, playerId: data.playerId }])
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== id))
        }, 3000)
      } else if (data.event === 'webrtc_signal') {
        if (user && (data.targetId === user.PlayerId || data.targetId === 'all')) {
          handleWebRTCSignal(data)
        }
      } else if (data.event === 'player_joined') {
        setPlayers(prev => {
          if (prev.find(p => p.id === data.player.PlayerId)) return prev
          return [...prev, { ...data.player, id: data.player.PlayerId, active: false, ready: true }]
        })
      } else if (data.event === 'player_disconnected') {
        setPlayers(prev => prev.filter(p => p.id !== data.playerId))
      }
    }

    return () => {
      if (socketRef.current) socketRef.current.close()
    }
  }, [roomCode])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSelectAnswer = (id) => {
    setSelected(id)
    if (socketRef.current?.readyState === WebSocket.OPEN && user) {
      socketRef.current.send(JSON.stringify({
        event: 'player_answered',
        playerId: user.PlayerId,
        answerId: id
      }))
    }
  }

  const handleWebRTCSignal = async (data) => {
    const { senderId, signal } = data

    if (signal.type === 'offer') {
      const pc = createPeerConnection(senderId)
      await pc.setRemoteDescription(new RTCSessionDescription(signal))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      sendSignal(senderId, answer)
    } else if (signal.type === 'answer') {
      const pc = peerConnections.current[senderId]
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal))
    } else if (signal.type === 'ice-candidate') {
      const pc = peerConnections.current[senderId]
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(signal.candidate))
    }
  }

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => pc.addTrack(track, localStream.current))
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(targetId, { type: 'ice-candidate', candidate: event.candidate })
      }
    }

    pc.ontrack = (event) => {
      const remoteAudio = new Audio()
      remoteAudio.srcObject = event.streams[0]
      remoteAudio.play()
    }

    peerConnections.current[targetId] = pc
    return pc
  }

  const sendSignal = (targetId, signal) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && user) {
      socketRef.current.send(JSON.stringify({
        event: 'webrtc_signal',
        senderId: user.PlayerId,
        targetId,
        signal
      }))
    }
  }

  const toggleMic = async () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)

    if (!nextMuted && !localStream.current) {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
        Object.values(peerConnections.current).forEach(pc => {
          localStream.current.getTracks().forEach(track => pc.addTrack(track, localStream.current))
        })
      } catch (err) {
        console.error("Error accessing microphone:", err)
      }
    } else if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => (track.enabled = !nextMuted))
    }

    if (socketRef.current?.readyState === WebSocket.OPEN && user) {
      socketRef.current.send(JSON.stringify({
        event: 'webrtc_signal',
        senderId: user.PlayerId,
        targetId: 'all',
        signal: { type: 'mic_status', muted: nextMuted }
      }))
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim() || !user) return

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        event: 'chat_message',
        playerId: user.PlayerId,
        playerName: user.name,
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
      setInputText('')
    }
  }

  const sendEmoji = (emoji) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && user) {
      socketRef.current.send(JSON.stringify({
        event: 'emoji_reaction',
        playerId: user.PlayerId,
        emoji: emoji
      }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0908] text-[#F5F2F0] font-sans flex flex-col overflow-hidden selection:bg-[#EF6637]/30 relative">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[1px] border-white/5 rounded-full -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-white/5 rounded-full -z-0" />

      {/* Custom Header with Chat/Mic controls */}
      <header className="bg-[#4A2B28] border-b border-[#F0A844]/20 px-16 py-6 flex items-center justify-between z-30 shadow-2xl">
        <div className="flex items-center gap-10">
          <img
            src="/Logo.png"
            alt="HCI Millionaire"
            className="h-16 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            onClick={() => onNavigate(ROUTES.HOME)}
          />
          <div className="w-[2px] h-10 bg-white/10" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-xl group ${
                chatOpen ? 'bg-[#EF6637] text-white border-[#F0A844]/40' : 'bg-[#1A1312] text-[#F0A844] hover:bg-[#EF6637] hover:text-white border-[#F0A844]/20'
              }`}
            >
              <MessageSquare size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            </button>

            <div className="relative group">
              <button className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1A1312] text-[#F0A844] hover:bg-[#EF6637] hover:text-white transition-all border border-[#F0A844]/20 shadow-xl">
                <Smile size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 flex gap-2 p-3 bg-[#1A1312] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {['👍', '🔥', '💡', '🤔', '🤣'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => sendEmoji(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={toggleMic}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-xl group ${
                !isMuted ? 'bg-[#1A1312] text-[#F0A844] hover:bg-[#EF6637] hover:text-white border-[#F0A844]/20' : 'bg-red-500/20 text-red-500 border-red-500/40'
              }`}
            >
              {isMuted ? <VolumeX size={24} strokeWidth={2.5} /> : <Mic size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[#F0A844] text-[12px] font-black tracking-[0.4em] uppercase font-sans">LOBBY STABILITY</span>
            <span className="text-green-500 text-[14px] font-black font-serif italic">EXCELLENT (14ms)</span>
          </div>
          <button
            onClick={() => onNavigate(ROUTES.MULTIPLAYER)}
            className="px-14 py-3 rounded-xl bg-[#EF6637] text-white font-black text-[14px] transition-all shadow-[0_10px_20px_rgba(239,102,55,0.3)] active:scale-95 uppercase tracking-widest"
          >
            Quit
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Floating Emoji Reactions */}
        <AnimatePresence>
          {reactions.map(r => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 100, x: Math.random() * 200 - 100 }}
              animate={{ opacity: 1, y: -500 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute bottom-20 left-1/2 pointer-events-none text-6xl z-50"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Chat Sidebar Overlay */}
        <AnimatePresence>
          {chatOpen && (
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] bg-[#1A1312] border-l border-white/10 z-40 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-serif italic font-black text-[#F0A844] text-xl tracking-tight">Scholarly Chat</h3>
                <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${user && msg.playerId === user.PlayerId ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#F0A844]">{msg.playerName}</span>
                      <span className="text-[10px] text-white/20">{msg.timestamp}</span>
                    </div>
                    <div className={`max-w-[85%] p-4 rounded-2xl font-serif italic text-sm ${
                      user && msg.playerId === user.PlayerId ? 'bg-[#EF6637] text-white rounded-tr-none' : 'bg-[#4A2B28]/40 text-[#F5F2F0] border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-6 bg-[#0D0908]/50 border-t border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your deliberation..."
                    className="w-full bg-[#1A1312] border border-white/10 rounded-xl py-4 pl-6 pr-14 text-white text-sm focus:outline-none focus:border-[#EF6637] transition-colors"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF6637]">
                    <Zap size={20} fill="currentColor" />
                  </button>
                </div>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
        {/* Lifelines Sidebar */}
        <aside className="w-[360px] bg-[#1A1312]/80 backdrop-blur-md border-r border-white/5 p-14 flex flex-col gap-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-[2px] bg-[#EF6637]" />
            <h2 className="text-[#F5F2F0]/40 text-[14px] font-black tracking-[0.4em] uppercase font-sans">LIFELINES</h2>
          </div>
          <div className="flex flex-col gap-8">
            {[
              { id: '5050', label: '50:50', text: '-1', used: true },
              { id: 'class', label: 'Ask the Class', icon: Users },
              { id: 'phone', label: 'Phone a Peer', icon: Smartphone },
              { id: 'sage', label: 'Sayings of the Sage', icon: BookOpen },
            ].map((ll) => (
              <button
                key={ll.id}
                onClick={() => !ll.used && setActiveLifeline(ll.id)}
                className={`w-full flex items-center gap-6 p-8 rounded-[24px] transition-all text-left border active:scale-[0.98] shadow-lg ${
                  ll.used
                    ? 'bg-black/20 border-white/5 opacity-30 cursor-not-allowed'
                    : 'bg-[#4A2B28]/20 border-white/5 hover:bg-[#4A2B28]/40 group'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-[#4A2B28] flex items-center justify-center shrink-0 border transition-all duration-500 shadow-xl ${
                  ll.used ? 'border-white/5' : 'border-[#F0A844]/20 group-hover:scale-110'
                }`}>
                  {ll.icon ? (
                    <ll.icon size={32} strokeWidth={2.5} className={ll.used ? 'text-white/20' : 'text-[#F0A844] group-hover:text-[#EF6637] transition-colors'} />
                  ) : (
                    <span className={`font-black text-3xl font-serif italic tracking-tighter transition-colors ${ll.used ? 'text-white/20' : 'text-[#F0A844] group-hover:text-[#EF6637]'}`}>{ll.text}</span>
                  )}
                </div>
                <span className={`text-[18px] font-black tracking-tight font-serif italic transition-colors ${ll.used ? 'text-white/20' : 'text-[#F5F2F0]/80 group-hover:text-white'}`}>{ll.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-16 overflow-y-auto custom-scrollbar flex flex-col items-center relative">
          {/* Players Strip */}
          <div className="w-full max-w-[1200px] grid grid-cols-4 gap-8 mb-20">
            {players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: player.id * 0.1 }}
                className={`p-6 rounded-[32px] border-2 flex items-center gap-6 relative transition-all shadow-2xl ${
                  player.active
                    ? 'bg-[#4A2B28] border-[#F0A844] scale-105 z-10'
                    : 'bg-[#1A1312] border-white/5'
                }`}
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl overflow-hidden bg-[#613736] border-2 shadow-xl ${player.active ? 'border-[#F0A844]' : 'border-white/10'}`}>
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                  {player.ready && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center border-2 border-[#1A1312] shadow-lg">
                      <Check size={16} strokeWidth={4} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[18px] font-black text-[#F5F2F0] font-serif italic truncate tracking-tight">{player.name}</p>
                  <p className="text-[14px] font-black text-[#F0A844] uppercase tracking-widest font-sans">{player.prize}</p>
                </div>
                <div className="ml-auto">
                  {player.muted ? (
                    <VolumeX size={20} className="text-white/20" />
                  ) : player.talking ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Volume2 size={24} className="text-[#EF6637]" />
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="relative mb-20">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] border-[2px] border-dashed border-[#EF6637]/20 rounded-full"
            />
            <div className="w-[200px] h-[200px] rounded-full border-[8px] border-[#F0A844] flex items-center justify-center relative bg-[#0D0908] shadow-[0_0_60px_rgba(240,168,68,0.3)]">
              <span className="text-[88px] font-serif font-black text-[#F5F2F0] italic tracking-tighter drop-shadow-2xl">{timeLeft}</span>
              <div className="absolute -bottom-4 bg-[#EF6637] px-6 py-1 rounded-lg text-white text-[12px] font-black uppercase tracking-widest font-sans shadow-xl">Seconds</div>
            </div>
          </div>

          {/* Question Box */}
          <div className="w-full max-w-[1000px] bg-[#4A2B28] rounded-[48px] p-20 mb-16 text-center relative border-2 border-[#F0A844]/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)] group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1A1312] border border-[#F0A844]/40 px-10 py-2 rounded-full shadow-xl">
              <span className="text-[#F0A844] text-[12px] font-black tracking-[0.5em] uppercase font-sans">COLLECTIVE CHALLENGE</span>
            </div>
            <p className="text-[#F5F2F0] text-[32px] md:text-[36px] leading-[1.4] font-black max-w-5xl mx-auto font-serif italic tracking-tight">
              You are an HCI designer engaging a San community for the first time. Guided by Philosophical Sagacity, who should you approach first to respect community protocol?
            </p>
            <div className="mt-14 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#F0A844]/40 to-transparent mx-auto rounded-full" />
          </div>

          {/* Answers Grid */}
          <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {ANSWERS.map((ans) => (
              <button
                key={ans.id}
                onClick={() => handleSelectAnswer(ans.id)}
                className={`flex items-stretch text-left rounded-[32px] border-2 transition-all group overflow-hidden relative ${
                  selected === ans.id
                    ? 'border-[#F0A844] bg-[#4A2B28] shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-[1.02]'
                    : 'border-white/5 bg-[#1A1312] hover:border-white/20'
                }`}
              >
                <div className={`w-[80px] flex items-center justify-center shrink-0 transition-all font-serif font-black italic text-[32px] ${
                  selected === ans.id ? 'bg-[#EF6637] text-white shadow-2xl' : 'bg-[#4A2B28] text-white/40 group-hover:text-white/80'
                }`}>
                  {ans.id}
                </div>
                <div className="p-10 flex items-center flex-1">
                  <span className={`text-[22px] font-black leading-snug font-serif italic tracking-tight ${
                    selected === ans.id ? 'text-white' : 'text-[#F5F2F0]/60 group-hover:text-white'
                  }`}>{ans.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Status */}
          <div className="flex items-center gap-6 text-[#F0A844] text-[16px] font-black tracking-[0.4em] uppercase font-sans animate-pulse">
            <div className="w-12 h-[2px] bg-[#EF6637]" />
            Scholarly Deliberation in Progress...
          </div>
        </main>

        {/* Progress Ladder Sidebar */}
        <aside className="w-[440px] bg-[#1A1312]/80 backdrop-blur-md border-l border-white/5 p-14 flex flex-col">
          <div className="flex items-center justify-between mb-14">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[2px] bg-[#EF6637]" />
              <h2 className="text-[#F5F2F0]/40 text-[14px] font-black tracking-[0.4em] uppercase font-sans">PROGRESS</h2>
            </div>
            <Trophy size={24} className="text-[#F0A844]" />
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto pr-4 custom-scrollbar">
            {LADDER.map((step) => (
              <div
                key={step.level}
                className={`flex items-center justify-between px-8 py-4 rounded-[20px] transition-all relative overflow-hidden ${
                  step.current
                    ? 'bg-[#EF6637] text-white font-black shadow-[0_15px_30px_rgba(239,102,55,0.3)] scale-[1.05] z-10'
                    : 'bg-white/[0.02] text-[#F5F2F0]/20'
                }`}
              >
                {step.current && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                )}
                <div className="flex items-center gap-8 relative z-10">
                  <span className={`w-8 text-[14px] font-black tracking-tighter font-sans ${step.current ? 'text-white' : 'text-white/10'}`}>{step.level}</span>
                  <div className="shrink-0">
                    {step.milestone === 'trophy' && <Trophy size={24} strokeWidth={3} className={step.current ? 'text-white' : 'text-[#F0A844]'} />}
                    {step.milestone === 'check' && <Check size={24} strokeWidth={4} className={step.current ? 'text-white' : 'text-[#F0A844]'} />}
                    {step.milestone === 'star' && <Star size={24} strokeWidth={3} className={step.current ? 'text-white' : 'text-[#F0A844]'} fill={step.current ? 'currentColor' : 'none'} />}
                    {!step.milestone && (
                      <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center text-[12px] font-black ${step.current ? 'border-white' : 'border-white/5'}`}>
                        $
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-[24px] font-black tracking-tight font-serif italic relative z-10 ${
                  step.current
                    ? 'text-white'
                    : step.level % 5 === 0
                      ? 'text-[#F0A844]'
                      : 'text-white/30 group-hover:text-white/50'
                }`}>{step.prize}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Lifeline Overlay Modals - Simplified for now */}
      <AnimatePresence>
        {activeLifeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#191211]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setActiveLifeline(null)}
          >
            {/* Modal content would go here, matching the specific lifeline designs */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#2d2421] border border-[#F0A844]/30 rounded-3xl p-10 max-w-lg w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-[#F0A844] font-['Source_Serif_4'] text-3xl font-bold mb-4 capitalize">{activeLifeline.replace('sage', 'Sage Counsel')}</h3>
              <p className="text-[#F5F2F0]/70 mb-8">This lifeline overlay is currently being aligned with pixel-perfect designs.</p>
              <button
                onClick={() => setActiveLifeline(null)}
                className="w-full py-4 rounded-xl bg-[#ef6637] text-[#191211] font-black uppercase tracking-widest"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 242, 240, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  )
}

export default MultiplayerGamePage
