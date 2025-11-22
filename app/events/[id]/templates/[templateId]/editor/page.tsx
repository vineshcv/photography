"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { LayoutEditor } from "@/components/layout-editor"
import { Loader2 } from 'lucide-react'

export default function EditorPage({ 
  params 
}: { 
  params: Promise<{ id: string; templateId: string }> 
}) {
  const { id, templateId } = React.use(params)
  const [photos, setPhotos] = useState<any[]>([])
  const [template, setTemplate] = useState<any>(null)
  const [people, setPeople] = useState<any[]>([]) // Add people state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [photosData, templateData, peopleData] = await Promise.all([ // Fetch people
          api.events.getPhotos(id),
          api.events.getTemplate(id, templateId),
          api.events.getPeople(id) // Fetch people
        ])
        setPhotos(photosData)
        setTemplate(templateData)
        setPeople(peopleData) // Set people
      } catch (error) {
        console.error("Failed to load editor data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, templateId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <LayoutEditor 
      eventId={id} 
      templateId={templateId} 
      photos={photos}
      people={people} // Pass people to LayoutEditor
      initialData={template}
    />
  )
}
