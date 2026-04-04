import { useState, useRef, useEffect, useCallback } from 'react'
import { ConversationProvider, useConversation } from '@elevenlabs/react'
import { sendChat, type ChatMessage } from '../lib/api'

type View = 'closed' | 'mode-select' | 'chat' | 'voice'

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID || ''
const NUM_BARS = 24

function getOrCreateUserId(): string {
  const key = 'ava_user_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

function getClientDateTimeVars(): Record<string, string> {
  const now = new Date()
  return {
    current_datetime: now.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }),
    caller_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    current_iso_date: now.toISOString().slice(0, 10),
  }
}

function ChatWidgetInner() {
  const [view, setView] = useState<View>('closed')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [sessionActive, setSessionActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<ChatMessage[]>([])

  // ElevenLabs conversation hook for voice mode
  const conversation = useConversation({
    onMessage: ({ message, role }) => {
      const chatRole = role === 'agent' ? 'assistant' : 'user'
      const msg: ChatMessage = { role: chatRole, content: message }
      messagesRef.current = [...messagesRef.current, msg]
      setMessages([...messagesRef.current])
    },
    onError: (error) => {
      console.error('ElevenLabs conversation error:', error)
    },
  })

  const isConnected = conversation.status === 'connected'
  const isConnecting = conversation.status === 'connecting'
  const conversationRef = useRef(conversation)
  conversationRef.current = conversation

  useEffect(() => { messagesRef.current = messages }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  useEffect(() => { scrollToBottom() }, [messages])

  // Start ElevenLabs voice session
  const startVoiceSession = useCallback(async () => {
    if (sessionActive || !AGENT_ID) return
    try {
      setSessionActive(true)
      await conversationRef.current.startSession({
        agentId: AGENT_ID,
        dynamicVariables: getClientDateTimeVars(),
        userId: getOrCreateUserId(),
      })
    } catch (err) {
      console.error('Failed to start voice session:', err)
      setSessionActive(false)
    }
  }, [sessionActive])

  // Start ElevenLabs text-only session
  const startChatSession = useCallback(async () => {
    if (sessionActive || !AGENT_ID) return
    try {
      setSessionActive(true)
      await conversationRef.current.startSession({
        agentId: AGENT_ID,
        textOnly: true,
        dynamicVariables: getClientDateTimeVars(),
        userId: getOrCreateUserId(),
      })
    } catch (err) {
      console.error('Failed to start chat session:', err)
      setSessionActive(false)
    }
  }, [sessionActive])

  // End session
  const endCurrentSession = useCallback(async () => {
    if (!sessionActive) return
    try {
      await conversationRef.current.endSession()
    } catch { /* ignore */ }
    setSessionActive(false)
  }, [sessionActive])

  // Auto-start session when entering a mode
  useEffect(() => {
    if (view === 'voice' && !sessionActive) {
      startVoiceSession()
    } else if (view === 'chat' && !sessionActive && AGENT_ID) {
      startChatSession()
    }
  }, [view]) // eslint-disable-line react-hooks/exhaustive-deps

  // Text chat via public-chat API (fallback when no agent ID)
  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg: ChatMessage = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsLoading(true)
    scrollToBottom()

    try {
      const res = await sendChat(updated, conversationId)
      setConversationId(res.conversation_id)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.message }])
      scrollToBottom()
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, conversationId])

  // Send message — uses ElevenLabs SDK if connected, otherwise API
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return
    if (isConnected) {
      conversationRef.current.sendUserMessage(text.trim())
      setInput('')
    } else {
      sendTextMessage(text)
    }
  }, [isConnected, sendTextMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  // Close widget
  const closeWidget = useCallback(async () => {
    setView('closed')
    await endCurrentSession()
  }, [endCurrentSession])

  // Volume waveform for voice mode
  const [volumeLevels, setVolumeLevels] = useState<number[]>(new Array(NUM_BARS).fill(0))
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (view !== 'voice' || !isConnected) {
      setVolumeLevels(new Array(NUM_BARS).fill(0))
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    const updateLevels = () => {
      try {
        const conv = conversationRef.current
        const inputData = conv.getInputByteFrequencyData()
        const outputData = conv.getOutputByteFrequencyData()
        const data = conv.isSpeaking ? outputData : inputData

        const bars: number[] = []
        for (let i = 0; i < NUM_BARS; i++) {
          const idx = Math.floor((i / NUM_BARS) * data.length)
          bars.push((data[idx] || 0) / 255)
        }
        setVolumeLevels(bars)
      } catch { /* SDK not ready */ }
      animFrameRef.current = requestAnimationFrame(updateLevels)
    }

    animFrameRef.current = requestAnimationFrame(updateLevels)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [view, isConnected])

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant')

  // === CLOSED STATE ===
  if (view === 'closed') {
    return (
      <button
        onClick={() => setView('mode-select')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50" style={{ maxHeight: '520px' }}>
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          {view !== 'mode-select' && (
            <button onClick={async () => { await endCurrentSession(); setView('mode-select') }} className="text-white/80 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <span className="font-semibold">Ava</span>
          {isConnecting && <span className="text-xs opacity-70">connecting...</span>}
          {view === 'voice' && conversation.isSpeaking && <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full">Speaking</span>}
        </div>
        <button onClick={closeWidget} className="text-white/80 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* === MODE SELECT === */}
      {view === 'mode-select' && (
        <div className="p-4 flex flex-col gap-3">
          <p className="text-center text-gray-600 text-sm mb-2">Hi! I'm Ava with My A.I. Freedom Systems. How would you like to connect?</p>
          <button
            onClick={() => setView('chat')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
          >
            <span className="text-2xl">&#128172;</span>
            <div>
              <div className="font-semibold text-gray-900">Chat with Ava</div>
              <div className="text-xs text-gray-500">Type your questions</div>
            </div>
          </button>
          <button
            onClick={() => setView('voice')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
          >
            <span className="text-2xl">&#127908;</span>
            <div>
              <div className="font-semibold text-gray-900">Speak with Ava</div>
              <div className="text-xs text-gray-500">Real-time voice conversation</div>
            </div>
          </button>
          {messages.length > 0 && (
            <p className="text-center text-xs text-gray-400">{messages.length} messages in conversation</p>
          )}
        </div>
      )}

      {/* === CHAT MODE === */}
      {view === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: '360px' }}>
            {messages.length === 0 && !isConnecting && (
              <p className="text-center text-gray-400 text-sm mt-8">Ask Ava anything about our products and services.</p>
            )}
            {isConnecting && messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-8">
                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p>Connecting to Ava...</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl text-sm text-gray-400">Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConnected ? 'Type a message...' : isConnecting ? 'Connecting...' : 'Type a message...'}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isConnecting}
            />
            <button type="submit" disabled={!input.trim() || isLoading || isConnecting} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
              Send
            </button>
          </form>
        </>
      )}

      {/* === VOICE MODE (ElevenLabs Agent) === */}
      {view === 'voice' && (
        <div className="p-6 flex flex-col items-center gap-3">
          {/* Waveform Visualization */}
          <div className="flex items-end justify-center gap-[3px] h-16 w-full px-4">
            {volumeLevels.map((level, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-75 ${
                  conversation.isListening ? 'bg-red-500' : conversation.isSpeaking ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
                style={{ height: `${Math.max(3, level * 60)}px` }}
              />
            ))}
          </div>

          {/* Mic Button */}
          <button
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
              conversation.isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : conversation.isSpeaking
                  ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse'
                  : isConnected
                    ? conversation.isMuted
                      ? 'bg-gray-300 hover:bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 opacity-50'
            }`}
            onClick={() => {
              if (isConnected) {
                conversation.setMuted(!conversation.isMuted)
              }
            }}
            disabled={!isConnected}
          >
            {conversation.isMuted ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          {/* Status */}
          <p className="text-sm text-gray-500">
            {isConnecting
              ? 'Connecting to Ava...'
              : conversation.isListening
                ? 'Listening...'
                : conversation.isSpeaking
                  ? 'Ava is speaking...'
                  : conversation.isMuted
                    ? 'Mic muted — tap to unmute'
                    : 'Ready — speak to Ava'}
          </p>

          {/* Last response */}
          {lastAssistantMsg && (
            <div className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm max-h-20 overflow-y-auto">
              <p className="text-xs text-gray-400 mb-1">Ava:</p>
              <p className="text-gray-700">{lastAssistantMsg.content}</p>
            </div>
          )}

          {/* Switch to chat */}
          <button
            className="text-xs text-gray-400 hover:text-gray-600 mt-1"
            onClick={async () => { await endCurrentSession(); setView('chat') }}
          >
            Switch to text chat
          </button>
        </div>
      )}
    </div>
  )
}

export default function ChatWidget() {
  return (
    <ConversationProvider>
      <ChatWidgetInner />
    </ConversationProvider>
  )
}

// Type declarations for Web Speech API
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
