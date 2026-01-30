'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Heart, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoveSidePanel } from '@/components/login/LoveSidePanel'
import { login } from '@/actions/auth'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {})
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <div className="flex min-h-screen w-full bg-stone-950">
      {/* Left Side - Animation */}
      <div className="hidden lg:block lg:w-1/2">
        <LoveSidePanel />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex flex-col items-center text-center">
            {/* Mobile-only logo */}
            <Link href="/" className="mb-6 rounded-full bg-stone-900 p-3 ring-1 ring-stone-800 transition-colors hover:ring-rose-500/50 lg:hidden">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            </Link>
            
            <h2 className="font-serif text-4xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              Sign in to your shared space
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 shadow-xl backdrop-blur-sm">
          <Form {...form}>
            <form action={formAction} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-stone-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        className="border-stone-800 bg-stone-950 text-white placeholder:text-stone-600 focus:border-rose-500 focus:ring-rose-500/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-stone-300">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="border-stone-800 bg-stone-950 text-white placeholder:text-stone-600 focus:border-rose-500 focus:ring-rose-500/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />

              {state.error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {state.error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-stone-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-rose-500 hover:text-rose-400 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>

    </div>
  )
}
