'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCoupleStats } from '@/hooks/useCoupleStats'
import { Heart } from 'lucide-react'
import { calculateTimeTogether, TimeTogether } from '@/lib/utils/anniversary'
import { useEffect, useState } from 'react'

interface DaysTimerProps {
  anniversaryDate?: Date
  meetDate?: Date | null
}

export function DaysTogetherTimer({ anniversaryDate, meetDate }: DaysTimerProps) {
  const { stats: hookStats, loading: hookLoading } = useCoupleStats()
  const [localStats, setLocalStats] = useState<TimeTogether | null>(null)
  const [meetStats, setMeetStats] = useState<TimeTogether | null>(null)
  const [mode, setMode] = useState<'together' | 'known'>('together')

  useEffect(() => {
    if (anniversaryDate) {
      setLocalStats(calculateTimeTogether(new Date(anniversaryDate)))
    }
    if (meetDate) {
      setMeetStats(calculateTimeTogether(new Date(meetDate)))
    }
  }, [anniversaryDate, meetDate])

  useEffect(() => {
    if (meetDate && anniversaryDate) {
      const interval = setInterval(() => {
        setMode(prev => prev === 'together' ? 'known' : 'together')
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [meetDate, anniversaryDate])

  const stats = mode === 'together' ? (anniversaryDate ? localStats : hookStats) : meetStats
  const loading = anniversaryDate ? !localStats : hookLoading
  const title = mode === 'together' ? 'Together for' : 'Known for'

  if (loading) return (
    <div className="h-32 w-full animate-pulse bg-stone-900/50 rounded-xl" />
  )

  if (!stats) return null

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 w-full">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <h2 className="font-serif text-xl sm:text-2xl italic text-stone-400">{title}</h2>
            
            <div className="flex items-baseline gap-3 sm:gap-6">
              <div className="flex flex-col items-center">
                <span className="font-serif text-6xl sm:text-9xl font-bold text-white tracking-tight">
                  {stats.totalDays}
                </span>
                <span className="text-base sm:text-xl text-rose-500 uppercase tracking-widest mt-2">Days</span>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-8 mt-6 text-stone-500 font-mono text-sm sm:text-base">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-xl sm:text-2xl">{stats.years}</span>
                <span>Years</span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-stone-800" />
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-xl sm:text-2xl">{stats.months}</span>
                <span>Months</span>
              </div>
              <div className="w-px h-8 sm:h-10 bg-stone-800" />
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-xl sm:text-2xl">{stats.days}</span>
                <span>Days</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
