"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Loader2, Download, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SharedProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const { id } = await params
        
        // In a real app, this would fetch project data from the API
        // For now, we'll show a demo page
        setProject({
          id,
          name: "Shared Photo Album",
          description: "This is a shared photo album project",
          thumbnail: "/placeholder.svg",
        })
      } catch (err) {
        setError("Failed to load project")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground">
              The shared project could not be found or may have expired.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
              <Image
                src={project.thumbnail}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Album
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>This is a shared project link. View the photo album and download when ready.</p>
        </div>
      </div>
    </div>
  )
}




