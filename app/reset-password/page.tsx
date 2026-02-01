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
import { updatePassword } from '@/actions/auth'

const formSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, {})
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <div className="flex min-h-screen w-full bg-stone-950">
      {/* Left Side - Animation */}
      <div className="hidden lg:block lg:w-1/2">
        <LoveSidePanel />
      </div>

      {/* Right Side - Reset Password Form */}
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
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              Enter your new password below
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 shadow-xl backdrop-blur-sm">
            <Form {...form}>
              <form action={formAction} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-stone-300">New Password</FormLabel>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-stone-300">Confirm Password</FormLabel>
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

                {state?.error && (
                  <div className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">
                    {state.error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
