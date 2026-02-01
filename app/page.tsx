import { DashboardHeader } from '@/components/landing/DashboardHeader'
import { getCoupleData } from '@/actions/couple'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Fetch latest user data from DB to ensure avatar is up-to-date
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  const { success, data: couple } = await getCoupleData()

  // Use real data if available, otherwise fallback to mock data (handling DB errors or new users)
  const displayCouple = (success && couple) ? couple : {
    anniversaryDate: new Date('2024-02-14'), // Default to Valentine's Day
    meetDate: new Date('2024-01-01'), // Default meet date
    users: [
      {
        id: user.id,
        name: dbUser?.name || user.user_metadata.full_name || user.email?.split('@')[0] || 'You',
        avatarUrl: dbUser?.avatarUrl || user.user_metadata.avatar_url,
        email: user.email || 'you@example.com'
      },
      {
        id: 'partner-placeholder',
        name: 'Your Partner',
        avatarUrl: null,
        email: 'partner@example.com'
      }
    ]
  }

  // Ensure 'Đình Khang' (a5ff...fe8c) is always displayed first (left)
  // and 'Thuỳ Trang' (eb19...cbec) is always displayed second (right)
  const sortedUsers = [...displayCouple.users].sort((a: any, b: any) => {
    const leftUserId = 'a5ff397a-d8b0-4b30-bac9-4b78315ffe8c' // Đình Khang
    const rightUserId = 'eb194461-fc4d-41be-833f-9223de33cbec' // Thuỳ Trang
    
    if (a.id === leftUserId) return -1
    if (b.id === leftUserId) return 1
    if (a.id === rightUserId) return 1
    if (b.id === rightUserId) return -1
    return 0
  })

  return (
    <div className="flex flex-col min-h-screen bg-stone-950">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-900/20 blur-[120px] rounded-full animate-pulse-slow" />
        </div>

        <div className="relative z-10 w-full">
          <DashboardHeader 
            users={sortedUsers} 
            anniversaryDate={displayCouple.anniversaryDate}
            meetDate={displayCouple.meetDate}
            currentUserId={user.id}
          />
        </div>
      </section>
    </div>
  )
}
