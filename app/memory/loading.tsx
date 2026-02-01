
import { Heart } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-stone-950">
      <div className="relative">
        <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full animate-pulse" />
        <Heart className="w-10 h-10 text-rose-500 animate-pulse fill-rose-500/20" />
      </div>
      <p className="mt-4 text-sm text-stone-500 font-serif tracking-widest uppercase animate-pulse">
        Loading Memories...
      </p>
    </div>
  )
}
