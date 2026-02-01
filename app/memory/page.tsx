
import { MasonryGallery } from '@/components/gallery/MasonryGallery'
import { CreateMemoryDialog } from '@/components/gallery/CreateMemoryDialog'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMemories } from '@/actions/memory'

export const dynamic = 'force-dynamic'

export default async function MemoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: memories } = await getMemories()

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 sm:py-10">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
          Our Memories
        </h1>
        <MasonryGallery memories={memories || []} />
        <CreateMemoryDialog />
      </div>
    </div>
  )
}
