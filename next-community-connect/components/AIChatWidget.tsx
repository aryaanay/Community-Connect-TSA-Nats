'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AI_PERSONA = {
  name: 'Community Connect AI',
  greeting: "Hi! I'm your Community Connect assistant. I can help you find local resources, events, volunteer opportunities, and more. What would you like to know?",
  suggestions: [
    'How do I volunteer?',
    'Find food assistance',
    'Health resources near Bothell',
    'Career & job help'
  ]
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: AI_PERSONA.greeting,
        timestamp: new Date()
      }])
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Build message history for API
    const history = messages.map(m => ({ role: m.role, content: m.content }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.error || 'Sorry, something went wrong.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(true); setIsMinimized(false) }}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open community assistant"
      >
        <span className="absolute inset-[-8px] rounded-full bg-sky-300/25 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
        <span className="absolute inset-[-3px] rounded-full border border-sky-200/40 animate-ping" />
        <span className="relative w-16 h-16 liquid-glass rounded-full flex items-center justify-center">
          <span className="absolute inset-2 rounded-full bg-gradient-to-br from-sky-300/35 via-white/10 to-cyan-300/20" />
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full border-2 border-white shadow-lg shadow-emerald-300/40 animate-pulse" />
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={`fixed right-6 z-50 transition-all duration-300 ${
              isMinimized
                ? 'bottom-24 w-80'
                : 'bottom-24 top-24 w-[min(24rem,calc(100vw-2rem))] max-h-[calc(100vh-8rem)]'
            }`}
          >
            <div className="liquid-glass rounded-[28px] overflow-hidden h-full">
              <div className="liquid-content h-full flex flex-col min-h-0">
              {/* Header */}
              <div className="px-4 py-4 flex items-center justify-between border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-syne font-bold text-sm">{AI_PERSONA.name}</h3>
                    <p className="text-sky-100/75 text-xs font-outfit flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live resource guide
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/15 rounded-xl transition-colors"
                    aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-white" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/15 rounded-xl transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              {!isMinimized && (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/10 via-sky-950/10 to-sky-950/25">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-3xl px-4 py-3 border ${
                            msg.role === 'user'
                              ? 'bg-sky-300/90 text-sky-950 rounded-br-lg border-white/30 shadow-lg shadow-sky-950/15'
                              : 'bg-white/14 text-white rounded-bl-lg border-white/15 shadow-lg shadow-sky-950/10 backdrop-blur-xl'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed font-outfit">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.role === 'user' ? 'text-sky-900/55' : 'text-sky-100/45'
                          }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/14 border border-white/15 rounded-3xl rounded-bl-lg px-4 py-3 shadow-sm backdrop-blur-xl">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-sky-200 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-sky-200 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-sky-200 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Suggestions */}
                  {messages.length <= 2 && (
                    <div className="flex-shrink-0 px-4 py-3 flex flex-wrap gap-2 border-t border-white/10">
                      {AI_PERSONA.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(suggestion)}
                          className="text-xs bg-white/12 hover:bg-white/20 text-sky-50 border border-white/15 px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex-shrink-0 p-3 border-t border-white/10 bg-white/5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me anything..."
                        className="ai-chat-input flex-1 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300/45"
                      />
                      <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="w-12 h-12 bg-sky-300 hover:bg-sky-200 disabled:bg-white/15 disabled:text-white/40 rounded-2xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                      >
                        <Send className="w-4 h-4 text-sky-950" />
                      </button>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
