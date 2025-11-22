"use client"

import React from "react"
import { UploadZone } from "@/components/upload-zone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
          <CardDescription>
            Add photos to this event. We'll automatically process them for face recognition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadZone eventId={React.use(params).id} />
        </CardContent>
      </Card>
    </div>
  )
}
