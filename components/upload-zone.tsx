"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { api } from "@/lib/api"
import { CheckCircle2, FileImage, Upload, X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  eventId: string
  onUploadComplete?: () => void
}

interface FileUpload {
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  id: string
}

export function UploadZone({ eventId, onUploadComplete }: UploadZoneProps) {
  const [uploads, setUploads] = useState<FileUpload[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
      id: Math.random().toString(36).substring(7),
    }))

    setUploads((prev) => [...prev, ...newUploads])
    
    // Simulate upload for each file
    newUploads.forEach((upload) => {
      simulateUpload(upload.id)
    })
  }, [])

  const simulateUpload = async (uploadId: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === uploadId ? { ...u, status: "uploading" } : u))
    )

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, progress: i } : u))
      )
    }

    // Call mock API
    try {
      const formData = new FormData()
      // In a real app we'd append the file here
      // formData.append('file', file)
      
      await api.events.upload(eventId, formData)
      
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, status: "completed" } : u))
      )
      
      if (onUploadComplete) onUploadComplete()
    } catch (error) {
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, status: "error" } : u))
      )
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  })

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Drag & drop photos here</h3>
            <p className="text-sm text-muted-foreground mt-1">
              or click to select files from your computer
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Supports JPG, PNG, WebP (RAW support coming soon)
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            Uploads ({uploads.filter(u => u.status === 'completed').length}/{uploads.length})
          </h4>
          <div className="grid gap-3">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card"
              >
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {upload.file.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeUpload(upload.id)
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {upload.status === "completed" ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Uploaded
                    </div>
                  ) : upload.status === "error" ? (
                    <div className="text-xs text-destructive font-medium">
                      Upload failed
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Progress value={upload.progress} className="h-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{upload.status === 'uploading' ? 'Uploading...' : 'Pending'}</span>
                        <span>{upload.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
