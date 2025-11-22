"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { FaceTileGrid } from "@/components/face-tile-grid"
import { PhotoGrid } from "@/components/photo-grid"
import { Loader2, Users, CheckSquare, X, Download, ArrowLeft, Grid, ListFilter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function PeoplePage({ params }: { params: Promise<{ id: string }> }) {
  const [people, setPeople] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewingPhotos, setViewingPhotos] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const { id } = await params
        const data = await api.events.getPeople(id)
        setPeople(data)
      } catch (error) {
        console.error("Failed to load people", error)
      } finally {
        setLoading(false)
      }
    }
    loadPeople()
  }, [params.id])

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleViewSelected = async () => {
    setLoading(true)
    try {
      // In a real app, we would fetch photos for these specific people
      // For now, we'll just fetch all photos and filter/randomize to simulate
      const { id } = await params
      const allPhotos = await api.events.getPhotos(id)
      // Mock filtering: just take some random photos to simulate "photos of these people"
      const mockFiltered = allPhotos.slice(0, Math.min(allPhotos.length, selectedIds.length * 5))
      setSelectedPhotos(mockFiltered)
      setViewingPhotos(true)
    } catch (error) {
      console.error("Failed to load selected photos", error)
      toast.error("Failed to load photos")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (viewingPhotos) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setViewingPhotos(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to People
            </Button>
            <h2 className="text-lg font-medium">
              Photos of {selectedIds.length} Selected People ({selectedPhotos.length})
            </h2>
          </div>
          <Button onClick={() => alert("Downloading...")}>
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
        <PhotoGrid photos={selectedPhotos} />
      </div>
    )
  }

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No people found yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We're still processing your photos to detect faces. Check back in a few minutes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-rose-100 flex items-center justify-center">
             <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">People</h2>
            <p className="text-muted-foreground">
              {people.length} identified faces from this event
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isSelectionMode ? (
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg animate-in fade-in slide-in-from-right-4">
              <span className="text-sm font-medium px-3">
                {selectedIds.length} selected
              </span>
              <Button variant="ghost" size="sm" onClick={() => {
                setIsSelectionMode(false)
                setSelectedIds([])
              }} className="hover:bg-background shadow-sm">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" disabled={selectedIds.length === 0} onClick={handleViewSelected} className="shadow-sm">
                <Users className="mr-2 h-4 w-4" />
                View Photos
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="hidden sm:flex">
                 <ListFilter className="mr-2 h-4 w-4" />
                 Filter
               </Button>
               <Button variant="outline" size="sm" onClick={() => setIsSelectionMode(true)} className="hover:border-primary hover:text-primary transition-colors">
                <CheckSquare className="mr-2 h-4 w-4" />
                Select
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="min-h-[500px]">
        <FaceTileGrid 
          eventId={React.use(params).id} 
          people={people} 
          selectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggle={toggleSelection}
        />
      </div>
    </div>
  )
}
