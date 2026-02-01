'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { memorySchema, MemoryFormData } from '@/lib/schemas/memory'
import { addMemory } from '@/actions/memory'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { format } from 'date-fns'
import { CalendarIcon, Plus, X, Loader2, ImagePlus, MapPin, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function CreateMemoryDialog() {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const form = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      content: '',
      eventDate: new Date(),
      locationName: '',
      imageUrls: [],
      isFavorite: false,
      mood: '',
    }
  })

  const { watch, setValue, control, handleSubmit, reset } = form
  const imageUrls = watch('imageUrls')
  const isFavorite = watch('isFavorite')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('memories')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(filePath)

        newUrls.push(publicUrl)
      }

      setValue('imageUrls', [...imageUrls, ...newUrls], { shouldValidate: true })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    setValue('imageUrls', imageUrls.filter((_, index) => index !== indexToRemove))
  }

  const onSubmit = async (data: MemoryFormData) => {
    try {
      const result = await addMemory(data)
      if (result.success) {
        setOpen(false)
        reset()
      } else {
        alert(result.error || 'Failed to create memory')
      }
    } catch (error) {
      console.error('Error creating memory:', error)
      alert('An unexpected error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 z-50 rounded-full h-14 w-14 shadow-2xl bg-rose-600 hover:bg-rose-500 hover:scale-105 transition-all duration-300">
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-stone-900 border-stone-800 text-stone-100 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-rose-200">New Memory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="What's this memory about?" className="bg-stone-800/50 border-stone-700 focus:border-rose-500/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-stone-800/50 border-stone-700 hover:bg-stone-800 hover:text-stone-200",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-stone-900 border-stone-800" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="bg-stone-900 text-stone-200"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                        <Input 
                          {...field} 
                          placeholder="Where was this?" 
                          className="pl-9 bg-stone-800/50 border-stone-700 focus:border-rose-500/50" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <FormField
              control={control}
              name="imageUrls"
              render={() => (
                <FormItem>
                  <FormLabel>Photos</FormLabel>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-stone-700/50">
                        <Image src={url} alt="Memory" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    <div 
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={cn(
                        "aspect-square rounded-xl border-2 border-dashed border-stone-700 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500/50 hover:bg-stone-800/50 transition-colors",
                        isUploading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 text-stone-400 animate-spin" />
                      ) : (
                        <>
                          <ImagePlus className="h-6 w-6 text-stone-400 mb-2" />
                          <span className="text-xs text-stone-500">Add Photos</span>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      rows={4}
                      placeholder="Tell the story..." 
                      className="flex w-full rounded-md border border-stone-700 bg-stone-800/50 px-3 py-2 text-sm ring-offset-background placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            <div className="flex items-center justify-between pt-2">
               <FormField
                  control={control}
                  name="isFavorite"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                         <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={cn(
                               "p-2 rounded-full transition-colors",
                               field.value ? "bg-rose-500/20 text-rose-400" : "bg-stone-800 text-stone-400 hover:text-rose-400"
                            )}
                         >
                            <Heart className={cn("h-5 w-5", field.value && "fill-current")} />
                         </button>
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer" onClick={() => field.onChange(!field.value)}>
                        Mark as Favorite
                      </FormLabel>
                    </FormItem>
                  )}
               />
               
               <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isUploading || form.formState.isSubmitting} className="bg-rose-600 hover:bg-rose-500">
                    {form.formState.isSubmitting ? 'Saving...' : 'Create Memory'}
                  </Button>
               </div>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
