"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ImageIcon, Album, Frame, Sparkles, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { CustomerPhotosTab } from "@/components/customer-photos-tab"
import { CustomerAlbumsTab } from "@/components/customer-albums-tab"
import { CustomerFramesTab } from "@/components/customer-frames-tab"
import { CustomerDecorTab } from "@/components/customer-decor-tab"
import { ConfirmSummaryModal } from "@/components/confirm-summary-modal"

export default function SharedPhotosPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = React.use(params)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'photos' | 'albums' | 'frames' | 'decor'>('photos')
  const [selectedItems, setSelectedItems] = useState<any>({
    photos: [],
    albums: [],
    frames: [],
    decor: []
  })
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  useEffect(() => {
    // Simulate loading
    if (eventId) {
      setTimeout(() => setLoading(false), 500)
    } else {
      setLoading(false)
    }
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const tabs = [
    { id: 'photos', name: 'Photos', icon: ImageIcon },
    { id: 'albums', name: 'Albums', icon: Album },
    { id: 'frames', name: 'Frames', icon: Frame },
    { id: 'decor', name: 'Decor', icon: Sparkles },
  ]

  const getTotalSelected = () => {
    return selectedItems.photos.length + 
           selectedItems.albums.length + 
           selectedItems.frames.length + 
           selectedItems.decor.length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Your Kerala Wedding Photos</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Browse and select your favorite Kerala wedding moments
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[88px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/20"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                  {selectedItems[tab.id as keyof typeof selectedItems]?.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {selectedItems[tab.id as keyof typeof selectedItems].length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'photos' && (
          <CustomerPhotosTab 
            eventId={eventId}
            selectedPhotos={selectedItems.photos}
            onSelectionChange={(photos) => setSelectedItems(prev => ({ ...prev, photos }))}
          />
        )}
        {activeTab === 'albums' && (
          <CustomerAlbumsTab 
            eventId={eventId}
            selectedAlbums={selectedItems.albums}
            onSelectionChange={(albums) => setSelectedItems(prev => ({ ...prev, albums }))}
          />
        )}
        {activeTab === 'frames' && (
          <CustomerFramesTab 
            eventId={eventId}
            selectedFrames={selectedItems.frames}
            onSelectionChange={(frames) => setSelectedItems(prev => ({ ...prev, frames }))}
          />
        )}
        {activeTab === 'decor' && (
          <CustomerDecorTab 
            eventId={eventId}
            selectedDecor={selectedItems.decor}
            onSelectionChange={(decor) => setSelectedItems(prev => ({ ...prev, decor }))}
          />
        )}
      </main>

      {/* Fixed Confirm Button */}
      {getTotalSelected() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {getTotalSelected()} item{getTotalSelected() !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Click to review your selection
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => setIsConfirmOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="mr-2 h-5 w-5" />
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Summary Modal */}
      <ConfirmSummaryModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        selectedItems={selectedItems}
        eventId={eventId}
      />
    </div>
  )
}
