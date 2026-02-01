'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage, getMessage } from '@/actions/chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Theme, EmojiClickData } from 'emoji-picker-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

interface Message {
  id: string
  content: string
  createdAt: Date
  senderId: string
  sender: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
}

interface ChatInterfaceProps {
  initialMessages: Message[]
  currentUserId: string
  coupleId: string
}

export function ChatInterface({ initialMessages, currentUserId, coupleId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Scroll to bottom on load and new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${coupleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `couple_id=eq.${coupleId}`
        },
        async (payload) => {
          const newMessageId = payload.new.id
          
          // Check if we already have this message (from our own send)
          setMessages(prev => {
            if (prev.some(m => m.id === newMessageId)) return prev
            
            // If not, fetch it
            return prev
          })

          // Fetch logic
          // Check again if we have it in a separate check to avoid race conditions?
          // Simplest is to just fetch and try to append unique
          
          const res = await getMessage(newMessageId)
          if (res.success && res.data) {
             setMessages(prev => {
                if (prev.some(m => m.id === newMessageId)) return prev
                return [...prev, res.data as Message]
             })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [coupleId, supabase])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const content = newMessage
    setNewMessage('') // Clear input immediately
    setShowEmojiPicker(false) // Close picker on send

    const result = await sendMessage(content)
    
    if (result.success && result.data) {
       setMessages(prev => [...prev, result.data as Message])
       setIsSending(false)
    } else {
       console.error('Failed to send:', result.error)
       alert(`Failed to send: ${result.error}`)
       setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-2xl mx-auto bg-stone-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-stone-800">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-2">
            <p>No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-end gap-2",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-stone-700">
                  {msg.sender.avatarUrl ? (
                    <Image 
                      src={msg.sender.avatarUrl} 
                      alt={msg.sender.name || 'User'} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center text-xs text-stone-400">
                      {msg.sender.name?.[0] || '?'}
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words shadow-sm",
                  isMe 
                    ? "bg-rose-600 text-white rounded-br-none" 
                    : "bg-stone-800 text-stone-200 rounded-bl-none"
                )}>
                  <p>{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-1 block text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-stone-950 border-t border-stone-800 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-10">
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={(emojiData: EmojiClickData) => {
                setNewMessage(prev => prev + emojiData.emoji)
              }}
            />
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-stone-400 hover:text-stone-200 hover:bg-stone-800"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-5 h-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-stone-900 border-stone-700 focus:border-rose-500 focus:ring-rose-500/20 text-stone-200"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim() || isSending}
            className="bg-rose-600 hover:bg-rose-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
