'use client'

import { useState } from 'react'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { updateAnniversary } from '@/actions/couple'

interface SetAnniversaryDialogProps {
  trigger?: React.ReactNode
}

export function SetAnniversaryDialog({ trigger }: SetAnniversaryDialogProps) {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSave() {
    if (!date) return
    
    setLoading(true)
    setError(null)
    
    const res = await updateAnniversary(date)
    
    if (res.success) {
      setOpen(false)
      // Reload to reflect changes since we don't have a global context yet
      window.location.reload() 
    } else {
      setError(res.error || 'Failed to update anniversary')
    }
    
    setLoading(false)
  }

  // Explicit type annotation to fix implicit 'any' error
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Set Anniversary</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-stone-900 border-stone-800 text-white">
        <DialogHeader>
          <DialogTitle>When did it all begin?</DialogTitle>
          <DialogDescription className="text-stone-400">
            Select the date your love story started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-stone-700 bg-stone-950 hover:bg-stone-900 hover:text-white",
                  !date && "text-stone-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-stone-900 border-stone-800" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
                className="bg-stone-950 text-white"
              />
            </PopoverContent>
          </Popover>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}

          <Button 
            onClick={onSave} 
            disabled={!date || loading}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Date
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
