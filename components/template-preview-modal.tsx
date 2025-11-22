"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Edit, Layout, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  description?: string
  category?: string
  thumbnail: string
  pages?: any[]
}

interface TemplatePreviewModalProps {
  template: Template | null
  isOpen: boolean
  onClose: () => void
  onUseTemplate: (templateId: string) => void
}

export function TemplatePreviewModal({ template, isOpen, onClose, onUseTemplate }: TemplatePreviewModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)

  // Extract pages and current page early
  const pages = template?.pages || []
  const currentPage = pages[currentPageIndex]

  const nextPage = React.useCallback(() => {
    setCurrentPageIndex((prev) => (prev + 1) % pages.length)
  }, [pages.length])

  const prevPage = React.useCallback(() => {
    setCurrentPageIndex((prev) => (prev - 1 + pages.length) % pages.length)
  }, [pages.length])

  // Reset page index when modal opens or template changes
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(0)
    }
  }, [isOpen, template?.id])

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && pages.length > 1) {
        prevPage()
      } else if (e.key === 'ArrowRight' && pages.length > 1) {
        nextPage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, pages.length, onClose, prevPage, nextPage])

  if (!template) return null

  const renderPagePreview = (page: any) => {
    if (!page) return null

    // Render different page types
    if (page.type === 'frontPage' || page.type === 'welcome') {
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
          {page.content?.backgroundImage && (
            <Image
              src={page.content.backgroundImage}
              alt="Background"
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-2">{page.content?.title || "Title"}</h1>
              <p className="text-xl opacity-90">{page.content?.subtitle || "Subtitle"}</p>
            </div>
          </div>
        </div>
      )
    }

    if (page.type === 'lastPage') {
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center p-8">
            {page.content?.elements?.map((element: any, idx: number) => (
              <div
                key={element.id || idx}
                className="mb-4"
                style={{
                  fontSize: `${Math.max(element.fontSize * 0.5, 12)}px`,
                  fontWeight: element.fontWeight,
                }}
              >
                {element.content.split('\n').map((line: string, lineIdx: number) => (
                  <div key={lineIdx}>{line}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Regular grid page
    const config = page.config || { rows: 1, cols: 1, gap: 16, padding: 24 }
    const slots = page.slots || {}

    return (
      <div 
        className="w-full h-full bg-white rounded-lg p-4 grid"
        style={{
          gridTemplateRows: `repeat(${config.rows}, 1fr)`,
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gap: `${Math.max(config.gap * 0.5, 8)}px`,
          padding: `${Math.max(config.padding * 0.5, 12)}px`,
        }}
      >
        {Array.from({ length: config.rows * config.cols }).map((_, i) => {
          const row = Math.floor(i / config.cols)
          const col = i % config.cols
          const key = `${row}-${col}`
          const photo = slots[key]

          return (
            <div
              key={key}
              className="relative bg-gray-200 rounded overflow-hidden"
            >
              {photo ? (
                <Image
                  src={photo.url}
                  alt={photo.filename || "Photo"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Layout className="h-8 w-8" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-6xl h-[90vh] mx-4 rounded-lg bg-background shadow-lg animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{template.name}</h2>
              {template.category && (
                <Badge variant="secondary">{template.category}</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {template.description && (
            <p className="text-muted-foreground mt-2">{template.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 p-6">
          {/* Page Navigation */}
          {pages.length > 1 && (
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={pages.length <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPageIndex + 1} of {pages.length}
                </span>
                {currentPage?.name && (
                  <Badge variant="outline" className="text-xs">
                    {currentPage.name}
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={pages.length <= 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Page Preview */}
          <div className="flex-1 bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-0">
            <div className="w-full max-w-3xl aspect-[3/2] bg-white shadow-lg rounded-lg overflow-hidden">
              {renderPagePreview(currentPage)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layout className="h-4 w-4" />
              <span>{pages.length} pages</span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onUseTemplate(template.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
