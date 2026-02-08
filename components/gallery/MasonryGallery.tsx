'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { MemoryCard } from './MemoryCard'
import { MemoryDetailDialog } from './MemoryDetailDialog'
import { EditMemoryDialog } from './EditMemoryDialog'
import { toggleMemoryFavorite, deleteMemory } from '@/actions/memory'

// Temporary mock data for UI development
const MOCK_MEMORIES = [
  {
    id: '1',
    title: 'Our First Coffee Date',
    eventDate: new Date('2023-10-15'),
    imageUrls: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop'],
    locationName: 'Starbucks Reserve',
    content: "We sat by the window for hours, talking about everything from our favorite books to our wildest dreams. The coffee went cold, but neither of us noticed.",
    isFavorite: false
  },
  {
    id: '2',
    title: 'Weekend in Paris',
    eventDate: new Date('2023-12-24'),
    imageUrls: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'],
    locationName: 'Eiffel Tower',
    content: "The city of lights truly lived up to its name. Watching the Eiffel Tower sparkle at midnight was magical.",
    isFavorite: false
  },
  {
    id: '3',
    title: 'The Proposal',
    eventDate: new Date('2024-02-14'),
    imageUrls: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop'],
    locationName: 'Central Park',
    content: "I was so nervous, but the moment I saw your smile, I knew the answer would be yes. Best day of my life.",
    isFavorite: false
  },
  {
    id: '4',
    title: 'Sunset at the Beach',
    eventDate: new Date('2024-06-20'),
    imageUrls: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop'],
    locationName: 'Malibu',
    content: "The sound of the waves, the golden hour light, and you. Perfect.",
    isFavorite: false
  }
]

interface MasonryGalleryProps {
  memories: any[]
}

type OptimisticAction = 
  | { type: 'TOGGLE_FAVORITE'; id: string; isFavorite: boolean }
  | { type: 'DELETE'; id: string }

export function MasonryGallery({ memories = [] }: MasonryGalleryProps) {
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const displayMemories = memories.length > 0 ? memories : MOCK_MEMORIES

  const [optimisticMemories, setOptimisticMemory] = useOptimistic(
    displayMemories,
    (state, action: OptimisticAction) => {
      switch (action.type) {
        case 'TOGGLE_FAVORITE':
          return state.map(m => m.id === action.id ? { ...m, isFavorite: action.isFavorite } : m)
        case 'DELETE':
          return state.filter(m => m.id !== action.id)
        default:
          return state
      }
    }
  )

  const selectedMemory = selectedMemoryId 
    ? optimisticMemories.find(m => m.id === selectedMemoryId) || null
    : null

  const editingMemory = editingMemoryId
    ? optimisticMemories.find(m => m.id === editingMemoryId) || null
    : null

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    startTransition(async () => {
      setOptimisticMemory({ type: 'TOGGLE_FAVORITE', id, isFavorite })
      try {
        await toggleMemoryFavorite(id, isFavorite)
      } catch (error) {
        console.error('Failed to toggle favorite', error)
      }
    })
  }

  const handleDelete = async (id: string) => {
    // Close detail view immediately
    if (selectedMemoryId === id) setSelectedMemoryId(null)
    
    startTransition(async () => {
      setOptimisticMemory({ type: 'DELETE', id })
      try {
        await deleteMemory(id)
      } catch (error) {
        console.error('Failed to delete memory', error)
      }
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-20 max-w-7xl mx-auto">
        {optimisticMemories.map((memory, index) => (
          <MemoryCard
            key={memory.id}
            index={index}
            {...memory}
            onClick={() => setSelectedMemoryId(memory.id)}
            onEdit={() => setEditingMemoryId(memory.id)}
            onToggleFavorite={() => handleToggleFavorite(memory.id, !memory.isFavorite)}
          />
        ))}
      </div>

      <MemoryDetailDialog 
        isOpen={!!selectedMemory} 
        onClose={() => setSelectedMemoryId(null)}
        memory={selectedMemory}
        onToggleFavorite={handleToggleFavorite}
        onEdit={(id) => {
          setSelectedMemoryId(null) // Close detail view
          setEditingMemoryId(id)    // Open edit view
        }}
        onDelete={handleDelete}
      />

      <EditMemoryDialog 
        open={!!editingMemory} 
        onOpenChange={(open) => !open && setEditingMemoryId(null)} 
        memory={editingMemory} 
      />
    </>
  )
}
