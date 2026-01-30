import { z } from 'zod'

export const memorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().optional(),
  eventDate: z.date(),
  locationName: z.string().optional(),
  imageUrls: z.array(z.string().url()).min(1, 'At least one photo is required'),
  isFavorite: z.boolean().default(false),
  milestone: z.enum([
    'FIRST_MEET',
    'FIRST_DATE',
    'FIRST_TRAVEL',
    'PROPOSAL',
    'MARRIAGE',
    'ANNIVERSARY',
    'OTHER'
  ]).optional(),
  mood: z.string().optional(),
})

export type MemoryFormData = z.infer<typeof memorySchema>

export const anniversarySchema = z.object({
  anniversaryDate: z.date(),
})
