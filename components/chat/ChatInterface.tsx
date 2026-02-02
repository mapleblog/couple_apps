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
import { format, isSameDay } from 'date-fns'
import { Theme } from 'emoji-picker-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { 
  ssr: false,
  loading: () => <div className="w-[300px] h-[400px] bg-stone-900/90 animate-pulse rounded-xl" />
})

interface Message {
  id: string
  content: string
  createdAt: Date | string
  senderId: string
  sender: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  isOptimistic?: boolean
}

interface ChatInterfaceProps {
  initialMessages: Message[]
  currentUser: {
    id: string
    name: string
    avatarUrl: string | null
  }
  coupleId: string
  partner?: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
}

function DateSeparator({ date }: { date: Date }) {
  return (
    <div className="flex items-center justify-center my-6">
      <span className="text-xs font-medium text-stone-400 bg-stone-800/40 px-3 py-1 rounded-full border border-white/5">
        {format(date, 'MMMM d, yyyy')}
      </span>
    </div>
  )
}

export function ChatInterface({ initialMessages, currentUser, coupleId, partner }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiTriggerRef = useRef<HTMLButtonElement>(null)
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiTriggerRef.current &&
        !emojiTriggerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

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

    const content = newMessage
    setNewMessage('') // Clear input immediately
    setShowEmojiPicker(false) // Close picker on send
    setIsSending(true)

    // Optimistic update
    const optimisticId = 'opt-' + Date.now()
    const optimisticMessage: Message = {
      id: optimisticId,
      content: content,
      createdAt: new Date(),
      senderId: currentUser.id,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl
      },
      isOptimistic: true
    }
    
    setMessages(prev => [...prev, optimisticMessage])

    try {
      const result = await sendMessage(content)
      
      if (result.success && result.data) {
         setMessages(prev => prev.map(m => m.id === optimisticId ? result.data as Message : m))
      } else {
         console.error('Failed to send:', result.error)
         // Remove optimistic message on failure and restore input
         setMessages(prev => prev.filter(m => m.id !== optimisticId))
         setNewMessage(content)
         alert(`Failed to send: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.filter(m => m.id !== optimisticId))
      setNewMessage(content)
    } finally {
      setIsSending(false)
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji)
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-stone-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md z-10">
         <h2 className="font-serif text-xl font-medium text-stone-200 tracking-wide">Love Chat</h2>
         <div className="flex items-center gap-3">
            {partner ? (
              <>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-stone-200">{partner.name || 'Partner'}</span>
                  <span className="text-xs text-stone-500">Together</span> 
                </div>
                <div className="relative w-9 h-9 rounded-full ring-2 ring-stone-800 overflow-hidden shadow-lg">
                    {partner.avatarUrl ? (
                        <Image src={partner.avatarUrl} alt={partner.name || 'Partner'} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-stone-700 flex items-center justify-center text-stone-400 font-medium">
                            {partner.name?.[0] || 'P'}
                        </div>
                    )}
                </div>
              </>
            ) : (
              <span className="text-stone-500 text-sm italic">Waiting for partner...</span>
            )}
         </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mb-2">
                <Smile className="w-8 h-8 text-stone-600" />
            </div>
            <p className="text-lg font-serif italic opacity-70">No messages yet...</p>
            <p className="text-sm text-stone-600">Start your love story conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id
            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId
            const showDateSeparator = index === 0 || !isSameDay(new Date(messages[index - 1].createdAt), new Date(msg.createdAt))
            
            return (
              <div key={msg.id}>
                {showDateSeparator && <DateSeparator date={new Date(msg.createdAt)} />}
                
                <div 
                  className={cn(
                    "flex items-end gap-3 group mb-2",
                    isMe ? "flex-row-reverse" : "flex-row",
                    !showAvatar && (isMe ? "mr-11" : "ml-11")
                  )}
                >
                  {/* Avatar */}
                  {showAvatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-stone-800 shadow-md">
                      {msg.sender.avatarUrl ? (
                        <Image 
                          src={msg.sender.avatarUrl} 
                          alt={msg.sender.name || 'User'} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-700 flex items-center justify-center text-xs text-stone-400 font-medium">
                          {msg.sender.name?.[0] || '?'}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Message Bubble */}
                  <div 
                    className={cn(
                      "relative max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all",
                      isMe 
                        ? "bg-rose-600 text-white rounded-br-none" 
                        : "bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700",
                      msg.isOptimistic && "opacity-70"
                    )}
                  >
                    {msg.content}
                    <span className={cn(
                      "text-[10px] ml-2 opacity-50 inline-block",
                      isMe ? "text-rose-100" : "text-stone-400"
                    )}>
                      {format(new Date(msg.createdAt), 'h:mm a')}
                      {msg.isOptimistic && " • Sending..."}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-md">
        <form onSubmit={handleSend} className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              ref={emojiTriggerRef}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800/50 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {showEmojiPicker && (
              <div 
                ref={emojiPickerRef}
                className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-xl overflow-hidden"
              >
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.DARK}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-stone-900/50 border-stone-800 focus:border-rose-500/50 focus:ring-rose-500/20 rounded-full px-6 py-5 text-stone-200 placeholder:text-stone-500"
          />

          <Button 
            type="submit" 
            size="icon"
            disabled={!newMessage.trim() || isSending}
            className={cn(
              "h-11 w-11 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all",
              (!newMessage.trim() || isSending) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
