"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Eye } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Album {
  id: string
  name: string
  thumbnail: string
  previewImages: string[]
  pageCount: number
  description?: string
}

interface CustomerAlbumsTabProps {
  eventId: string
  selectedAlbums: Album[]
  onSelectionChange: (albums: Album[]) => void
}

// Kerala Wedding Albums - Traditional Kerala wedding albums
// Images are loaded from: /public/kerala-wedding-photos/albums/
// Using actual images from the albums folder: 01, 02, 03, 04
const mockAlbums: Album[] = [
  {
    id: "album1",
    name: "Wedding Highlights",
    thumbnail: "/kerala-wedding-photos/albums/01",
    previewImages: [
      "/kerala-wedding-photos/albums/01",
      "/kerala-wedding-photos/albums/02",
      "/kerala-wedding-photos/albums/03",
      "/kerala-wedding-photos/albums/04",
    ],
    pageCount: 24,
    description: "Best moments from your special Kerala wedding day"
  },
  {
    id: "album2",
    name: "Ceremony Collection",
    thumbnail: "/kerala-wedding-photos/albums/02",
    previewImages: [
      "/kerala-wedding-photos/albums/02",
      "/kerala-wedding-photos/albums/01",
      "/kerala-wedding-photos/albums/03",
      "/kerala-wedding-photos/albums/04",
    ],
    pageCount: 18,
    description: "Beautiful traditional Kerala ceremony moments"
  },
  {
    id: "album3",
    name: "Reception Fun",
    thumbnail: "/kerala-wedding-photos/albums/03",
    previewImages: [
      "/kerala-wedding-photos/albums/03",
      "/kerala-wedding-photos/albums/04",
      "/kerala-wedding-photos/albums/01",
      "/kerala-wedding-photos/albums/02",
    ],
    pageCount: 20,
    description: "Traditional Sadya and joyful reception celebrations"
  },
  {
    id: "album4",
    name: "Family Portraits",
    thumbnail: "/kerala-wedding-photos/albums/04",
    previewImages: [
      "/kerala-wedding-photos/albums/04",
      "/kerala-wedding-photos/albums/01",
      "/kerala-wedding-photos/albums/02",
      "/kerala-wedding-photos/albums/03",
    ],
    pageCount: 12,
    description: "Cherished family group photos from the wedding"
  }
]

// Scrolling Album Preview Component
function AlbumPreviewCarousel({ 
  images, 
  isHovered 
}: { 
  images: string[]
  isHovered: boolean 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isHovered) {
      setCurrentIndex(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Auto-scroll through images every 800ms
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 800)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, images.length])

  return (
    <div className="absolute inset-0 bg-black/95 z-20 overflow-hidden">
      {/* Scrolling Image Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative min-w-full h-full flex-shrink-0"
          >
            <Image
              src={img}
              alt={`Album page ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
          </div>
        ))}
      </div>

      {/* Page Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === currentIndex
                ? "bg-white w-8"
                : "bg-white/40 w-1.5"
            )}
          />
        ))}
      </div>

      {/* Album Page Counter */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 z-30">
        <span className="text-white text-xs font-medium">
          Page {currentIndex + 1} of {images.length}
        </span>
      </div>
    </div>
  )
}

export function CustomerAlbumsTab({ eventId, selectedAlbums, onSelectionChange }: CustomerAlbumsTabProps) {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null)

  const handleToggleAlbum = (album: Album) => {
    const isSelected = selectedAlbums.some(a => a.id === album.id)
    if (isSelected) {
      onSelectionChange(selectedAlbums.filter(a => a.id !== album.id))
    } else {
      onSelectionChange([...selectedAlbums, album])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Kerala Wedding Albums</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mockAlbums.length} albums available • {selectedAlbums.length} selected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {mockAlbums.map((album) => {
          const isSelected = selectedAlbums.some(a => a.id === album.id)
          const isHovered = hoveredAlbum === album.id

          return (
            <Card
              key={album.id}
              className={cn(
                "relative overflow-hidden group cursor-pointer transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2",
                "hover:shadow-lg"
              )}
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
              onClick={() => handleToggleAlbum(album)}
            >
              <CardContent className="p-0">
                {/* Thumbnail with Scrolling Preview */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* Default Thumbnail */}
                  <Image
                    src={album.thumbnail}
                    alt={album.name}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-500",
                      isHovered ? "opacity-0" : "opacity-100"
                    )}
                  />
                  
                  {/* Scrolling Album Preview on Hover */}
                  {isHovered && (
                    <AlbumPreviewCarousel 
                      images={album.previewImages} 
                      isHovered={isHovered}
                    />
                  )}
                  
                  {/* Selection Checkbox */}
                  <div className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-30",
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-white/90 border-white backdrop-blur-sm",
                    !isHovered && !isSelected && "opacity-0 group-hover:opacity-100"
                  )}>
                    {isSelected && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </div>

                  {/* Hover Indicator */}
                  {isHovered && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 z-30">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3.5 w-3.5 text-white" />
                        <span className="text-white text-xs font-medium">
                          {album.pageCount} pages • Hover to preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Album Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{album.name}</h3>
                  {album.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{album.pageCount} pages</span>
                    </div>
                    {!isHovered && (
                      <span className="text-xs text-muted-foreground italic">
                        Hover to preview
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

