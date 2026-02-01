import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/LogoutButton"
import { Button } from "@/components/ui/button"

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
          <span>Love Story</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2">
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="text-stone-400 hover:text-rose-500 hover:bg-rose-500/10">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat
              </Button>
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  )
}
