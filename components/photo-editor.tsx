"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { X, RotateCw, Download, Sparkles } from 'lucide-react'
import { cn } from "@/lib/utils"

interface PhotoEditorProps {
  photo: {
    id: string
    url: string
    filename: string
  }
  onClose: () => void
  onSave?: (photoId: string, filters: any) => void
}

interface Filters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hue: number
  grayscale: number
  sepia: number
}

const PRESET_FILTERS = {
  none: { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, grayscale: 0, sepia: 0 },
  vivid: { brightness: 110, contrast: 120, saturation: 130, blur: 0, hue: 0, grayscale: 0, sepia: 0 },
  bw: { brightness: 100, contrast: 110, saturation: 0, blur: 0, hue: 0, grayscale: 100, sepia: 0 },
  vintage: { brightness: 105, contrast: 95, saturation: 80, blur: 0, hue: 0, grayscale: 0, sepia: 60 },
  warm: { brightness: 105, contrast: 100, saturation: 110, blur: 0, hue: 10, grayscale: 0, sepia: 20 },
  cool: { brightness: 100, contrast: 105, saturation: 110, blur: 0, hue: -10, grayscale: 0, sepia: 0 },
  soft: { brightness: 110, contrast: 90, saturation: 95, blur: 1, hue: 0, grayscale: 0, sepia: 0 },
}

export function PhotoEditor({ photo, onClose, onSave }: PhotoEditorProps) {
  const [filters, setFilters] = useState<Filters>(PRESET_FILTERS.none)
  const [activePreset, setActivePreset] = useState<string>('none')
  const [imageLoaded, setImageLoaded] = useState(false) // Added state to track image loading
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Apply filters to canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !imageLoaded) return // Wait for image to load

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    // Apply CSS filters
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      hue-rotate(${filters.hue}deg)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
    `

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }, [filters, imageLoaded]) // Added imageLoaded dependency

  const applyPreset = (preset: keyof typeof PRESET_FILTERS) => {
    setFilters(PRESET_FILTERS[preset])
    setActivePreset(preset)
  }

  const handleSliderChange = (key: keyof Filters, value: number[]) => {
    setFilters(prev => ({ ...prev, [key]: value[0] }))
    setActivePreset('custom')
  }

  const handleReset = () => {
    applyPreset('none')
  }

  const handleSave = () => {
    onSave?.(photo.id, filters)
    onClose()
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `edited-${photo.filename}`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex">
      {/* Hidden image for canvas source */}
      <img
        ref={imgRef}
        src={photo.url || "/placeholder.svg"}
        alt={photo.filename}
        className="hidden"
        crossOrigin="anonymous"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Sidebar - Controls */}
      <div className="w-80 bg-background border-r overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Photo</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Preset Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESET_FILTERS).map((preset) => (
                <Button
                  key={preset}
                  variant={activePreset === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(preset as keyof typeof PRESET_FILTERS)}
                  className="capitalize"
                >
                  {preset === 'bw' ? 'B&W' : preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Adjustments */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Adjustments
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Brightness</label>
                  <span className="text-muted-foreground">{filters.brightness}%</span>
                </div>
                <Slider
                  value={[filters.brightness]}
                  onValueChange={(v) => handleSliderChange('brightness', v)}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Contrast</label>
                  <span className="text-muted-foreground">{filters.contrast}%</span>
                </div>
                <Slider
                  value={[filters.contrast]}
                  onValueChange={(v) => handleSliderChange('contrast', v)}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Saturation</label>
                  <span className="text-muted-foreground">{filters.saturation}%</span>
                </div>
                <Slider
                  value={[filters.saturation]}
                  onValueChange={(v) => handleSliderChange('saturation', v)}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Blur</label>
                  <span className="text-muted-foreground">{filters.blur}px</span>
                </div>
                <Slider
                  value={[filters.blur]}
                  onValueChange={(v) => handleSliderChange('blur', v)}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Hue Rotate</label>
                  <span className="text-muted-foreground">{filters.hue}°</span>
                </div>
                <Slider
                  value={[filters.hue]}
                  onValueChange={(v) => handleSliderChange('hue', v)}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Grayscale</label>
                  <span className="text-muted-foreground">{filters.grayscale}%</span>
                </div>
                <Slider
                  value={[filters.grayscale]}
                  onValueChange={(v) => handleSliderChange('grayscale', v)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Sepia</label>
                  <span className="text-muted-foreground">{filters.sepia}%</span>
                </div>
                <Slider
                  value={[filters.sepia]}
                  onValueChange={(v) => handleSliderChange('sepia', v)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t">
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RotateCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleDownload} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleSave} className="w-full">
              Apply Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
