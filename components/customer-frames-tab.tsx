"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Frame {
  id: string
  name: string
  thumbnail: string
  style: string
  price?: number
  description?: string
}

interface CustomerFramesTabProps {
  eventId: string
  selectedFrames: Frame[]
  onSelectionChange: (frames: Frame[]) => void
}

// Kerala Wedding Frames - Personalized photo frames for Kerala weddings
// Images are loaded from: /public/kerala-wedding-photos/frames/
// Using actual images from the frames folder: 01, 02, 03, 04, 07, 08, 09, 010
const mockFrames: Frame[] = [
  {
    id: "frame1",
    name: "Wedding Photo Collage",
    thumbnail: "/kerala-wedding-photos/frames/01",
    style: "Photo Collage",
    price: 2999,
    description: "3x3 grid with personalized names and dates - Perfect for displaying your favorite Kerala wedding moments together"
  },
  {
    id: "frame2",
    name: "Anniversary Frame",
    thumbnail: "/kerala-wedding-photos/frames/02",
    style: "Digital Frame",
    price: 4499,
    description: "Traditional design with calendar and circular photo collage - Celebrate your special dates"
  },
  {
    id: "frame3",
    name: "Romantic Quote Frame",
    thumbnail: "/kerala-wedding-photos/frames/03",
    style: "Quote Overlay",
    price: 2499,
    description: "Beautiful couple photo with personalized romantic quote overlay"
  },
  {
    id: "frame4",
    name: "Traditional Kerala Wedding Portrait",
    thumbnail: "/kerala-wedding-photos/frames/04",
    style: "Classic Portrait",
    price: 3499,
    description: "Elegant Kerala wedding portrait in traditional Kasavu saree and Mundu - Timeless keepsake"
  },
  {
    id: "frame5",
    name: "Black Frame with Gold Mat",
    thumbnail: "/kerala-wedding-photos/frames/07",
    style: "Gallery Frame",
    price: 1999,
    description: "Professional black frame with traditional gold mat - Perfect for Kerala wedding photos"
  },
  {
    id: "frame6",
    name: "Intimate Couple Portrait",
    thumbnail: "/kerala-wedding-photos/frames/08",
    style: "Intimate Portrait",
    price: 2799,
    description: "Close-up portrait capturing your special bond and emotions - Perfect for Kerala wedding memories"
  },
  {
    id: "frame7",
    name: "Ceremony Moment Frame",
    thumbnail: "/kerala-wedding-photos/frames/09",
    style: "Romantic Setting",
    price: 3199,
    description: "Warm evening ambiance with soft lighting - Perfect for capturing the ceremony moment"
  },
  {
    id: "frame8",
    name: "Reception Celebration Frame",
    thumbnail: "/kerala-wedding-photos/frames/010",
    style: "Festive",
    price: 2299,
    description: "Capture your reception celebration joy in a beautiful traditional frame"
  }
]

export function CustomerFramesTab({ eventId, selectedFrames, onSelectionChange }: CustomerFramesTabProps) {
  const handleToggleFrame = (frame: Frame) => {
    const isSelected = selectedFrames.some(f => f.id === frame.id)
    if (isSelected) {
      onSelectionChange(selectedFrames.filter(f => f.id !== frame.id))
    } else {
      onSelectionChange([...selectedFrames, frame])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Kerala Wedding Photo Frames</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mockFrames.length} frames available • {selectedFrames.length} selected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {mockFrames.map((frame) => {
          const isSelected = selectedFrames.some(f => f.id === frame.id)

          return (
            <Card
              key={frame.id}
              className={cn(
                "relative overflow-hidden group cursor-pointer transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2",
                "hover:shadow-lg"
              )}
              onClick={() => handleToggleFrame(frame)}
            >
              <CardContent className="p-0">
                {/* Frame Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={frame.thumbnail}
                    alt={frame.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Frame Border Effect */}
                  <div className="absolute inset-0 border-8 border-white/20 shadow-inner" />
                  
                  {/* Selection Checkbox */}
                  <div className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-20 backdrop-blur-sm",
                    isSelected
                      ? "bg-primary border-primary shadow-lg"
                      : "bg-white/90 border-white opacity-0 group-hover:opacity-100"
                  )}>
                    {isSelected && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </div>

                  {/* Personalized Frame Indicator */}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">
                      Personalized
                    </span>
                  </div>
                </div>

                {/* Frame Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{frame.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{frame.style}</p>
                  {frame.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {frame.description}
                    </p>
                  )}
                  {frame.price && (
                    <p className="text-lg font-bold text-primary mt-2">
                      ₹{frame.price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

