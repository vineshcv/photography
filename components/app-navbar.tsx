"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut, Plus } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { Logo } from "@/components/logo"

export function AppNavbar() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo href="/dashboard" />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/events/new">
            <Button size="sm" className="hidden sm:flex">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </Link>
          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium leading-none">
                {isLoading ? "User" : (user?.name || "User")}
              </span>
              <span className="text-xs text-muted-foreground min-h-[1rem]">
                {isLoading ? "" : user?.email}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
