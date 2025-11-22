"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Download, FileArchive, Loader2, RefreshCw } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function ExportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [exports, setExports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const loadExports = async () => {
    try {
      const data = await api.events.getExports(id)
      setExports(data)
    } catch (error) {
      console.error("Failed to load exports", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExports()
  }, [id])

  const handleCreateExport = async () => {
    setCreating(true)
    try {
      await api.events.createExport(id, { type: "all_photos" })
      await loadExports()
    } catch (error) {
      console.error("Failed to create export", error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Exports</h2>
          <p className="text-sm text-muted-foreground">Download your event photos and templates.</p>
        </div>
        <Button onClick={handleCreateExport} disabled={creating}>
          {creating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileArchive className="mr-2 h-4 w-4" />
          )}
          Export All Photos
        </Button>
      </div>

      {exports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No exports yet</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
              Create an export to download all photos from this event in high resolution.
            </p>
            <Button onClick={handleCreateExport} variant="outline">Create Export</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exports.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mr-4">
                  <FileArchive className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">Event Export - {new Date(item.createdAt).toLocaleDateString()}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.size || "Calculating size..."} • {item.count} files
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === "completed" ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.downloadUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Ready</Badge>
  }
  if (status === "processing") {
    return <Badge variant="secondary">Processing</Badge>
  }
  return <Badge variant="outline">{status}</Badge>
}
