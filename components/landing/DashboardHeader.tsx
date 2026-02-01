'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2, Camera } from 'lucide-react'
import { DaysTogetherTimer } from './DaysTimer'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { updateUserAvatar } from '@/actions/user'

interface SimpleUser {
  id: string
  name: string | null
  avatarUrl: string | null
  email: string
  isPlaceholder?: boolean
}

interface DashboardHeaderProps {
  users: SimpleUser[]
  anniversaryDate: Date
  meetDate?: Date | null
  currentUserId?: string
}

export function DashboardHeader({ users, anniversaryDate, meetDate, currentUserId }: DashboardHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Ensure we have 2 slots to display (User 1, User 2/Placeholder)
  // If users has 2 items, use them. If 1, use it + placeholder.
  const displayUsers = [
    users[0],
    users[1] || { id: 'placeholder', isPlaceholder: true, name: 'Partner', email: '', avatarUrl: null }
  ]

  const handleAvatarClick = (userId: string) => {
    if (userId === currentUserId && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUserId) return

    setIsUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentUserId}-${Date.now()}.${fileExt}`
      const filePath = `${currentUserId}/${fileName}`

      // Upload to 'avatars' bucket
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error('Supabase upload error details:', uploadError)
        // Show a more descriptive error to the user
        if (uploadError.message.includes('row-level security')) {
           alert('Upload failed: Permission denied. Please check Supabase Storage RLS Policies.')
        } else if (uploadError.statusCode === '404' || uploadError.message.includes('Bucket not found')) {
           alert('Upload failed: "avatars" bucket not found. Please create it in Supabase Dashboard.')
        } else {
           alert(`Upload failed: ${uploadError.message} (Code: ${uploadError.statusCode || 'Unknown'})`)
        }
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const result = await updateUserAvatar(publicUrl)
      if (!result.success) {
        throw new Error(result.error)
      }
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image. Please ensure the image is valid and try again.')
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-2 pb-6 md:py-12">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-8 items-center justify-items-center">
        {/* Left Avatar (Mobile: Top Left) */}
        <div className="col-start-1 row-start-1 md:col-start-1 md:row-start-1 justify-self-center md:justify-self-center">
          <AvatarItem 
            user={displayUsers[0]} 
            index={0} 
            isEditable={displayUsers[0].id === currentUserId}
            isUploading={displayUsers[0].id === currentUserId && isUploading}
            onClick={() => handleAvatarClick(displayUsers[0].id)}
          />
        </div>

        {/* Right Avatar (Mobile: Top Right) */}
        <div className="col-start-2 row-start-1 md:col-start-3 md:row-start-1 justify-self-center md:justify-self-center">
          <AvatarItem 
            user={displayUsers[1]} 
            index={1} 
            isEditable={displayUsers[1].id === currentUserId}
            isUploading={displayUsers[1].id === currentUserId && isUploading}
            onClick={() => handleAvatarClick(displayUsers[1].id)}
          />
        </div>

        {/* Timer (Mobile: Bottom Full Width, Desktop: Center) */}
        <div className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1 w-full flex justify-center pt-16 pb-4 md:py-0">
          <div className="scale-100 md:scale-100 transform origin-top md:origin-center">
            <DaysTogetherTimer anniversaryDate={anniversaryDate} meetDate={meetDate ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AvatarItem({ 
  user, 
  index, 
  isEditable = false,
  isUploading = false,
  onClick 
}: { 
  user: SimpleUser, 
  index: number, 
  isEditable?: boolean,
  isUploading?: boolean,
  onClick?: () => void
}) {
  const isPlaceholder = user.isPlaceholder
  const [imgError, setImgError] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="relative z-10 flex flex-col items-center group"
    >
      <div 
        onClick={onClick}
        className={cn(
          "relative h-28 w-28 sm:h-40 sm:w-40 md:h-56 md:w-56 rounded-full border-4 border-stone-950 overflow-hidden shadow-2xl ring-2 md:ring-4 transition-transform duration-300",
          isPlaceholder 
            ? "bg-stone-900 border-dashed border-stone-700 ring-stone-800" 
            : "bg-stone-800 ring-stone-700",
          isEditable && !isUploading ? "cursor-pointer hover:scale-105 hover:ring-rose-500/50" : ""
        )}
      >
        {isUploading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        ) : isEditable && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
             <Camera className="h-8 w-8 text-white/0 group-hover:text-white/80 transition-opacity duration-300 transform scale-75 group-hover:scale-100" />
          </div>
        )}

        {!isPlaceholder ? (
          user.avatarUrl && !imgError ? (
            <Image 
              src={user.avatarUrl} 
              alt={user.name || 'User'} 
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 160px, 224px"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-800 text-4xl md:text-6xl font-bold text-stone-500">
              {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
            </div>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-600">
             <span className="text-5xl md:text-7xl font-light">+</span>
          </div>
        )}
      </div>
      
      {!isPlaceholder && (
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-2 md:mt-6 bg-stone-900/80 backdrop-blur-sm px-3 py-1 md:px-6 md:py-2.5 rounded-full border border-stone-800 shadow-lg"
         >
            <span className="text-xs md:text-xl font-medium text-stone-300 whitespace-nowrap">
              {user.name || user.email?.split('@')[0] || 'User'}
            </span>
         </motion.div>
      )}
    </motion.div>
  )
}
