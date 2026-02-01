
"use client"

import { LogOut, Menu, MessageCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/actions/auth"

export function NavbarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-rose-500/10 hover:text-rose-500">
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-stone-900 border-stone-800 text-stone-200">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-stone-800" />
        
        <Link href="/memory">
          <DropdownMenuItem className="cursor-pointer focus:bg-rose-500/20 focus:text-rose-400">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Memories</span>
          </DropdownMenuItem>
        </Link>
        
        <Link href="/chat">
          <DropdownMenuItem className="cursor-pointer focus:bg-rose-500/20 focus:text-rose-400">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Chat</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="bg-stone-800" />
        
        <form action={signOut} className="w-full">
          <button type="submit" className="w-full">
            <DropdownMenuItem className="cursor-pointer focus:bg-red-500/20 focus:text-red-400 w-full">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
