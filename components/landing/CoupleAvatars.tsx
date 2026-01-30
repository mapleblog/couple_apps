'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SimpleUser {
  id: string
  name: string | null
  avatarUrl: string | null
  email: string
}

interface CoupleAvatarsProps {
  users: SimpleUser[]
  className?: string
}

export function CoupleAvatars({ users, className }: CoupleAvatarsProps) {
  return (
    <div className={cn("flex items-center justify-center -space-x-4", className)}>
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: index === 0 ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="relative z-10"
        >
          <div className="relative h-20 w-20 rounded-full border-4 border-stone-950 bg-stone-800 overflow-hidden shadow-xl ring-2 ring-stone-800">
             {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
             ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-800 text-xl font-bold text-stone-400">
                  {(user.name?.[0] || user.email[0]).toUpperCase()}
                </div>
             )}
          </div>
          {/* Status Indicator - Online/Active (Optional) */}
          <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-stone-950 bg-rose-500" />
        </motion.div>
      ))}
      
      {/* If single user, show a placeholder for partner */}
      {users.length === 1 && (
         <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-0 opacity-50 grayscale filter"
         >
           <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-stone-950 bg-stone-900 shadow-xl border-dashed border-stone-700">
              <span className="text-2xl text-stone-600">+</span>
           </div>
         </motion.div>
      )}
    </div>
  )
}
