import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

interface Photo {
  id: string
  url: string
  filename: string
}

interface PhotoGridProps {
  photos: Photo[]
  selectable?: boolean
  selectedIds?: string[]
  onSelect?: (id: string) => void
  onPhotoClick?: (photo: Photo) => void // Added callback for photo clicks
}

export function PhotoGrid({ photos, selectable, selectedIds = [], onSelect, onPhotoClick }: PhotoGridProps) {
  const handleClick = (photo: Photo) => {
    if (selectable && onSelect) {
      onSelect(photo.id)
    } else if (onPhotoClick) {
      onPhotoClick(photo)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {photos.map((photo) => {
        const isSelected = selectedIds.includes(photo.id)
        
        return (
          <div
            key={photo.id}
            className={cn(
              "group relative rounded-lg overflow-hidden border bg-muted cursor-pointer transition-all",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => handleClick(photo)} // Updated to use new handler
          >
            <AspectRatio ratio={3/2}>
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={photo.filename}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
            
            {/* Overlay for selection or hover actions */}
            <div className={cn(
              "absolute inset-0 bg-black/20 opacity-0 transition-opacity",
              (isSelected || selectable) && "group-hover:opacity-100",
              isSelected && "opacity-100 bg-primary/10"
            )}>
              {selectable && (
                <div className="absolute top-2 right-2">
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 border-white transition-colors",
                    isSelected ? "bg-primary border-primary" : "bg-black/20"
                  )} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
