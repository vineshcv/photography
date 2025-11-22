"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Check, ImageIcon, Album, Frame, Sparkles, Download, ShoppingCart } from 'lucide-react'

interface ConfirmSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: {
    photos: any[]
    albums: any[]
    frames: any[]
    decor: any[]
  }
  eventId: string
}

export function ConfirmSummaryModal({ isOpen, onClose, selectedItems, eventId }: ConfirmSummaryModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const totalItems = selectedItems.photos.length + 
                    selectedItems.albums.length + 
                    selectedItems.frames.length + 
                    selectedItems.decor.length

  // Calculate total price in INR
  const totalPrice = [
    ...selectedItems.frames.map((f: any) => f.price || 0),
    ...selectedItems.decor.map((d: any) => d.price || 0)
  ].reduce((sum, price) => sum + price, 0)

  const handleConfirm = () => {
    // In a real app, this would submit the order
    console.log("Confirming selection:", selectedItems)
    // Store selected items in sessionStorage for success page
    sessionStorage.setItem(`selection_${eventId}`, JSON.stringify(selectedItems))
    // Navigate to success page with confetti and fireworks
    router.push(`/share/photos/${eventId}/success`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-4xl mx-4 max-h-[90vh] bg-background rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Review Your Selection</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Please review all selected items before confirming
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Photos Section */}
            {selectedItems.photos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Photos ({selectedItems.photos.length})</h3>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {selectedItems.photos.slice(0, 10).map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded overflow-hidden">
                      <Image
                        src={photo.url || photo.thumbnail || "/placeholder.svg"}
                        alt={photo.filename || "Photo"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {selectedItems.photos.length > 10 && (
                    <div className="relative aspect-square rounded overflow-hidden bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        +{selectedItems.photos.length - 10} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Albums Section */}
            {selectedItems.albums.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Album className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Albums ({selectedItems.albums.length})</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedItems.albums.map((album) => (
                    <div key={album.id} className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={album.thumbnail}
                          alt={album.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{album.name}</p>
                        <p className="text-xs text-muted-foreground">{album.pageCount} pages</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frames Section */}
            {selectedItems.frames.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Frame className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Frames ({selectedItems.frames.length})</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedItems.frames.map((frame) => (
                    <div key={frame.id} className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-square">
                        <Image
                          src={frame.thumbnail}
                          alt={frame.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{frame.name}</p>
                        <p className="text-xs text-muted-foreground">{frame.style}</p>
                        {frame.price && (
                          <p className="text-sm font-bold text-primary mt-1">
                            ₹{frame.price.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decor Section */}
            {selectedItems.decor.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Decor Items ({selectedItems.decor.length})</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedItems.decor.map((decor) => (
                    <div key={decor.id} className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={decor.thumbnail}
                          alt={decor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{decor.name}</p>
                        <p className="text-xs text-muted-foreground">{decor.type}</p>
                        {decor.price && (
                          <p className="text-sm font-bold text-primary mt-1">
                            ₹{decor.price.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-2xl font-bold text-primary">
                {totalPrice > 0 ? `₹${totalPrice.toLocaleString('en-IN')}` : 'Contact for Quote'}
              </p>
              {totalPrice === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  (Photos & Albums pricing on request)
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-primary hover:bg-primary/90">
              <Check className="mr-2 h-4 w-4" />
              Confirm Selection
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            By confirming, you agree to proceed with your selection. We'll contact you soon to finalize details.
          </p>
        </div>
      </div>
    </div>
  )
}

