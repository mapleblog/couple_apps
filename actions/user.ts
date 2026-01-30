'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from './couple'

export async function updateUserAvatar(avatarUrl: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Use upsert to handle cases where Auth user exists but Prisma record is missing
    await prisma.user.upsert({
      where: { id: user.id },
      update: { avatarUrl },
      create: {
        id: user.id,
        email: user.email || '',
        avatarUrl,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      }
    })
    
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating avatar:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to update avatar: ${errorMessage}` }
  }
}
