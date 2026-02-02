'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userProfileSchema, UserProfileFormData } from '@/lib/schemas/user'
import { updateUserProfile } from '@/actions/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, MapPin, Palette, Star, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const ZODIAC_SIGNS = [
  { value: 'Aries', label: '白羊座 (Aries)' },
  { value: 'Taurus', label: '金牛座 (Taurus)' },
  { value: 'Gemini', label: '双子座 (Gemini)' },
  { value: 'Cancer', label: '巨蟹座 (Cancer)' },
  { value: 'Leo', label: '狮子座 (Leo)' },
  { value: 'Virgo', label: '处女座 (Virgo)' },
  { value: 'Libra', label: '天秤座 (Libra)' },
  { value: 'Scorpio', label: '天蝎座 (Scorpio)' },
  { value: 'Sagittarius', label: '射手座 (Sagittarius)' },
  { value: 'Capricorn', label: '摩羯座 (Capricorn)' },
  { value: 'Aquarius', label: '水瓶座 (Aquarius)' },
  { value: 'Pisces', label: '双鱼座 (Pisces)' },
]

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    name: string | null
    birthday?: Date | null
    zodiacSign?: string | null
    favoriteColor?: string | null
    location?: string | null
  }
}

export function ProfileEditDialog({ open, onOpenChange, user }: ProfileEditDialogProps) {
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name || '',
      birthday: user.birthday ? new Date(user.birthday) : undefined,
      zodiacSign: user.zodiacSign || '',
      favoriteColor: user.favoriteColor || '',
      location: user.location || '',
    }
  })

  const [birthdayYear, setBirthdayYear] = useState<number | ''>(user.birthday ? new Date(user.birthday).getFullYear() : '')
  const [birthdayMonth, setBirthdayMonth] = useState<number | ''>(user.birthday ? new Date(user.birthday).getMonth() + 1 : '')
  const [birthdayDay, setBirthdayDay] = useState<number | ''>(user.birthday ? new Date(user.birthday).getDate() : '')

  useEffect(() => {
    if (open) {
      form.reset({
        name: user.name || '',
        birthday: user.birthday ? new Date(user.birthday) : undefined,
        zodiacSign: user.zodiacSign || '',
        favoriteColor: user.favoriteColor || '',
        location: user.location || '',
      })
      setBirthdayYear(user.birthday ? new Date(user.birthday).getFullYear() : '')
      setBirthdayMonth(user.birthday ? new Date(user.birthday).getMonth() + 1 : '')
      setBirthdayDay(user.birthday ? new Date(user.birthday).getDate() : '')
    }
  }, [open, user, form])

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      const result = await updateUserProfile(data)
      if (result.success) {
        onOpenChange(false)
      } else {
        alert(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An unexpected error occurred')
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const daysInMonth = (year: number, month: number) => {
    if (!year || !month) return 31
    return new Date(year, month, 0).getDate()
  }
  const dayOptions = Array.from({ length: daysInMonth(Number(birthdayYear) || currentYear, Number(birthdayMonth) || 1) }, (_, i) => i + 1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-stone-900 border-stone-800 text-stone-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-rose-200">Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                      <Input {...field} className="pl-9 bg-stone-800/50 border-stone-700" placeholder="Your Name" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthday</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <FormControl>
                      <select
                        value={birthdayYear === '' ? '' : String(birthdayYear)}
                        onChange={(e) => {
                          const y = e.target.value ? Number(e.target.value) : ''
                          setBirthdayYear(y)
                          const m = birthdayMonth === '' ? 1 : Number(birthdayMonth)
                          const d = birthdayDay === '' ? 1 : Number(birthdayDay)
                          if (y !== '' && birthdayMonth !== '' && birthdayDay !== '') {
                            const maxD = daysInMonth(Number(y), Number(m))
                            const safeD = Math.min(Number(d), maxD)
                            field.onChange(new Date(Number(y), Number(m) - 1, safeD))
                            setBirthdayDay(safeD)
                          }
                        }}
                        className="w-full bg-stone-800/50 border border-stone-700 text-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
                      >
                        <option value="" disabled>Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormControl>
                      <select
                        value={birthdayMonth === '' ? '' : String(birthdayMonth)}
                        onChange={(e) => {
                          const m = e.target.value ? Number(e.target.value) : ''
                          setBirthdayMonth(m)
                          const y = birthdayYear === '' ? currentYear : Number(birthdayYear)
                          const d = birthdayDay === '' ? 1 : Number(birthdayDay)
                          if (birthdayYear !== '' && m !== '' && birthdayDay !== '') {
                            const maxD = daysInMonth(Number(y), Number(m))
                            const safeD = Math.min(Number(d), maxD)
                            field.onChange(new Date(Number(y), Number(m) - 1, safeD))
                            setBirthdayDay(safeD)
                          }
                        }}
                        className="w-full bg-stone-800/50 border border-stone-700 text-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
                      >
                        <option value="" disabled>Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormControl>
                      <select
                        value={birthdayDay === '' ? '' : String(birthdayDay)}
                        onChange={(e) => {
                          const d = e.target.value ? Number(e.target.value) : ''
                          setBirthdayDay(d)
                          if (birthdayYear !== '' && birthdayMonth !== '' && d !== '') {
                            const y = Number(birthdayYear)
                            const m = Number(birthdayMonth)
                            field.onChange(new Date(y, m - 1, Number(d)))
                          }
                        }}
                        className="w-full bg-stone-800/50 border border-stone-700 text-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
                      >
                        <option value="" disabled>Day</option>
                        {dayOptions.map((d) => (
                          <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
                        ))}
                      </select>
                    </FormControl>
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {birthdayYear && birthdayMonth && birthdayDay
                      ? format(new Date(Number(birthdayYear), Number(birthdayMonth) - 1, Number(birthdayDay)), 'PPP')
                      : 'Select Year, Month, Day'}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zodiacSign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zodiac Sign</FormLabel>
                  <FormControl>
                    <select
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full bg-stone-800/50 border border-stone-700 text-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
                    >
                      <option value="" disabled>
                        Select your sign
                      </option>
                      {ZODIAC_SIGNS.map((sign) => (
                        <option key={sign.value} value={sign.value}>
                          {sign.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Favorite Color */}
            <FormField
              control={form.control}
              name="favoriteColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Color</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Palette className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                      <Input {...field} className="pl-9 bg-stone-800/50 border-stone-700" placeholder="e.g. Red, #FF0000" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                      <Input {...field} className="pl-9 bg-stone-800/50 border-stone-700" placeholder="e.g. Paris, France" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-rose-600 hover:bg-rose-500">
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
