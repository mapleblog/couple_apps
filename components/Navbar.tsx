import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/LogoutButton"

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight">
          <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
          <span>Love Story</span>
        </div>

        {user && (
          <LogoutButton />
        )}
      </div>
    </nav>
  )
}
