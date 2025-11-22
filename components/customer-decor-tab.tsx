"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Decor {
  id: string
  name: string
  thumbnail: string
  type: string
  price?: number
  description?: string
}

interface CustomerDecorTabProps {
  eventId: string
  selectedDecor: Decor[]
  onSelectionChange: (decor: Decor[]) => void
}

// Kerala Wedding Decor Items - Traditional and modern Kerala wedding decor
// Images are loaded from: /public/kerala-wedding-photos/decor/
// Using actual images from the decor folder: 01, 02, 03, 04, 05
const mockDecor: Decor[] = [
  {
    id: "decor1",
    name: "Wedding Photo Heart Decor",
    thumbnail: "/kerala-wedding-photos/decor/01",
    type: "Wall Decor",
    price: 2999,
    description: "Add your Kerala wedding photos to this heart-shaped display"
  },
  {
    id: "decor2",
    name: "Family Gallery Wall",
    thumbnail: "/kerala-wedding-photos/decor/02",
    type: "Wall Decor",
    price: 4499,
    description: "Multi-photo gallery frame perfect for Kerala wedding family portraits"
  },
  {
    id: "decor3",
    name: "Traditional Kerala Canvas",
    thumbnail: "/kerala-wedding-photos/decor/03",
    type: "Canvas",
    price: 3499,
    description: "Large canvas print with traditional Kerala wedding design elements"
  },
  {
    id: "decor4",
    name: "Ceremony Frame Set",
    thumbnail: "/kerala-wedding-photos/decor/04",
    type: "Frames",
    price: 3999,
    description: "Traditional floating frame collection for ceremony moments"
  },
  {
    id: "decor5",
    name: "Wedding Memory Board",
    thumbnail: "/kerala-wedding-photos/decor/05",
    type: "Wall Decor",
    price: 2499,
    description: "Decorative memory board for Kerala wedding photos"
  },
  {
    id: "decor6",
    name: "Acrylic Print",
    thumbnail: "/kerala-wedding-photos/decor/01",
    type: "Print",
    price: 2799,
    description: "Modern acrylic photo print with traditional Kerala wedding borders"
  },
  {
    id: "decor7",
    name: "Traditional Wood Panel",
    thumbnail: "/kerala-wedding-photos/decor/02",
    type: "Wall Decor",
    price: 3299,
    description: "Rustic Kerala wood panel design with traditional carvings"
  },
  {
    id: "decor8",
    name: "Metal Print with Gold Frame",
    thumbnail: "/kerala-wedding-photos/decor/03",
    type: "Metal Print",
    price: 3799,
    description: "Durable metal print with traditional gold frame - Perfect for Kerala wedding keepsake"
  }
]

export function CustomerDecorTab({ eventId, selectedDecor, onSelectionChange }: CustomerDecorTabProps) {
  const handleToggleDecor = (decor: Decor) => {
    const isSelected = selectedDecor.some(d => d.id === decor.id)
    if (isSelected) {
      onSelectionChange(selectedDecor.filter(d => d.id !== decor.id))
    } else {
      onSelectionChange([...selectedDecor, decor])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Kerala Wedding Decor</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mockDecor.length} decor items available • {selectedDecor.length} selected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {mockDecor.map((decor) => {
          const isSelected = selectedDecor.some(d => d.id === decor.id)

          return (
            <Card
              key={decor.id}
              className={cn(
                "relative overflow-hidden group cursor-pointer transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2",
                "hover:shadow-lg"
              )}
              onClick={() => handleToggleDecor(decor)}
            >
              <CardContent className="p-0">
                {/* Decor Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={decor.thumbnail}
                    alt={decor.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Selection Checkbox */}
                  <div className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10",
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-white/90 border-white opacity-0 group-hover:opacity-100"
                  )}>
                    {isSelected ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </div>

                  {/* Add Photo Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <div className="text-white text-sm font-medium">
                      Add Your Photos
                    </div>
                  </div>
                </div>

                {/* Decor Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{decor.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{decor.type}</p>
                  {decor.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {decor.description}
                    </p>
                  )}
                  {decor.price && (
                    <p className="text-lg font-bold text-primary mt-2">
                      ₹{decor.price.toLocaleString('en-IN')}
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

