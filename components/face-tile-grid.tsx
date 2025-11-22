import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from 'lucide-react'

interface Person {
  personId: string
  name: string
  thumbnail: string
  count: number
  confidence: number
}

interface FaceTileGridProps {
  eventId: string
  people: Person[]
  selectionMode?: boolean
  selectedIds?: string[]
  onToggle?: (id: string) => void
}

export function FaceTileGrid({ eventId, people, selectionMode = false, selectedIds = [], onToggle }: FaceTileGridProps) {
  // Show first 8 people, rest can be scrolled
  const visiblePeople = people.slice(0, 8)
  const remainingCount = Math.max(0, people.length - 8)
  
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
      {visiblePeople.map((person) => {
        const isSelected = selectedIds.includes(person.personId)
        
        const Content = (
          <div className="group flex flex-col items-center text-center space-y-2 cursor-pointer relative flex-shrink-0">
            <div className={cn(
              "relative h-14 w-14 rounded-full p-[2px] transition-all duration-300",
              isSelected 
                ? "bg-gradient-to-tr from-primary to-rose-400 shadow-lg scale-110 ring-2 ring-primary/20" 
                : "bg-gradient-to-tr from-gray-200 to-gray-100 group-hover:from-primary group-hover:to-rose-400 group-hover:shadow-md group-hover:scale-105"
            )}>
              <div className="h-full w-full rounded-full border-[2px] border-background overflow-hidden relative bg-white">
                <Image
                  src={person.thumbnail || "/placeholder.svg?key=face"}
                  alt={person.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {selectionMode && (
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 text-white drop-shadow-lg" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/80 drop-shadow-lg" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-0.5 w-14">
              <h3 className={cn(
                "font-medium text-[10px] truncate transition-colors text-center leading-tight", 
                isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
              )}>
                {person.name}
              </h3>
              <div className="text-[9px] text-muted-foreground text-center">
                <span>{person.count}</span>
              </div>
            </div>
          </div>
        )

        if (selectionMode) {
          return (
            <div key={person.personId} onClick={() => onToggle?.(person.personId)}>
              {Content}
            </div>
          )
        }

        return (
          <Link key={person.personId} href={`/events/${eventId}/people/${person.personId}`}>
            {Content}
          </Link>
        )
      })}
      
      {/* Show remaining count if there are more people */}
      {remainingCount > 0 && (
        <Link href={`/events/${eventId}/people`}>
          <div className="group flex flex-col items-center text-center space-y-2 cursor-pointer relative flex-shrink-0">
            <div className="relative h-14 w-14 rounded-full p-[2px] bg-gradient-to-tr from-gray-200 to-gray-100 group-hover:from-primary group-hover:to-rose-400 transition-all duration-300 group-hover:scale-105">
              <div className="h-full w-full rounded-full border-[2px] border-background overflow-hidden relative bg-muted flex items-center justify-center">
                <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  +{remainingCount}
                </span>
              </div>
            </div>
            <div className="space-y-0.5 w-14">
              <h3 className="font-medium text-[10px] text-center text-muted-foreground group-hover:text-primary transition-colors leading-tight">
                More
              </h3>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
