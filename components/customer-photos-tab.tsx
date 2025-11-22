"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface CustomerPhotosTabProps {
  eventId: string
  selectedPhotos: any[]
  onSelectionChange: (photos: any[]) => void
}

export function CustomerPhotosTab({ eventId, selectedPhotos, onSelectionChange }: CustomerPhotosTabProps) {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await api.events.getPhotos(eventId)
        setPhotos(data || [])
      } catch (error) {
        console.error("Failed to load photos", error)
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }
    if (eventId) {
      loadPhotos()
    } else {
      setLoading(false)
    }
  }, [eventId])

  const handleTogglePhoto = (photo: any) => {
    const isSelected = selectedPhotos.some(p => p.id === photo.id)
    if (isSelected) {
      onSelectionChange(selectedPhotos.filter(p => p.id !== photo.id))
    } else {
      onSelectionChange([...selectedPhotos, photo])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading photos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Kerala Wedding Photos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {photos.length} photos available • {selectedPhotos.length} selected
          </p>
        </div>
      </div>

      {/* Google Photos Style Grid - 10 photos per row */}
      <div className="grid grid-cols-10 gap-1">
        {photos.map((photo) => {
          const isSelected = selectedPhotos.some(p => p.id === photo.id)
          return (
            <div
              key={photo.id}
              className={cn(
                "relative aspect-square cursor-pointer group overflow-hidden rounded-sm",
                "hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => handleTogglePhoto(photo)}
            >
              <Image
                src={photo.url || photo.thumbnail || "/placeholder.svg"}
                alt={photo.filename || "Photo"}
                fill
                className="object-cover"
              />
              
              {/* Selection Checkbox */}
              <div className={cn(
                "absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-white/80 border-white/50 opacity-0 group-hover:opacity-100"
              )}>
                {isSelected && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Overlay on hover */}
              <div className={cn(
                "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"
              )} />
            </div>
          )
        })}
      </div>

      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">No photos available</p>
        </div>
      )}
    </div>
  )
}
