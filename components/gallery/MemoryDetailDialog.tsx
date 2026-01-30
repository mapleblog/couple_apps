'use client'

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { format } from "date-fns"
import { MapPin, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"

interface MemoryDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  memory: {
    id: string
    title: string
    content?: string
    eventDate: Date | string
    imageUrls: string[]
    locationName?: string | null
  } | null
}

export function MemoryDetailDialog({ isOpen, onClose, memory }: MemoryDetailDialogProps) {
  if (!memory) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-stone-950 border-stone-800 text-stone-100 sm:rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] h-[80vh] md:h-[700px]">
          {/* Image Section */}
          <div className="relative h-full w-full bg-stone-900">
            <Image
              src={memory.imageUrls[0] || PLACEHOLDER_IMAGE}
              alt={memory.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="flex flex-col p-8 md:p-10 overflow-y-auto bg-stone-950">
            <DialogTitle className="sr-only">{memory.title}</DialogTitle>
            <DialogDescription className="sr-only">Memory details for {memory.title}</DialogDescription>
            
            {/* Header Info */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-2 text-rose-500 text-sm font-medium tracking-wide uppercase">
                <Calendar className="w-4 h-4" />
                {format(new Date(memory.eventDate), 'MMMM d, yyyy')}
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-50 leading-tight">
                {memory.title}
              </h2>

              {memory.locationName && (
                <div className="flex items-center gap-2 text-stone-400">
                  <MapPin className="w-4 h-4" />
                  <span>{memory.locationName}</span>
                </div>
              )}
            </div>

            {/* Story Content */}
            <div className="flex-1 prose prose-invert prose-stone max-w-none">
              <p className="text-lg leading-relaxed text-stone-300 font-light">
                {memory.content || "No story written yet..."}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="pt-8 mt-auto border-t border-stone-900 flex gap-4">
               <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full h-12 text-base">
                 Relive Moment
               </Button>
               <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-800 hover:bg-stone-900 hover:text-rose-500">
                 <Heart className="w-5 h-5" />
               </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
