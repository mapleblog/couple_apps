'use client'

import { motion } from 'framer-motion'

export function ShaderBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a16] pointer-events-none">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-20 opacity-[0.15] mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.8" 
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
        className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] md:top-[-10%] md:left-[-10%] md:w-[60vw] md:h-[60vw] rounded-full bg-blue-600/40 mix-blend-screen blur-[80px] md:blur-[120px]"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 40, 80, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 45, -45, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-[10%] right-[-20%] w-[110vw] h-[110vw] md:top-[10%] md:right-[-10%] md:w-[60vw] md:h-[60vw] rounded-full bg-pink-600/40 mix-blend-screen blur-[80px] md:blur-[120px]"
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 90, -30, 0],
          scale: [1, 1.1, 0.9, 1],
          rotate: [0, -30, 30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[140vw] h-[140vw] md:bottom-[-20%] md:left-[20%] md:w-[70vw] md:h-[70vw] rounded-full bg-fuchsia-600/30 mix-blend-screen blur-[100px] md:blur-[140px]"
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.3, 0.8, 1],
          rotate: [0, 60, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  )
}
