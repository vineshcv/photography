"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from 'next/navigation'
import { AppNavbar } from "@/components/app-navbar"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, ImageIcon, Layout, History, Upload, Settings } from 'lucide-react'
import { EventProgressBar } from "@/components/event-progress-bar"
import { NotificationBadge } from "@/components/notification-badge"

export default function EventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!params.id) return
      try {
        const [eventData, progressData, notificationsData] = await Promise.all([
          api.events.get(params.id as string),
          api.events.getProgress(params.id as string).catch(() => ({ success: false, data: null })),
          api.events.getNotifications(params.id as string).catch(() => [])
        ])
        setEvent(eventData)
        setProgress(progressData?.data || null)
        setNotifications(Array.isArray(notificationsData) ? notificationsData : notificationsData?.data || [])
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      if (params.id) {
        api.events.getProgress(params.id as string)
          .then(res => setProgress(res?.data || null))
          .catch(() => {})
        api.events.getNotifications(params.id as string)
          .then(res => setNotifications(Array.isArray(res) ? res : res?.data || []))
          .catch(() => {})
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { name: "Upload Photos", href: `/events/${event.id}/upload`, icon: Upload },
    { name: "Photos", href: `/events/${event.id}`, icon: ImageIcon, exact: true },
    { name: "Templates", href: `/events/${event.id}/templates`, icon: Layout },
    { name: "History", href: `/events/${event.id}/history`, icon: History },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-medium">{event.title}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{event.clientName}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBadge 
                eventId={event.id} 
                notifications={notifications}
              />
              <Link href={`/events/${event.id}/settings`}>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Progress Bar - Above Tabs */}
          {progress && (
            <div className="mb-6">
              <EventProgressBar
                eventId={event.id}
                currentStep={progress.currentStep || 1}
                customerName={progress.customerName}
              />
            </div>
          )}
          
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px">
            {tabs.map((tab) => {
              const isActive = tab.exact 
                ? pathname === tab.href 
                : pathname.startsWith(tab.href)
              
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/20"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
