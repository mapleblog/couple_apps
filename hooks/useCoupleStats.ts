'use client'

import { useState, useEffect } from 'react'
import { getCoupleData } from '@/actions/couple'
import { calculateTimeTogether, TimeTogether } from '@/lib/utils/anniversary'

export function useCoupleStats() {
  const [stats, setStats] = useState<TimeTogether | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getCoupleData()
        
        if (response.success && response.data?.anniversaryDate) {
          const anniversary = new Date(response.data.anniversaryDate)
          setStats(calculateTimeTogether(anniversary))
        } else {
          // Default or empty state if no anniversary set
          setError(response.error || 'No anniversary date found')
        }
      } catch (err) {
        setError('Failed to calculate stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
