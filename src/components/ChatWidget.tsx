import { useState, useRef, useCallback } from 'react'
import { sendChat, textToSpeech, type ChatMessage } from '../lib/api'

type View = 'closed' | 'mode-select' | 'chat' | 'voice'

export default function ChatWidget() {
  const [view, setView] = useState<View>('closed')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const sendMessage = useCallback(async (text: string, useVoice = false) => {
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

      if (useVoice && res.message) {
        try {
          const blob = await textToSpeech(res.message)
          const url = URL.createObjectURL(blob)
          if (audioRef.current) audioRef.current.pause()
          const audio = new Audio(url)
          audioRef.current = audio
          audio.play()
        } catch { /* TTS optional */ }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, conversationId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition

    let finalText = ''

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalText += transcript + ' '
        } else {
          interim += transcript
        }
      }
      setInterimTranscript(finalText + interim)
    }

    recognition.onend = () => {
      setIsListening(false)
      const text = finalText.trim()
      if (text) {
        sendMessage(text, true)
      }
      setInterimTranscript('')
    }

    recognition.start()
    setIsListening(true)
  }

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
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50" style={{ maxHeight: '500px' }}>
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <span className="font-semibold">Ava</span>
        <button onClick={() => setView('closed')} className="text-white/80 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mode Select */}
      {view === 'mode-select' && (
        <div className="p-4 flex flex-col gap-3">
          <p className="text-center text-gray-600 text-sm mb-2">Hi! How would you like to connect?</p>
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
              <div className="text-xs text-gray-500">Have a voice conversation</div>
            </div>
          </button>
          {messages.length > 0 && (
            <p className="text-center text-xs text-gray-400">{messages.length} messages in conversation</p>
          )}
        </div>
      )}

      {/* Chat Mode */}
      {view === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: '340px' }}>
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">Ask Ava anything about our products and services.</p>
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
            <button type="button" onClick={() => setView('mode-select')} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
              Send
            </button>
          </form>
        </>
      )}

      {/* Voice Mode */}
      {view === 'voice' && (
        <div className="p-6 flex flex-col items-center gap-4">
          <button type="button" onClick={() => setView('mode-select')} className="self-start text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <p className="text-sm text-gray-500">
            {isListening ? 'Listening... tap to stop' : isLoading ? 'Ava is thinking...' : 'Tap to speak'}
          </p>

          {interimTranscript && (
            <p className="text-sm text-gray-700 text-center italic max-h-20 overflow-y-auto">{interimTranscript}</p>
          )}

          {messages.length > 0 && (
            <div className="w-full max-h-40 overflow-y-auto space-y-2">
              {messages.slice(-4).map((msg, i) => (
                <div key={i} className={`text-xs px-3 py-1.5 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-700'
                }`}>
                  <span className="font-medium">{msg.role === 'user' ? 'You' : 'Ava'}:</span> {msg.content.slice(0, 100)}{msg.content.length > 100 ? '...' : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
