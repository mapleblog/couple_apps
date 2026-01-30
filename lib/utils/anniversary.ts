import { differenceInDays, differenceInHours, differenceInMinutes, intervalToDuration, startOfDay } from 'date-fns'

export interface TimeTogether {
  totalDays: number
  years: number
  months: number
  days: number
  hours: number
  minutes: number
}

export function calculateTimeTogether(startDate: Date): TimeTogether {
  const now = new Date()
  
  // Normalize both dates to start of day to ignore time components
  // This ensures we calculate based on calendar days, not 24h periods
  const day1 = startOfDay(startDate)
  const day2 = startOfDay(now)

  // Basic difference in days
  // Add 1 to include the start date as the first day
  const totalDays = differenceInDays(day2, day1) + 1
  
  // Detailed duration
  const duration = intervalToDuration({
    start: startDate,
    end: now
  })

  // For hours and minutes (remainder)
  const totalHours = differenceInHours(now, startDate)
  const totalMinutes = differenceInMinutes(now, startDate)

  return {
    totalDays,
    years: duration.years || 0,
    months: duration.months || 0,
    days: duration.days || 0,
    hours: totalHours % 24,
    minutes: totalMinutes % 60
  }
}
