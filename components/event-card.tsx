import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Users, HardDrive, ImageIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    clientName: string
    coverUrl: string
    location?: string
    imageCount?: number
    totalSize?: string
  }
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full border-border/50">
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            src={event.coverUrl || "/placeholder.svg?key=event-cover"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="font-serif text-xl font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-3 w-3" />
            {event.clientName}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-2 pb-4">
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-4 mt-1 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5" title="Total Images">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>{event.imageCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Total Size">
                <HardDrive className="h-3.5 w-3.5" />
                <span>{event.totalSize || "0 MB"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
