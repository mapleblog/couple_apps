'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { format } from "date-fns"
import { MapPin, Heart, Calendar, X, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
    isFavorite?: boolean
  } | null
  onToggleFavorite?: (id: string, isFavorite: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function MemoryDetailDialog({ isOpen, onClose, memory, onToggleFavorite, onEdit, onDelete }: MemoryDetailDialogProps) {
  const [showRelive, setShowRelive] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  if (!memory) return null

  const handleToggleFavorite = async () => {
    if (onToggleFavorite) {
      onToggleFavorite(memory.id, !memory.isFavorite)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !showRelive && onClose()}>
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
                 <Button 
                   className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full h-12 text-base transition-all transform hover:scale-[1.02]"
                   onClick={() => setShowRelive(true)}
                 >
                   Relive Moment
                 </Button>

                 {onEdit && (
                   <Button 
                     variant="outline" 
                     size="icon" 
                     className="w-12 h-12 rounded-full border-stone-800 bg-stone-900/50 hover:bg-stone-800 text-stone-300 hover:text-white transition-all transform hover:scale-110"
                     onClick={() => onEdit(memory.id)}
                   >
                     <Pencil className="w-5 h-5" />
                   </Button>
                 )}

                 {onDelete && (
                   <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                     <PopoverTrigger asChild>
                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="w-12 h-12 rounded-full border-stone-800 bg-stone-900/50 hover:bg-red-900/30 text-stone-300 hover:text-red-400 hover:border-red-900/50 transition-all transform hover:scale-110"
                       >
                         <Trash2 className="w-5 h-5" />
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent side="top" className="w-auto p-3 bg-stone-900 border-stone-800 shadow-xl mb-2">
                       <div className="flex flex-col gap-3">
                         <p className="text-sm font-medium text-stone-300 text-center">Delete this memory?</p>
                         <div className="flex items-center gap-2">
                           <Button 
                             variant="ghost" 
                             size="sm"
                             className="h-8 text-stone-400 hover:text-white hover:bg-stone-800"
                             onClick={() => setIsDeleteOpen(false)}
                           >
                             Cancel
                           </Button>
                           <Button 
                             variant="destructive" 
                             size="sm"
                             className="h-8 bg-red-600 hover:bg-red-700 text-white"
                             onClick={() => {
                               onDelete(memory.id)
                               setIsDeleteOpen(false)
                             }}
                           >
                             Confirm
                           </Button>
                         </div>
                       </div>
                     </PopoverContent>
                   </Popover>
                 )}

                 <Button 
                   variant="outline" 
                   size="icon" 
                   className={cn(
                    "h-12 w-12 rounded-full border-stone-800 hover:bg-stone-900 transition-colors",
                    memory.isFavorite ? "text-rose-500 hover:text-rose-600" : "text-stone-400 hover:text-rose-500"
                  )}
                  onClick={handleToggleFavorite}
                >
                  <Heart className={cn("w-5 h-5 transition-all", memory.isFavorite && "fill-current scale-110")} />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Relive Overlay */}
      <Dialog open={showRelive} onOpenChange={setShowRelive}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-none bg-black flex items-center justify-center overflow-hidden [&>button]:hidden">
          <DialogTitle className="sr-only">Relive {memory.title}</DialogTitle>
          <DialogDescription className="sr-only">Immersive view of the memory</DialogDescription>
          
          <div 
            className="relative w-full h-full"
            onClick={() => setShowRelive(false)}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="relative w-full h-full"
            >
              <Image 
                src={memory.imageUrls[0] || PLACEHOLDER_IMAGE} 
                alt={memory.title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            
            <div className="absolute bottom-10 left-0 right-0 text-center z-10 p-4">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 drop-shadow-lg"
              >
                {memory.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-stone-300 font-mono text-sm uppercase tracking-widest drop-shadow-md"
              >
                {format(new Date(memory.eventDate), 'MMMM d, yyyy')}
              </motion.p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 z-[110]"
              onClick={(e) => {
                e.stopPropagation()
                setShowRelive(false)
              }}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
