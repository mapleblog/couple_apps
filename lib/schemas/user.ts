import { z } from 'zod'

export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long').optional(),
  birthday: z.date().optional(),
  zodiacSign: z.string().optional(),
  favoriteColor: z.string().optional(),
  location: z.string().optional(),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>
