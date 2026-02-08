'use client'

import { motion } from 'framer-motion'

export function ShaderBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950 pointer-events-none">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-20 opacity-30 mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.6" 
              stitchTiles="stitch" 
              numOctaves="3" 
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] md:top-[-10%] md:left-[-10%] md:w-[50vw] md:h-[50vw] rounded-full bg-rose-900/40 blur-[80px] md:blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-[10%] right-[-20%] w-[100vw] h-[100vw] md:top-[20%] md:right-[-10%] md:w-[40vw] md:h-[40vw] rounded-full bg-indigo-900/40 blur-[80px] md:blur-[100px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-[140vw] h-[140vw] md:bottom-[-10%] md:left-[20%] md:w-[60vw] md:h-[60vw] rounded-full bg-violet-900/30 blur-[100px] md:blur-[120px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  )
}
