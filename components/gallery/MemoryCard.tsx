'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

interface MemoryCardProps {
  id: string
  title: string
  eventDate: Date | string
  imageUrls: string[]
  locationName?: string | null
  onClick: () => void
  index: number
}

export function MemoryCard({ id, title, eventDate, imageUrls, locationName, onClick, index }: MemoryCardProps) {
  return (
    <motion.div
      layoutId={`card-${id}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer break-inside-avoid mb-6"
    >
      <Card className="relative overflow-hidden border-stone-800 bg-stone-900 rounded-2xl aspect-[4/5] hover:border-stone-700 transition-colors">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrls[0] || PLACEHOLDER_IMAGE}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-rose-400 text-xs font-mono mb-2 uppercase tracking-wider">
            {format(new Date(eventDate), 'MMMM d, yyyy')}
          </p>
          <h3 className="font-serif text-2xl text-white font-bold leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
          {locationName && (
            <div className="flex items-center gap-1 text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{locationName}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
