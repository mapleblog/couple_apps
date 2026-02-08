'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface ClickHeart {
  id: number
  x: number
  y: number
  rotation: number
}

export function ClickHeartEffect() {
  const [hearts, setHearts] = useState<ClickHeart[]>([])

  const handleClick = useCallback((e: MouseEvent) => {
    const newHeart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      rotation: Math.random() * 60 - 30, // Random rotation between -30 and 30 deg
    }

    setHearts(prev => [...prev, newHeart])
  }, [])

  useEffect(() => {
    // Use capture=true to ensure we catch clicks even if propagation is stopped
    window.addEventListener('click', handleClick, true)
    return () => window.removeEventListener('click', handleClick, true)
  }, [handleClick])

  const removeHeart = (id: number) => {
    setHearts(prev => prev.filter(heart => heart.id !== id))
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 1, 
              scale: 0, 
              x: heart.x - 12, // Center the heart (assuming 24px width)
              y: heart.y - 12 
            }}
            animate={{ 
              opacity: 0, 
              scale: 1.5, 
              y: heart.y - 100,
              x: heart.x + (Math.random() * 40 - 20) // Slight random x movement
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1, 
              ease: "easeOut" 
            }}
            onAnimationComplete={() => removeHeart(heart.id)}
            className="absolute"
          >
            <Heart 
              className="w-6 h-6 fill-current text-red-500" 
              style={{ transform: `rotate(${heart.rotation}deg)` }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
