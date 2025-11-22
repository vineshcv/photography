"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhotoGrid } from "@/components/photo-grid"
import { PhotoEditor } from "@/components/photo-editor"
import { FaceTileGrid } from "@/components/face-tile-grid"
import { api } from "@/lib/api"
import { Loader2, Upload, Share2, X } from 'lucide-react'
import { ShareDialog } from "@/components/share-dialog"

export default function EventPhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const [photos, setPhotos] = useState<any[]>([])
  const [people, setPeople] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterSize, setFilterSize] = useState('all')
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        const [photosData, peopleData] = await Promise.all([
          api.events.getPhotos(id),
          api.events.getPeople(id)
        ])
        setPhotos(photosData)
        setPeople(peopleData)
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  const handleTogglePerson = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    )
  }

  const handleClearSelection = () => {
    setSelectedPeople([])
  }

  const filteredPhotos = photos.filter(photo => {
    // Filter by selected people (if any selected)
    if (selectedPeople.length > 0) {
      // In a real app, check if photo contains any of the selected people
      // For now, simulate by randomly showing some photos
      const personMatch = Math.random() > 0.3
      if (!personMatch) return false
    }

    if (filterType === 'candid' && Math.random() > 0.5) return false
    if (filterType === 'posed' && Math.random() > 0.5) return false
    
    if (filterSize === 'landscape' && Math.random() > 0.6) return false
    if (filterSize === 'portrait' && Math.random() > 0.6) return false
    
    return true
  })

  const handleSaveEdit = (photoId: string, filters: any) => {
    console.log('[v0] Saving photo edits:', photoId, filters)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No photos yet</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
          Upload photos to this event to start tagging faces and creating galleries.
        </p>
        <Link href={`/events/${React.use(params).id}/upload`}>
          <Button>Upload Photos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {people.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">People</h2>
              <p className="text-xs text-muted-foreground">
                Tap to filter photos • {people.length} people found
              </p>
            </div>
            {selectedPeople.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearSelection}
              >
                <X className="mr-2 h-4 w-4" />
                Clear ({selectedPeople.length})
              </Button>
            )}
          </div>
          
          <FaceTileGrid 
            eventId={React.use(params).id}
            people={people}
            selectionMode={true}
            selectedIds={selectedPeople}
            onToggle={handleTogglePerson}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">
            Photos ({filteredPhotos.length})
            {selectedPeople.length > 0 && (
              <span className="text-sm text-muted-foreground font-normal ml-2">
                - Filtered by {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'}
              </span>
            )}
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <div className="relative">
                <select 
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="candid">Candid</option>
                  <option value="posed">Posed</option>
                  <option value="ceremony">Ceremony</option>
                </select>
              </div>
              <div className="relative">
                <select 
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setIsShareDialogOpen(true)}
              className="hidden sm:flex"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            <Link href={`/events/${React.use(params).id}/upload`}>
              <Button size="sm" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Add More
              </Button>
            </Link>
          </div>
        </div>
        
        <PhotoGrid 
          photos={filteredPhotos} 
          onPhotoClick={(photo) => setSelectedPhoto(photo)}
        />
      </div>

      {selectedPhoto && (
        <PhotoEditor
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onSave={handleSaveEdit}
        />
      )}

      <ShareDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)}
        eventId={React.use(params).id}
        filterSettings={{ type: filterType, size: filterSize }}
      />
    </div>
  )
}
