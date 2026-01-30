import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth"

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost" size="sm" className="text-stone-400 hover:text-rose-500 hover:bg-rose-500/10">
        <LogOut className="h-5 w-5 mr-2" />
        Sign out
      </Button>
    </form>
  )
}
