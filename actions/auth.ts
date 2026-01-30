'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type AuthState = {
  error?: string
  success?: boolean
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }
  } catch (error) {
    return { error: 'Failed to connect to authentication service. Please check your network or configuration.' }
  }

  redirect('/')
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()
  const origin = (await headers()).get('origin') || 'http://localhost:3000'

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }
  } catch (error) {
    return { error: 'Failed to connect to authentication service. Please check your network or configuration.' }
  }

  return { success: true }
}


export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
