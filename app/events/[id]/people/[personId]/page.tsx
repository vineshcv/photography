"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { PhotoGrid } from "@/components/photo-grid"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from 'lucide-react'

export default function PersonDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string; personId: string }> 
}) {
  const { id, personId } = React.use(params)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [personName, setPersonName] = useState("Person")

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app we'd fetch person details too, but for now we'll just fetch photos
        // and infer name from the mock data if possible or just use ID
        const data = await api.events.getPersonPhotos(id, personId)
        setPhotos(data)
        
        // Mock name lookup
        if (personId === 'p1') setPersonName("Priya")
        else if (personId === 'p2') setPersonName("Rama")
        else if (personId === 'p3') setPersonName("Aunty")
        else setPersonName("Unknown Person")
        
      } catch (error) {
        console.error("Failed to load person photos", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, personId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/events/${id}/people`}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-serif font-medium">{personName}</h2>
          <p className="text-sm text-muted-foreground">{photos.length} photos found</p>
        </div>
      </div>
      
      <PhotoGrid photos={photos} />
    </div>
  )
}
