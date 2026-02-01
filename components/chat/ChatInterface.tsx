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
import { Theme, EmojiClickData, EmojiStyle } from 'emoji-picker-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { 
  ssr: false,
  loading: () => <div className="w-[300px] h-[400px] bg-stone-900/90 animate-pulse rounded-xl" />
})

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
  partner?: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
}

export function ChatInterface({ initialMessages, currentUserId, coupleId, partner }: ChatInterfaceProps) {
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
            const isMe = msg.senderId === currentUserId
            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId
            
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-end gap-3 group",
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
                      <div className="w-full h-full bg-stone-800 flex items-center justify-center text-xs text-stone-400 font-medium">
                        {msg.sender.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                ) : (
                   <div className="w-8 shrink-0" />
                )}

                {/* Bubble */}
                <div className={cn(
                  "relative max-w-[75%] px-5 py-3 text-sm leading-relaxed shadow-lg transition-all duration-200 hover:shadow-xl",
                  isMe 
                    ? "bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-2xl rounded-tr-sm" 
                    : "bg-stone-800/80 text-stone-100 rounded-2xl rounded-tl-sm backdrop-blur-sm border border-white/5"
                )}>
                  <p>{msg.content}</p>
                  <span className={cn(
                    "text-[10px] mt-1 block text-right font-medium tracking-wide",
                    isMe ? "text-rose-200/70" : "text-stone-500"
                  )}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-stone-900/60 border-t border-white/5 backdrop-blur-md relative z-20">
        <div 
          ref={emojiPickerRef}
          className={cn(
            "absolute bottom-24 left-6 z-30 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10 transition-all duration-300 ease-out origin-bottom-left",
            showEmojiPicker 
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          )}
        >
          <EmojiPicker
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.APPLE}
            lazyLoadEmojis={true}
            searchDisabled={false}
            skinTonesDisabled
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
            onEmojiClick={(emojiData: EmojiClickData) => {
              setNewMessage(prev => prev + emojiData.emoji)
            }}
          />
        </div>
        <form onSubmit={handleSend} className="flex gap-3 items-end max-w-4xl mx-auto">
          <Button
            ref={emojiTriggerRef}
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full h-10 w-10 transition-all duration-300",
              showEmojiPicker 
                ? "bg-rose-500/20 text-rose-400 rotate-0" 
                : "text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 hover:rotate-12"
            )}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-6 h-6" />
          </Button>
          
          <div className="flex-1 relative group">
             <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a loving message..."
                className="w-full bg-stone-800/50 border-stone-700/50 focus:border-rose-500/50 focus:ring-rose-500/20 text-stone-200 placeholder:text-stone-500 rounded-2xl py-6 pl-5 pr-12 transition-all duration-300 group-hover:bg-stone-800/80"
             />
          </div>

          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim() || isSending}
            className={cn(
               "rounded-full h-12 w-12 shadow-lg transition-all duration-300",
               !newMessage.trim() || isSending 
                 ? "bg-stone-800 text-stone-600" 
                 : "bg-rose-600 hover:bg-rose-500 hover:scale-105 hover:shadow-rose-500/25 text-white"
            )}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
