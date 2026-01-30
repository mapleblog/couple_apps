import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-stone-950 text-center text-white">
      {/* Background Gradient/Effects */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500 blur-[120px] rounded-full animate-soft-fade" />
      </div>

      <div className="relative z-10 container px-4 animate-soft-fade">
        <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight sm:text-7xl">
          Capture Your <span className="text-rose-500">Love Story</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-stone-300 sm:text-xl">
          A modern, high-end gallery to preserve your most cherished memories. 
          Timeless, elegant, and forever yours.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white min-w-[160px] rounded-full text-lg h-12">
              Start Your Story
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="border-stone-700 text-stone-300 hover:bg-stone-900 hover:text-white min-w-[160px] rounded-full text-lg h-12">
              View Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
