import Link from "next/link"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { NavbarMenu } from "./NavbarMenu"

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
          <NavbarMenu />
        )}
      </div>
    </nav>
  )
}
