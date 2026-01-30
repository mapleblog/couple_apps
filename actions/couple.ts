'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = null> = {
  success: boolean
  data?: T
  error?: string
}

export async function getCoupleData(): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        couple: {
          include: {
            users: true
          }
        }
      }
    })

    if (!dbUser?.couple) {
      return { success: false, error: 'No couple data found' }
    }

    return { success: true, data: dbUser.couple }
  } catch (error) {
    console.error('Error fetching couple data:', error)
    return { success: false, error: 'Failed to fetch couple data' }
  }
}

export async function updateAnniversary(date: Date): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser?.coupleId) {
      return { success: false, error: 'No couple found' }
    }

    await prisma.couple.update({
      where: { id: dbUser.coupleId },
      data: { anniversaryDate: date }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating anniversary:', error)
    return { success: false, error: 'Failed to update anniversary' }
  }
}
