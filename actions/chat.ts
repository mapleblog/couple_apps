'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function sendMessage(content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get current user from DB to find coupleId
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { coupleId: true }
  })

  if (!dbUser?.coupleId) {
    return { success: false, error: 'No couple found' }
  }

  // Debug log to check if prisma.message is defined
  // @ts-ignore
  if (!prisma.message) {
    console.error('CRITICAL ERROR: prisma.message is undefined. Prisma Client is not generated correctly.')
    return { success: false, error: 'Server configuration error: Message model not found' }
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        coupleId: dbUser.coupleId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    revalidatePath('/chat')
    return { success: true, data: message }
  } catch (error: any) {
    console.error('Error sending message:', error)
    return { success: false, error: error.message || 'Failed to send message' }
  }
}

export async function getMessages() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { coupleId: true }
  })

  if (!dbUser?.coupleId) {
    return { success: false, error: 'No couple found' }
  }

  try {
    const messages = await prisma.message.findMany({
      where: { coupleId: dbUser.coupleId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    return { success: true, data: messages }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return { success: false, error: 'Failed to fetch messages' }
  }
}

export async function getMessage(id: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })
    return { success: true, data: message }
  } catch (error) {
    return { success: false, error: 'Failed to fetch message' }
  }
}
