'use client'

import { ImageCropDialog } from '@/components/ImageCropDialog'
import { ProfileEditDialog } from '@/components/landing/ProfileEditDialog'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2, Camera, Cake, MapPin, Palette, Star } from 'lucide-react'
import { DaysTogetherTimer } from './DaysTimer'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { updateUserAvatar } from '@/actions/user'
import { format } from 'date-fns'

interface SimpleUser {
  id: string
  name: string | null
  avatarUrl: string | null
  email: string
  isPlaceholder?: boolean
  birthday?: Date | null
  zodiacSign?: string | null
  favoriteColor?: string | null
  location?: string | null
}

interface DashboardHeaderProps {
  users: SimpleUser[]
  anniversaryDate: Date
  meetDate?: Date | null
  currentUserId?: string
}

export function DashboardHeader({ users, anniversaryDate, meetDate, currentUserId }: DashboardHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [profileEditDialogOpen, setProfileEditDialogOpen] = useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Ensure we have 2 slots to display (User 1, User 2/Placeholder)
  // If users has 2 items, use them. If 1, use it + placeholder.
  const displayUsers = [
    users[0],
    users[1] || { id: 'placeholder', isPlaceholder: true, name: 'Partner', email: '', avatarUrl: null }
  ]

  const currentUserData = users.find(u => u.id === currentUserId)

  const handleAvatarClick = (userId: string) => {
    if (userId === currentUserId && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUserId) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setSelectedImageSrc(reader.result as string)
      setCropDialogOpen(true)
    })
    reader.readAsDataURL(file)
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadAvatar = async (file: File) => {
    if (!currentUserId) return

    setIsUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop() || 'jpg'
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
    }
  }

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" })
    uploadAvatar(file)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <ImageCropDialog 
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCropComplete}
        aspect={1}
      />

      {currentUserData && (
        <ProfileEditDialog 
          open={profileEditDialogOpen}
          onOpenChange={setProfileEditDialogOpen}
          user={currentUserData}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-6 items-center justify-items-center">
        {/* Left Avatar (Mobile: Bottom Left) */}
        <div className="col-start-1 row-start-2 md:col-start-1 md:row-start-1 justify-self-center md:justify-self-center">
          <AvatarItem 
            user={displayUsers[0]} 
            index={0} 
            isEditable={displayUsers[0].id === currentUserId}
            isUploading={displayUsers[0].id === currentUserId && isUploading}
            onClick={() => handleAvatarClick(displayUsers[0].id)}
            onEditProfile={() => setProfileEditDialogOpen(true)}
          />
        </div>

        {/* Right Avatar (Mobile: Bottom Right) */}
        <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 justify-self-center md:justify-self-center">
          <AvatarItem 
            user={displayUsers[1]} 
            index={1} 
            isEditable={displayUsers[1].id === currentUserId}
            isUploading={displayUsers[1].id === currentUserId && isUploading}
            onClick={() => handleAvatarClick(displayUsers[1].id)}
            onEditProfile={() => setProfileEditDialogOpen(true)}
          />
        </div>

        {/* Timer (Mobile: Top Full Width, Desktop: Center) */}
        <div className="col-span-2 row-start-1 md:col-span-1 md:col-start-2 md:row-start-1 w-full flex justify-center md:py-0">
          <div className="scale-[0.9] md:scale-100 transform origin-center">
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
  onClick,
  onEditProfile
}: { 
  user: SimpleUser, 
  index: number, 
  isEditable?: boolean,
  isUploading?: boolean,
  onClick?: () => void
  onEditProfile?: () => void
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
          "relative h-24 w-24 sm:h-36 sm:w-36 md:h-48 md:w-48 rounded-full border-4 border-stone-950 overflow-hidden shadow-2xl ring-2 md:ring-4 transition-transform duration-300",
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
         <div className="flex flex-col items-center">
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "mt-2 md:mt-6 bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 md:px-6 md:py-2.5 rounded-full border border-stone-800 shadow-lg flex items-center gap-2 group/name",
                isEditable ? "cursor-pointer hover:border-stone-700" : ""
              )}
              onClick={() => {
                if (isEditable) onEditProfile?.()
              }}
           >
              <span className="text-xs md:text-xl font-medium text-stone-300 whitespace-nowrap">
                {user.name || user.email?.split('@')[0] || 'User'}
              </span>
           </motion.div>

           {/* User Info Section */}
           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 flex flex-col items-center gap-1.5"
           >
              <div className="flex items-center gap-3 text-[10px] md:text-xs text-stone-400 font-medium tracking-wide">
                 {user.birthday && (
                   <div className="flex items-center gap-1 bg-stone-900/50 px-2 py-0.5 rounded-full border border-stone-800/50" title="Birthday">
                     <Cake className="w-3 h-3 text-rose-400" />
                     <span>{format(new Date(user.birthday), 'MMM d')}</span>
                   </div>
                 )}
                 {user.zodiacSign && (
                   <div className="flex items-center gap-1 bg-stone-900/50 px-2 py-0.5 rounded-full border border-stone-800/50" title="Zodiac">
                     <Star className="w-3 h-3 text-amber-400" />
                     <span>{user.zodiacSign}</span>
                   </div>
                 )}
              </div>
              
              <div className="flex items-center gap-3 text-[10px] md:text-xs text-stone-500">
                {user.location && (
                   <div className="flex items-center gap-1" title="Location">
                     <MapPin className="w-3 h-3" />
                     <span>{user.location}</span>
                   </div>
                 )}
                 {user.favoriteColor && (
                   <div className="flex items-center gap-1" title={`Favorite Color: ${user.favoriteColor}`}>
                     <Palette className="w-3 h-3" />
                     <div 
                       className="w-2 h-2 rounded-full ring-1 ring-white/10" 
                       style={{ backgroundColor: user.favoriteColor }} 
                     />
                   </div>
                 )}
              </div>
           </motion.div>
         </div>
      )}
    </motion.div>
  )
}
