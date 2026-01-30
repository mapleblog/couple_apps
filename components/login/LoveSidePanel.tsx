'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export function LoveSidePanel() {
  return (
    <div className="relative hidden h-full w-full flex-col items-center justify-center overflow-hidden bg-stone-900 lg:flex">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-900 to-rose-950/20" />
      
      {/* Animated Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              y: '120%', 
              x: Math.random() * 100 - 50 + '%',
              scale: 0.5 + Math.random() * 0.5
            }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: '-20%',
              rotate: [0, Math.random() * 45 - 22.5]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute bottom-0 left-1/2"
            style={{ left: `${(i * 8) + 10}%` }}
          >
            <Heart 
              className="text-rose-500/20 fill-rose-500/20" 
              size={24 + Math.random() * 48} 
            />
          </motion.div>
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 rounded-full bg-stone-800/50 p-6 ring-1 ring-white/10 backdrop-blur-md"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-16 w-16 text-rose-500 fill-rose-500" />
          </motion.div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4 font-serif text-5xl font-bold text-white tracking-tight"
        >
          Love Story
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-md text-lg text-stone-400 italic"
        >
          "Every love story is beautiful, but ours is my favorite."
        </motion.p>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  )
}
