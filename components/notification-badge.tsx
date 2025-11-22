"use client"

import React from "react"
import { Bell } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  message: string
  timestamp: Date
  type: 'submission' | 'info'
  eventId: string
  customerName?: string
}

interface NotificationBadgeProps {
  eventId: string
  notifications?: Notification[]
}

export function NotificationBadge({ eventId, notifications = [] }: NotificationBadgeProps) {
  const unreadCount = notifications.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-md hover:bg-muted transition-colors",
            unreadCount > 0 && "text-primary"
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <div className="font-semibold mb-2">Notifications</div>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No new notifications
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium mb-1">
                    {notification.customerName || 'Customer'} {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}




