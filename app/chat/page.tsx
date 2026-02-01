import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getMessages } from '@/actions/chat'
import { ChatInterface } from '@/components/chat/ChatInterface'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has a couple
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { coupleId: true }
  })

  if (!dbUser?.coupleId) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col">
        {/* Navbar removed to avoid duplication */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-stone-400">You need to be linked to a partner to start chatting.</p>
        </div>
      </div>
    )
  }

  const { success, data: messages } = await getMessages()

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 sm:py-10">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
          Chat Channel
        </h1>
        <ChatInterface 
          initialMessages={messages || []} 
          currentUserId={user.id}
          coupleId={dbUser.coupleId}
        />
      </div>
    </div>
  )
}
