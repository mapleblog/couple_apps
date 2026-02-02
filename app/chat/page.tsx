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
    select: { 
      coupleId: true,
      couple: {
        select: {
          users: {
            where: {
              id: { not: user.id }
            },
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      }
    }
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
  const partner = dbUser.couple?.users[0] || null

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-stone-950">
      <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6">
        <ChatInterface 
          initialMessages={messages || []} 
          currentUser={{
            id: user.id,
            name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Me',
            avatarUrl: user.user_metadata.avatar_url || null
          }}
          coupleId={dbUser.coupleId}
          partner={partner}
        />
      </div>
    </div>
  )
}
