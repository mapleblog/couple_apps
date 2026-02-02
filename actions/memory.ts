'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { memorySchema, MemoryFormData } from '@/lib/schemas/memory'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from './couple'

export async function getMemories(): Promise<ActionResponse<any[]>> {
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

    const memories = await prisma.memory.findMany({
      where: { coupleId: dbUser.coupleId },
      orderBy: { eventDate: 'desc' },
      include: { tags: true }
    })

    return { success: true, data: memories }
  } catch (error) {
    console.error('Error fetching memories:', error)
    return { success: false, error: 'Failed to fetch memories' }
  }
}

export async function addMemory(formData: MemoryFormData): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedFields = memorySchema.safeParse(formData)
    
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields' }
    }

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

    await prisma.memory.create({
      data: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
        eventDate: validatedFields.data.eventDate,
        locationName: validatedFields.data.locationName,
        isFavorite: validatedFields.data.isFavorite,
        imageUrls: validatedFields.data.imageUrls,
        milestone: validatedFields.data.milestone,
        coupleId: dbUser.coupleId,
      }
    })

    revalidatePath('/')
    revalidatePath('/memory')
    return { success: true }
  } catch (error) {
    console.error('Error adding memory:', error)
    return { success: false, error: 'Failed to add memory' }
  }
}

export async function deleteMemory(memoryId: string): Promise<ActionResponse> {
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

    // Verify ownership
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId }
    })

    if (!memory || memory.coupleId !== dbUser.coupleId) {
      return { success: false, error: 'Memory not found or access denied' }
    }

    // Delete from DB
    await prisma.memory.delete({
      where: { id: memoryId }
    })
    
    revalidatePath('/')
    revalidatePath('/memory')
    return { success: true }
  } catch (error) {
    console.error('Error deleting memory:', error)
    return { success: false, error: 'Failed to delete memory' }
  }
}

export async function toggleMemoryFavorite(memoryId: string, isFavorite: boolean): Promise<ActionResponse> {
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

    await prisma.memory.update({
      where: {
        id: memoryId,
        coupleId: dbUser.coupleId
      },
      data: {
        isFavorite
      }
    })

    revalidatePath('/')
    revalidatePath('/memory')
    return { success: true }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: 'Failed to toggle favorite' }
  }
}

export async function updateMemory(memoryId: string, formData: MemoryFormData): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedFields = memorySchema.safeParse(formData)
    
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields' }
    }

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

    // Verify ownership
    const existingMemory = await prisma.memory.findUnique({
      where: { id: memoryId }
    })

    if (!existingMemory || existingMemory.coupleId !== dbUser.coupleId) {
      return { success: false, error: 'Memory not found or access denied' }
    }

    await prisma.memory.update({
      where: { id: memoryId },
      data: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
        eventDate: validatedFields.data.eventDate,
        locationName: validatedFields.data.locationName,
        isFavorite: validatedFields.data.isFavorite,
        imageUrls: validatedFields.data.imageUrls,
        milestone: validatedFields.data.milestone,
      }
    })

    revalidatePath('/')
    revalidatePath('/memory')
    return { success: true }
  } catch (error) {
    console.error('Error updating memory:', error)
    return { success: false, error: 'Failed to update memory' }
  }
}
